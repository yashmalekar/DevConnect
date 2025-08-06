import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Discover from "./pages/Discover";
import Projects from "./pages/Projects";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import Feed from "./pages/Feed";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/SignUp";
import AddProject from "./pages/AddProject";
import CreatePost from "./pages/CreatePost";
import AuthListener from '../backend/AuthListener.tsx'
import Comments from "./pages/Comments.tsx";
import Posts from "./pages/Posts.tsx";
import UserProjects from "./pages/UserProjects.tsx";
import Followers from "./pages/Followers.tsx";
import Following from "./pages/Following.tsx";
import Chat from "./pages/Chat.tsx"

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
      <AuthListener>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/add" element={<AddProject />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/post/:postId" element={<Comments />} />
          <Route path="/feed/create" element={<CreatePost />} />
          <Route path ="/dashboard/posts" element={<Posts />} />
          <Route path ="/dashboard/projects" element={<UserProjects />} />
          <Route path ="/dashboard/followers" element={<Followers />} />
          <Route path ="/dashboard/following" element={<Following />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:username" element={<Chat />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthListener>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
