"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Ghost, LogOut } from "lucide-react";
import Link from "next/link";

const NavbarRoutes = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isPlayerPage = pathname?.includes("/chapter");

  return (
    <div className="flex gap-x-2 ml-auto">
      {isTeacherPage || isPlayerPage ? (
        <Link href="/">
          <Button>
            <LogOut className="h-4 w-4 mr-2" />
            Salir
          </Button>
        </Link>
      ) : (
        <Link href="/teacher/courses">
          <Button size="sm" variant="ghost">
            Profesor
          </Button>
        </Link>
      )}
    </div>
  );
};

export default NavbarRoutes;
