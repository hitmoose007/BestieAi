import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";
const { Configuration, OpenAIApi } = require("openai");
const { createClient } = require("@supabase/supabase-js");

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SB_PROJECT_URL || ``,
  process.env.NEXT_PUBLIC_SB_ANON_KEY || ``
);
const aiConfig = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export const config = {
  runtime: "edge",
};

const openai = new OpenAIApi(aiConfig);

const handler = async (req: Request): Promise<Response> => {
  try {
    // req.body["userMessage"] = req.body["userMessage"].replace(/\n/g, " ");

    const hardCodedUserId = "clf24ucm50000l208pkomy8ze";
    const hardCodedAvatarId = 1;

    const { data: chatHistoryData, error: chatHistoryError } =
      await supabaseClient
        .from("Chat_History")
        .select("user_message, agent_message")
        .eq("userId", hardCodedUserId)
        .eq("avatarId", hardCodedAvatarId)
        .limit(10)
        .order("created_at", { ascending: false });
    if (chatHistoryError) {
      throw new Error(chatHistoryError.message);
    }
    // const response = await openai.listEngines();

    const url = "https://api.openai.com/v1/embeddings";

    const api_key = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${api_key}`,
      },
      body: JSON.stringify({
        input: "This is a test",
        model: "text-embedding-ada-002",
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create embedding: ${response.statusText}`);
    }

    // const responseData = await response.json();

    const data = await response.json();

    const embeddings = data.data[0].embedding;

    const { data: roleData, error: roleError } = await supabaseClient
      .from("avatar_roles")
      .select("id,name, description_embeddings, description, role_type");

    
    const roleDataJson = roleData.map((role: any) => {
      return {
        name: role.name,
        description: role.description,
        role_id: role.id,
        role_type: role.role_type,
        description_embeddings: JSON.parse(role.description_embeddings),
      };
    });

    // console.log(roleDataJson.id)
    // console.log(roleData[0].description_embeddings)
    // console.log(embeddings)
    const roleMatchData = roleDataJson.map((role: any) => {
      return {
        role_id: role.role_id,
        name: role.name,
        role_type: role.role_type,
        description: role.description,
        similarity: cosineSimilarity(embeddings, role.description_embeddings),
      };
    });

    // console.log(roleMatchData);

    const highestSimilarityRole = roleMatchData.reduce((acc:any, curr:any) => {
      return curr.similarity > acc.similarity ? curr : acc;
    });
    // console.log(highestSimilarityRole);

    //use highest similarity role_type to get avatar_role_type and avatar_mock_data
    const { data: avatarRoleTypeData, error: avatarRoleTypeError } =
      await supabaseClient
        .from("avatar_role_type")
        .select(`id, role_description, avatar_mock_data (id,name,dialect,vocabulary,image_url, dialect)`)
        .eq("id", highestSimilarityRole.role_type);
    if (avatarRoleTypeError) {
      throw new Error(avatarRoleTypeError.message);
    }

    // console.log(avatarRoleTypeData[0].avatar_mock_data[0])
    // console.log(avatarRoleTypeData[0].avatar_mock_data[0].dialect);

    console.log(avatarRoleTypeData[0].role_description);
    // const { data: avatarMockData, error: avatarMockDataError } =
    //     await supabaseClient
    //         .from("avatar_mock_data")
    //         .select("id, dialect")
    //         .eq("id", highestSimilarityRole.role_id);
    // if (avatarMockDataError) {
    //     throw new Error(avatarMockDataError.message);
    // }

    // console.log(avatarMockData)
    // console.log(avatarRoleTypeData)
    // send api request to openai
    const payload: OpenAIStreamPayload = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Currently your name is " +
            avatarRoleTypeData[0].avatar_mock_data[0].name +
            "Your role and purpose will change. Your role current role is:" +
            highestSimilarityRole?.name +
            ". Your role description is:" +
            highestSimilarityRole?.description +
            ". You will speak with the following dialect:" +
            avatarRoleTypeData[0].avatar_mock_data[0].dialect +
            ". Your vocabulary consists of:" +
            avatarRoleTypeData[0].avatar_mock_data[0].vocabulary+
            "I want you to act as a system-based task manager. You will do this role when a " +
            "user needs help organizing their tasks and subtasks. Your goal is to help users complete their tasks " +
            "on time and achieve their goals. You will be responsible for defining any task and associated subtask" +
            ", and assigning them to the user for completion.For example, if a user wants to plan " +
            "a birthday party, you will help them to define the main task, 'plan birthday party" +
            "', and then create subtasks such as 'decide on theme', 'create guest list', 'choose " +
            "venue', 'order decorations', 'order cake', and 'send invitations'.You will use your conversational abilities to assist " +
            "users in completing their tasks and subtasks. For example, you might help them research venues or " +
            "vendors, strategize the order in which to complete tasks, or automate activities to streamline the process" +
            ".Your focus is on ensuring that users complete their tasks and subtasks in a timely manner to reach " +
            "their goals. You will provide recommendations and support to help them achieve this. As a system" +
            "-based task manager, you will always keep track of the user's progress and remind them of " +
            "upcoming deadlines or tasks that need to be completed.  Must include a Subtask description but not a task description " +
            "as Description and Task Name as Name with Subtask as the title for each Subtask. Always make sure your response is in the style of json object below." +
            "{" +
            '"task_name": "Plan a trip to Austin, TX",' +
            '"subtasks": [' +
            "{" +
            '"subtask_name": "Book flights",' +
            '"subtask_description": "Find and book the most suitable and affordable flights to Austin."' +
            "}," +
            "{" +
            '"subtask_name": "Find accommodations",' +
            '"subtask_description": "Research and book suitable accommodations in Austin for the duration of your stay."' +
            '}," +' +
            "]" +
            "}" +
            "Remember you are sending the response to a devloper so only make sure to send json in your response nothing else and in the json format i have provided. " +
            "I will now " +
            "provide you with last ten interactions between you the avatar and the user. Use these to generate " +
            "the json object and select tasks accordingly." +
            chatHistoryData
              .map((item: any) => {
                let combinedMessage =
                  "User: " +
                  item.user_message +
                  ".Agent: " +
                  item.agent_message;
                combinedMessage = combinedMessage.replace(/\n/g, " ");
                return combinedMessage;
              })
              .join(" "),
        },

        { role: "user", content: chatHistoryData[0].user_message || "" },
      ],
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,

      stream: false,
      n: 1,
    };

    const content = await OpenAIStream(payload);

    // console.log('hello')
    // const content = completion.data.choices[0].message?.content;
    const content_lines = content?.split("\n");

    console.log(content_lines);
    // console.log(content_lines);
    if (!content_lines) {
      throw new Error("No response from OpenAI");
    }

    const inputString = content_lines.join("");

    const result = JSON.parse(inputString);
    // console.log(result);
    const { data: taskData, error: taskError } = await supabaseClient

      .from("Tasks")
      .insert([
        {
          name: result.task_name,
          userId: hardCodedUserId,
          avatarId: hardCodedAvatarId,
        },
      ])
      .select("id");

    if (taskError) {
      throw new Error(taskError.message);
    }

    //insert taskData id into result

    result.task_id = taskData[0].id;

    /// add all subtasks to database

    for (let i = 0; i < result.subtasks.length; i++) {
      const { data: subtaskData, error: subtaskError } = await supabaseClient
        .from("SubTasks")
        .insert([
          {
            name: result.subtasks[i].subtask_name,
            description: result.subtasks[i].subtask_description,
            userId: hardCodedUserId,
            avatarId: hardCodedAvatarId,
            taskId: result.task_id,
          },
        ])
        .select("id");

      if (subtaskError) {
        throw new Error(subtaskError.message);
      }

      //insert subtaskData id into result

      result.subtasks[i].subtask_id = subtaskData[0].id;
    }

    // const destructure = (obj: any, path: string) => {
    //     return path.split(".").reduce((acc, part) => acc && acc[part], obj);
    //     }
    // const response = destructure(result, "subtasks.0.subtask_id");
    // console.log(response);
    // return NextResponse.json({ response });

    // const destructure = {
    //     task_id: result.task_id,
    //     task_name: result.task_name,
    //     subtasks: result.subtasks

    // }

    // console.log(destructure);
    return NextResponse.json({ result });
  } catch (error: unknown) {
    if (error instanceof Error) {
      // handle error of type Error
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      // handle error of unknown type
      return NextResponse.json(
        { error: "Unknown error occurred" },
        { status: 500 }
      );
    }
  }
};
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

export default handler;
