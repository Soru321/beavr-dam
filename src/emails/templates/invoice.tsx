import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

import { loadPublicFile } from "@/lib/utils";

import { SendInvoiceProps } from "../invoice";
import LayoutComponent from "./components/layout";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

export default function Invoice({
  orderEmailValue,
  paymentMethod,
  invoiceId,
  date,
  amount,
  items,
  customer,
}: SendInvoiceProps) {
  return (
    <LayoutComponent
      bodyProps={{ style: main }}
      preview={orderEmailValue?.title ?? "Invoice"}
    >
      <Container style={container}>
        {!!orderEmailValue && (
          <Section>
            <Row className="mb-4 border-b border-solid border-gray-200">
              <Heading
                as="h2"
                className="bg-primary py-4 text-center text-white"
              >
                {orderEmailValue.title}
              </Heading>
              <Text className="px-4">{orderEmailValue.description}</Text>
            </Row>
          </Section>
        )}
        <Section>
          <Column>
            <Img
              src={`${APP_URL}/images/logo.webp`}
              height="42"
              alt={process.env.NEXT_PUBLIC_APP_NAME}
            />
          </Column>

          <Column align="right" style={tableCell}>
            <Text style={heading}>INVOICE</Text>
          </Column>
        </Section>
        <Section style={informationTable}>
          <Row style={informationTableRow}>
            <Column colSpan={2}>
              <Row>
                <Column style={informationTableColumn}>
                  <Text style={informationTableLabel}>PAYMENT METHOD</Text>
                  <Text style={informationTableValue}>{paymentMethod}</Text>
                </Column>
              </Row>
              <Row>
                <Column style={informationTableColumn}>
                  <Text style={informationTableLabel}>INVOICE ID</Text>
                  <Text style={informationTableValue}>{invoiceId}</Text>
                </Column>
              </Row>
              <Row>
                <Column style={informationTableColumn}>
                  <Text style={informationTableLabel}>INVOICE DATE</Text>
                  <Text style={informationTableValue}>{date}</Text>
                </Column>
              </Row>
            </Column>
            <Column style={informationTableColumn} colSpan={2}>
              <Text style={informationTableLabel}>BILLED TO</Text>
              <Text style={informationTableValue}>
                {customer.name} <br />
                {customer.email} <br />
                {customer.phoneNumber} <br />
                {customer.address} <br />
                {customer.city}, {customer.country} <br />
                {customer.postalCode} <br />
              </Text>
            </Column>
          </Row>
        </Section>
        <Section style={productTitleTable}>
          <Text style={productsTitle}>Products</Text>
        </Section>
        {items?.map((item, index) => (
          <Section key={`item-${index}`} style={{ marginBottom: "20px" }}>
            <Column style={{ width: "64px" }}>
              <Img
                src={loadPublicFile(item.image ?? "")}
                width="64"
                alt="Image"
                style={productImage}
              />
            </Column>
            <Column style={{ paddingLeft: "16px" }}>
              <Text style={productTitle}>{item.name}</Text>
              <Text
                style={productDescription}
                title={item.shortDescription ?? ""}
              >
                {item.shortDescription}
              </Text>
            </Column>
            <Column>
              <Text>{item.quantity}</Text>
            </Column>
            <Column style={productPriceWrapper} align="right">
              <Text style={productPrice}>${item.amount}</Text>
            </Column>
          </Section>
        ))}
        <Hr style={productPriceLine} />
        <Section align="right">
          <Column style={tableCell} align="right">
            <Text style={productPriceTotal}>TOTAL</Text>
          </Column>
          <Column style={productPriceVerticalLine}></Column>
          <Column style={productPriceLargeWrapper}>
            <Text style={productPriceLarge}>${amount}</Text>
          </Column>
        </Section>
        <Hr style={productPriceLineBottom} />

        <Section>
          <Text style={footerCopyright}>
            Copyright © {new Date().getFullYear()}{" "}
            {process.env.NEXT_PUBLIC_APP_NAME} <br />
            All rights reserved
          </Text>
        </Section>
      </Container>
    </LayoutComponent>
  );
}

const main = {
  fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
  backgroundColor: "#ffffff",
};

const resetText = {
  margin: "0",
  padding: "0",
  lineHeight: 1.4,
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "660px",
};

const tableCell = { display: "table-cell" };

const heading = {
  fontSize: "32px",
  fontWeight: "300",
  color: "#888888",
  letterSpacing: "2px",
};

const informationTable = {
  borderCollapse: "collapse" as const,
  borderSpacing: "0px",
  color: "rgb(51,51,51)",
  backgroundColor: "rgb(250,250,250)",
  borderRadius: "3px",
  fontSize: "12px",
  marginTop: "20px",
};

const informationTableRow = {
  height: "46px",
};

const informationTableColumn = {
  paddingLeft: "20px",
  borderStyle: "solid",
  borderColor: "white",
  borderWidth: "0px 1px 1px 0px",
  height: "44px",
};

const informationTableLabel = {
  ...resetText,
  color: "rgb(102,102,102)",
  fontSize: "10px",
};

const informationTableValue = {
  fontSize: "12px",
  margin: "0",
  padding: "0",
  lineHeight: 1.4,
};

const productTitleTable = {
  ...informationTable,
  margin: "30px 0 15px 0",
  height: "24px",
};

const productsTitle = {
  background: "#fafafa",
  fontSize: "14px",
  fontWeight: "500",
  margin: "0",
  padding: "10px",
};

const productImage = {
  margin: "0 0 0 20px",
  height: "60px",
  borderRadius: "5px",
  objectFit: "cover" as const,
};

const productTitle = { fontSize: "12px", fontWeight: "600", ...resetText };

const productDescription = {
  fontSize: "12px",
  color: "rgb(102,102,102)",
  ...resetText,

  display: "-webkit-box",
  WebkitLineClamp: 2,
  overflow: "hidden",
  WebkitBoxOrient: "vertical" as const,
};

const productPriceTotal = {
  color: "rgb(102,102,102)",
  fontSize: "10px",
  fontWeight: "600",
  padding: "0px 30px 0px 0px",
  textAlign: "right" as const,
};

const productPrice = {
  fontSize: "12px",
  fontWeight: "600",
};

const productPriceLarge = {
  margin: "0px 20px 0px 0px",
  fontSize: "16px",
  fontWeight: "600",
  whiteSpace: "nowrap" as const,
  textAlign: "right" as const,
};

const productPriceWrapper = {
  display: "table-cell",
  padding: "0px 20px 0px 0px",
  width: "100px",
  verticalAlign: "top",
};

const productPriceLine = { margin: "30px 0 0 0" };

const productPriceVerticalLine = {
  height: "48px",
  borderLeft: "1px solid",
  borderColor: "rgb(238,238,238)",
};

const productPriceLargeWrapper = { display: "table-cell", width: "90px" };

const productPriceLineBottom = { margin: "0 0 75px 0" };

const walletBottomLine = { margin: "4px 0 20px 0" };

const footerHeading = {
  fontSize: "14px",
  margin: "0",
};

const footerText = {
  fontSize: "12px",
  color: "rgb(102,102,102)",
  margin: "0",
  lineHeight: "auto",
  marginBottom: "16px",
};

const footerCopyright = {
  margin: "25px 0 0 0",
  textAlign: "center" as const,
  fontSize: "12px",
  color: "rgb(102,102,102)",
};
