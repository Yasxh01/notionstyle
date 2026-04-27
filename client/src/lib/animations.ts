/**
 * Animation Utilities
 * 
 * Provides animation configuration and utilities for smooth transitions
 * throughout the editor.
 */

/**
 * Standard animation durations (in milliseconds)
 */
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 800,
} as const;

/**
 * Easing functions for smooth animations
 */
export const EASING = {
  LINEAR: 'linear',
  EASE_IN: 'ease-in',
  EASE_OUT: 'ease-out',
  EASE_IN_OUT: 'ease-in-out',
  CUBIC_BEZIER_SMOOTH: 'cubic-bezier(0.4, 0, 0.2, 1)',
  CUBIC_BEZIER_BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

/**
 * Generates CSS transition string
 */
export function generateTransition(
  properties: string | string[] = 'all',
  duration: number = ANIMATION_DURATIONS.NORMAL,
  easing: string = EASING.EASE_IN_OUT,
  delay: number = 0
): string {
  const props = Array.isArray(properties) ? properties : [properties];
  return props
    .map((prop) => `${prop} ${duration}ms ${easing} ${delay}ms`)
    .join(', ');
}

/**
 * Generates CSS animation keyframes for block entry
 */
export function getBlockEntryAnimation(): string {
  return `
    @keyframes blockEntry {
      from {
        opacity: 0;
        transform: translateY(-8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
}

/**
 * Generates CSS animation keyframes for block exit
 */
export function getBlockExitAnimation(): string {
  return `
    @keyframes blockExit {
      from {
        opacity: 1;
        transform: translateY(0);
      }
      to {
        opacity: 0;
        transform: translateY(-8px);
      }
    }
  `;
}

/**
 * Generates CSS animation keyframes for drag over effect
 */
export function getDragOverAnimation(): string {
  return `
    @keyframes dragOver {
      from {
        background-color: transparent;
      }
      to {
        background-color: rgba(59, 130, 246, 0.1);
      }
    }
  `;
}

/**
 * Applies animation to an element
 */
export function applyAnimation(
  element: HTMLElement,
  animationName: string,
  duration: number = ANIMATION_DURATIONS.NORMAL,
  easing: string = EASING.EASE_IN_OUT
): void {
  element.style.animation = `${animationName} ${duration}ms ${easing} forwards`;
}

/**
 * Removes animation from an element
 */
export function removeAnimation(element: HTMLElement): void {
  element.style.animation = 'none';
}

/**
 * Waits for animation to complete
 */
export async function waitForAnimation(element: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    const handleAnimationEnd = () => {
      element.removeEventListener('animationend', handleAnimationEnd);
      resolve();
    };
    element.addEventListener('animationend', handleAnimationEnd);
  });
}
