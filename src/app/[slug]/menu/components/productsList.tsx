import { FormatCurrency } from "@/helpers/formatCurrency";
import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

interface ProductsProps {
  products: Product[];
}
("");
export default function Products({ products }: ProductsProps) {
  const { slug } = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const consumptionMethod = searchParams.get("consumptionMethod");

  return (
    <div className="space-y-3 p-5">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/${slug}/menu/${product.id}?consumptionMethod=${consumptionMethod}`}
          className="flex items-center justify-between gap-10 py-3 border-b"
        >
          <div>
            <h3 className="text-sm font-medium">{product.name}</h3>

            <p className="line-clamp-2 text-sm text-muted-foreground">
              {product.description}
            </p>

            <p className="pt-3 text-sm font-semibold">
              {FormatCurrency(product.price)}
            </p>
          </div>

          <div className="relative min-h-[82px] min-w-[120px]">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="rounded-lg object-contain"
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
