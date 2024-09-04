// auth
export const signInRoute = (callbackUrl: string = "") => {
  return !!callbackUrl ? `/sign-in?callbackUrl=${callbackUrl}` : "/sign-in";
};
export const signOutRoute = "/sign-out";
export const forgotPasswordRoute = "/forgot-password";

export const homeRoute = "/";
export const productEstimatorToolRoute = "/product-estimator-tool";
export const howToInstallRoute = "/#how-to-install";
export const contactUsRoute = "/#contact-us";
export const productsRoute = "/products";
export const productRoute = (id: number) => `/products/${id}`;
export const checkoutRoute = "/checkout";
export const pageRoute = (slug: string) => `/pages/${slug}`;
