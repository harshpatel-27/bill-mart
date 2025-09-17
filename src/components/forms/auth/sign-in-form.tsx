"use client";

import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SigninType, SigninValidation } from "@/schema/user-schema";
import CustomInput from "@/components/CustomInput";
import { signInAccount } from "@/actions/user";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export function SignInForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignin = async (values: SigninType) => {
    try {
      setIsLoading(true);
      const loadingToast = toast.loading("Signing In...", {
        duration: Infinity,
      });
      const isLoggedIn = await signInAccount(values);
      toast.dismiss(loadingToast);
      if (isLoggedIn?.success) {
        toast.success("Sign in successful");
        router.push("/");
      } else {
        toast.error(`Failed to Signin: ${isLoggedIn?.error}`);
      }
      setIsLoading(false);
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Logo Section */}
      <div className="mb-8 flex flex-col items-center">
        <div className="bg-white rounded-full shadow-lg mb-4">
          <Image
            src="/logo.png"
            alt="Bill Mart"
            width={100}
            height={100}
            className="object-cover rounded-full"
          />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
        <p className="text-gray-600 mt-2">
          Sign in to continue to your account
        </p>
      </div>

      <Form {...form}>
        <Card className="w-full max-w-md shadow-xl rounded-2xl overflow-hidden border-0">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-2 w-full"></div>
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl text-center font-semibold text-gray-800">
              Sign In
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Enter your email & password below to sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8">
            <form
              onSubmit={form.handleSubmit(handleSignin)}
              className="flex flex-col gap-5 w-full mt-4"
            >
              <CustomInput
                placeholder={"Enter Email"}
                control={form.control}
                className="h-12 !mt-[2px] rounded-lg"
                name={"email"}
                label={"Email"}
              />

              <CustomInput
                placeholder="Enter Password"
                control={form.control}
                className="!h-12 !mt-[2px] rounded-lg"
                name="password"
                label="Password"
                type="password"
              />

              <div className="text-right -mt-3">
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                className="shad-button_primary h-12 rounded-lg text-base font-medium shadow-md hover:shadow-lg transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Form>

      <div className="mt-8 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} Bill Mart. All rights reserved.</p>
      </div>
    </div>
  );
}
