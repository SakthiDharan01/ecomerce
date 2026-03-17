import ProductDetailView from "@/components/ProductDetailView";
import { getProductById } from "@/lib/products";
import { notFound } from "next/navigation";

type ProductPageProps = {
  params: {
    id: string;
  };
};

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductById(params.id);

  if (!product) {
    notFound();
  }

  return <ProductDetailView product={product} />;
}
