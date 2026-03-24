"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { productService } from "@/services/product.service";
import { storeService } from "@/services/store.service";
import { Product, Store } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

export default function Page() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "most-sold" | "reviews">("featured");

  const MOCK_PRODUCTS: Product[] = [
    {
      id: "mock-1",
      name: "Tratamiento con Ozono Pro",
      description: "Sistema industrial de erradicación de patógenos.",
      sku: "OZ-PRO-01",
      category: "Maquinaria",
      basePrice: 450.00,
      quantity: 10,
      minStockAlert: 2,
      status: 'ACTIVE',
      storeId: "mock-store",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDK3c9CROrKB11EuFbETtnBcxIvvBjEb5Ctc8zSdDGK-tj8NYRkZ84Cb0TPC88WELTums0RGER7z6uDOjNNN14KxbRpve7LaOJJAMcSRFRUryXNGH0g3j4skMUWMiIQI5qDUNkDClcAQtmXhEN4jcH_fADBBDcx4B69qOB1g0jNztnTtLocZ3ukHiIlnNNutTpXtiWkWt12amKY41eg0Q7YPeaD6Ci_KaMLlXISj5qBTo9fVXKAY0myXyjZKgcQ8pAiXb02ISICL8g"
    },
    {
      id: "mock-2",
      name: "Enriquecedor de Suelo 2.0",
      description: "Concentrado orgánico mineral ozonizado.",
      sku: "EN-SOIL-02",
      category: "Agroquímicos",
      basePrice: 125.00,
      quantity: 50,
      minStockAlert: 10,
      status: 'ACTIVE',
      storeId: "mock-store",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAkf4OIEZRi2rs_t1nW42shqsR-KmnWtN5k9qoglBgnnslFJPYV6FwnPoBjgYd_B7nTO7RBZVhi2m4Y9WXXdoSvXSXvTUOvQwYQEVTJzK0seGtBkbsMGbJd7zmt9MsaGkUnbftwaR50-koDprPERB34z83_12BrKBMXjwFplGxk1ENUCz0BHgS4aUqdViHb5k4CywcC0TZrJ_oyxOh8ibtbkgRAsrzC5nsHnXHQpp6jccVZFQMVGfH6UHIZSgnEQ5ZbUKgQZnRBduc"
    },
    {
       id: "mock-3",
       name: "Sonda Ozono Max",
       description: "Sensor de saturación en tiempo real.",
       sku: "SN-MAX-03",
       category: "Sensores",
       basePrice: 89.00,
       quantity: 20,
       minStockAlert: 5,
       status: 'ACTIVE',
       storeId: "mock-store",
       imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5-poPdzP2NJs6z65raecU71_c6TJVIv42f4DrboQ-hCwsHQrc-fHEOHJbvepUukX7IV773MjZwv3bVisS7LI_bORpjDVItyJ51eXYm43Gd3hjgSuMst0rs8nYLydf65M6-_m7KDroXYR7YrV9EzgN1mI9l4MWd3hgoumtW82hvLJKLe_Vwjnco0lUXPsgoJGjYVQKzKDEcI509hqZ_CKjsUKBTddE-4sORcHR0zW6-5Jc19o-U-XgZqdsAPfyXZoVQ67QRThxNm0"
    },
    {
       id: "mock-4",
       name: "Spray Foliar",
       description: "Mejorador de absorción celular.",
       sku: "SP-FOL-04",
       category: "Complementos",
       basePrice: 64.50,
       quantity: 100,
       minStockAlert: 20,
       status: 'ACTIVE',
       storeId: "mock-store",
       imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCwLqIsAwKw9XIt2OnQWPBDSqyDmGX-JupcM7WqcYH7pDL_LMU1QKLu5xnAFmADLJS0vX5Nhxw_xNRRMJCq6Dcnu8bRRLbSUrGdWlAWSjtrQi2t991TooJUpsiae-0REHZ1SmUib49zK1lctXSX7Jit-xlpPUOaka-ghX-bkvXuAKURSyFNqinqCgMWuj73NBd52BoQiekVoZkS9-ZYE-a59HJbjqC4HV07eXT_x7tbhRc9JhgpW6wRhr14cYG1VcpT32V2t0QCR0Q"
    }
  ];

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      // Safety timeout
      const timeout = setTimeout(() => setLoading(false), 3000);

      try {
        const host = window.location.hostname;
        let subdomain = host.split('.')[0];
        if (subdomain === 'localhost' || subdomain === '127') subdomain = 'superozono';

        const storeData = await storeService.getBySubdomain(subdomain);
        setStore(storeData);

        const productsData = await productService.getPublicProducts(subdomain);
        setProducts(productsData || []);
      } catch (err) {
        console.error("Error loading store content:", err);
      } finally {
        clearTimeout(timeout);
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const displayedProducts = products.length > 0 ? products : MOCK_PRODUCTS;

  const sortedProducts = [...displayedProducts].sort((a, b) => {
     if (sortBy === "price-low") return a.basePrice - b.basePrice;
     if (sortBy === "price-high") return b.basePrice - a.basePrice;
     return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 pb-24">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 mb-20 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden rounded-[3rem] bg-on-primary-fixed border border-outline-variant/10 shadow-2xl min-h-[500px]"
      >
        <div className="lg:col-span-5 p-10 md:p-16 lg:p-20 flex flex-col justify-center bg-primary text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white rounded-full text-[10px] font-black mb-8 tracking-[0.2em] uppercase w-fit">
            <span className="material-symbols-outlined text-[14px]">stars</span>
            Selección Maestra
          </div>
          <h1 className="font-headline text-5xl md:text-6xl font-black leading-[1.05] mb-8 tracking-tighter">
            Tratamiento con Ozono <br /><span className="text-primary-fixed">Maestría.</span>
          </h1>
          <p className="text-white/80 text-lg mb-10 leading-relaxed font-medium max-w-sm">
            Precisión molecular para el agricultor moderno. Erradica patógenos con cero residuos.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-white text-primary px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">
              Colección 2026
            </button>
          </div>
        </div>
        <div className="lg:col-span-7 relative min-h-[300px]">
          <img className="absolute inset-0 w-full h-full object-cover" alt="Agrotech" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAC5E9Cq5INsfVSTJuV5uaKBLLdNKqDt78C8aVhcYc2uZd3lvF4Q8vsDpTrkY7w76fhEeLKT_KbYQAKT5mNs3DRMlZKP3R0Y1aFoddsMgqnO3zLbF2eggDj0Yyey1CoqJ32vF3VAH9R_8wpyptbJ3wYFI7fRqc0RBZSjN9REY5HuM9KIdSCocOHzQMkWNMoNI_LAjFxwnfqMZl7_qlrdFm6spTolidmemfMw3KFEJNUOU_wr4bSBp564gG1ibLxGwhdQHqtFPbnmBA" />
        </div>
      </motion.section>

      {/* Grid Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div>
          <h2 className="font-headline text-4xl font-black text-on-surface tracking-tighter mb-4">
            {store ? `Catálogo de ${store.name}` : "Agroquímicos de Precisión"}
          </h2>
          <div className="flex gap-4 text-on-surface-variant text-[10px] font-black uppercase tracking-widest opacity-60">
            <span className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">verified</span> Orgánico</span>
            <span className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">eco</span> Sustentable</span>
          </div>
        </div>
        <div className="flex gap-2 p-1 bg-surface-container-low rounded-2xl border border-outline-variant/10">
          {["featured", "price-low", "most-sold"].map(s => (
            <button key={s} onClick={() => setSortBy(s as any)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${sortBy === s ? "bg-primary text-white shadow-lg" : "text-on-surface-variant hover:text-primary"}`}>
              {s === "featured" ? "Destacados" : s === "price-low" ? "Precio" : "Ventas"}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="col-span-full py-32 text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" />
              <p className="font-black text-[10px] uppercase tracking-[0.3em] text-on-surface-variant">Sincronizando catálogo...</p>
            </motion.div>
          ) : (
            sortedProducts.map((product, idx) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group flex flex-col bg-white rounded-[2.5rem] p-5 border border-outline-variant/5 hover:shadow-2xl transition-all duration-500"
              >
                <div className="relative aspect-[1/1] bg-surface-container-low rounded-[2rem] overflow-hidden mb-6">
                  <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1s]" alt={product.name} src={product.imageUrl} />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-on-primary px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">{product.category}</span>
                  </div>
                </div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-headline font-black text-xl text-on-surface leading-tight tracking-tight">{product.name}</h3>
                  <span className="font-headline font-black text-xl text-primary">${product.basePrice.toFixed(2)}</span>
                </div>
                <p className="text-on-surface-variant text-sm mb-8 line-clamp-2 font-medium opacity-60">{product.description}</p>
                <button 
                  onClick={() => addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.basePrice,
                    quantity: 1,
                    category: product.category,
                    imageUrl: product.imageUrl
                  })}
                  className="mt-auto w-full bg-surface-container-low text-primary py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-3"
                >
                  <span className="material-symbols-outlined text-sm">add_shopping_cart</span> Añadir
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
