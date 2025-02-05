"use client";

import { useState } from "react";
import { useSessionContext } from "./ContextProvider";

export type Task = {
  id: string;
  title: string;
  description: string;
  due_date: number; // Store as a timestamp
  completed: boolean;
  created_at: number;
  updated_at: number;
};

export default function TaskItem({ task }: { task: Task }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task>(task);
  const [isLoading, setIsLoading] = useState(false);

  const session = useSessionContext();
  

  // Handle task update
  const handleUpdate = async (updatedTask: Task) => {
    if (!session) return alert("Please log in first");

    try {
      setIsLoading(true);
      await session.call({
        name: "update_task",
        args: [
          task.id,
          updatedTask.title,
          updatedTask.description,
          updatedTask.due_date, // Ensure this remains a timestamp
        ],
      });

      setEditedTask(updatedTask);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle task completion
  const handleComplete = async () => {
    if (!session) return alert("Please log in first");

    try {
      setIsLoading(true);
      await session.call({
        name: "complete_task",
        args: [task.id],
      });

      setEditedTask((prev) => ({ ...prev, completed: true }));
    } catch (error) {
      console.error("Error completing task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle task deletion
  const handleDelete = async () => {
    if (!session) return alert("Please log in first");

    try {
      setIsLoading(true);
      await session.call({
        name: "delete_task",
        args: [task.id],
      });
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <input
          type="text"
          value={editedTask.title}
          onChange={(e) =>
            setEditedTask({ ...editedTask, title: e.target.value })
          }
          className="w-full mb-2 p-2 border rounded"
        />
        <textarea
          value={editedTask.description}
          onChange={(e) =>
            setEditedTask({ ...editedTask, description: e.target.value })
          }
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="date"
          value={new Date(editedTask.due_date).toISOString().split("T")[0]} // Convert timestamp to date string
          onChange={(e) =>
            setEditedTask({
              ...editedTask,
              due_date: new Date(e.target.value).getTime(), // Convert back to timestamp
            })
          }
          className="w-full mb-2 p-2 border rounded"
        />
        <div className="flex justify-between">
          <button
            onClick={() => setIsEditing(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => handleUpdate(editedTask)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4 flex justify-between items-center">
      <div>
        <div
          className={`font-bold ${task.completed ? "line-through text-gray-500" : ""}`}
        >
          {task.title}
        </div>
        <div className="text-gray-600">{task.description}</div>
        <div className="text-sm text-gray-500">
          Due: {new Date(task.due_date).toLocaleDateString()}
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={handleComplete}
          className={`px-3 py-1 rounded ${
            task.completed ? "bg-green-500" : "bg-gray-500"
          } text-white`}
          disabled={isLoading || task.completed}
        >
          {task.completed ? "✓" : "○"}
        </button>
        <button
          onClick={() => setIsEditing(true)}
          className="bg-blue-500 text-white px-3 py-1 rounded"
          disabled={isLoading}
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-3 py-1 rounded"
          disabled={isLoading}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
