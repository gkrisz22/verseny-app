"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Particles } from "@/components/magicui/particles";
import { motion, useScroll, useTransform } from "framer-motion";

export function HeroParticles() {
  const { resolvedTheme } = useTheme();
  const [color, setColor] = useState("#ffffff");
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -50]);


  useEffect(() => {
    setColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
  }, [resolvedTheme]);

  return (
    <motion.div
      className="absolute inset-0 z-0"
      style={{ y, opacity: useTransform(scrollY, [200, 1000], [1, 0]) }}
      >
      <Particles
        quantity={200}
        ease={30}
        color={color}
        refresh
        className=""
      />
      </motion.div>
  );
}
