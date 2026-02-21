"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function AnimatedMenuContent({
  categories,
  suppliers,
  selectedType,
}: any) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={selectedType}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="space-y-14"
      >
        {/* ================= MENU ================= */}
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-10">

          {categories?.map((category: any) => (
            <section key={category.id} className="space-y-4">

              <h2 className="text-xl font-semibold border-b border-stone-200 pb-1">
                {category.name}
              </h2>

              <div className="space-y-3">
                {category.menu_items
                  ?.sort((a: any, b: any) => a.position - b.position)
                  .map((item: any) => (
                    <div
                      key={item.id}
                      className="group flex justify-between items-start py-1.5 border-b border-stone-100"
                    >
                      <div className="space-y-0.5">
                        <h3 className="text-sm font-medium transition group-hover:font-semibold group-hover:text-stone-900">
                          {item.name}
                        </h3>

                        {item.description && (
                          <p className="text-xs text-stone-500 group-hover:text-stone-700 transition">
                            {item.description}
                          </p>
                        )}
                      </div>

                      {item.price && (
                        <div className="text-sm font-medium whitespace-nowrap">
                          {Number(item.price).toFixed(2)} €
                        </div>
                      )}
                    </div>
                  ))}
              </div>

            </section>
          ))}

        </div>

        {/* ================= FOURNISSEURS ================= */}
        {suppliers && suppliers.length > 0 && (
          <section className="pt-10 border-t border-stone-200">
            <h2 className="text-3xl font-semibold text-center mb-12">
              🤝 Nos fournisseurs
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {suppliers.map((supplier: any) => (
                <div
                  key={supplier.id}
                  className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <h3 className="text-lg font-semibold mb-3">
                    {supplier.name}
                  </h3>

                  {supplier.description && (
                    <p className="text-sm text-stone-600 mb-4">
                      {supplier.description}
                    </p>
                  )}

                  {supplier.website && (
                    <a
                      href={supplier.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm underline text-stone-800 hover:text-black transition"
                    >
                      Visiter le site →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

      </motion.div>
    </AnimatePresence>
  );
}