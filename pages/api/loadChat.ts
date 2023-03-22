import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

import supabaseClient from '../../lib/supabaseClient';

const config = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export default async function sendTextToAvatar(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const hardCodedUserId = 'clf24ucm50000l208pkomy8ze';
    const hardCodedAvatarId = 1;
    const { data: chatHistoryData, error:chatHistoryError } = await supabaseClient
      .from('Chat_History').select('user_message, agent_message')
        .eq('userId', hardCodedUserId)
        .eq('avatarId', hardCodedAvatarId)
        .order('created_at', { ascending: true }).limit(10);
     
    
    //insert embedding of user message and agent message into database

  

    res.status(200).json({ chatHistoryData });
  } catch (error: unknown) {
    if (error instanceof Error) {
      // handle error of type Error
      res.status(500).json({ error: error.message });
    } else {
      // handle error of unknown type
      res.status(500).json({ error: 'Unknown error occurred' });
    }
  }
}
