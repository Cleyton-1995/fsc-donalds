import { db } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductHeader from "./components/productHeader";

interface ProductPageProps {
  params: Promise<{ slug: string; productId: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId, slug } = await params;
  const product = await db.product.findUnique({ where: { id: productId } });
  if (!product) {
    return notFound();
  }

  return (
    <>
      <ProductHeader product={product}/>
    </>
  );
}
