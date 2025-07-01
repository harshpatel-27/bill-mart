"use server";

import { appwriteConfig } from "./config";
import {
  Client,
  Account,
  Databases,
  Messaging,
  Users,
  Storage,
} from "node-appwrite";
import { cookies } from "next/headers";
import { SESSION_NAME } from "@/lib/constants";

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(appwriteConfig.url)
    .setProject(appwriteConfig.projectId);

  const session = cookies().get(SESSION_NAME);
  if (!session || !session.value) {
    throw new Error("No session");
  }
  client.setSession(session.value);
  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
  };
}

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(appwriteConfig.url)
    .setProject(appwriteConfig.projectId)
    .setKey(appwriteConfig.apiSecret);
  return {
    get account() {
      return new Account(client);
    },
    get users() {
      return new Users(client);
    },
    get messaging() {
      return new Messaging(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
  };
}
