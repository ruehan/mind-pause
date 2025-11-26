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
	route("metrics", "routes/metrics.tsx"),
	route("profile", "routes/profile.tsx"),
	route("challenge", "routes/challenge.tsx"),
	route("help", "routes/help.tsx"),
	route("admin", "routes/admin.tsx"),
	route("error", "routes/error.tsx"),
	route("avatar-demo", "routes/avatar-demo.tsx"),
	route("qna", "routes/qna.tsx"),
	route("qna_dashboard", "routes/qna_dashboard.tsx"),
	
	// Archived Old Pages
	route("home-old", "routes/home_old.tsx"),
	route("login-old", "routes/login_old.tsx"),
	route("dashboard-old", "routes/dashboard_old.tsx"),
	route("emotion-old", "routes/emotion_old.tsx"),
	route("chat-old", "routes/chat_old.tsx"),
	route("community-old", "routes/community_old.tsx"),
	route("challenge-old", "routes/challenge_old.tsx"),
	route("profile-old", "routes/profile_old.tsx"),
] satisfies RouteConfig;
