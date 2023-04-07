//fetch an avatar
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
    // const hardCodedUserId = "clf24ucm50000l208pkomy8ze";
    const hardCodedAvatarId = 1;

    //use highest similarity role_type to get avatar_role_type and avatar_mock_data
    const { data: avatarRoleTypeData, error: avatarRoleTypeError }: any =
      await supabaseClient
        .from("avatar_mock_data")
        .select(`name, image_url`)
        .eq("id", hardCodedAvatarId);
    if (avatarRoleTypeError) {
      throw new Error(avatarRoleTypeError.message);
    }

    //send prompt to openai
    res.status(200).json({
      image_url: avatarRoleTypeData[0].image_url,
      name: avatarRoleTypeData[0].name,
    });
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
