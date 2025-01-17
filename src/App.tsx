import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Upgrade from "@/pages/Upgrade";
import BookmarkedDates from "@/pages/BookmarkedDates";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <Routes>
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/upgrade" element={<ProtectedRoute><Upgrade /></ProtectedRoute>} />
            <Route path="/bookmarked-dates" element={<ProtectedRoute><BookmarkedDates /></ProtectedRoute>} />
          </Routes>
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;