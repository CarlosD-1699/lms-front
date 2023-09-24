"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";

const NavbarRoutes = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isPlayerPage = pathname?.includes("/chapter");

  const logout = async () => {
    try {
      const response = await axios.post("/api/auth/logout");
      // router.push(`/sign-in`);
    } catch (error) {
      toast.error("Algo va mal");
    }
  };

  return (
    <div className="flex gap-x-2 ml-auto">
      {/* {isTeacherPage || isPlayerPage ? (
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
      )} */}
      <div>
        <Link href="/teacher/courses">
          <Button size="sm" variant="ghost">
            Profesor
          </Button>
        </Link>
      </div>
      <div>
        <Link href="/sign-in">
          <Button onClick={() => logout()}>
            <LogOut className="h-4 w-4 mr-2" />
            Salir
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NavbarRoutes;
