export const admin = "/admin";
export const dashboardRoute = admin;

// product
export const productsRoute = `${admin}/products`;
export const createProductRoute = `${admin}/products/create`;
export const editProduct = (productId: number) =>
  `${admin}/products/${productId}`;

// order
export const ordersRoute = `${admin}/orders`;

// page
export const pageRoute = (slug: string) => `${admin}/pages/${slug}`;

// user
export const usersRoute = `${admin}/customers`;
export const profileRoute = `${admin}/profile`;
export const changePasswordRoute = `${admin}/change-password`;
