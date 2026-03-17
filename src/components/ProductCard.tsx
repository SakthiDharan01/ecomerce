"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/products";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white"
    >
      <Link href={`/product/${product.id}`}>
        <div className="aspect-[4/5] overflow-hidden bg-zinc-100">
          <Image
            src={product.image}
            alt={product.name}
            width={800}
            height={1000}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="space-y-1 p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">
            {product.category}
          </p>
          <h3 className="text-lg font-medium tracking-tight text-zinc-900">
            {product.name}
          </h3>
          <p className="text-zinc-600">${product.price}</p>
        </div>
      </Link>
    </motion.article>
  );
}
