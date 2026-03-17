import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import Button from "@/components/Button";
import { products } from "@/lib/products";

export default function Home() {
  const featuredProducts = products.filter((product) => product.featured).slice(0, 6);

  return (
    <div className="space-y-16 pb-8">
      <section className="relative overflow-hidden rounded-3xl bg-zinc-900 px-6 py-14 text-white sm:px-12 sm:py-20">
        <div className="absolute inset-0 opacity-25">
          <Image
            src="https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1600&q=80"
            alt="Hero"
            fill
            priority
            className="h-full w-full object-cover"
          />
        </div>

        <div className="relative z-10 max-w-2xl space-y-6">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-200">New Season</p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
            Elevated essentials for everyday movement.
          </h1>
          <p className="max-w-xl text-zinc-200/90">
            Discover premium shoes, t-shirts, and hoodies crafted with a clean, modern aesthetic.
          </p>
          <Link href="/products" className="inline-block">
            <Button>Shop Collection</Button>
          </Link>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Featured</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
              Featured Products
            </h2>
          </div>
          <Link href="/products" className="text-sm text-zinc-700 underline-offset-4 hover:underline">
            View all
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
