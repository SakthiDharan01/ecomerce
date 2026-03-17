"use client";

import Link from "next/link";
import Button from "@/components/Button";
import { useCart } from "@/context/CartContext";

export default function SuccessPage() {
  const { lastOrder } = useCart();

  const orderTotal = lastOrder.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <header className="rounded-3xl border border-zinc-200 bg-white p-8 text-center">
        <p className="text-xs uppercase tracking-[0.18em] text-emerald-600">
          Order Confirmed
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          Thank you for your order.
        </h1>
        <p className="mt-3 text-zinc-600">
          Your items are being prepared and will be shipped soon.
        </p>
      </header>

      <section className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8">
        <h2 className="text-lg font-medium text-zinc-900">Order Summary</h2>

        {lastOrder.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-600">No recent order found.</p>
        ) : (
          <>
            <ul className="mt-5 space-y-4">
              {lastOrder.map((item) => (
                <li
                  key={`${item.product.id}-${item.size}`}
                  className="flex items-center justify-between text-sm"
                >
                  <div>
                    <p className="font-medium text-zinc-900">{item.product.name}</p>
                    <p className="text-zinc-500">
                      Size {item.size} · Qty {item.quantity}
                    </p>
                  </div>
                  <p className="text-zinc-700">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-6 border-t border-zinc-200 pt-4 text-sm font-medium text-zinc-900">
              Total: ${orderTotal.toFixed(2)}
            </div>
          </>
        )}

        <Link href="/products" className="mt-7 block">
          <Button className="w-full">Continue Shopping</Button>
        </Link>
      </section>
    </div>
  );
}
