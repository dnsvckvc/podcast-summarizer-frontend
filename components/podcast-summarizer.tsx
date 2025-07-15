"use client";

import type React from "react";
import type { Summary } from "@/utils/models";

import Image from "next/image";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UrlValidator } from "./url-validator";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import { useTaskStatus } from "@/hooks/use-task-status";
import { TaskProgress } from "@/components/task-progress";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  User,
  Copy,
  Clock,
  Youtube,
  Podcast,
  Loader2,
  Sparkles,
  Calendar,
  Bookmark,
  BarChart3,
  RefreshCw,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 },
  },
};

const staggerItems = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      mass: 1,
    },
  },
};

type PodcastSource = "youtube" | "rss";
type SummaryStatus = "idle" | "loading" | "success" | "error";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export function PodcastSummarizer() {
  const {
    taskInfo,
    isLoading,
    error: taskError,
    startPolling,
    stopPolling,
  } = useTaskStatus(API_URL);

  const [source, setSource] = useState<PodcastSource>("youtube");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [rssFeedUrl, setRssFeedUrl] = useState("");
  const [episodeName, setEpisodeName] = useState("");
  const [detailLevel, setDetailLevel] = useState([0.5]);
  const [status, setStatus] = useState<SummaryStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isYoutubeValid, setIsYoutubeValid] = useState(false);
  const [isRssValid, setIsRssValid] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [youtubeValidationData, setYoutubeValidationData] = useState<any>(null);
  const [rssValidationData, setRssValidationData] = useState<any>(null);

  useEffect(() => {
    if (copySuccess) {
      const timer = setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copySuccess]);

  useEffect(() => {
    if (taskInfo?.status === "completed" && taskInfo.result) {
      setSummary({
        title: taskInfo.result.title,
        content: taskInfo.result.summary,
        thumbnail: taskInfo.result.thumbnail,
        channel: taskInfo.result.channel,
        duration_string: taskInfo.result.duration_string,
        release_date: taskInfo.result.release_date,
      });
      setStatus("success");
      setCurrentTaskId(null);
    } else if (taskInfo?.status === "failed") {
      setError(taskInfo.error || "Task failed");
      setStatus("error");
      setCurrentTaskId(null);
    }
  }, [taskInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    setSummary(null);

    try {
      const payload = {
        source_url: source === "youtube" ? youtubeUrl : rssFeedUrl,
        episode_name: source === "youtube" ? null : episodeName,
        detail_level: detailLevel[0],
        platform: source,
      };

      const response = await fetch(`${API_URL}/api/summarize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setCurrentTaskId(data.task_id);
        startPolling(data.task_id);
        setStatus("idle");
      } else {
        const errorMessage = Array.isArray(data.errors)
          ? data.errors.join(", ")
          : data.error || "Failed to start processing";
        setError(errorMessage);
        setStatus("error");
      }
    } catch (err) {
      console.error("API request failed:", err);
      setError(
        "Failed to connect to the summarization service. Please check your connection and try again."
      );
      setStatus("error");
    }
  };

  const resetForm = () => {
    setYoutubeUrl("");
    setRssFeedUrl("");
    setEpisodeName("");
    setDetailLevel([0.5]);
    setStatus("idle");
    setError(null);
    setSummary(null);
    setIsYoutubeValid(false);
    setIsRssValid(false);
    setCurrentTaskId(null);
    setYoutubeValidationData(null);
    setRssValidationData(null);
    stopPolling();
  };

  const copyToClipboard = () => {
    if (summary?.content) {
      navigator.clipboard.writeText(summary.content);
      setCopySuccess(true);
    }
  };

  const handleYoutubeValidation = (isValid: boolean, data?: any) => {
    setIsYoutubeValid(isValid);
    setYoutubeValidationData(data);
  };

  const handleRssValidation = (isValid: boolean, data?: any) => {
    setIsRssValid(isValid);
    setRssValidationData(data);
  };

  const canSubmit = () => {
    if (status === "loading" || isLoading) return false;

    if (source === "youtube") {
      return isYoutubeValid && youtubeUrl.trim();
    } else {
      return isRssValid && rssFeedUrl.trim() && episodeName.trim();
    }
  };

  if (currentTaskId && taskInfo) {
    return (
      <div className="space-y-8">
        <TaskProgress taskInfo={taskInfo} />

        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={resetForm}
            className="flex items-center gap-2 bg-transparent"
          >
            <RefreshCw className="h-4 w-4" />
            Start New Summary
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AnimatePresence mode="wait">
        {status !== "success" ? (
          <motion.div
            key="form"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeIn}
          >
            <Card className="w-full border border-slate-200 dark:border-slate-700 shadow-xl bg-white dark:bg-slate-900 rounded-xl overflow-hidden">
              <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
                      Podcast Summarizer
                    </CardTitle>
                    <CardDescription className="text-slate-500 dark:text-slate-400 mt-1">
                      Select your podcast source and provide the necessary
                      information
                    </CardDescription>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Badge
                      variant="outline"
                      className="text-corporate-600 dark:text-corporate-400 bg-corporate-50 dark:bg-corporate-900/20 border-corporate-200 dark:border-corporate-800"
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI-Powered
                    </Badge>
                  </motion.div>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                <form onSubmit={handleSubmit}>
                  <Tabs
                    defaultValue="youtube"
                    className="w-full"
                    onValueChange={(value) => {
                      setSource(value as PodcastSource);
                      setError(null);
                    }}
                  >
                    <TabsList className="flex w-full mb-8 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <TabsTrigger
                        value="youtube"
                        className="flex-1 flex items-center justify-center gap-2 rounded-md py-3 
                        data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 
                        data-[state=active]:shadow-sm data-[state=active]:border-b-2 
                        data-[state=active]:border-corporate-600 dark:data-[state=active]:border-corporate-400
                        data-[state=active]:text-corporate-600 dark:data-[state=active]:text-corporate-400
                        transition-all duration-200"
                      >
                        <Youtube className="h-4 w-4" />
                        <span>YouTube</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="rss"
                        className="flex-1 flex items-center justify-center gap-2 rounded-md py-3 
                        data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 
                        data-[state=active]:shadow-sm data-[state=active]:border-b-2 
                        data-[state=active]:border-corporate-600 dark:data-[state=active]:border-corporate-400
                        data-[state=active]:text-corporate-600 dark:data-[state=active]:text-corporate-400
                        transition-all duration-200"
                      >
                        <Podcast className="h-4 w-4" />
                        <span>RSS Feeds</span>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="youtube" className="space-y-6 w-full">
                      <UrlValidator
                        platform="youtube"
                        value={youtubeUrl}
                        onChange={setYoutubeUrl}
                        onValidationChange={handleYoutubeValidation}
                        placeholder="https://www.youtube.com/watch?v=..."
                        label="YouTube Video URL"
                        apiUrl={API_URL}
                      />

                      {isYoutubeValid && (
                        <motion.div
                          className="mt-6 space-y-4"
                          initial="hidden"
                          animate="visible"
                          variants={fadeIn}
                        >
                          <div className="flex justify-between items-center">
                            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              Summary Detail Level
                            </Label>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {detailLevel[0] < 0.33
                                ? "Concise"
                                : detailLevel[0] < 0.66
                                ? "Balanced"
                                : "Detailed"}
                            </span>
                          </div>
                          <Slider
                            defaultValue={[0.5]}
                            max={1}
                            step={0.25}
                            value={detailLevel}
                            onValueChange={setDetailLevel}
                            className="py-2"
                          />
                          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                            <span>Shorter</span>
                            <span>Longer</span>
                          </div>
                        </motion.div>
                      )}
                    </TabsContent>

                    <TabsContent value="rss" className="space-y-6">
                      <UrlValidator
                        platform="rss"
                        value={rssFeedUrl}
                        onChange={setRssFeedUrl}
                        onValidationChange={handleRssValidation}
                        placeholder="https://feeds.example.com/podcast.xml"
                        label="Podcast RSS Feed URL"
                        apiUrl={API_URL}
                      />

                      {isRssValid && (
                        <motion.div
                          className="space-y-4"
                          initial="hidden"
                          animate="visible"
                          variants={fadeIn}
                        >
                          <div className="space-y-2">
                            <Label
                              htmlFor="episode-name"
                              className="text-sm font-medium text-slate-700 dark:text-slate-300"
                            >
                              Episode Name
                            </Label>
                            <Input
                              id="episode-name"
                              placeholder="Enter the exact episode name"
                              value={episodeName}
                              onChange={(e) => setEpisodeName(e.target.value)}
                              required
                              className="border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-corporate-500/20 dark:focus:ring-corporate-500/20 transition-all"
                            />
                            {rssValidationData?.sample_episodes && (
                              <div className="mt-2">
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                                  Recent episodes (click to select):
                                </p>
                                <div className="space-y-1">
                                  {rssValidationData.sample_episodes
                                    .slice(0, 3)
                                    .map((episode: any, index: number) => (
                                      <button
                                        key={index}
                                        type="button"
                                        onClick={() =>
                                          setEpisodeName(episode.title)
                                        }
                                        className="w-full text-left p-2 text-xs bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded border border-slate-200 dark:border-slate-700 transition-colors"
                                      >
                                        <div className="truncate font-medium">
                                          {episode.title}
                                        </div>
                                        <div className="text-slate-500 dark:text-slate-400">
                                          {episode.published}
                                        </div>
                                      </button>
                                    ))}
                                </div>
                              </div>
                            )}
                          </div>

                          <motion.div
                            className="mt-6 space-y-4"
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                          >
                            <div className="flex justify-between items-center">
                              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Summary Detail Level
                              </Label>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {detailLevel[0] < 0.33
                                  ? "Concise"
                                  : detailLevel[0] < 0.66
                                  ? "Balanced"
                                  : "Detailed"}
                              </span>
                            </div>
                            <Slider
                              defaultValue={[0.5]}
                              max={1}
                              step={0.25}
                              value={detailLevel}
                              onValueChange={setDetailLevel}
                              className="py-2"
                            />
                            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                              <span>Shorter</span>
                              <span>Longer</span>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </TabsContent>
                  </Tabs>

                  <AnimatePresence>
                    {(error || taskError) && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <Alert
                          variant="destructive"
                          className="mt-6 rounded-lg"
                        >
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Error</AlertTitle>
                          <AlertDescription>
                            {error || taskError}
                          </AlertDescription>
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-8">
                    <motion.div
                      whileHover={{ scale: canSubmit() ? 1.02 : 1 }}
                      whileTap={{ scale: canSubmit() ? 0.98 : 1 }}
                    >
                      <Button
                        type="submit"
                        className="w-full py-6 bg-corporate-600 hover:bg-corporate-700 text-white rounded-lg font-medium shadow-corporate hover:shadow-corporate-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!canSubmit()}
                      >
                        {status === "loading" || isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Starting Processing...
                          </>
                        ) : (
                          <>
                            Summarize Podcast
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="summary"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={cardVariants}
            className="max-w-4xl mx-auto"
          >
            {/* Background animation elements */}
            <div className="absolute top-0 right-0 -z-10 opacity-20 dark:opacity-10">
              <div className="relative w-96 h-96">
                <div className="absolute top-0 right-0 w-72 h-72 bg-corporate-300 dark:bg-corporate-700 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
                <div className="absolute top-20 right-20 w-72 h-72 bg-corporate-200 dark:bg-corporate-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-corporate-400 dark:bg-corporate-800 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
              </div>
            </div>

            <Card className="w-full overflow-hidden border border-slate-200 dark:border-slate-700 shadow-corporate bg-white dark:bg-slate-900 rounded-xl relative z-10">
              {/* Header with podcast info */}
              <CardHeader className="p-0">
                {summary?.thumbnail && (
                  <div className="relative w-full h-56 md:h-72 overflow-hidden">
                    <Image
                      src={summary.thumbnail || "/placeholder.svg"}
                      alt={summary.title}
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                    {/* New Summary button */}
                    <div className="absolute top-4 right-4 z-10">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="animate-float"
                      >
                        <Button
                          onClick={resetForm}
                          className="bg-corporate-600 hover:bg-corporate-700 text-white border-corporate-500 shadow-lg hover:shadow-xl hover:shadow-corporate-500/20 transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded-full"
                        >
                          <RefreshCw className="h-4 w-4" />
                          <span>New Summary</span>
                        </Button>
                      </motion.div>
                    </div>

                    {/* Podcast metadata on image */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: 0.2,
                          type: "spring",
                          stiffness: 100,
                        }}
                        className="inline-flex items-center px-3 py-1 mb-3 text-xs font-medium rounded-full bg-corporate-600/90 text-white"
                      >
                        <Sparkles className="h-3 w-3 mr-2" />
                        AI-Powered Summary
                      </motion.div>

                      <motion.h2
                        className="text-2xl md:text-3xl font-bold mb-2 line-clamp-2 font-heading tracking-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, type: "spring" }}
                      >
                        {summary?.title}
                      </motion.h2>

                      <motion.div
                        className="flex flex-wrap gap-2 mt-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        {summary?.channel && (
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1 text-white border-white/30 bg-black/30 backdrop-blur-sm"
                          >
                            <User className="h-3 w-3" />
                            {summary.channel}
                          </Badge>
                        )}
                        {summary?.duration_string && (
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1 text-white border-white/30 bg-black/30 backdrop-blur-sm"
                          >
                            <Clock className="h-3 w-3" />
                            {summary.duration_string}
                          </Badge>
                        )}
                        {summary?.release_date && (
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1 text-white border-white/30 bg-black/30 backdrop-blur-sm"
                          >
                            <Calendar className="h-3 w-3" />
                            {summary.release_date}
                          </Badge>
                        )}
                      </motion.div>
                    </div>
                  </div>
                )}
              </CardHeader>

              {/* Summary content */}
              <CardContent className="p-6 md:p-8 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/95">
                <motion.div
                  className="space-y-6"
                  initial="hidden"
                  animate="visible"
                  variants={staggerItems}
                >
                  <motion.div
                    className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4"
                    variants={itemVariants}
                  >
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2 font-heading">
                      <BarChart3 className="h-5 w-5 text-corporate-600 dark:text-corporate-400" />
                      Executive Summary
                    </h3>

                    <div className="flex gap-2">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-500 hover:text-slate-900 dark:text-slate-400 hover:dark:text-white"
                          onClick={copyToClipboard}
                        >
                          {copySuccess ? (
                            <span className="flex items-center">
                              <CheckCircle2 className="h-4 w-4 mr-1 text-corporate-500" />
                              Copied
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <Copy className="h-4 w-4 mr-1" />
                              Copy
                            </span>
                          )}
                        </Button>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-500 hover:text-slate-900 dark:text-slate-400 hover:dark:text-white"
                        >
                          <Bookmark className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="bg-white dark:bg-slate-800/50 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50"
                    variants={itemVariants}
                  >
                    {summary?.content ? (
                      <MarkdownRenderer content={summary.content} />
                    ) : (
                      <p className="text-slate-500 dark:text-slate-400 italic">
                        No summary content available.
                      </p>
                    )}
                  </motion.div>

                  {/* Action buttons */}
                  <motion.div
                    className="mt-8 flex flex-wrap gap-3 justify-end"
                    variants={itemVariants}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="shadow-sm hover:shadow-md transition-all"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                        onClick={copyToClipboard}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy to Clipboard
                      </Button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </CardContent>

              <CardFooter className="bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-4 px-6">
                <div className="w-full flex justify-between items-center">
                  <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    Generated by AI Podcast Summarizer
                  </span>
                  {(youtubeUrl || rssFeedUrl) && (
                    <a
                      href={source === "youtube" ? youtubeUrl : rssFeedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-corporate-600 dark:text-corporate-400 hover:underline flex items-center font-medium"
                    >
                      View Original Content
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  )}
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
