import { render } from "@react-email/render";

import { sendEmail } from "@/lib/server/utils";

import { ResetPassword } from "./templates/reset-password";

export async function sendResetPasswordEmail(email: string, link: string) {
  const html = render(<ResetPassword link={link} />);
  await sendEmail({
    from: process.env.CUSTOMER_SERVICE_EMAIL,
    to: email,
    subject: "Reset Your Password Now",
    html,
  });
}
