"use client";

// Adapted from pqoqubbw/icons (MIT). See LICENSE in this directory.
import { motion } from "motion/react";
import { createAnimatedIcon } from "./create-icon";

export const Plus = createAnimatedIcon("plus", (controls) => (
  <motion.svg
    animate={controls}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    transition={{ type: "spring", stiffness: 100, damping: 15 }}
    variants={{
      normal: {
        rotate: 0,
      },
      animate: {
        rotate: 180,
      },
    }}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </motion.svg>
));
