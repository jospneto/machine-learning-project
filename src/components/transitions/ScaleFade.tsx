'use client';

import { LazyMotion, m, type HTMLMotionProps } from 'motion/react';

import { type TargetsProps } from '@/types';
import { loadFeatures } from '@/utils/functions/loadFeatures';

export type ScaleFadeProps = TargetsProps &
  Omit<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'exit'>;

export const ScaleFade = ({
  initial,
  animate,
  exit,
  transition,
  children,
  ...props
}: ScaleFadeProps) => {
  const animations: TargetsProps = {
    initial: {
      opacity: 0,
      scale: 0.95,
      ...initial,
    },
    animate: {
      opacity: 1,
      scale: 1,
      ...animate,
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      ...exit,
    },
    transition: {
      duration: 0.25,
      ...transition,
    },
  };

  return (
    <LazyMotion features={loadFeatures} strict>
      <m.div
        initial={animations?.initial}
        animate={animations?.animate}
        exit={animations?.exit}
        transition={animations?.transition}
        {...props}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
};
