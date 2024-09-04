import { render } from '@react-email/render';

import { EMAIL_VERIFICATION_CONTENT } from '@/data/auth';
import { sendEmail } from '@/lib/server/utils';
import { EmailVerificationType } from '@/lib/types/auth';
import { generateVerificationTokenFunc } from '@/server/routers/auth';

import { EmailVerification } from './templates/email-verification';

interface SendEmailVerificationProps {
  type: EmailVerificationType;
  userId: number;
  email: string;
  userName: string | null;
}

export async function sendEmailVerification({
  type,
  userId,
  email,
  userName,
}: SendEmailVerificationProps) {
  const { token } = await generateVerificationTokenFunc({ userId, email });
  const url = new URL("/verify-email", process.env.NEXT_PUBLIC_APP_URL);
  url.searchParams.append("email", email);
  url.searchParams.append("token", token);
  const confirmLink = url.toString();
  const html = render(
    <EmailVerification
      link={confirmLink}
      userName={userName}
      content={EMAIL_VERIFICATION_CONTENT[type].content}
    />,
  );
  await sendEmail({
    from: process.env.SALES_EMAIL,
    to: email,
    subject: EMAIL_VERIFICATION_CONTENT[type].subject,
    html,
  });
}
