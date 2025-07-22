"use client";

import type { TaskInfo, UseTaskStatusReturn } from "@/utils/models";

import { apiFetch } from "@/utils/api";
import { useState, useEffect, useCallback, useRef } from "react";

export function useTaskStatus(): UseTaskStatusReturn {
  const [taskInfo, setTaskInfo] = useState<TaskInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingRef = useRef(false);

  const fetchTaskStatus = useCallback(async (taskId: string) => {
    if (!isPollingRef.current) return;

    try {
      const response = await apiFetch(`/api/status/${taskId}`);
      const data = await response.json();

      if (data.success) {
        setTaskInfo(data.task);
        setError(null);

        if (data.task.status === "completed" || data.task.status === "failed") {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          isPollingRef.current = false;
          setIsLoading(false);
        }
      } else {
        setError(data.error || "Failed to fetch task status");
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        isPollingRef.current = false;
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error fetching task status:", err);
      setError("Network error while fetching task status");
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      isPollingRef.current = false;
      setIsLoading(false);
    }
  }, []);

  const startPolling = useCallback(
    (taskId: string) => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      setIsLoading(true);
      setError(null);
      setTaskInfo(null);
      isPollingRef.current = true;

      fetchTaskStatus(taskId);

      intervalRef.current = setInterval(() => {
        fetchTaskStatus(taskId);
      }, 5000);
    },
    [fetchTaskStatus]
  );

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    isPollingRef.current = false;
    setIsLoading(false);
    setTaskInfo(null);
    setError(null);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      isPollingRef.current = false;
    };
  }, []);

  return {
    taskInfo,
    isLoading,
    error,
    startPolling,
    stopPolling,
  };
}
