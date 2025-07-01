"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite/api";
import { SigninType, SigninValidation } from "@/schema/user-schema";
import { cookies } from "next/headers";
import { SESSION_NAME } from "@/lib/constants";

export async function signInAccount(form: SigninType) {
  const parsedBody = SigninValidation.safeParse(form);
  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message);
  }
  const { account } = await createAdminClient();
  try {
    const session = await account.createEmailPasswordSession(
      parsedBody.data.email,
      parsedBody.data.password,
    );
    const oneYear = 365 * 24 * 60 * 60 * 1000;
    cookies().set(SESSION_NAME, session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      expires: Date.now() + oneYear,
    });
    return { success: true, message: "Sign In Successfully" };
  } catch (error: any) {
    console.log({ error });
    return {
      success: false,
      message: "Sign in Failed",
      error: error?.message,
    };
  }
}

export async function getAccount() {
  try {
    const { account } = await createSessionClient();
    const currentAccount = await account.get();
    return currentAccount;
  } catch {
    return null;
  }
}

export const logOutCurrentUser = async () => {
  try {
    cookies().delete(SESSION_NAME);
  } catch {
    return null;
  }
};
