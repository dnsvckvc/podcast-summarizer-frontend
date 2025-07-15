"use client";

import type { TaskInfo, UseTaskStatusReturn } from "@/utils/models";

import { useState, useEffect, useCallback } from "react";

export function useTaskStatus(apiUrl: string): UseTaskStatusReturn {
  const [taskInfo, setTaskInfo] = useState<TaskInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const fetchTaskStatus = useCallback(
    async (taskId: string) => {
      try {
        const response = await fetch(`${apiUrl}/api/status/${taskId}`);
        const data = await response.json();

        if (data.success) {
          setTaskInfo(data.task);
          setError(null);

          if (
            data.task.status === "completed" ||
            data.task.status === "failed"
          ) {
            resetInterval();
          }
        } else {
          setError(data.error || "Failed to fetch task status");
        }
      } catch (err) {
        setError("Network error while fetching task status");
        resetInterval();
      }
    },
    [apiUrl, intervalId]
  );

  const resetInterval = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsLoading(false);
  };

  const startPolling = useCallback(
    (taskId: string) => {
      setIsLoading(true);
      setError(null);
      setTaskInfo(null);

      if (intervalId) {
        clearInterval(intervalId);
      }

      fetchTaskStatus(taskId);

      const newIntervalId = setInterval(() => {
        fetchTaskStatus(taskId);
      }, 5000);

      setIntervalId(newIntervalId);
    },
    [fetchTaskStatus, intervalId]
  );

  const stopPolling = useCallback(() => {
    resetInterval();
  }, [intervalId]);

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  return {
    taskInfo,
    isLoading,
    error,
    startPolling,
    stopPolling,
  };
}
