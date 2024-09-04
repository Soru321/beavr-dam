declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: "development" | "production";

    NEXT_PUBLIC_APP_URL: string;
    NEXT_PUBLIC_APP_NAME: string;

    DATABASE_URL: string;

    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;

    JWT_SECRET_KEY: string;

    TMP_STORAGE: string;
    PRIVATE_STORAGE: string;
    PUBLIC_STORAGE: string;

    EMAIL_SERVER_HOST: string;
    EMAIL_SERVER_PORT: string;
    EMAIL_SERVER_USER: string;
    EMAIL_SERVER_PASSWORD: string;

    BEAVR_DAM_GMAIL: string;
    SALES_EMAIL: string;
    CUSTOMER_SERVICE_EMAIL: string;

    NEXT_PUBLIC_PRODUCT_NAME: string;
    NEXT_PUBLIC_PRODUCT_DESCRIPTION: string;
    NEXT_PUBLIC_PRODUCT_PRICE: number;

    NEXT_PUBLIC_PAYPAL_CLIENT_ID: string;
    PAYPAL_CLIENT_SECRET: string;
  }
}
