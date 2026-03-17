"use client";

import Link from "next/link";
import Button from "@/components/Button";
import CartItem from "@/components/CartItem";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, totalPrice } = useCart();

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Cart</p>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          Your Bag
        </h1>
      </header>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-10 text-center">
          <p className="text-zinc-600">Your cart is empty.</p>
          <Link href="/products" className="mt-4 inline-block text-sm text-zinc-900 underline">
            Explore products
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {items.map((item) => (
              <CartItem
                key={`${item.product.id}-${item.size}`}
                item={item}
              />
            ))}
          </div>

          <aside className="h-fit rounded-3xl border border-zinc-200 bg-white p-6">
            <h2 className="text-lg font-medium text-zinc-900">Order Summary</h2>
            <div className="mt-4 flex items-center justify-between text-sm text-zinc-600">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-zinc-600">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="mt-4 border-t border-zinc-200 pt-4 text-base font-medium text-zinc-900">
              Total: ${totalPrice.toFixed(2)}
            </div>

            <Link href="/checkout" className="mt-6 block">
              <Button className="w-full">Proceed to Checkout</Button>
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
