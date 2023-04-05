//retreive 10 tasks using offset

//load tasks from supabase
import { NextApiRequest, NextApiResponse } from "next";
import supabaseClient from "../../lib/supabaseClient";

interface Subtask {
  subtask_id: number;
  subtask_name: string;
  subtask_completed: boolean;
}

interface Task {
  task_id: number;
  task_name: string;
  task_completed: boolean;
  subtasks: Subtask[];
}

export default async function loadTasks(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const hardCodedUserId = "clf24ucm50000l208pkomy8ze";
    const hardCodedAvatarId = 1;

    const { data: taskData, error: taskError } = await supabaseClient.rpc(
      "get_tasks_with_subtasks",
      { user_id: hardCodedUserId, avatar_id: hardCodedAvatarId, offset_value: req.body["offset"]}
    );
    if (taskError) {
      throw new Error(taskError.message);
    }

    const results: Task[] = taskData.reduce((acc: Task[], curr: any) => {
      // Find the index of the current task ID in the accumulator array
      const index = acc.findIndex((task) => task.task_id === curr.task_id);

      // If the current task ID is already in the accumulator array, add the subtask to its subtask array
      if (index !== -1) {
        acc[index].subtasks.push({
          subtask_id: curr.subtask_id,
          subtask_name: curr.subtask_name,
          subtask_completed: curr.subtask_completed
        });
      } else {
        // If the current task ID is not in the accumulator array, create a new task object with a subtask array
        acc.push({
          task_id: curr.task_id,
          task_name: curr.task_name,
          task_completed: curr.task_completed,
          subtasks: curr.subtask_id ? [
            {
              subtask_id: curr.subtask_id,
              subtask_name: curr.subtask_name,
              subtask_completed: curr.subtask_completed
            }
          ] : []
        });
      }

      return acc;
    }, []);

    // Output the combined tasks object

    res.status(200).json({ results });
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
