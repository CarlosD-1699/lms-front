"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

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
  email: z
    .string()
    .min(1, {
      message: "El Correo es requerido",
    })
    .email({ message: "El correo no es valido" }),
});

const ForgetPassword = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/auth/forget-password", values);
      router.push(`/sign-in`);
    } catch (error) {
      toast.error("Algo va mal");
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div className="border-2 rounded-md m-auto p-8">
        <h1 className="text-2xl font-semibold text-black">
          Recuperar contraseña
        </h1>
        <p className="text-sm text-slate-600 mb-2">
          Formulario para recuperar contraseña
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 p-1"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Ingresa tu correo"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={isSubmitting}>Recuperar contraseña</Button>
            </div>
            <div className="flex justify-center items-center gap-x-1">
              <p className="text-sm text-slate-600">Volver al</p>
              <Link href="/sign-in">
                <h3 className="text-sm text-black font-semibold">Inicio</h3>
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ForgetPassword;
