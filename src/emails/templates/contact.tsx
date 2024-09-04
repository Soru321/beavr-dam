import { Container, Img, Text } from "@react-email/components";
import * as React from "react";

import { ContactUs } from "@/lib/zod/contact-us";

import LayoutComponent from "./components/layout";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

interface ContactProps {
  adminName: string | null;
  contactDetails: ContactUs;
}

export function Contact({ adminName, contactDetails }: ContactProps) {
  return (
    <LayoutComponent bodyProps={{ style: main }} preview="Email Verification">
      <Container style={container}>
        <Img
          src={`${APP_URL}/images/logo.webp`}
          height="42"
          alt={process.env.APP_NAME}
          style={logo}
        />
        <Text style={paragraph}>Hi {adminName ?? ""},</Text>
        <Text style={paragraph}>
          You have received a new contact form submission. Here are the details:
        </Text>
        <Text style={paragraph}>
          Name: {contactDetails.name}
          <br />
          Email: {contactDetails.email}
          <br />
          Message: {contactDetails.message}
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
