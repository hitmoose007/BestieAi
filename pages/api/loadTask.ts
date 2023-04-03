//retreive 10 tasks using offset

//load tasks from supabase
import { NextApiRequest, NextApiResponse } from "next";

import supabaseClient from "../../lib/supabaseClient";

export default async function loadTask(
    req: NextApiRequest,
    res: NextApiResponse
    ) {
    try {
        const { data: taskData, error: taskError } = await supabaseClient
        .from("Tasks")
        .select("id, title, description, completed")
        .eq("userId", req.body["userId"])
        .order("created_at", { ascending: false })
        .range(req.body["offset"], req.body["offset"] + 10);
    
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

    