"use client";

import Footer from "@/components/footer";
import LoginPage from "@/components/auth";

import { LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { Hero } from "@/components/hero";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/components/auth/hooks/useAuth";
import { FeaturesSection } from "@/components/features-section";
import { SummarizationSection } from "@/components/summarization-section";

export default function Home() {
  const { login, logout, authState } = useAuth();

  const handleLogin = async (username: string, password: string) => {
    const result = await login(username, password);
    return result;
  };

  const handleLogout = async () => {
    await logout();
  };

  if (!authState.isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-gray-950 dark:to-slate-900 overflow-hidden">
      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Logout Button */}
      <motion.div
        className="fixed top-6 right-20 z-40"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </motion.div>

      {/* User Info */}
      <motion.div
        className="fixed top-6 left-6 z-40"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 shadow-lg">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Welcome,{" "}
            <span className="font-medium text-corporate-600 dark:text-corporate-400">
              {authState.user?.username}
            </span>
          </p>
        </div>
      </motion.div>

      {/* Main section */}
      <div className="relative pt-20 pb-2 md:pt-32">
        <div className="container mx-auto px-6 max-w-screen-xl">
          <Hero />
          <SummarizationSection />
          <FeaturesSection />
          <Footer />
        </div>
      </div>
    </main>
  );
}
