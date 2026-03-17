"use client";

import { useState } from "react";
import Button from "@/components/Button";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/products";
import Image from "next/image";

const sizes = ["S", "M", "L", "XL"];

type ProductDetailViewProps = {
  product: Product;
};

export default function ProductDetailView({ product }: ProductDetailViewProps) {
  const [selectedSize, setSelectedSize] = useState(sizes[1]);
  const { addToCart } = useCart();

  return (
    <section className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      <div className="overflow-hidden rounded-3xl bg-zinc-100">
        <Image
          src={product.image}
          alt={product.name}
          width={1200}
          height={1400}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="space-y-6">
        <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
          {product.category}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          {product.name}
        </h1>
        <p className="text-2xl text-zinc-800">${product.price}</p>
        <p className="max-w-xl leading-relaxed text-zinc-600">{product.description}</p>

        <div className="space-y-3">
          <p className="text-sm font-medium text-zinc-800">Select size</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const isActive = selectedSize === size;

              return (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`h-10 min-w-10 rounded-full border px-4 text-sm transition ${
                    isActive
                      ? "border-black bg-black text-white"
                      : "border-zinc-300 text-zinc-700 hover:border-zinc-800"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        <Button onClick={() => addToCart(product, selectedSize)}>
          Add to Cart
        </Button>
      </div>
    </section>
  );
}
