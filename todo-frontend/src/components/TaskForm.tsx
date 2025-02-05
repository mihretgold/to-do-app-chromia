import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSessionContext } from "./ContextProvider";

export default function NewTaskForm() {
  // Initialize state variables
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [task, setTask] = useState({
    title: "",
    description: "",
    due_date: new Date().toISOString().split("T")[0], // Default to today
  });

  const session = useSessionContext();

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      alert("Please log in first");
      return;
    }

    try {
      setIsLoading(true);
      console.log("Creating task...");

      // Convert `due_date` from string to timestamp
      const dueDateTimestamp = new Date(task.due_date).getTime();

      await session.call({
        name: "create_task",
        args: [task.title, task.description, dueDateTimestamp], // Pass as integer
      });

      // Redirect to home after successful task creation
      router.push("/");
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Create New Task</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={task.title}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={task.description}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={4}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Due Date
          </label>
          <input
            type="date"
            name="due_date"
            value={task.due_date}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full ${isLoading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Task"}
        </button>
      </form>
    </div>
  );
}
