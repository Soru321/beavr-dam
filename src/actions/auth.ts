import axios from "axios";

import { SignIn } from "@/lib/zod/auth";

export const signInAction = async ({ email, password }: SignIn) => {
  return await axios
    .post(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/sign-in`, {
      email,
      password,
    })
    .then((res) => res.data);
};
