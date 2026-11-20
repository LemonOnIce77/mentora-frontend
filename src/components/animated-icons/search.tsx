"use client";

// Adapted from pqoqubbw/icons (MIT). See LICENSE in this directory.
import { motion } from "motion/react";
import { createAnimatedIcon } from "./create-icon";

export const Search = createAnimatedIcon("search", (controls) => (
  <motion.svg
    animate={controls}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    transition={{
      duration: 1,
      bounce: 0.3,
    }}
    variants={{
      normal: { x: 0, y: 0 },
      animate: {
        x: [0, 0, -3, 0],
        y: [0, -4, 0, 0],
      },
    }}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </motion.svg>
));
