"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <motion.div
      key={pathname}
      initial={false}
      animate={
        isMounted
          ? { opacity: 1, y: 0 }
          : { opacity: 1, y: 0 }
      }
      transition={{
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      }}
      style={{ opacity: 1 }}
    >
      {children}
    </motion.div>
  );
}
