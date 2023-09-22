"use client";

import { Layout, Compass, List, BarChart } from "lucide-react";
import SidebarItem from "./sidebar-item";
import { usePathname } from "next/navigation";

const guestRoutes = [
  {
    icon: Layout,
    label: "Panel",
    href: "/",
  },
  {
    icon: Compass,
    label: "Navegar",
    href: "/search",
  },
];

const teacherRoutes = [
  {
    icon: List,
    label: "Cursos",
    href: "/teacher/courses",
  },
  {
    icon: BarChart,
    label: "Analítica",
    href: "/teacher/analytics",
  },
];

const SidebarRoutes = () => {
  const pathname = usePathname();

  const isTeacher = pathname?.includes("/teacher");

  const routes = isTeacher ? teacherRoutes : guestRoutes;

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};

export default SidebarRoutes;
