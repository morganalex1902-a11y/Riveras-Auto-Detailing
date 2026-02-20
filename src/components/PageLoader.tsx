import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
const logo = "https://cdn.builder.io/api/v1/image/assets%2F0f00b454c21444a59a62cb373d89a358%2F7322560b6f384e6b960289838005c4ee?format=webp&width=800&height=1200";

const PageLoader = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {/* Subtle radial glow behind logo */}
            <motion.div
              className="absolute w-80 h-80 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, hsl(43 72% 50% / 0.08) 0%, transparent 70%)",
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [0.8, 1.2, 1], opacity: [0, 1, 0.6] }}
              transition={{ duration: 2, ease: "easeOut" }}
            />

            {/* Logo */}
            <motion.img
              src={logo}
              alt="Rivera's Auto Detailing"
              className="w-64 md:w-80 relative z-10"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />

            {/* Gold loading bar */}
            <div className="relative z-10 w-48 h-[2px] bg-border/30 mt-8 overflow-hidden rounded-full">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, hsl(43 72% 50%), hsl(43 72% 65%), hsl(43 72% 50%))",
                }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
              />
            </div>

            {/* Tagline */}
            <motion.p
              className="relative z-10 mt-5 text-xs font-display uppercase tracking-[0.3em] text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Dealership Detailing Solution
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      )}
    </>
  );
};

export default PageLoader;
