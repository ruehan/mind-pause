import { useState } from "react";
import { Search, Filter, MoreVertical, Mail, Ban, Check } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  status: "active" | "inactive" | "banned";
  emotionLogs: number;
  lastActive: string;
}

interface UserManagementTableProps {
  users: User[];
}

export function UserManagementTable({ users }: UserManagementTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "banned">("all");
  const [sortBy, setSortBy] = useState<"joinDate" | "lastActive" | "emotionLogs">("joinDate");

  const filteredUsers = users
    .filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "joinDate") return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
      if (sortBy === "lastActive") return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
      return b.emotionLogs - a.emotionLogs;
    });

  const getStatusBadge = (status: User["status"]) => {
    const styles = {
      active: "bg-mint-100 text-mint-700",
      inactive: "bg-neutral-200 text-neutral-700",
      banned: "bg-error-100 text-error-700",
    };
    const labels = {
      active: "활성",
      inactive: "비활성",
      banned: "차단",
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
      {/* Header with Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="이름 또는 이메일 검색..."
            className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-neutral-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">전체 상태</option>
            <option value="active">활성</option>
            <option value="inactive">비활성</option>
            <option value="banned">차단</option>
          </select>
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="joinDate">가입일순</option>
          <option value="lastActive">최근활동순</option>
          <option value="emotionLogs">기록수순</option>
        </select>
      </div>

      {/* Results Count */}
      <p className="text-body-sm text-neutral-600 mb-4">
        총 {filteredUsers.length}명의 사용자
      </p>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="text-left py-3 px-4 text-body-sm font-semibold text-neutral-700">
                사용자
              </th>
              <th className="text-left py-3 px-4 text-body-sm font-semibold text-neutral-700">
                이메일
              </th>
              <th className="text-left py-3 px-4 text-body-sm font-semibold text-neutral-700">
                상태
              </th>
              <th className="text-left py-3 px-4 text-body-sm font-semibold text-neutral-700">
                감정기록
              </th>
              <th className="text-left py-3 px-4 text-body-sm font-semibold text-neutral-700">
                가입일
              </th>
              <th className="text-left py-3 px-4 text-body-sm font-semibold text-neutral-700">
                최근활동
              </th>
              <th className="text-center py-3 px-4 text-body-sm font-semibold text-neutral-700">
                작업
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-lavender-400 flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0)}
                    </div>
                    <span className="text-body font-medium text-neutral-900">
                      {user.name}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 text-body-sm text-neutral-600">
                  {user.email}
                </td>
                <td className="py-4 px-4">{getStatusBadge(user.status)}</td>
                <td className="py-4 px-4 text-body text-neutral-900">
                  {user.emotionLogs}회
                </td>
                <td className="py-4 px-4 text-body-sm text-neutral-600">
                  {user.joinDate}
                </td>
                <td className="py-4 px-4 text-body-sm text-neutral-600">
                  {user.lastActive}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      className="p-2 hover:bg-primary-50 rounded-lg transition-colors"
                      title="이메일 보내기"
                    >
                      <Mail className="w-4 h-4 text-primary-600" />
                    </button>
                    <button
                      className="p-2 hover:bg-error-50 rounded-lg transition-colors"
                      title="차단하기"
                    >
                      <Ban className="w-4 h-4 text-error-600" />
                    </button>
                    <button
                      className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                      title="더보기"
                    >
                      <MoreVertical className="w-4 h-4 text-neutral-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-h4 text-neutral-700 mb-2">검색 결과가 없습니다</h3>
          <p className="text-body text-neutral-600">
            다른 검색어나 필터를 시도해보세요
          </p>
        </div>
      )}
    </div>
  );
}
