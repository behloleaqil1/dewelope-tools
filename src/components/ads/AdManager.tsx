'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import AdUnit from './AdUnit';
import type { AdPosition, AdSize } from '@/types/ads';

/**
 * Configuration for an individual ad slot managed by AdManager.
 */
interface AdSlotConfig {
  id: string;
  position: AdPosition;
  size: AdSize;
  /** Priority for mobile rendering (lower number = higher priority). */
  priority?: number;
}

interface AdManagerProps {
  /** Array of ad slot configurations to manage on this page. */
  slots: AdSlotConfig[];
  /** Optional className applied to the wrapper container. */
  className?: string;
}

/** Mobile breakpoint in pixels. */
const MOBILE_BREAKPOINT = 768;

/** Maximum number of ad units displayed on mobile viewports. */
const MAX_MOBILE_ADS = 2;

/** IntersectionObserver rootMargin for lazy loading ads outside the viewport. */
const LAZY_LOAD_MARGIN = '200px';

/**
 * AdManager - Client component that manages multiple AdUnit placements on a page.
 *
 * Features:
 * - Detects mobile viewport (< 768px) and limits visible ads to max 2
 * - Lazy loads ads outside the initial viewport using IntersectionObserver with 200px threshold
 * - Ensures ads fit their container width without overflow (max-width: 100%)
 *
 * Requirements: 10.3, 10.4, 12.4, 12.5
 */
export default function AdManager({ slots, className = '' }: AdManagerProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [visibleSlots, setVisibleSlots] = useState<Set<string>>(new Set());
  const slotRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Detect mobile viewport
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Initial check
    checkMobile();

    // Listen for resize events
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Set up IntersectionObserver for lazy loading
  const setupObserver = useCallback(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      // Fallback: show all slots if IntersectionObserver is not supported
      setVisibleSlots(new Set(slots.map((s) => s.id)));
      return;
    }

    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const slotId = (entry.target as HTMLElement).dataset.adSlotId;
            if (slotId) {
              setVisibleSlots((prev) => {
                const next = new Set(prev);
                next.add(slotId);
                return next;
              });
              // Stop observing once visible
              observerRef.current?.unobserve(entry.target);
            }
          }
        });
      },
      {
        rootMargin: LAZY_LOAD_MARGIN,
      }
    );

    // Observe all slot containers
    slotRefs.current.forEach((element) => {
      observerRef.current?.observe(element);
    });
  }, [slots]);

  useEffect(() => {
    setupObserver();

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [setupObserver]);

  // Register a ref for a slot element
  const setSlotRef = useCallback((id: string, element: HTMLDivElement | null) => {
    if (element) {
      slotRefs.current.set(id, element);
    } else {
      slotRefs.current.delete(id);
    }
  }, []);

  // Determine which slots to render based on viewport
  const slotsToRender = (() => {
    if (!isMobile) {
      // Desktop/tablet: render all slots
      return slots;
    }

    // Mobile: limit to MAX_MOBILE_ADS, sorted by priority (lower = higher priority)
    const sorted = [...slots].sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));
    return sorted.slice(0, MAX_MOBILE_ADS);
  })();

  return (
    <div className={`ad-manager ${className}`}>
      {slotsToRender.map((slot) => (
        <div
          key={slot.id}
          ref={(el) => setSlotRef(slot.id, el)}
          data-ad-slot-id={slot.id}
          className="ad-slot-container w-full overflow-hidden"
          style={{ maxWidth: '100%' }}
        >
          {visibleSlots.has(slot.id) ? (
            <AdUnit
              position={slot.position}
              size={slot.size}
              className="w-full max-w-full"
            />
          ) : (
            // Placeholder maintaining space until ad is lazy-loaded
            <div
              className="ad-placeholder"
              style={{
                width: '100%',
                minHeight: slot.size === '728x90' ? '90px' : slot.size === '300x250' ? '250px' : '90px',
              }}
              aria-hidden="true"
            />
          )}
        </div>
      ))}
    </div>
  );
}
