//calculate embeddings for mock data

import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

import supabaseClient from "../../lib/supabaseClient";

const config = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export default async function calculateEmbeddings(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // const dialect = 'Angry Irish';
    // const role = 'Doctor';
    //get mock data from supabase
    const { data: mockData, error: mockDataError } = await supabaseClient

      .from("avatar_roles")
      .select("id, description");

    // console.log(mockData);
    mockData?.forEach((item) => {
      if (typeof item.description === "string") {
        item.description = item.description.replace(/\n/g, "");
      }
    });
    //remove \n from mock data

    //calculate embeddings for each mock data item

    mockData?.forEach(async (item) => {
      if (typeof item.description === "string" && item.description !== null) {
        const mockDataEmbeddings = await openai.createEmbedding({
          model: "text-embedding-ada-002",
          input: item.description,
        });


        
        
        //insert into description embeddings in avatar_roles table
        const { data: updateData, error: updateError } =
            await supabaseClient
                .from("avatar_roles")
                .update({ description_embeddings: mockDataEmbeddings.data.data[0].embedding })
                .eq("id", item.id);
        if (updateError) {
            throw new Error(updateError.message);
    }

    //   console.log(mockDataEmbeddings.data.data[0].embedding);
      }

    });

    // const mockDataEmbeddings = await openai.createEmbedding({
    //     model: "text-embedding-ada-002",
    //     input: mockData,
    //     });

    if (mockDataError) {
      throw new Error(mockDataError.message);
    }

    // const userCurrentText = req.body["userMessage"].replace(/\n/g, " ");
    //

    // const userEmbeddingCurrent = await openai.createEmbedding({
    //   model: "text-embedding-ada-002",
    //   input: userCurrentText,
    // });

    // const chatHistory: string[] = [];

    //send prompt to openai

    res.status(200).json({ done: "done" });
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
