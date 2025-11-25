import { useEffect } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Navigate,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useNavigate,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { ToastProvider } from "./components/ToastProvider";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ForbiddenError } from "./lib/api";
import ErrorPage from "./routes/error";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://cdn.jsdelivr.net" },
  {
    rel: "stylesheet",
    href: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css",
  },
  { rel: "icon", type: "image/png", href: "/logo.png" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    const publicPaths = ["/", "/login"];
    const isPublicPath = publicPaths.some((path) =>
      location.pathname === path || location.pathname.startsWith(path + "/")
    ) || location.pathname.includes("improve");

    if (!isAuthenticated && !isPublicPath) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, isLoading, location.pathname, navigate]);

  if (isLoading) {
    return null;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AuthGuard>
          <Outlet />
        </AuthGuard>
      </ToastProvider>
    </AuthProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let errorType: "404" | "500" | "403" | "network" | "maintenance" | "session" | "ratelimit" = "500";

  if (error instanceof ForbiddenError) {
    return <Navigate to="/" replace />;
  }

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      errorType = "404";
    } else if (error.status === 403) {
      return <Navigate to="/" replace />;
    } else if (error.status === 429) {
      errorType = "ratelimit";
    } else if (error.status === 503) {
      errorType = "maintenance";
    } else {
      errorType = "500";
    }
  }

  return <ErrorPage type={errorType} />;
}
