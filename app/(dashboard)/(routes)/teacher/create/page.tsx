"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/app/_context/auth-context";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "El titulo es requerido",
  }),
});

interface Value {
  userEmail: string;
  values: {
    title: string;
  };
}

const CreatePage = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const { user } = useAuth();

  let userEmail: string | null;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let info: Value;
    try {
      if (user) {
        userEmail = user.email;
        info = { values, userEmail };
        console.log(info);
        const response = await axios.post("/api/courses", info);
        router.push(`/teacher/courses/${response.data.id}`);
        toast.success("Curso creado");
      }
    } catch (error) {
      toast.error("Algo va mal");
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl">Nombra tu Curso</h1>
        <p className="text-sm text-slate-600">
          Como llamaras tu curso? No te preocupes, puedes cambiarlo en cualquier
          momento.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titulo del Curso</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g 'Titulo'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    ¿Que quieres enseñar en este curso?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Link href="/">
                <Button type="button" variant="ghost">
                  Cancelar
                </Button>
              </Link>
              <Button disabled={!isValid || isSubmitting}>Continuar</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreatePage;
