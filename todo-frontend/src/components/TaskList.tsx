"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, CheckCircle, Filter } from "lucide-react";
import { useSessionContext } from "./ContextProvider";
import { useQuery } from "@/app/hooks";

export type Task = {
  id: string;
  title: string;
  description: string;
  due_date: number;
  completed: boolean;
  created_at: number;
  updated_at: number;
};

export type GetTasksReturnType = {
  pointer: number;
  tasks: Task[];
};

export default function TaskList() {
  const session = useSessionContext();
  const accountId = session?.account?.id;
  const [filter, setFilter] = useState("all");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Tasks
  const { result: allTasks, reload } = useQuery<GetTasksReturnType>(
    "get_my_tasks",
    accountId ? { user_id: accountId, pointer: 0, n_tasks: 10 } : undefined
  );

  const { result: completedTasks } = useQuery<GetTasksReturnType>(
    "get_my_completed_tasks",
    accountId ? { user_id: accountId } : undefined
  );

  const { result: pendingTasks } = useQuery<GetTasksReturnType>(
    "get_my_pending_tasks",
    accountId ? { user_id: accountId } : undefined
  );

  useEffect(() => {
    const interval = setInterval(() => {
      reload();
    }, 10000);
    return () => clearInterval(interval);
  }, [reload]);

  const getFilteredTasks = () => {
    switch (filter) {
      case "completed":
        return completedTasks?.tasks || [];
      case "pending":
        return pendingTasks?.tasks || [];
      default:
        return allTasks?.tasks || [];
    }
  };

  // Reload tasks when filter changes
  useEffect(() => {
    reload();
  }, [filter, reload]);

  const handleUpdate = async (updatedTask: Task) => {
    if (!session) return alert("Please log in first");

    try {
      setIsLoading(true);
      await session.call({
        name: "update_task",
        args: [
          updatedTask.id,
          updatedTask.title,
          updatedTask.description,
          updatedTask.due_date,
        ],
      });
      setIsEditing(false);
      reload();
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async (taskId: string) => {
    if (!session) return alert("Please log in first");

    try {
      setIsLoading(true);
      await session.call({ name: "complete_task", args: [taskId] });
      reload();
    } catch (error) {
      console.error("Error completing task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!session) return alert("Please log in first");

    try {
      setIsLoading(true);
      await session.call({ name: "delete_task", args: [taskId] });
      reload();
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 text-transparent bg-clip-text">Your Tasks</h2>

      <div className="flex justify-end mt-4 relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700"
        >
          <Filter size={20} className="mr-2" /> Filter
        </button>
        {showDropdown && (
          <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg w-40">
            {["all", "completed", "pending"].map((value) => (
              <button
                key={value}
                onClick={() => {
                  setFilter(value);
                  setShowDropdown(false);
                }}
                className={`block w-full text-left px-4 py-2 hover:bg-gray-200 ${
                  filter === value ? "font-bold" : ""
                }`}
              >
                {value.charAt(0).toUpperCase() + value.slice(1)} Tasks
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg mt-4">
        <table className="w-full mt-4 border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border p-3 text-left">Title</th>
              <th className="border p-3 text-left">Description</th>
              <th className="border p-3 text-left">Due Date</th>
              <th className="border p-3 text-left">Status</th>
              <th className="border p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredTasks().map((task) => (
              <tr key={task.id} className="border hover:bg-gray-50">
                <td className="border p-3">{task.title}</td>
                <td className="border p-3">{task.description}</td>
                <td className="border p-3">{new Date(task.due_date).toLocaleDateString()}</td>
                <td className="border p-3 text-center font-semibold text-sm">
                  <span
                    className={`px-4 py-2 rounded-full border ${
                      task.completed
                        ? "border-green-500 text-green-500"
                        : "border-yellow-500 text-yellow-500"
                    } bg-white`}
                  >
                    {task.completed ? "Completed" : "Pending"}
                  </span>
                </td>
                <td className="border p-3 flex items-center space-x-4 justify-center">
                  <button onClick={() => handleComplete(task.id)} className="text-green-500 hover:text-green-700"><CheckCircle size={24} /></button>
                  <button onClick={() => { setEditedTask(task); setIsEditing(true); }} className="text-blue-500 hover:text-blue-700"><Pencil size={24} /></button>
                  <button onClick={() => handleDelete(task.id)} className="text-red-500 hover:text-red-700"><Trash2 size={24} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Popup for Editing */}
      {isEditing && editedTask && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Edit Task</h3>
            <input
              type="text"
              value={editedTask.title}
              onChange={(e) =>
                setEditedTask({ ...editedTask, title: e.target.value })
              }
              className="w-full mb-2 p-2 border rounded"
              placeholder="Title"
            />
            <textarea
              value={editedTask.description}
              onChange={(e) =>
                setEditedTask({ ...editedTask, description: e.target.value })
              }
              className="w-full mb-2 p-2 border rounded"
              placeholder="Description"
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
        </div>
      )}
    </div>
  );
}
