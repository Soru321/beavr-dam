import {
  contactUsRoute,
  productEstimatorToolRoute,
  productsRoute,
} from "../routes";

export const homeMenu = [
  { title: "Home", href: "/#home" },
  { title: "Product Estimator", href: productEstimatorToolRoute },
  { title: "Products", href: productsRoute },
  { title: "Contact Us", href: contactUsRoute },
];
