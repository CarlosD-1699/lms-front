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

const formSchema = z
  .object({
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
    confirmPassword: z.string().min(1, {
      message: "Debes confirmar la contraseña",
    }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "La contraseña no coincide",
      });
    }
  });

const Signup = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(isSubmitting);
      const response = await axios.post("/api/auth/signup", values);
      router.push(`/dashboard`);
    } catch (error) {
      toast.error("Algo va mal");
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div className="min-w-[40%] border-2 rounded-md m-auto p-8">
        <h1 className="text-2xl font-semibold text-black">Registrate</h1>
        <p className="text-sm text-slate-600 mb-2">
          Formulario para crear una cuenta
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar contraseña</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Repite tu contraseña"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={isSubmitting}>Crear cuenta</Button>
            </div>

            <div className="flex items-center gap-x-1">
              <p className="text-sm text-slate-600">Ya tienes cuenta?</p>
              <Link href="/sign-in">
                <h3 className="text-sm text-black font-semibold">
                  Inicia Sesión
                </h3>
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Signup;
