import { render } from "@react-email/render";

import { sendEmail } from "@/lib/server/utils";
import { ContactUs } from "@/lib/zod/contact-us";

import { Contact } from "./templates/contact";

interface SendMessageProps {
  adminName: string | null;
  contactDetails: ContactUs;
}

export async function sendMessage(props: SendMessageProps) {
  const html = render(<Contact {...props} />);
  await sendEmail({
    from: process.env.CUSTOMER_SERVICE_EMAIL,
    to: process.env.BEAVR_DAM_GMAIL,
    subject: `New Contact Form Submission from ${props.contactDetails.name}`,
    html,
  });
}
