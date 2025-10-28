import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("emotion", "routes/emotion.tsx"),
  route("chat", "routes/chat.tsx"),
  route("community", "routes/community.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("profile", "routes/profile.tsx"),
  route("challenge", "routes/challenge.tsx"),
  route("help", "routes/help.tsx"),
] satisfies RouteConfig;
