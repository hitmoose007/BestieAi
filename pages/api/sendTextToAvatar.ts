import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

import supabaseClient from "../../lib/supabaseClient";

const config = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export default async function sendTextToAvatar(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const hardCodedUserId = "clf24ucm50000l208pkomy8ze";
    const hardCodedAvatarId = 1;
    // const { data: avatarData, error: avatarError } = await supabaseClient
    //   .from("avatar_mock_data")
    //   .select("dialect, backstory, vocabulary, name")
    //   .eq("id", hardCodedAvatarId);

    // if (avatarError) {
    //   throw new Error(avatarError.message);
    // }
    // const dialect = 'Angry Irish';
    // const role = 'Doctor';
    const userCurrentText = req.body["userMessage"].replace(/\n/g, " ");
    //

    const userEmbeddingCurrent = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: userCurrentText,
    });

    const { data: sortedChatData } = await supabaseClient.rpc(
      "match_chat_messages",
      {
        query_embedding: userEmbeddingCurrent.data.data[0].embedding,
        match_threshold: 0.7, // Choose an appropriate threshold for your data
        match_count: 6, // Ch
        session_user_id: hardCodedUserId,
        session_avatar_id: hardCodedAvatarId,
      }
    );

    //role types
    const { data: roleData, error: roleError } = await supabaseClient
      .from("avatar_roles")
      .select("id,name, description_embeddings, description, role_type");

    const roleDataJson = roleData?.map((role: any) => {
      return {
        name: role.name,
        description: role.description,
        role_id: role.id,
        role_type: role.role_type,
        description_embeddings: JSON.parse(role.description_embeddings),
      };
    });

    const roleMatchData = roleDataJson?.map((role: any) => {
      return {
        role_id: role.role_id,
        name: role.name,
        role_type: role.role_type,
        description: role.description,
        similarity: cosineSimilarity(
          userEmbeddingCurrent.data.data[0].embedding,
          role.description_embeddings
        ),
      };
    });


    const highestSimilarityRole = roleMatchData?.reduce((acc, curr) => {
      return curr.similarity > acc.similarity ? curr : acc;
    });

    //use highest similarity role_type to get avatar_role_type and avatar_mock_data
    const { data: avatarRoleTypeData, error: avatarRoleTypeError }: any =
      await supabaseClient
        .from("avatar_role_type")
        .select(
          `role_description, avatar_mock_data (id,name, dialect,vocabulary,image_url)`
        )
        .eq("id", highestSimilarityRole?.role_type);
    if (avatarRoleTypeError) {
      throw new Error(avatarRoleTypeError.message);
    }


    const similarChatHistory: string[] = [];
    if (sortedChatData) {
      for (const chat of sortedChatData) {
        const userMessage = chat.user_message?.replace(/\n/g, " ");

        const avatarMessage = chat.avatar_message?.replace(/\n/g, " ");

        const query = `user:${userMessage}. Avatar: ${avatarMessage}`;

        similarChatHistory.push(query);
      }
    } else {
      similarChatHistory.push("No previous chat history available for now");
    }

    //get chat history of last 5 recent messages
    const { data: chatHistoryData, error: chatHistoryError } =
      await supabaseClient
        .from("Chat_History")
        .select("user_message, agent_message")
        .eq("userId", hardCodedUserId)
        .eq("avatarId", hardCodedAvatarId)
        .order("id", { ascending: false })
        .limit(3);

    if (chatHistoryError) {
      throw new Error(chatHistoryError.message);
    }
    //group the array into one string
    const chatHistoryString = chatHistoryData
      ?.map((chat: any) => {
        return `User: ${chat.user_message}. Avatar: ${chat.agent_message}. `;
      })
      .join(" ");

    //remove\n from the string
    const chatHistoryStringNoNewLine = chatHistoryString.replace(/\n/g, " ");


    if (avatarRoleTypeData[0]) {
      if (!avatarRoleTypeData[0].avatar_mock_data) {
        throw new Error("No role description");
      }

      if (!avatarRoleTypeData[0]?.avatar_mock_data) {
        // fixed
        throw new Error("No role description");
      }

      const prompt =
        "Currently your name is " +
        avatarRoleTypeData[0].avatar_mock_data[0].name +
        ". You are a conversational agent whose purpose is to be the user's personal assistant and confidant like a best friend.   Your role and purpose will change. Your role current role is:" +
        highestSimilarityRole?.name +
        ". Your role description is:" +
        highestSimilarityRole?.description +
        ". You will speak with the following dialect:" +
        avatarRoleTypeData[0].avatar_mock_data[0].dialect +
        ". Your vocabulary consists of:" +
        avatarRoleTypeData[0].avatar_mock_data[0].vocabulary +
        ". We are now providing you with the most relevant parts of the chat history that may not necessarily be in order. These are the most relevant parts we picked out from the whole chat " +
        similarChatHistory.join("") +
      "These are the previous 3 messages between you and the user that had occured before. " +
        chatHistoryStringNoNewLine +
        
        ". Now we are providing you with the current message from the user. This is the current message from the user:" +
        userCurrentText +
        "Now you must provide a response to the user that is appropriate for the context and the user. Do not reply in the format Avatar: your response.";

      //send prompt to openai

      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0.9,
        max_tokens: 3000,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 1,
      });

      //insert embedding of user message and agent message into database

      if (!completion.data.choices[0].text) {
        throw new Error("No response from avatar");
      }
      const agentText = completion.data.choices[0].text.replace(/\n/g, " ");
      const agentEmbedding = await openai.createEmbedding({
        model: "text-embedding-ada-002",
        input: agentText,
      });


      const { data: insertedChatHistory } = await supabaseClient
        .from("Chat_History")
        .insert([
          {
            userId: hardCodedUserId,
            avatarId: hardCodedAvatarId,
            user_message: userCurrentText,
            agent_message: completion.data.choices[0].text,
            avatarName: avatarRoleTypeData[0].avatar_mock_data[0].name,
            imageUrl: avatarRoleTypeData[0].avatar_mock_data[0].image_url,
          },
        ])
        .select("id");

      if (!insertedChatHistory) {
        throw new Error("Error inserting chat history");
      }

      await supabaseClient.from("Chat_Embeddings").insert({
        chat_id: insertedChatHistory[0].id,
        user_message_embedding: userEmbeddingCurrent.data.data[0].embedding,
        avatar_message_embedding: agentEmbedding.data.data[0].embedding,
      });

      res.status(200).json({
        content: completion.data.choices[0].text,
        image_url: avatarRoleTypeData[0].avatar_mock_data[0].image_url,
        name: avatarRoleTypeData[0].avatar_mock_data[0].name,
      });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      // handle error of type Error
      res.status(500).json({ error: error.message });
    } else {
      // handle error of unknown type
      res.status(500).json({ error: "Unknown error occurred" });
    }
  }
}

function cosineSimilarity(embedding1: number[], embedding2: number[]): number {
  // calculate the dot product of the two embeddings
  let dotProduct = 0;
  for (let i = 0; i < embedding1.length; i++) {
    dotProduct += embedding1[i] * embedding2[i];
  }

  // calculate the magnitude of each embedding
  const magnitude1 = Math.sqrt(
    embedding1.reduce((acc, curr) => acc + curr ** 2, 0)
  );
  const magnitude2 = Math.sqrt(
    embedding2.reduce((acc, curr) => acc + curr ** 2, 0)
  );

  // calculate the cosine similarity
  return dotProduct / (magnitude1 * magnitude2);
}
