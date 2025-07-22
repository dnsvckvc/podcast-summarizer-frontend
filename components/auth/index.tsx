"use client";

import type React from "react";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Eye,
  Lock,
  User,
  EyeOff,
  Shield,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

interface LoginPageProps {
  onLogin: (
    username: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await onLogin(username, password);
      if (!result.success) {
        setError(
          result.error || "Invalid username or password. Please try again."
        );
      }
    } catch (error) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-corporate-100 dark:bg-corporate-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-corporate-200 dark:bg-corporate-800/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-corporate-50 dark:bg-corporate-700/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-corporate-600 via-corporate-700 to-corporate-800 rounded-2xl mb-6 shadow-xl shadow-corporate-500/25"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Shield className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 dark:from-slate-100 dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent font-heading mb-2">
            Podcast Summarizer
          </h1>

          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-corporate-600 dark:text-corporate-400" />
            <p className="text-slate-600 dark:text-slate-300 font-medium">
              AI-Powered Content Analysis
            </p>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Powered by{" "}
            <span className="text-corporate-600 dark:text-corporate-400 font-semibold">
              Inat Networks
            </span>
          </p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="shadow-2xl border-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl overflow-hidden">
            <CardHeader className="pb-6 pt-8 px-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-heading mb-2">
                  Welcome Back
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Sign in to access your dashboard
                </p>
              </div>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username Field */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Label
                    htmlFor="username"
                    className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Username
                  </Label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-corporate-600 dark:group-focus-within:text-corporate-400 w-5 h-5 transition-colors duration-200" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-12 h-12 border-2 border-slate-200 dark:border-slate-700 focus:border-corporate-500 dark:focus:border-corporate-400 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all duration-200 focus:shadow-lg focus:shadow-corporate-500/10"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </motion.div>

                {/* Password Field */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Label
                    htmlFor="password"
                    className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Password
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-corporate-600 dark:group-focus-within:text-corporate-400 w-5 h-5 transition-colors duration-200" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 pr-12 h-12 border-2 border-slate-200 dark:border-slate-700 focus:border-corporate-500 dark:focus:border-corporate-400 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all duration-200 focus:shadow-lg focus:shadow-corporate-500/10"
                      required
                      disabled={isLoading}
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <motion.button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="flex items-center justify-center w-5 h-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200"
                        disabled={isLoading}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>

                {/* Error Alert */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Alert className="border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/50 rounded-xl">
                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        <AlertDescription className="text-red-700 dark:text-red-300 font-medium ml-2">
                          {error}
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-corporate-600 via-corporate-700 to-corporate-800 hover:from-corporate-700 hover:via-corporate-800 hover:to-corporate-900 text-white font-semibold shadow-xl hover:shadow-2xl hover:shadow-corporate-500/25 transition-all duration-300 rounded-xl border-0 group"
                    disabled={isLoading || !username.trim() || !password.trim()}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2 group-hover:space-x-3 transition-all duration-200">
                        <span>Sign In</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    )}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="inline-flex items-center justify-center px-4 py-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-full border border-slate-200/50 dark:border-slate-700/50">
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              © 2025{" "}
              <span className="text-corporate-600 dark:text-corporate-400 font-semibold">
                Inat Networks
              </span>
              . All rights reserved.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
