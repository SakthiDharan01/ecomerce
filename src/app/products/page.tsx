import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

const filters = ["All", "Shoes", "T-shirts", "Hoodies", "New", "Popular"];

export default function ProductsPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Shop</p>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          Product Collection
        </h1>
        <p className="max-w-2xl text-zinc-600">
          Elevated essentials designed for comfort, movement, and timeless style.
        </p>
      </header>

      <section className="space-y-4">
        <p className="text-sm font-medium text-zinc-700">Filters</p>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter, index) => (
            <button
              key={filter}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                index === 0
                  ? "border-black bg-black text-white"
                  : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-800"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </div>
  );
}
