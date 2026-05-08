import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { render, act, cleanup } from '@testing-library/react';
import React from 'react';

/**
 * Property-based tests for ad unit behavior.
 *
 * Validates: Requirements 10.4, 10.6
 */

// Mock IntersectionObserver for the test environment
class MockIntersectionObserver {
  callback: IntersectionObserverCallback;
  elements: Set<Element> = new Set();

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  observe(element: Element) {
    this.elements.add(element);
    // Immediately trigger as intersecting so ads become "visible"
    this.callback(
      [{ isIntersecting: true, target: element } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver
    );
  }

  unobserve(element: Element) {
    this.elements.delete(element);
  }

  disconnect() {
    this.elements.clear();
  }
}

describe('Feature: online-tools-hub, Property 27: Mobile Ad Unit Count Limit', () => {
  let originalInnerWidth: number;

  beforeEach(() => {
    originalInnerWidth = window.innerWidth;
    // Mock IntersectionObserver
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  });

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    cleanup();
    vi.restoreAllMocks();
  });

  it('for any tool page rendered at a viewport width below 768px, the number of visible Ad_Unit placements SHALL be at most 2', async () => {
    // Import AdManager dynamically to ensure mocks are in place
    const { default: AdManager } = await import('@/components/ads/AdManager');

    // Arbitrary for ad slot configurations: generate between 1 and 10 slots
    const adSlotConfigArb = fc.record({
      id: fc.uuid(),
      position: fc.constantFrom('leaderboard' as const, 'sidebar' as const, 'in-content' as const),
      size: fc.constantFrom('728x90' as const, '300x250' as const, 'responsive' as const),
      priority: fc.option(fc.integer({ min: 1, max: 99 }), { nil: undefined }),
    });

    const slotsArb = fc.array(adSlotConfigArb, { minLength: 1, maxLength: 10 });

    // Arbitrary for mobile viewport widths (below 768px, minimum 320px)
    const mobileWidthArb = fc.integer({ min: 320, max: 767 });

    fc.assert(
      fc.property(
        slotsArb,
        mobileWidthArb,
        (slots, viewportWidth) => {
          // Set mobile viewport
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: viewportWidth,
          });

          // Trigger resize event so the component detects mobile
          window.dispatchEvent(new Event('resize'));

          const { container, unmount } = render(
            React.createElement(AdManager, { slots })
          );

          // Count rendered ad slot containers
          const renderedSlots = container.querySelectorAll('[data-ad-slot-id]');
          expect(renderedSlots.length).toBeLessThanOrEqual(2);

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('on desktop viewports (>= 768px), all provided ad slots SHALL be rendered', async () => {
    const { default: AdManager } = await import('@/components/ads/AdManager');

    const adSlotConfigArb = fc.record({
      id: fc.uuid(),
      position: fc.constantFrom('leaderboard' as const, 'sidebar' as const, 'in-content' as const),
      size: fc.constantFrom('728x90' as const, '300x250' as const, 'responsive' as const),
      priority: fc.option(fc.integer({ min: 1, max: 99 }), { nil: undefined }),
    });

    const slotsArb = fc.array(adSlotConfigArb, { minLength: 1, maxLength: 10 });

    // Desktop viewport widths (>= 768px)
    const desktopWidthArb = fc.integer({ min: 768, max: 2560 });

    fc.assert(
      fc.property(
        slotsArb,
        desktopWidthArb,
        (slots, viewportWidth) => {
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: viewportWidth,
          });

          window.dispatchEvent(new Event('resize'));

          const { container, unmount } = render(
            React.createElement(AdManager, { slots })
          );

          const renderedSlots = container.querySelectorAll('[data-ad-slot-id]');
          expect(renderedSlots.length).toBe(slots.length);

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Feature: online-tools-hub, Property 28: Ad Container Collapse on Failure', () => {
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
    // Remove any existing AdSense script tags from previous tests
    document.querySelectorAll('script[src*="googlesyndication"]').forEach((el) => el.remove());
    // Clear the adsbygoogle global
    delete (window as unknown as Record<string, unknown>).adsbygoogle;
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('for any Ad_Unit placement where the ad state is collapsed (error or no fill), the ad container SHALL have zero visible height', async () => {
    const { default: AdUnit } = await import('@/components/ads/AdUnit');

    // Arbitrary for ad positions and sizes
    const positionArb = fc.constantFrom('leaderboard' as const, 'sidebar' as const, 'in-content' as const);
    const sizeArb = fc.constantFrom('728x90' as const, '300x250' as const, 'responsive' as const);

    await fc.assert(
      fc.asyncProperty(
        positionArb,
        sizeArb,
        async (position, size) => {
          // Clean up any previous script tags and global state
          document.querySelectorAll('script[src*="googlesyndication"]').forEach((el) => el.remove());
          delete (window as unknown as Record<string, unknown>).adsbygoogle;

          // Mock appendChild to simulate script load failure
          const originalAppendChild = document.head.appendChild.bind(document.head);
          document.head.appendChild = <T extends Node>(node: T): T => {
            if (node instanceof HTMLScriptElement && node.src.includes('googlesyndication')) {
              // Simulate async script error
              Promise.resolve().then(() => {
                if (node.onerror) {
                  (node.onerror as (event: Event) => void)(new Event('error'));
                }
              });
              return node;
            }
            return originalAppendChild(node);
          };

          let container: HTMLElement;
          let unmountFn: () => void;

          await act(async () => {
            const result = render(
              React.createElement(AdUnit, { position, size })
            );
            container = result.container;
            unmountFn = result.unmount;
            // Allow microtasks (Promise.resolve) to flush
            await new Promise((resolve) => setTimeout(resolve, 10));
          });

          // After error, the component should be in collapsed state
          const adContainer = container!.firstElementChild as HTMLElement;
          expect(adContainer).toBeTruthy();
          expect(adContainer.getAttribute('data-ad-state')).toBe('collapsed');
          expect(adContainer.style.height).toBe('0px');

          unmountFn!();
          document.head.appendChild = originalAppendChild;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('collapsed ad containers SHALL have no padding or margin contributing to visible space', async () => {
    const { default: AdUnit } = await import('@/components/ads/AdUnit');

    const positionArb = fc.constantFrom('leaderboard' as const, 'sidebar' as const, 'in-content' as const);
    const sizeArb = fc.constantFrom('728x90' as const, '300x250' as const, 'responsive' as const);

    await fc.assert(
      fc.asyncProperty(
        positionArb,
        sizeArb,
        async (position, size) => {
          // Clean up any previous script tags and global state
          document.querySelectorAll('script[src*="googlesyndication"]').forEach((el) => el.remove());
          delete (window as unknown as Record<string, unknown>).adsbygoogle;

          // Mock appendChild to simulate script load failure
          const originalAppendChild = document.head.appendChild.bind(document.head);
          document.head.appendChild = <T extends Node>(node: T): T => {
            if (node instanceof HTMLScriptElement && node.src.includes('googlesyndication')) {
              Promise.resolve().then(() => {
                if (node.onerror) {
                  (node.onerror as (event: Event) => void)(new Event('error'));
                }
              });
              return node;
            }
            return originalAppendChild(node);
          };

          let container: HTMLElement;
          let unmountFn: () => void;

          await act(async () => {
            const result = render(
              React.createElement(AdUnit, { position, size })
            );
            container = result.container;
            unmountFn = result.unmount;
            await new Promise((resolve) => setTimeout(resolve, 10));
          });

          const adContainer = container!.firstElementChild as HTMLElement;
          expect(adContainer).toBeTruthy();
          expect(adContainer.getAttribute('data-ad-state')).toBe('collapsed');
          expect(adContainer.style.margin).toBe('0px');
          expect(adContainer.style.padding).toBe('0px');

          unmountFn!();
          document.head.appendChild = originalAppendChild;
        }
      ),
      { numRuns: 100 }
    );
  });
});
