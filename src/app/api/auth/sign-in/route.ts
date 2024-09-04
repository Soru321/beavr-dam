import { compare } from "bcrypt";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";
import { users } from "@/db/schemas/auth";
import { sendEmailVerification } from "@/emails/email-verification";
import { SignInResponse } from "@/lib/types/auth";
import { signInSchema } from "@/lib/zod/auth";
import { UserStatus } from "@/lib/zod/user";

export const POST = async (req: NextRequest) => {
  try {
    const reqData = await req.json();
    const validatedData = signInSchema.safeParse(reqData);
    if (!validatedData.success) {
      return NextResponse.json(validatedData.error.issues, { status: 422 });
    }

    const { email: inputEmail, password: inputPassword } = validatedData.data;

    const user = await db.query.users.findFirst({
      where: eq(users.email, inputEmail),
    });
    if (!user || user.role === "USER") {
      return new NextResponse("Invalid credentials!", { status: 401 });
    }

    const isValidPassword = await compare(inputPassword, user.password ?? "");
    if (!isValidPassword) {
      return new NextResponse("Invalid credentials!", { status: 401 });
    }

    if (user.status === "BLOCKED") {
      return NextResponse.json(
        {
          key: "BLOCKED" as UserStatus,
          message: "Your account has been blocked. Please contact support.",
        },
        { status: 403 },
      );
    }

    if (!user.emailVerified) {
      sendEmailVerification({
        type: "SIGN_IN",
        userId: user.id,
        email: user.email,
        userName: user.name,
      });

      return NextResponse.json(
        { key: "emailVerification", message: "Please verify your email." },
        { status: 403 },
      );
    }

    const { id, role, name, email, image } = user;
    const signInResponse: SignInResponse = { id, role, name, email, image };
    return NextResponse.json(signInResponse);
  } catch (error) {
    return new NextResponse("Internal server error!", { status: 500 });
  }
};
