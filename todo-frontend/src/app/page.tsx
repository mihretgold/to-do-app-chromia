"use client";
import { useSessionContext } from "@/components/ContextProvider";
import TaskList from "@/components/TaskList";
import {useRouter} from "next/navigation";
import { useEffect } from "react";

export default function TasksPage() {
  const { session } = useSessionContext();
  const router = useRouter();
  // Redirect to auth if not logged in
  useEffect(() => {
    if (!session) {
      router.push('/auth');
    }
  }, [session, router]);


  return <TaskList />;
}
