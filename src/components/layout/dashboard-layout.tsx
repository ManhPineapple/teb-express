import { useState, useEffect } from "react";
import Sidebar from "../shared/sidebar";
import Header from "../shared/header";
import MobileSidebar from "../shared/mobile-sidebar";
import { MenuIcon } from "lucide-react";
import { useRouter } from "@/routes/hooks";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (window.location.pathname === '/') {
      router.push('/home');
    }
  }, [router]);

  return (
    <div className="flex h-screen overflow-hidden bg-secondary">
      <MobileSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <Sidebar />
      <div className="flex w-0 flex-1 flex-col overflow-hidden">
        <div className="relative z-10 flex  flex-shrink-0  shadow">
          <button
            className="pl-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </button>
          <Header />
        </div>
        <main className="relative flex-1 overflow-y-auto bg-background focus:outline-none ">
          {children}
        </main>
      </div>
    </div>
  );
}
