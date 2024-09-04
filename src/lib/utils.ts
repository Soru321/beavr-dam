import { Row, Table } from "@tanstack/react-table";
import axios from "axios";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";

import { Currency } from "./zod/order";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const loadPublicFile = (path: string) => {
  return `${process.env.NEXT_PUBLIC_APP_URL}/api/file/${encodeURIComponent(
    path,
  )}`;
};

export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});

// format file size
export const formatFileSize = (sizeBytes: number) => {
  if (sizeBytes === 0) {
    return "0 B";
  }
  const sizeName = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(sizeBytes) / Math.log(1024));
  const p = Math.pow(1024, i);
  const s = (sizeBytes / p).toFixed(2);
  return `${s} ${sizeName[i]}`;
};

export const formatNumber = (number: number | string) => {
  return new Intl.NumberFormat("en-US").format(+number);
};

export const formatAmount = (amount: number | string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD" as Currency,
  }).format(+amount);
};

export const createValidSlug = (string: string) => {
  return string
    .replace(/[^\w\s-]/g, "") // Remove non-alphanumeric, non-space, and non-hyphen characters
    .toLowerCase()
    .replace(/\s+/g, "-");
};

export const createTitleFromSlug = (slug: string) => {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
};

export const generateRandomString = () => uuidv4();

export const getDataTableRowSerialNumber = <T, R>(
  table: Table<T>,
  row: Row<R>,
) =>
  table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
  row.index +
  1;
