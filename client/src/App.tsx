import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Entries from "@/pages/Entries";
import Reminders from "@/pages/Reminders";
import Settings from "@/pages/Settings";
import Analytics from "@/pages/Analytics";
import { toast } from "@/hooks/use-toast";
import { type UserSettings } from "@shared/schema";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/entries" component={Entries} />
      <Route path="/reminders" component={Reminders} />
      <Route path="/settings" component={Settings} />
      <Route path="/analytics" component={Analytics} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  // Fetch user settings when app loads
  const { data: settings, isError } = useQuery<UserSettings>({
    queryKey: ['/api/settings'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Set initial appearance based on settings
  useEffect(() => {
    if (settings) {
      // Apply color mode
      if (settings.colorMode === "dark") {
        document.documentElement.classList.add("dark");
      } else if (settings.colorMode === "light") {
        document.documentElement.classList.remove("dark");
      } else if (settings.colorMode === "system") {
        const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (isDarkMode) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }

      // Apply background gradient
      document.documentElement.setAttribute("data-gradient", settings.backgroundGradient);

      // Apply font size
      if (settings.fontSize === "small") {
        document.documentElement.style.setProperty("--base-font-size", "14px");
      } else if (settings.fontSize === "medium") {
        document.documentElement.style.setProperty("--base-font-size", "16px");
      } else if (settings.fontSize === "large") {
        document.documentElement.style.setProperty("--base-font-size", "18px");
      }

      // Apply zoom level
      document.documentElement.style.fontSize = `${settings.zoomLevel}%`;
    } else {
      // Set defaults if settings not loaded
      document.documentElement.setAttribute("data-gradient", "orange-blue");
    }
  }, [settings]);

  // Show error if settings couldn't be loaded
  useEffect(() => {
    if (isError) {
      toast({
        title: "Settings Error",
        description: "Could not load your settings. Using defaults instead.",
        variant: "destructive",
      });
    }
  }, [isError]);

  return (
    <>
      <Router />
      <Toaster />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
