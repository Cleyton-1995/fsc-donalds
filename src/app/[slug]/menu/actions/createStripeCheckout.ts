"use server";

import Stripe from "stripe";
import { CartProduct } from "../contexts/cart";
import { headers } from "next/headers";
import { db } from "@/lib/prisma";
import { ConsumptionMethod } from "@prisma/client";
import { removeCpfPunctuation } from "../helpers/cpf";

interface CreateStripeCheckoutInput {
  products: CartProduct[];
  orderId: Number;
  slug: string;
  consumptionMethod: ConsumptionMethod;
  cpf: string;
}

export default async function CreateStripeCheckout({
  products,
  orderId,
  consumptionMethod,
  slug,
  cpf,
}: CreateStripeCheckoutInput) {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key not found");
  }

  const productsWithPrices = await db.product.findMany({
    where: {
      id: {
        in: products.map((product) => product.id),
      },
    },
  });

  const reqHeaders = await headers();
  const origin = reqHeaders.get("origin") ?? "";

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-02-24.acacia",
  });

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
    line_items: products.map((product) => {
      const foundProduct = productsWithPrices.find((p) => p.id === product.id);

      if (!foundProduct) {
        throw new Error(`Produto com ID ${product.id} não encontrado no banco de dados`);
      }

      return {
        price_data: {
          currency: "brl",
          product_data: {
            name: product.name,
            images: [product.imageUrl],
          },
          unit_amount: Math.round(foundProduct.price * 100),
        },
        quantity: product.quantity,
      };
    }),
  });

  return { sessionId: session.id };
}
