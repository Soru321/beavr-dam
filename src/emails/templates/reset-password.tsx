import { Button, Container, Img, Section, Text } from "@react-email/components";
import * as React from "react";

import LayoutComponent from "./components/layout";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

interface ResetPasswordProps {
  link: string;
}

export function ResetPassword({ link }: ResetPasswordProps) {
  return (
    <LayoutComponent bodyProps={{ style: main }} preview="Email Verification">
      <Container style={container}>
        <Img
          src={`${APP_URL}/images/logo.webp`}
          height="42"
          alt={process.env.APP_NAME}
          style={logo}
        />
        <Text style={paragraph}>Hi,</Text>
        <Text style={paragraph}>
          We received a request to reset your password. If you initiated this
          request, please click the button below to reset your password.
        </Text>
        <Section style={btnContainer}>
          <Button style={button} href={link}>
            Reset Password
          </Button>
        </Section>
        <Text style={paragraph}>
          If you did not request a password reset, you can ignore this email.
          Your account remains secure.
        </Text>
        <Text style={paragraph}>
          Thank You,
          <br />
          The {process.env.NEXT_PUBLIC_APP_NAME} team
        </Text>
      </Container>
    </LayoutComponent>
  );
}

const main = {
  backgroundColor: "#99c620",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const container = {
  margin: "0 auto",
  padding: "4rem 3rem",
  backgroundColor: "#ffffff",
  borderRadius: "1.5rem",
};

const logo = {
  margin: "0 auto",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#99c620",
  borderRadius: "calc(0.5rem - 2px)",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 1.5rem",
};
