//updata task status to what was sent from the front end

import { NextApiRequest, NextApiResponse } from "next";

import supabaseClient from "../../lib/supabaseClient";

export default async function updataTaskStatus(
    req: NextApiRequest,
    res: NextApiResponse
    ) {
    try {
        const { data: taskData, error: taskError } = await supabaseClient
        .from("Tasks")
        .update({ completed: req.body["completed"] })
        .eq("id", req.body["id"]);
    
        if (taskError) {
        throw new Error(taskError.message);
        }
    
        res.status(200).json({ taskData });
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