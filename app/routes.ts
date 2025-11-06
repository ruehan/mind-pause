import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("login", "routes/login.tsx"),
	route("emotion", "routes/emotion.tsx"),
	route("chat", "routes/chat.tsx"),
	route("community", "routes/community.tsx"),
	route("community/write", "routes/community.write.tsx"),
	route("community/:postId", "routes/community.$postId.tsx"),
	route("dashboard", "routes/dashboard.tsx"),
	route("profile", "routes/profile.tsx"),
	route("challenge", "routes/challenge.tsx"),
	route("help", "routes/help.tsx"),
	route("admin", "routes/admin.tsx"),
	route("error", "routes/error.tsx"),
	route("avatar-demo", "routes/avatar-demo.tsx"),
] satisfies RouteConfig;
