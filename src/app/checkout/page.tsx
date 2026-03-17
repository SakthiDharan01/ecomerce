"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, placeOrder } = useCart();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Card");

  const handlePlaceOrder = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name || !address || items.length === 0) {
      return;
    }

    placeOrder();
    router.push("/success");
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Checkout</p>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          Checkout Details
        </h1>
      </header>

      <form
        onSubmit={handlePlaceOrder}
        className="space-y-6 rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8"
      >
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-zinc-700">
            Name
          </label>
          <input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="h-12 w-full rounded-xl border border-zinc-300 px-4 text-sm outline-none transition focus:border-zinc-900"
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="address" className="text-sm font-medium text-zinc-700">
            Address
          </label>
          <textarea
            id="address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            className="min-h-28 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-zinc-900"
            placeholder="123 Main Street, City"
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-zinc-700">Payment method</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {["Card", "UPI", "Cash on Delivery"].map((method) => (
              <label
                key={method}
                className={`cursor-pointer rounded-xl border px-4 py-3 text-sm transition ${
                  paymentMethod === method
                    ? "border-black bg-black text-white"
                    : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-900"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={() => setPaymentMethod(method)}
                  className="sr-only"
                />
                {method}
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-zinc-200 pt-5 text-sm">
          <span className="text-zinc-600">Total</span>
          <span className="text-base font-medium text-zinc-900">
            ${totalPrice.toFixed(2)}
          </span>
        </div>

        <Button type="submit" className="w-full" disabled={items.length === 0}>
          Place Order
        </Button>
      </form>
    </div>
  );
}
