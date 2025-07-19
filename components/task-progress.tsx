"use client";

import type { TaskInfo } from "@/utils/models";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Clock,
  Loader2,
  Download,
  FileText,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface TaskProgressProps {
  taskInfo: TaskInfo;
}

const statusConfig = {
  pending: {
    icon: Clock,
    color: "text-slate-500",
    bgColor: "bg-slate-100 dark:bg-slate-800",
    label: "Pending",
    description: "Task is queued for processing",
  },
  downloading: {
    icon: Download,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    label: "Downloading",
    description: "Downloading audio content",
  },
  transcribing: {
    icon: FileText,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    label: "Transcribing",
    description: "Converting audio to text",
  },
  summarizing: {
    icon: Sparkles,
    color: "text-corporate-600 dark:text-corporate-400",
    bgColor: "bg-corporate-50 dark:bg-corporate-900/20",
    label: "Summarizing",
    description: "Generating AI summary",
  },
  completed: {
    icon: CheckCircle2,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    label: "Completed",
    description: "Summary ready!",
  },
  failed: {
    icon: AlertCircle,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    label: "Failed",
    description: "Processing failed",
  },
};

export function TaskProgress({ taskInfo }: TaskProgressProps) {
  const config = statusConfig[taskInfo.status];
  const IconComponent = config.icon;
  const isProcessing = [
    "pending",
    "downloading",
    "transcribing",
    "summarizing",
  ].includes(taskInfo.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full border border-slate-200 dark:border-slate-700 shadow-lg bg-white dark:bg-slate-900 rounded-xl overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white font-heading">
              Processing Status
            </CardTitle>
            <Badge
              variant="outline"
              className={`${config.color} ${config.bgColor} border-current`}
            >
              <IconComponent className="h-3 w-3 mr-1" />
              {config.label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Progress
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {Math.round(taskInfo.progress)}%
              </span>
            </div>
            <Progress value={taskInfo.progress} className="h-2" />
          </div>

          {/* Status Message */}
          <div
            className={`p-4 rounded-lg ${config.bgColor} border border-current/20`}
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {isProcessing ? (
                  <Loader2 className={`h-5 w-5 ${config.color} animate-spin`} />
                ) : (
                  <IconComponent className={`h-5 w-5 ${config.color}`} />
                )}
              </div>
              <div>
                <p className={`font-medium ${config.color}`}>
                  {config.description}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {taskInfo.message}
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {taskInfo.status === "failed" && taskInfo.error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <p className="text-sm text-red-700 dark:text-red-300">
                <strong>Error:</strong> {taskInfo.error}
              </p>
            </motion.div>
          )}

          {/* Processing Steps */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Processing Steps
            </h4>
            <div className="space-y-2">
              {Object.entries(statusConfig)
                .slice(1, -1)
                .map(([status, stepConfig], index) => {
                  const StepIcon = stepConfig.icon;
                  const isCurrentStep = taskInfo.status === status;
                  const isCompleted =
                    [
                      "downloading",
                      "transcribing",
                      "summarizing",
                      "completed",
                    ].indexOf(taskInfo.status) >
                    [
                      "downloading",
                      "transcribing",
                      "summarizing",
                      "completed",
                    ].indexOf(status);
                  const isActive = isCurrentStep || isCompleted;

                  return (
                    <div key={status} className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          isCompleted
                            ? "bg-green-100 dark:bg-green-900/20"
                            : isCurrentStep
                            ? stepConfig.bgColor
                            : "bg-slate-100 dark:bg-slate-800"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
                        ) : isCurrentStep ? (
                          <Loader2
                            className={`h-3 w-3 ${stepConfig.color} animate-spin`}
                          />
                        ) : (
                          <StepIcon
                            className={`h-3 w-3 ${
                              isActive ? stepConfig.color : "text-slate-400"
                            }`}
                          />
                        )}
                      </div>
                      <span
                        className={`text-sm ${
                          isActive
                            ? "text-slate-900 dark:text-white font-medium"
                            : "text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {stepConfig.label}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Task Info */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-2 gap-4 text-xs text-slate-500 dark:text-slate-400">
              <div>
                <span className="font-medium">Task ID:</span>
                <br />
                <span className="font-mono">
                  {taskInfo.task_id.slice(0, 8)}...
                </span>
              </div>
              <div>
                <span className="font-medium">Started:</span>
                <br />
                <span>
                  {new Date(taskInfo.created_at * 1000).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
