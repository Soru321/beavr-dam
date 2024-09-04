import { z } from "zod";

export const productType = z.enum(["GATE", "POLE", "OTHER"]);
export type ProductType = z.infer<typeof productType>;

const areaName = z.enum(["", "Door", "Window", "Garage"]);

export const areaItemSchema = z.object({
  id: z.string().min(1),
  areaName,
  width: z.number().min(1),
  height: z.number().min(1),
  gateCount: z.number().min(1),
  poleCount: z.number().min(1),
  error: z.string(),
  countError: z.string(),
  widthError: z.string(),
  heightError: z.string(),
});

export type AreaItem = z.infer<typeof areaItemSchema>;
export type AreaName = z.infer<typeof areaName>;
