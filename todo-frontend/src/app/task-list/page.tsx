"use client";

import TaskList from "@/components/TaskList";
import NewTaskForm from "@/components/TaskList";

export default function NewTaskPage() {
  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Create New Task</h2>
      <TaskList />
    </div>
  );
}
