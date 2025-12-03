'use client';

import { LazyMotion, m, type HTMLMotionProps } from 'motion/react';

import { TargetsPropsWithOrientation, type TargetsProps } from '@/types';
import { loadFeatures } from '@/utils/functions/loadFeatures';

export type SlideFadeProps = {
  orientation?: 'vertical' | 'horizontal';
} & TargetsProps &
  Omit<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'exit'>;

export const SlideFade = ({
  initial,
  animate,
  exit,
  transition,
  orientation = 'vertical',
  children,
  ...props
}: SlideFadeProps) => {
  const animations: TargetsPropsWithOrientation = {
    vertical: {
      initial: {
        y: '70%',
        opacity: 0,
        ...initial,
      },
      animate: {
        y: '0',
        opacity: 1,
        ...animate,
      },
      exit: {
        y: '70%',
        opacity: 0,
        ...exit,
      },
    },
    horizontal: {
      initial: {
        x: '70%',
        opacity: 0,
        ...initial,
      },
      animate: {
        x: '0',
        opacity: 1,
        ...animate,
      },
      exit: {
        x: '70%',
        opacity: 0,
        ...exit,
      },
    },
    transition: {
      duration: 0.25,
      ...transition,
    },
  };

  return (
    <LazyMotion features={loadFeatures} strict>
      <m.div
        initial={animations?.[orientation]?.initial}
        animate={animations?.[orientation]?.animate}
        exit={animations?.[orientation]?.exit}
        transition={animations?.transition}
        {...props}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
};
