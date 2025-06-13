// app/page.tsx

import {Sidebar ,SidebarProvider} from "@/components/ui/sidebar";
export default function HomePage() {
  return (
    <div className="flex h-screen bg-gray-100">
          {/* 사이드바 */}
          <SidebarProvider>
          <Sidebar >
            <div className="p-4 text-2xl font-bold border-b border-gray-700">
              My App
            </div>
            <div className="p-4 text-sm text-gray-400 border-t border-gray-700">
              © 2024 My App
            </div>
          </Sidebar>
          </SidebarProvider>

        </div>
  );
}