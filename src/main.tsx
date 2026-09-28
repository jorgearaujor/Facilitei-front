import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./routes";
import "./index.css";
import { AuthBootstrap } from "./components/auth/AuthBootstrap";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import { ThemedToaster } from "./components/theme/ThemedToaster";
import { PwaStatus } from "./components/pwa/PwaStatus";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      staleTime: 0,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <ThemedToaster />
        <PwaStatus />
        <AuthBootstrap>
          <RouterProvider router={router} />
        </AuthBootstrap>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
);
