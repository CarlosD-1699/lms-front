"use client";

import { useAuth } from "@/app/_context/auth-context";
import { IconBadge } from "@/components/icon-badge";
import axios from "axios";
import { LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import TitleForm from "./_components/title-form";

interface CourseData {
  id?: string | null;
  title?: string;
  description?: string | null;
  imageUrl?: string | null;
  price?: number | null;
  categoryId?: string | null;
}

const CourseIdPage = ({ params }: { params: { courseId: string } }) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseData>();

  useEffect(() => {
    CourseInfoVerify({ params });
  }, []);

  const CourseInfoVerify = async ({
    params,
  }: {
    params: { courseId: string };
  }) => {
    const info = { params, user };
    const response = await axios.post("/api/courses/coursesid", info);
    console.log(response.data);
    setCourses(response.data);
    console.log(courses);
  };

  let requiredFields = [];

  const title = courses?.title || "";
  const description = courses?.description || "";
  const imageUrl = courses?.imageUrl || "";
  const price = courses?.price || "";
  const categoryId = courses?.categoryId || "";

  requiredFields.push(title, description, imageUrl, price, categoryId);

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Configuración del Curso</h1>
          <span className="text-sm text-slate-700">
            Completa todos los campos {completionText}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">Personaliza tu Curso</h2>
          </div>
          <TitleForm
            initialData={{ title: courses?.title }}
            courseId={courses?.id}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseIdPage;
