"use client";

import { useAnimation, useReducedMotion } from "motion/react";
import {
  cloneElement,
  useEffect,
  useRef,
  type ReactElement,
  type SVGProps,
} from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number | string };
type IconElement = ReactElement<SVGProps<SVGSVGElement> & {
  "data-animated-icon"?: string;
}>;

export function createAnimatedIcon(
  name: string,
  render: (controls: ReturnType<typeof useAnimation>) => IconElement,
  states = { active: "animate", rest: "normal" },
) {
  function AnimatedIcon({ size = 24, ...props }: IconProps) {
    const svg = useRef<SVGSVGElement>(null);
    const controls = useAnimation();
    const reduceMotion = useReducedMotion();

    useEffect(() => {
      const icon = svg.current;
      if (!icon) return;
      if (reduceMotion) {
        controls.set(states.rest);
        return;
      }

      const target = icon.closest("a[href], button, summary") ?? icon;
      let hovered = false;
      let focused = false;
      let active = false;

      function update() {
        if (active === (hovered || focused)) return;
        active = hovered || focused;
        void controls.start(active ? states.active : states.rest);
      }

      function pointerEnter(event: Event) {
        if ((event as PointerEvent).pointerType === "touch") return;
        hovered = true;
        update();
      }

      function pointerLeave() {
        hovered = false;
        update();
      }

      function focusIn(event: Event) {
        focused = event.target instanceof Element && event.target.matches(":focus-visible");
        update();
      }

      function focusOut() {
        focused = false;
        update();
      }

      target.addEventListener("pointerenter", pointerEnter);
      target.addEventListener("pointerleave", pointerLeave);
      target.addEventListener("focusin", focusIn);
      target.addEventListener("focusout", focusOut);

      return () => {
        target.removeEventListener("pointerenter", pointerEnter);
        target.removeEventListener("pointerleave", pointerLeave);
        target.removeEventListener("focusin", focusIn);
        target.removeEventListener("focusout", focusOut);
        controls.stop();
      };
    }, [controls, reduceMotion]);

    return cloneElement(render(controls), {
      width: size,
      height: size,
      "aria-hidden": true,
      focusable: false,
      ...props,
      ref: svg,
      "data-animated-icon": name,
    });
  }

  AnimatedIcon.displayName = name;
  return AnimatedIcon;
}
