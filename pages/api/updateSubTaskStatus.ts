//udpate the subtask status using supabase

import { NextApiRequest, NextApiResponse } from "next";

import supabaseClient from "../../lib/supabaseClient";

export default async function updataSubTaskStatus(
    req: NextApiRequest,
    res: NextApiResponse
    ) {
    try {
        const { data: subTaskData, error: subTaskError } = await supabaseClient
        .from("SubTasks")
        .update({ completed: req.body["completed"] })
        .eq("id", req.body["id"]);
    
        if (subTaskError) {
        throw new Error(subTaskError.message);
        }
    
        res.status(200).json({ subTaskData });
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