"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function AnimatedMenuContent({ categories, suppliers, selectedType }: any) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={selectedType}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="space-y-16"
      >
        {/* ── CATÉGORIES ── */}
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
          {categories?.map((category: any) => (
            <section key={category.id} className="space-y-5">
              <div className="space-y-2">
                <h2 className="font-display text-xl uppercase tracking-widest"
                  style={{ color: "oklch(0.15 0.02 60)" }}>
                  {category.name}
                </h2>
                <div className="w-8 h-[2px] rounded-full bg-[oklch(0.58_0.13_148)]" />
              </div>

              <div>
                {category.menu_items
                  ?.sort((a: any, b: any) => a.position - b.position)
                  .map((item: any) => (
                    <div key={item.id}
                      className="group flex justify-between items-start py-3 transition-colors duration-200"
                      style={{ borderBottom: "1px solid oklch(0.92 0.01 80)" }}>
                      <div className="space-y-0.5 pr-4 flex-1">
                        <h3 className="font-body text-sm font-medium transition-colors duration-200 group-hover:text-[oklch(0.15_0.02_60)]"
                          style={{ color: "oklch(0.25 0.02 60)" }}>
                          {item.name}
                        </h3>
                        {item.description && (
                          <p className="font-body text-xs leading-relaxed"
                            style={{ color: "oklch(0.55 0.02 60)" }}>
                            {item.description}
                          </p>
                        )}
                      </div>
                      {item.price && (
                        <div className="font-body text-sm font-semibold whitespace-nowrap pt-0.5"
                          style={{ color: "oklch(0.58 0.13 148)" }}>
                          {Number(item.price).toFixed(2)} €
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </section>
          ))}
        </div>

        {/* ── FOURNISSEURS ── */}
        {suppliers && suppliers.length > 0 && (
          <section className="pt-12 space-y-10"
            style={{ borderTop: "1px solid oklch(0.90 0.01 80)" }}>
            <div className="text-center space-y-3">
              <p className="font-body text-xs uppercase tracking-[0.3em]"
                style={{ color: "oklch(0.58 0.13 148)" }}>
                Partenaires
              </p>
              <h2 className="font-display text-3xl uppercase tracking-wider"
                style={{ color: "oklch(0.15 0.02 60)" }}>
                Nos fournisseurs
              </h2>
              <div className="flex items-center justify-center gap-3 pt-1">
                <div className="w-12 h-[1px]" style={{ backgroundColor: "oklch(0.85 0.01 80)" }} />
                <div className="w-2 h-2 rounded-full bg-[oklch(0.58_0.13_148)]" />
                <div className="w-12 h-[1px]" style={{ backgroundColor: "oklch(0.85 0.01 80)" }} />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {suppliers.map((supplier: any) => (
                <div key={supplier.id}
                  className="rounded-2xl p-6 space-y-3 transition-colors duration-300"
                  style={{
                    backgroundColor: "oklch(0.97 0.008 80)",
                    border: "1px solid oklch(0.90 0.01 80)",
                  }}>
                  <h3 className="font-display text-base uppercase tracking-wide"
                    style={{ color: "oklch(0.15 0.02 60)" }}>
                    {supplier.name}
                  </h3>
                  {supplier.description && (
                    <p className="font-body text-sm leading-relaxed"
                      style={{ color: "oklch(0.45 0.02 60)" }}>
                      {supplier.description}
                    </p>
                  )}
                  {supplier.website && (
                    <a href={supplier.website} target="_blank" rel="noopener noreferrer"
                      className="inline-block font-body text-xs hover:underline transition-colors duration-200"
                      style={{ color: "oklch(0.58 0.13 148)" }}>
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
