export type AreaName = "Door" | "Window" | "Garage";

export type AreaItem = {
  id: string;
  areaName: AreaName;
  width: number;
  height: number;
  amount: number;
  canStack: boolean;
  isStack: boolean;
  items: {
    id: number;
    image: string;
    name: string;
    shortDescription: string;
    price: number;
    quantity: number;
    amount: number;
  }[];
  widthError: string;
  heightError: string;
};
