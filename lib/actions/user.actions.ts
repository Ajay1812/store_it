"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { Query, ID } from "node-appwrite";
import { parseStringify } from "@/lib/utils";
import { cookies } from "next/headers";
// import { avatarPlaceholderUrl } from "@/constants";
import { redirect } from "next/navigation";

const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();

  const result = await databases.listDocuments(
    appwriteConfig.databaseID,
    appwriteConfig.usersCollectionId,
    [Query.equal("email", [email])],
  );

  return result.total > 0 ? result.documents[0] : null;
};

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken(ID.unique(), email);

    return session.userId;
  } catch (error) {
    handleError(error, "Failed to send email OTP");
  }
};

export const createAccount = async ({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) => {
  const existingUser = await getUserByEmail(email);

  const accountId = await sendEmailOTP({ email });
  if (!accountId) throw new Error("Failed to send an OTP");

  if (!existingUser) {
    const { databases } = await createAdminClient();

    await databases.createDocument(
      appwriteConfig.databaseID,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      {
        fullName,
        email,
        avatar: 'ddata:image/jpeg;base64,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',
        accountId,
      },
    );
  }
  return parseStringify({ accountId });
};

export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createSession(accountId, password);

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, "Failed to verify OTP");
  }
};

export const getCurrentUser = async () => {
  try {
    const { databases, account } = await createSessionClient();

    const result = await account.get();

    const user = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", result.$id)],
    );

    if (user.total <= 0) return null;

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error);
  }
};

export const signOutUser = async () => {
  const { account } = await createSessionClient();

  try {
    await account.deleteSession("current");
    (await cookies()).delete("appwrite-session");
  } catch (error) {
    handleError(error, "Failed to sign out user");
  } finally {
    redirect("/sign-in");
  }
};

export const signInUser = async ({ email }: { email: string }) => {
  try {
    const existingUser = await getUserByEmail(email);

    // User exists, send OTP
    if (existingUser) {
      await sendEmailOTP({ email });
      return parseStringify({ accountId: existingUser.accountId });
    }

    return parseStringify({ accountId: null, error: "User not found" });
  } catch (error) {
    handleError(error, "Failed to sign in user");
  }
};
