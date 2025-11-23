import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AppSidebar } from "@/components/AppSidebar";
import { TopBar } from "@/components/TopBar";
import { CommandPalette } from "@/components/CommandPalette";
import Incidents from "./pages/Incidents";
import IncidentDetail from "./pages/IncidentDetail";
import Analytics from "./pages/Analytics";
import Runbooks from "./pages/Runbooks";
import Reports from "./pages/Reports";
import Config from "./pages/Config";
import Integrations from "./pages/Integrations";
import Debug from "./pages/Debug";
import NotFound from "./pages/NotFound";
import ChatBox from "@/components/ChatBox";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider defaultOpen>
            <div className="min-h-screen flex w-full">
              <AppSidebar />
              <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 p-6 overflow-auto">
                  <Routes>
                    <Route path="/" element={<Navigate to="/incidents" replace />} />
                    <Route path="/incidents" element={<Incidents />} />
                    <Route path="/incidents/:id" element={<IncidentDetail />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/runbooks" element={<Runbooks />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/config" element={<Config />} />
                    <Route path="/integrations" element={<Integrations />} />
                    <Route path="/debug" element={<Debug />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </div>
            <ChatBox />
            <CommandPalette />
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
