import { inferRouterOutputs } from '@trpc/server';
import { create } from 'zustand';

import { AreaItem, AreaName } from '@/lib/types/calculation';
import { generateRandomString } from '@/lib/utils';
import { AppRouter } from '@/server/routers';

type Product = inferRouterOutputs<AppRouter>["product"]["get"][0];
type ProductWithQuantity = Product & { quantity: number };

const areaItem: AreaItem = {
  id: "",
  areaName: "Door",
  width: 0,
  height: 0,
  amount: 0,
  canStack: false,
  isStack: false,
  items: [],
  widthError: "",
  heightError: "",
};

interface ItemStore {
  items: AreaItem[];
  amount: number;

  addItem: (areaName: AreaName) => void;
  removeItem: (itemId: string) => void;
  removeAllItems: () => void;
  onFieldChange: (props: {
    products: Product[];
    itemId: string;
    field: {
      name: string;
      value: string;
    };
  }) => void;
  updateItem: (props: { products: Product[]; itemId: string }) => void;
  updateAmount: () => void;
  toggleStack: (props: { products: Product[]; itemId: string }) => void;
}

export const useCalculation = create<ItemStore>((set, get) => ({
  items: [{ ...areaItem, id: generateRandomString() }],
  amount: 0,

  addItem: (areaName) => {
    set({
      items: [
        ...get().items,
        { ...areaItem, id: generateRandomString(), areaName },
      ],
    });
  },

  removeItem: (itemId) => {
    set({ items: get().items.filter((item) => item.id !== itemId) });
    get().updateAmount();
  },

  removeAllItems: () => {
    set({ items: [{ ...areaItem, id: generateRandomString() }] });
    get().updateAmount();
  },

  onFieldChange: ({ products, itemId, field }) => {
    set({
      items: [
        ...get().items.map((item) =>
          item.id === itemId
            ? {
                ...item,
                [field.name]: +field.value,
                items: [],
                amount: 0,
                isStack: false,
                widthError:
                  field.name === "width"
                    ? generateError({
                        fieldName: field.name,
                        fieldValue: field.value,
                      })
                    : item.widthError,
                heightError:
                  field.name === "height"
                    ? generateError({
                        fieldName: field.name,
                        fieldValue: field.value,
                      })
                    : item.heightError,
              }
            : item,
        ),
      ],
    });

    get().updateItem({ products, itemId });
  },

  updateItem: ({ products, itemId }) => {
    const item = get().items.find((item) => item.id === itemId);

    if (!item || !!item.widthError || !!item.heightError) {
      get().updateAmount();
      return;
    }

    const calculatedItem = calculate({ products, item });
    if (!calculatedItem) {
      get().updateAmount();
      return;
    }

    const { gatesProduct, poleProduct, canStack } = calculatedItem;

    const gatesAmount = gatesProduct.reduce((total, product) => {
      const amount =
        +product.price *
        (item.isStack ? product.quantity * 2 : product.quantity);
      return total + amount;
    }, 0);
    const poleAmount = !!poleProduct
      ? +poleProduct.price * poleProduct.quantity
      : 0;
    const amount = gatesAmount + poleAmount;

    set({
      items: [
        ...get().items.map((item) =>
          item.id === itemId
            ? {
                ...item,
                amount,
                canStack,
                items: [
                  ...gatesProduct.map((product) => ({
                    id: product.id,
                    name: product.name,
                    price: +product.price,
                    quantity: item.isStack
                      ? product.quantity * 2
                      : product.quantity,
                    amount:
                      +product.price *
                      (item.isStack ? product.quantity * 2 : product.quantity),
                    shortDescription: product.shortDescription ?? "",
                    image: product.productFiles.at(0)?.file.path ?? "",
                  })),
                  ...(!!poleProduct
                    ? [
                        {
                          id: poleProduct.id,
                          name: poleProduct.name,
                          price: +poleProduct.price,
                          quantity: poleProduct.quantity,
                          amount: +poleProduct.price * poleProduct.quantity,
                          shortDescription: poleProduct.shortDescription ?? "",
                          image:
                            poleProduct.productFiles.at(0)?.file.path ?? "",
                        },
                      ]
                    : []),
                ],
              }
            : item,
        ),
      ],
    });

    get().updateAmount();
  },

  updateAmount: () => {
    set({
      amount: get().items.reduce((total, item) => total + item.amount, 0),
    });
  },

  toggleStack: ({ products, itemId }) => {
    set({
      items: [
        ...get().items.map((item) =>
          item.id === itemId ? { ...item, isStack: !item.isStack } : item,
        ),
      ],
    });

    get().updateItem({ products, itemId });
  },
}));

interface Calculate {
  products: Product[];
  item: AreaItem;
}

type Calculation = {
  gatesProduct: ProductWithQuantity[];
  poleProduct?: ProductWithQuantity;
  canStack: boolean;
};

function calculate({ products, item }: Calculate): Calculation | void {
  const preCalculatedGates = calculateGatesHorizontally({
    itemWidth: item.width,
    itemHeight: item.height,
    products,
  });
  // console.log("🚀 ~ calculate ~ preCalculatedGates:", preCalculatedGates);
  const preCalculatedPole = calculatePole({
    item,
    calculatedGates: preCalculatedGates,
    products,
  });
  // console.log("🚀 ~ calculate ~ preCalculatedPole:", preCalculatedPole);
  const preCalculatedGatesQuantity = preCalculatedGates.reduce(
    (total, product) => total + product.quantity,
    0,
  );

  if (!!preCalculatedGatesQuantity && !preCalculatedPole) return;

  const calculatedGates =
    preCalculatedGatesQuantity > 1
      ? calculateGatesHorizontally({
          itemWidth:
            item.width -
            (preCalculatedPole?.width ?? 0) *
              (preCalculatedPole?.quantity ?? 0),
          itemHeight: item.height,
          products,
        })
      : preCalculatedGates;

  if (!calculatedGates.length) return;

  console.log("🚀 ~ calculate ~ calculatedGates:", calculatedGates);
  const calculatedGatesQuantity = calculatedGates.reduce(
    (total, product) => total + product.quantity,
    0,
  );

  const calculatedPole =
    preCalculatedGatesQuantity !== calculatedGatesQuantity
      ? calculatePole({
          item,
          calculatedGates,
          products,
        })
      : preCalculatedPole;

  console.log("🚀 ~ calculate ~ calculatedPole:", calculatedPole);
  if (!!calculatedGatesQuantity && !calculatedPole) return;

  const calculatedGateHeight = calculatedGates[0].height ?? 0;
  const canStack =
    preCalculatedGatesQuantity > 1 && item.height >= calculatedGateHeight * 2;

  return {
    gatesProduct: calculatedGates,
    poleProduct: calculatedPole,
    canStack,
  };
}

interface CalculateGatesHorizontallyProps {
  itemWidth: number;
  itemHeight: number;
  products: Product[];
}

function calculateGatesHorizontally({
  itemWidth,
  itemHeight,
  products,
}: CalculateGatesHorizontallyProps) {
  let dp = Array(itemWidth + 1).fill(0);
  let choice = Array(itemWidth + 1).fill(-1);
  let quantity = Array(itemWidth + 1).fill(Infinity);

  for (let i = 0; i < products.length; i++) {
    if (!products[i].minWidth || !products[i].maxWidth || !products[i].height)
      break;

    const productMinWidth = products[i].minWidth ?? 0;
    const productMaxWidth = products[i].maxWidth ?? 0;
    const productHeight = products[i].height ?? 0;

    for (let j = productMinWidth; j <= itemWidth; j++) {
      if (productHeight <= itemHeight) {
        let option1 = dp[j];
        let option2 = dp[j - productMinWidth] + productMaxWidth;
        let quantity1 = quantity[j];
        let quantity2 =
          j - productMinWidth === 0 ? 1 : quantity[j - productMinWidth] + 1;

        if (
          option2 > option1 ||
          (option2 === option1 && quantity2 < quantity1)
        ) {
          dp[j] = option2;
          choice[j] = i;
          quantity[j] = quantity2;
        }
      }
    }
  }

  let chosenProducts = [];
  let width = dp.lastIndexOf(Math.max(...dp));
  let widthMargin = 0;
  let isFit = false;

  while (width > 0 && choice[width] !== -1) {
    let productIndex = chosenProducts.findIndex(
      (p) => p.id === products[choice[width]].id,
    );
    if (productIndex !== -1) {
      chosenProducts[productIndex].quantity++;
    } else {
      chosenProducts.push({
        ...products[choice[width]],
        quantity: 1,
      });
    }

    const chosedProductMinWidth = products[choice[width]].minWidth ?? 0;
    const chosedProductMaxWidth = products[choice[width]].maxWidth ?? 0;
    // console.log("The width is:", width);
    // console.log("The width margin is ", widthMargin);
    // console.log("Min width:", chosedProductMinWidth);
    // console.log("Max Width:", chosedProductMaxWidth);
    isFit =
      width + widthMargin >= chosedProductMinWidth &&
      width <= chosedProductMaxWidth;

    width -= chosedProductMaxWidth;
    widthMargin += chosedProductMaxWidth - chosedProductMinWidth;
  }

  // console.log("The choice is:", chosenProducts);
  // console.log("Is fit: ", isFit);
  // console.log("The chosen products are:", chosenProducts);

  return isFit ? chosenProducts : [];
}

interface CalculatePoleProps {
  item: AreaItem;
  calculatedGates: ProductWithQuantity[];
  products: Product[];
}

function calculatePole({
  item,
  calculatedGates,
  products,
}: CalculatePoleProps) {
  const gatesQuantity = calculatedGates.reduce(
    (total, product) => total + product.quantity,
    0,
  );
  const gateHeight = calculatedGates.at(0)?.height ?? 0;
  if (!gatesQuantity || !gateHeight) return;

  const polesQuantity = gatesQuantity - 1;

  for (const product of products) {
    if (product.type !== "POLE" || !product.minHeight || !product.maxHeight) {
      continue;
    }

    if (gatesQuantity === 1) {
      if (
        item.height - gateHeight < product.minHeight ||
        item.height - gateHeight > product.maxHeight
      ) {
        continue;
      }

      return { ...product, quantity: 1 };
    }

    if (item.height < product.minHeight || item.height > product.maxHeight) {
      continue;
    }

    return { ...product, quantity: polesQuantity };
  }
}

interface GenerateError {
  fieldName: string;
  fieldValue: string;
}

function generateError({ fieldName, fieldValue }: GenerateError) {
  if (!fieldValue) {
    return `The ${fieldName} is required`;
  }

  if (isNaN(Number(fieldValue))) {
    return `The ${fieldName} must be a number`;
  }

  return "";
}
