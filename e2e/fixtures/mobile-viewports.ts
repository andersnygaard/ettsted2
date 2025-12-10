/**
 * Mobile viewport configurations for responsive testing
 */
export interface MobileViewport {
  width: number;
  height: number;
  name: string;
  description: string;
}

export const MOBILE_VIEWPORTS: MobileViewport[] = [
  {
    width: 360,
    height: 640,
    name: 'small-phone',
    description: 'Small phone (360x640)',
  },
  {
    width: 640,
    height: 960,
    name: 'large-phone',
    description: 'Large phone (640x960)',
  },
  {
    width: 768,
    height: 1024,
    name: 'tablet',
    description: 'Tablet (768x1024)',
  },
];

/**
 * Minimum touch target size in pixels (WCAG 2.1 AA)
 */
export const MIN_TOUCH_TARGET = 44;

/**
 * Interactive element selectors for touch target validation
 */
export const INTERACTIVE_SELECTORS = [
  'button',
  'a[href]',
  'input[type="button"]',
  'input[type="checkbox"]',
  'input[type="radio"]',
  'input[type="submit"]',
  '[role="button"]',
  '[role="link"]',
];
