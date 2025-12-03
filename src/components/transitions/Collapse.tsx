'use client';

import { LazyMotion, m, type HTMLMotionProps } from 'motion/react';

import { cn } from '@/lib/tailwind';
import { TargetsPropsWithOrientation, type TargetsProps } from '@/types';
import { loadFeatures } from '@/utils/functions/loadFeatures';

export type CollapseProps = {
  isOpen: boolean;
  orientation?: 'vertical' | 'horizontal';
} & TargetsProps &
  Omit<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'exit'>;

export const Collapse = ({
  initial,
  animate,
  exit,
  transition,
  isOpen,
  orientation = 'vertical',
  className,
  children,
  ...props
}: CollapseProps) => {
  const animations: TargetsPropsWithOrientation = {
    vertical: {
      initial: {
        height: 0,
        ...initial,
      },
      animate: {
        height: isOpen ? 'auto' : 0,
        ...animate,
      },
      exit: {
        height: 0,
        ...exit,
      },
    },
    horizontal: {
      initial: {
        width: 0,
        ...initial,
      },
      animate: {
        width: isOpen ? 'auto' : 0,
        ...animate,
      },
      exit: {
        width: 0,
        ...exit,
      },
    },
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
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
        className={cn('overflow-hidden', className)}
        {...props}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
};
