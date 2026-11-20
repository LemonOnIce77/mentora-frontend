"use client";

// Adapted from pqoqubbw/icons (MIT). See LICENSE in this directory.
import type { Variants } from "motion/react";
import { motion } from "motion/react";
import { createAnimatedIcon } from "./create-icon";

const PATH_VARIANTS: Variants = {
  normal: {
    opacity: 1,
    pathLength: 1,
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
  },
};

export const X = createAnimatedIcon("x", (controls) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <motion.path
      animate={controls}
      d="M18 6 6 18"
      variants={PATH_VARIANTS}
    />
    <motion.path
      animate={controls}
      d="m6 6 12 12"
      transition={{ delay: 0.2 }}
      variants={PATH_VARIANTS}
    />
  </svg>
));
