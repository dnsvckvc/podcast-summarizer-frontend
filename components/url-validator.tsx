"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useUrlValidation } from "@/hooks/use-url-validation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Hash,
  Loader2,
  Youtube,
  Podcast,
  Calendar,
  AlertCircle,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

interface UrlValidatorProps {
  platform: "youtube" | "rss";
  value: string;
  onChange: (value: string) => void;
  onValidationChange: (isValid: boolean, data?: any) => void;
  placeholder: string;
  label: string;
}

export function UrlValidator({
  platform,
  value,
  onChange,
  onValidationChange,
  placeholder,
  label,
}: UrlValidatorProps) {
  const { validateUrl, isValidating, lastValidation } = useUrlValidation();
  const [hasValidated, setHasValidated] = useState(false);

  useEffect(() => {
    if (!value.trim()) {
      setHasValidated(false);
      onValidationChange(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      if (value.trim() && !isValidating) {
        handleValidation();
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [value, platform]);

  useEffect(() => {
    if (lastValidation) {
      onValidationChange(lastValidation.valid, lastValidation.data);
    }
  }, [lastValidation, onValidationChange]);

  const handleValidation = async () => {
    if (!value.trim()) return;

    setHasValidated(true);
    await validateUrl(value.trim(), platform);
  };

  const getValidationIcon = () => {
    if (isValidating) {
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    }
    if (lastValidation?.valid) {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
    if (hasValidated && !lastValidation?.valid) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
        <div className="relative">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-corporate-500/20 dark:focus:ring-corporate-500/20 transition-all pr-10"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {getValidationIcon()}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {hasValidated && lastValidation && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {lastValidation.valid ? (
              <Alert className="bg-corporate-50 dark:bg-corporate-900/20 border-corporate-200 dark:border-corporate-800 rounded-lg">
                <CheckCircle2 className="h-4 w-4 text-corporate-600 dark:text-corporate-400" />
                <AlertTitle className="font-medium text-corporate-700 dark:text-corporate-300">
                  {platform === "youtube"
                    ? "YouTube URL Validated"
                    : "RSS Feed Validated"}
                </AlertTitle>
                <AlertDescription className="text-corporate-600 dark:text-corporate-400">
                  {platform === "youtube"
                    ? "The YouTube URL is valid and ready for processing."
                    : "The RSS feed is valid and contains podcast episodes."}
                </AlertDescription>

                {/* Show additional info for RSS feeds */}
                {platform === "rss" && lastValidation.data && (
                  <div className="mt-3 space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className="text-corporate-600 dark:text-corporate-400 bg-corporate-50 dark:bg-corporate-900/20"
                      >
                        <Podcast className="h-3 w-3 mr-1" />
                        {lastValidation.data.feed_title}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-corporate-600 dark:text-corporate-400 bg-corporate-50 dark:bg-corporate-900/20"
                      >
                        <Hash className="h-3 w-3 mr-1" />
                        {lastValidation.data.episode_count} episodes
                      </Badge>
                    </div>

                    {lastValidation.data.sample_episodes &&
                      lastValidation.data.sample_episodes.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-corporate-600 dark:text-corporate-400 mb-1">
                            Recent episodes:
                          </p>
                          <div className="space-y-1">
                            {lastValidation.data.sample_episodes
                              .slice(0, 3)
                              .map((episode, index) => (
                                <div
                                  key={index}
                                  className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                >
                                  <Calendar className="h-3 w-3" />
                                  <span className="truncate">
                                    {episode.title}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                  </div>
                )}

                {/* Show video info for YouTube */}
                {platform === "youtube" && lastValidation.data && (
                  <div className="mt-3">
                    <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="bg-red-500 rounded-lg p-2 flex-shrink-0">
                        <Youtube className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                          Video ID: {lastValidation.data.video_id}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Ready to process
                        </p>
                      </div>
                      <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-corporate-600 dark:text-corporate-400 hover:text-corporate-700 dark:hover:text-corporate-300"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                )}
              </Alert>
            ) : (
              <Alert variant="destructive" className="rounded-lg">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Validation Failed</AlertTitle>
                <AlertDescription>
                  {lastValidation.error || "Invalid URL provided"}
                </AlertDescription>
              </Alert>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
