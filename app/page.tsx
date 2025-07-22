"use client";

import Footer from "@/components/footer";
import LoginPage from "@/components/auth";

import { Hero } from "@/components/hero";
import { Header } from "@/components/header";
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
      {/* Header */}
      <Header user={authState.user!} onLogout={handleLogout} />

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Main section */}
      <div className="relative pt-24 pb-2 md:pt-32">
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
