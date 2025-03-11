<<<<<<< HEAD
"use server";

import Stripe from "stripe";
import { CartProduct } from "../contexts/cart";

interface CreateStripeCheckoutInput {
  products: CartProduct[];
}
export default async function CreateStripeCheckout({
  products,
}: CreateStripeCheckoutInput) {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key not found");
  }
=======
"use server"

import { ConsumptionMethod } from "@prisma/client";

import Stripe from "stripe";

import { CartProduct } from "../contexts/cart";
import { headers } from "next/headers";
import { db } from "@/lib/prisma";
import { removeCpfPunctuation } from "../helpers/cpf";

interface CreateStripeCheckoutProps {
  products: CartProduct[];
  orderId: number;
  slug: string;
  consumptionMethod: ConsumptionMethod;
  cpf: string;
}
export default async function CreateStripeCheckout({
  products,
  orderId,
  slug,
  consumptionMethod,
  cpf,
}: CreateStripeCheckoutProps) {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key not found");
  }

  const origin = (await headers()).get("origin") || "";

  const productsWithPrices = await db.product.findMany({
    where: {
      id: {
        in: products.map((product) => product.id),
      },
    },
  });

>>>>>>> b64a9ffbf698cf8344fc38b14571470019ac2214
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-02-24.acacia",
  });

<<<<<<< HEAD
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
=======
  const searchParams = new URLSearchParams();
  searchParams.set("consumptionMethod", consumptionMethod);
  searchParams.set("cpf", removeCpfPunctuation(cpf));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${origin}/${slug}/orders?${searchParams.toString()}`,
    cancel_url: `${origin}/${slug}/orders?${searchParams.toString()}`,
    metadata: {
      orderId,
    },
>>>>>>> b64a9ffbf698cf8344fc38b14571470019ac2214
    line_items: products.map((product) => ({
      price_data: {
        currency: "brl",
        product_data: {
          name: product.name,
          images: [product.imageUrl],
        },
<<<<<<< HEAD
        unit_amount: product.price * 100,
=======
        unit_amount:
          productsWithPrices.find((p) => p.id === product.id)!.price * 100,
>>>>>>> b64a9ffbf698cf8344fc38b14571470019ac2214
      },
      quantity: product.quantity,
    })),
  });
  return { sessionId: session.id };
}
