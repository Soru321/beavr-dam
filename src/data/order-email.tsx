import { OrderEmail } from '@/lib/zod/order';

export const orderEmail: OrderEmail = {
  PENDING: {
    title: "Thank you for Your Order!",
    description:
      "Your order is in the queue, and we're getting ready to make it perfect. Hang tight, and we'll notify you as soon as it's ready for the next step.",
  },
  PROCESSING: {
    title: "Your Order is in the Works!",
    description:
      "Great news! We're busy crafting your items with care. Our team is working diligently, and we'll notify you once your order is prepared for shipment.",
  },
  ONHOLD: {
    title: "A Quick Pause on Your Order",
    description:
      "We've temporarily put your order on hold. Don't worry; we're resolving a small matter and will resume processing shortly. Thank you for your patience.",
  },
  SHIPPED: {
    title: "Exciting News! Your Order is On Its Way!",
    description:
      "Hooray! Your order has been carefully packed and is en route to you. Keep an eye on your inbox for tracking details and get ready to welcome your package.",
  },
  COMPLETED: {
    title: "Congratulations! Your Order is Complete!",
    description:
      "Your items have been successfully delivered. We hope they exceed your expectations. If you have any feedback or questions, feel free to reach out. Enjoy your purchase!",
  },
  CANCELED: {
    title: "Order Canceled - Let's Assist You!",
    description:
      "We're sorry to hear about the cancellation. If you have any concerns or if there's anything we can do to help, please contact our support team. We appreciate your understanding.",
  },
  REFUNDED: {
    title: "Refund Processed Successfully",
    description:
      "Your refund has been processed, and the funds are on their way back to you. If you have any further inquiries or need assistance, feel free to reach out. Thank you for choosing us.",
  },
};
