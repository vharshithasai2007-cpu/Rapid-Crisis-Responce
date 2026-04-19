import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Layout from "./components/Layout";
import UserView from "./pages/UserView";
import StaffDashboard from "./pages/StaffDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

type Role = "user" | "staff" | "admin";

const queryClient = new QueryClient();

declare global {
  interface Window {
    __reactRoot?: ReturnType<typeof createRoot>;
  }
}

const AppContent = () => {
  const [role, setRole] = useState<Role>("user");

  return (
    <Layout currentRole={role} onRoleChange={setRole}>
      {role === "user" && <UserView />}
      {role === "staff" && <StaffDashboard />}
      {role === "admin" && <AdminDashboard />}
    </Layout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppContent />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

const container = document.getElementById("root");
if (container) {
  if (!window.__reactRoot) {
    window.__reactRoot = createRoot(container);
  }
  window.__reactRoot.render(<App />);
}
