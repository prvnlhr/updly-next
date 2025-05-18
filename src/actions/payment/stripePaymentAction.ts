"use server";
import { stripe } from "../../lib/stripe";
import Stripe from "stripe";

interface CheckoutSessionParams {
  amount: number;
  email: string;
  shippingAddress: {
    line1: string;
    city: string;
    state: string;
    country: string;
    postal_code?: string;
  };
  userId: string;
  queryParams: {
    type: string;
    product_id?: string;
    variant_id?: string;
  };
}

interface CheckoutSessionResponse {
  id: string;
}

export async function createCheckoutSession({
  amount,
  email,
  userId,
  queryParams,
  shippingAddress,
}: CheckoutSessionParams): Promise<CheckoutSessionResponse> {
  try {
    const query = new URLSearchParams();
    query.append("type", queryParams.type);
    if (queryParams.product_id)
      query.append("product_id", queryParams.product_id);
    if (queryParams.variant_id)
      query.append("variant_id", queryParams.variant_id);

    const cancelUrl = `${
      process.env.NEXT_PUBLIC_BASE_URL
    }/shop/user/${userId}/checkout?${query.toString()}`;

    // Create order details for confirmation page
    const orderDetails = {
      orderId: `ORD-${Date.now()}`,
      amount: amount / 100, // Convert to rupees
      date: new Date().toISOString(),
      email,
      shippingAddress,
      items:
        queryParams.type === "cart"
          ? []
          : [
              {
                productId: queryParams.product_id,
                variantId: queryParams.variant_id,
              },
            ],
    };

    const encodedDetails = encodeURIComponent(JSON.stringify(orderDetails));
    const successUrl = `${
      process.env.NEXT_PUBLIC_BASE_URL
    }/shop/user/${userId}/orders/order-confirmation?details=${encodedDetails}&${query.toString()}`;

    const session: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer_email: email,
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: { amount: 0, currency: "inr" },
              display_name: "Free Shipping",
              delivery_estimate: {
                minimum: { unit: "business_day", value: 5 },
                maximum: { unit: "business_day", value: 7 },
              },
            },
          },
        ],
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: { name: "Nexop Order" },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        ui_mode: "hosted",
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          userId,
          type: queryParams.type,
          product_id: queryParams.product_id || "",
          variant_id: queryParams.variant_id || "",
          address: JSON.stringify(shippingAddress),
        },
      });

    return { id: session.id };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Stripe error:", errorMessage);
    throw new Error(`Failed to create checkout session: ${errorMessage}`);
  }
}
