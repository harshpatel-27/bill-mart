"use client";

import * as z from "zod";
import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Form} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {SigninType, SigninValidation} from "@/schema/user-schema";
import CustomInput from "@/components/CustomInput";
import {signInAccount} from "@/actions/user";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {useState} from "react";

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
  };

  return (
    <Form {...form}>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Signin</CardTitle>
          <CardDescription>
            Enter your email & password below to signin to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(handleSignin)}
            className="flex flex-col gap-5 w-full mt-4">
            <CustomInput
              placeholder={"Enter Email"}
              control={form.control}
              className="h-12 !mt-[2px]"
              name={"email"}
              label={"Email"}
            />

            <CustomInput
              placeholder="Enter Password"
              control={form.control}
              className="!h-12 !mt-[2px]"
              name="password"
              label="Password"
              type="password"
            />

            <Button
              type="submit"
              className="shad-button_primary"
              disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Form>
  );
}
