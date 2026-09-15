import { LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

const loadFeatures = () =>
  import("@/lib/motion-features").then((mod) => mod.default);

// Wraps the homepage board. `strict` guarantees nothing pulls the full motion
// runtime into the main bundle; reducedMotion="user" makes every m.* animation
// respect the OS setting without per-component checks.
const MotionProvider = ({ children }: { children: ReactNode }) => (
  <LazyMotion features={loadFeatures} strict>
    <MotionConfig reducedMotion="user">{children}</MotionConfig>
  </LazyMotion>
);

export default MotionProvider;
