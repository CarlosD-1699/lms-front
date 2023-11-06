"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/app/_context/auth-context";
import { useEffect } from "react";

import {
  Form,
  FormControl,
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
  password: z
    .string()
    .min(1, {
      message: "La contraseña es requerida",
    })
    .min(8, {
      message: "La contraseña debe ser mayor a 8 caracteres",
    }),
});

const Signin = () => {
  const router = useRouter();
  const { signin, isAuthenticated, user } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;
  const { register } = form;

  useEffect(() => {
    if (isAuthenticated) router.push(`/dashboard`);
  }, [isAuthenticated]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      signin(values);
      console.log(user);
    } catch (error) {
      toast.error("Algo va mal");
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div className="border-2 rounded-md m-auto p-8">
        <h1 className="text-2xl font-semibold text-black">Inicia Sesión</h1>
        <p className="text-sm text-slate-600 mb-2">
          Formulario para iniciar sesión
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 p-2"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo</FormLabel>
                  <FormControl>
                    <Input
                      {...register("email", { required: true })}
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input
                      {...register("password", { required: true })}
                      disabled={isSubmitting}
                      placeholder="Ingresa tu contraseña"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={isSubmitting}>Iniciar Sesión</Button>
            </div>
            <div className="flex flex-col items-center gap-y-3">
              <div className="flex items-center gap-x-1">
                <p className="text-sm text-slate-600">
                  Te olvidaste tu contraseña?
                </p>
                <Link href="/forget-password">
                  <h3 className="text-sm text-black font-semibold">
                    Recuperar contraseña
                  </h3>
                </Link>
              </div>
              <div className="flex items-center gap-x-1">
                <p className="text-sm text-slate-600">Aun no tienes cuenta?</p>
                <Link href="/sign-up">
                  <h3 className="text-sm text-black font-semibold">
                    Registrate
                  </h3>
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Signin;
