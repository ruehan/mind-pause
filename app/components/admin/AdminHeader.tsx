import { Button } from "../Button";

export function AdminHeader() {
  const handleLogout = () => {
    console.log("Admin logout");
    // TODO: Implement logout functionality
  };

  return (
    <header className="bg-neutral-900 text-white h-16 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🧘</span>
        <h1 className="text-h3 font-bold">마음쉼표 관리자 콘솔</h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm">관리자: 홍길동</span>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white hover:bg-neutral-800">
          로그아웃
        </Button>
      </div>
    </header>
  );
}
