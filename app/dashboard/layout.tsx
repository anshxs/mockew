// app/dashboard/layout.tsx

import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="px-8 md:px-20">
      {children}
    </div>
  );
}
