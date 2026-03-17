export type ProductCategory = "Shoes" | "T-shirts" | "Hoodies";

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: ProductCategory;
  featured?: boolean;
};

export const products: Product[] = [
  {
    id: "1",
    name: "AeroRun Pro",
    price: 189,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    description:
      "Precision-engineered running shoes with responsive cushioning and breathable knit upper.",
    category: "Shoes",
    featured: true,
  },
  {
    id: "2",
    name: "Core Street Tee",
    price: 49,
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=80",
    description:
      "A heavyweight cotton t-shirt with a structured premium fit for daily wear.",
    category: "T-shirts",
    featured: true,
  },
  {
    id: "3",
    name: "CloudLite Hoodie",
    price: 109,
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=80",
    description:
      "Ultra-soft brushed interior hoodie designed for comfort, movement, and all-day layering.",
    category: "Hoodies",
    featured: true,
  },
  {
    id: "4",
    name: "Pulse Trainer X",
    price: 159,
    image:
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&q=80",
    description:
      "Versatile trainers built for gym sessions and fast city transitions.",
    category: "Shoes",
    featured: true,
  },
  {
    id: "5",
    name: "Mono Essential Tee",
    price: 42,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    description:
      "Minimalist tee crafted from organic cotton with a soft, durable finish.",
    category: "T-shirts",
  },
  {
    id: "6",
    name: "CityFlex Hoodie",
    price: 119,
    image:
      "https://images.unsplash.com/photo-1618354691321-e851c56960d1?auto=format&fit=crop&w=1200&q=80",
    description:
      "Tailored silhouette hoodie with ribbed cuffs and premium midweight fabric.",
    category: "Hoodies",
  },
  {
    id: "7",
    name: "Nova Sprint",
    price: 174,
    image:
      "https://images.unsplash.com/photo-1584735175315-9d5df23be620?auto=format&fit=crop&w=1200&q=80",
    description:
      "Lightweight racing-inspired shoes tuned for comfort and speed.",
    category: "Shoes",
  },
  {
    id: "8",
    name: "Weekend Oversized Tee",
    price: 55,
    image:
      "https://images.unsplash.com/photo-1622445275576-721325763afe?auto=format&fit=crop&w=1200&q=80",
    description:
      "Relaxed oversized t-shirt with clean seams and a draped modern profile.",
    category: "T-shirts",
  },
];

export const getProductById = (id: string) =>
  products.find((product) => product.id === id);
