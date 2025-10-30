import { useState } from "react";
import { AlertCircle, Info, AlertTriangle, XCircle, Search, Download } from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "error" | "critical";
  message: string;
  source: string;
  details?: string;
}

interface LogViewerProps {
  logs: LogEntry[];
}

export function LogViewer({ logs }: LogViewerProps) {
  const [filter, setFilter] = useState<"all" | "info" | "warning" | "error" | "critical">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLogs = logs
    .filter((log) => filter === "all" || log.level === filter)
    .filter(
      (log) =>
        log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.source.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getLevelIcon = (level: LogEntry["level"]) => {
    const iconMap = {
      info: Info,
      warning: AlertTriangle,
      error: AlertCircle,
      critical: XCircle,
    };
    return iconMap[level];
  };

  const getLevelStyle = (level: LogEntry["level"]) => {
    const styles = {
      info: {
        bg: "bg-primary-50",
        text: "text-primary-700",
        border: "border-primary-200",
      },
      warning: {
        bg: "bg-accent-50",
        text: "text-accent-700",
        border: "border-accent-200",
      },
      error: {
        bg: "bg-error-50",
        text: "text-error-700",
        border: "border-error-200",
      },
      critical: {
        bg: "bg-error-100",
        text: "text-error-900",
        border: "border-error-400",
      },
    };
    return styles[level];
  };

  const getLevelLabel = (level: LogEntry["level"]) => {
    const labels = {
      info: "정보",
      warning: "경고",
      error: "오류",
      critical: "치명적",
    };
    return labels[level];
  };

  const handleExport = () => {
    const logText = filteredLogs
      .map((log) => `[${log.timestamp}] [${log.level.toUpperCase()}] [${log.source}] ${log.message}`)
      .join("\n");
    const blob = new Blob([logText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `logs-${new Date().toISOString()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Count by level
  const counts = {
    all: logs.length,
    info: logs.filter((l) => l.level === "info").length,
    warning: logs.filter((l) => l.level === "warning").length,
    error: logs.filter((l) => l.level === "error").length,
    critical: logs.filter((l) => l.level === "critical").length,
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-h3 text-neutral-900">로그 뷰어</h2>
          <p className="text-body-sm text-neutral-600">
            시스템 로그를 조회하고 관리하세요
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-body-sm font-medium"
        >
          <Download className="w-4 h-4" />
          로그 내보내기
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Level Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-body-sm font-medium whitespace-nowrap transition-colors ${
              filter === "all"
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            전체 ({counts.all})
          </button>
          <button
            onClick={() => setFilter("info")}
            className={`px-4 py-2 rounded-lg text-body-sm font-medium whitespace-nowrap transition-colors ${
              filter === "info"
                ? "bg-primary-600 text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            정보 ({counts.info})
          </button>
          <button
            onClick={() => setFilter("warning")}
            className={`px-4 py-2 rounded-lg text-body-sm font-medium whitespace-nowrap transition-colors ${
              filter === "warning"
                ? "bg-accent-600 text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            경고 ({counts.warning})
          </button>
          <button
            onClick={() => setFilter("error")}
            className={`px-4 py-2 rounded-lg text-body-sm font-medium whitespace-nowrap transition-colors ${
              filter === "error"
                ? "bg-error-600 text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            오류 ({counts.error})
          </button>
          <button
            onClick={() => setFilter("critical")}
            className={`px-4 py-2 rounded-lg text-body-sm font-medium whitespace-nowrap transition-colors ${
              filter === "critical"
                ? "bg-error-700 text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            치명적 ({counts.critical})
          </button>
        </div>

        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="로그 검색..."
            className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Logs List */}
      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {filteredLogs.map((log) => {
          const Icon = getLevelIcon(log.level);
          const style = getLevelStyle(log.level);
          return (
            <div
              key={log.id}
              className={`border ${style.border} ${style.bg} rounded-lg p-4 hover:shadow-sm transition-shadow`}
            >
              {/* Log Header */}
              <div className="flex items-start gap-3 mb-2">
                <Icon className={`w-5 h-5 ${style.text} flex-shrink-0 mt-0.5`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold ${style.text} uppercase`}>
                      {getLevelLabel(log.level)}
                    </span>
                    <span className="text-caption text-neutral-500">•</span>
                    <span className="text-caption text-neutral-600">{log.source}</span>
                    <span className="text-caption text-neutral-500">•</span>
                    <span className="text-caption text-neutral-500">{log.timestamp}</span>
                  </div>
                  <p className="text-body text-neutral-900 break-words">
                    {log.message}
                  </p>
                  {log.details && (
                    <details className="mt-2">
                      <summary className="text-body-sm text-neutral-600 cursor-pointer hover:text-primary-600">
                        세부 정보 보기
                      </summary>
                      <pre className="mt-2 p-3 bg-neutral-900 text-neutral-100 rounded text-xs overflow-x-auto">
                        {log.details}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredLogs.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-h4 text-neutral-700 mb-2">로그가 없습니다</h3>
          <p className="text-body text-neutral-600">
            {searchQuery ? "검색 결과가 없습니다" : "해당 레벨의 로그가 없습니다"}
          </p>
        </div>
      )}
    </div>
  );
}
