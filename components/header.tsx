"use client";

import type { User } from "@/utils/models";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Crown,
  LogOut,
  Shield,
  Settings,
  UserIcon,
  Sparkles,
  UserCircle,
  HelpCircle,
  ChevronDown,
} from "lucide-react";

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  const getInitials = (username: string) => {
    return username
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleConfig = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return {
          color:
            "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-200 dark:from-amber-900/30 dark:to-orange-900/30 dark:text-amber-300 dark:border-amber-700",
          icon: Crown,
          label: "Administrator",
        };
      case "user":
        return {
          color:
            "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-300 dark:border-blue-700",
          icon: UserCircle,
          label: "User",
        };
      default:
        return {
          color:
            "bg-gradient-to-r from-slate-100 to-gray-100 text-slate-800 border-slate-200 dark:from-slate-800/30 dark:to-gray-800/30 dark:text-slate-300 dark:border-slate-700",
          icon: UserCircle,
          label: role,
        };
    }
  };

  const roleConfig = getRoleConfig(user.role);
  const RoleIcon = roleConfig.icon;

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-b-2 border-slate-200/60 dark:border-slate-700/60 shadow-lg shadow-slate-900/5 dark:shadow-slate-900/20"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Enhanced Logo and Brand */}
          <motion.div
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="relative">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-corporate-600 via-corporate-700 to-corporate-800 rounded-2xl shadow-xl shadow-corporate-500/25">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white dark:border-slate-900 shadow-sm"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-slate-100 dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent font-heading">
                Podcast Summarizer
              </h1>
              <div className="flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-corporate-600 dark:text-corporate-400" />
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Powered by{" "}
                  <span className="text-corporate-600 dark:text-corporate-400">
                    Inat Networks
                  </span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Enhanced User Menu */}
          <motion.div
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-3 px-4 py-3 h-auto bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-800/30 hover:from-slate-100 hover:to-slate-50 dark:hover:from-slate-800 dark:hover:to-slate-700/50 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 rounded-2xl transition-all duration-300 group shadow-lg shadow-slate-900/5 dark:shadow-slate-900/20"
                  >
                    <Avatar className="w-10 h-10 ring-2 ring-slate-200 dark:ring-slate-700 ring-offset-2 ring-offset-white dark:ring-offset-slate-900">
                      <AvatarFallback className="bg-gradient-to-br from-corporate-600 via-corporate-700 to-corporate-800 text-white text-sm font-bold shadow-inner">
                        {getInitials(user.username)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start min-w-0">
                      <span className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-32">
                        {user.username}
                      </span>
                      <Badge
                        variant="secondary"
                        className={`text-xs px-2 py-0.5 h-5 font-semibold border ${roleConfig.color} shadow-sm`}
                      >
                        <RoleIcon className="w-3 h-3 mr-1" />
                        {roleConfig.label}
                      </Badge>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-all duration-200 group-hover:rotate-180" />
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-72 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 shadow-2xl rounded-2xl p-3 mt-2"
                sideOffset={8}
              >
                {/* User Info Header */}
                <DropdownMenuLabel className="px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-xl mb-2">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12 ring-2 ring-corporate-200 dark:ring-corporate-700">
                      <AvatarFallback className="bg-gradient-to-br from-corporate-600 to-corporate-700 text-white font-bold">
                        {getInitials(user.username)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <p className="text-base font-bold text-slate-900 dark:text-white">
                        {user.username}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={`text-xs px-2 py-1 font-semibold border ${roleConfig.color}`}
                        >
                          <RoleIcon className="w-3 h-3 mr-1" />
                          {roleConfig.label}
                        </Badge>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          Online
                        </span>
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700 my-2" />

                {/* Menu Items */}
                <motion.div
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.2 }}
                >
                  <DropdownMenuItem className="px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer group transition-all duration-200">
                    <UserIcon className="w-5 h-5 mr-3 text-slate-500 group-hover:text-corporate-600 dark:group-hover:text-corporate-400 transition-colors" />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
                        Profile Settings
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Manage your account
                      </span>
                    </div>
                  </DropdownMenuItem>
                </motion.div>

                <motion.div
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.2 }}
                >
                  <DropdownMenuItem className="px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer group transition-all duration-200">
                    <Settings className="w-5 h-5 mr-3 text-slate-500 group-hover:text-corporate-600 dark:group-hover:text-corporate-400 transition-colors" />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
                        Preferences
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Customize your experience
                      </span>
                    </div>
                  </DropdownMenuItem>
                </motion.div>

                <motion.div
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.2 }}
                >
                  <DropdownMenuItem className="px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer group transition-all duration-200">
                    <HelpCircle className="w-5 h-5 mr-3 text-slate-500 group-hover:text-corporate-600 dark:group-hover:text-corporate-400 transition-colors" />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
                        Help & Support
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Get assistance
                      </span>
                    </div>
                  </DropdownMenuItem>
                </motion.div>

                <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700 my-2" />

                {/* Logout */}
                <motion.div
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.2 }}
                >
                  <DropdownMenuItem
                    onClick={onLogout}
                    className="px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/50 cursor-pointer group transition-all duration-200"
                  >
                    <LogOut className="w-5 h-5 mr-3 text-red-500 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors" />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300">
                        Sign Out
                      </span>
                      <span className="text-xs text-red-500 dark:text-red-400">
                        End your session
                      </span>
                    </div>
                  </DropdownMenuItem>
                </motion.div>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
