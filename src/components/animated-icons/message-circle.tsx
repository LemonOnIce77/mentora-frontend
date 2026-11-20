"use client";

// Adapted from pqoqubbw/icons (MIT). See LICENSE in this directory.
import type { Variants } from "motion/react";
import { motion } from "motion/react";
import { createAnimatedIcon } from "./create-icon";

const ICON_VARIANTS: Variants = {
  normal: {
    scale: 1,
    rotate: 0,
  },
  animate: {
    scale: 1.05,
    rotate: [0, -7, 7, 0],
    transition: {
      rotate: {
        duration: 0.5,
        ease: "easeInOut",
      },
      scale: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  },
};

export const MessageCircle = createAnimatedIcon("message-circle", (controls) => (
  <motion.svg
  animate={controls}
  fill="none"
  stroke="currentColor"
  strokeLinecap="round"
  strokeLinejoin="round"
  strokeWidth="2"
  variants={ICON_VARIANTS}
  viewBox="0 0 24 24"
  xmlns="http://www.w3.org/2000/svg"
      >
  <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      </motion.svg>
));
