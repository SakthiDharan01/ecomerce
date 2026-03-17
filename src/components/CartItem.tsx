"use client";

import type { CartLine } from "@/context/CartContext";
import { useCart } from "@/context/CartContext";
import Image from "next/image";

type CartItemProps = {
  item: CartLine;
};

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <article className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4">
      <Image
        src={item.product.image}
        alt={item.product.name}
        width={96}
        height={96}
        className="h-24 w-24 rounded-xl object-cover"
      />

      <div className="flex-1 space-y-1">
        <h3 className="text-base font-medium text-zinc-900">{item.product.name}</h3>
        <p className="text-sm text-zinc-500">Size {item.size}</p>
        <p className="text-sm text-zinc-700">${item.product.price}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() =>
            updateQuantity(item.product.id, item.size, item.quantity - 1)
          }
          className="h-8 w-8 rounded-full border border-zinc-300 text-zinc-700 transition hover:border-zinc-800"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="min-w-6 text-center text-sm font-medium">{item.quantity}</span>
        <button
          onClick={() =>
            updateQuantity(item.product.id, item.size, item.quantity + 1)
          }
          className="h-8 w-8 rounded-full border border-zinc-300 text-zinc-700 transition hover:border-zinc-800"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <button
        onClick={() => removeItem(item.product.id, item.size)}
        className="text-sm text-zinc-500 transition hover:text-zinc-900"
      >
        Remove
      </button>
    </article>
  );
}
