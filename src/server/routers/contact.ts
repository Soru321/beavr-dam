import { sendMessage } from "@/emails/contact";
import { contactUsSchema } from "@/lib/zod/contact-us";

import { publicProcedure, router } from "../trpc";

export const contactRouter = router({
  send: publicProcedure
    .input(contactUsSchema)
    .mutation(async ({ input, ctx: { session } }) => {
      sendMessage({
        adminName: !!session?.user.name ? session.user.name : "Admin",
        contactDetails: {
          name: input.name,
          email: input.email,
          message: input.message,
        },
      });

      return {
        message:
          "Thank you for reaching out! Your message has been successfully sent.",
      };
    }),
});
