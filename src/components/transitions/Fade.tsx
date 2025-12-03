'use client';

import { LazyMotion, m, type HTMLMotionProps } from 'motion/react';

import { type TargetsProps } from '@/types';
import { loadFeatures } from '@/utils/functions/loadFeatures';

export type FadeProps = TargetsProps & Omit<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'exit'>;

export const Fade = ({ initial, animate, exit, transition, children, ...props }: FadeProps) => {
  const animations: TargetsProps = {
    initial: {
      opacity: 0,
      ...initial,
    },
    animate: {
      opacity: 1,
      ...animate,
    },
    exit: {
      opacity: 0,
      ...exit,
    },
    transition: {
      duration: 0.35,
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
