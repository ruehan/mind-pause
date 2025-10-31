import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { DevSidebar } from "./components/DevSidebar";
import { ToastProvider } from "./components/ToastProvider";
import ErrorPage from "./routes/error";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://cdn.jsdelivr.net" },
  {
    rel: "stylesheet",
    href: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css",
  },
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
        <DevSidebar />
        <div className="ml-16">
          {children}
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <Outlet />
    </ToastProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let errorType: "404" | "500" | "403" | "network" | "maintenance" | "session" | "ratelimit" = "500";

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      errorType = "404";
    } else if (error.status === 403) {
      errorType = "403";
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
