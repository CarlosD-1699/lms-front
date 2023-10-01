"use client";

import * as z from "zod";
import axios, { AxiosRequestConfig } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";

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

const formSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, {
        message: "La contraseña es requerida",
      })
      .min(8, {
        message: "La contraseña debe ser mayor a 8 caracteres",
      }),
    confirmPassword: z
      .string()
      .min(1, {
        message: "La contraseña es requerida",
      })
      .min(8, {
        message: "La contraseña debe ser mayor a 8 caracteres",
      }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "La contraseña no coincide",
    path: ["confirmPassword"],
  });

const ChangePassword = () => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const token = searchParams.get("token");

  const options: AxiosRequestConfig<any> = {
    headers: {
      token,
    },
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post(
        "/api/auth/change-password",
        values,
        options
      );
      router.push(`/sign-in`);
    } catch (error) {
      toast.error("Algo va mal");
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div className="border-2 rounded-md m-auto p-8">
        <h1 className="text-2xl font-semibold text-black">
          Cambia tu contraseña
        </h1>
        <p className="text-sm text-slate-600 mb-2">
          Formulario para cambiar contraseña
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 p-1"
          >
            <FormField
              control={form.control}
              name="newPassword"
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
                      placeholder="Confirmar contraseña"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={isSubmitting}>Cambiar contraseña</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ChangePassword;
