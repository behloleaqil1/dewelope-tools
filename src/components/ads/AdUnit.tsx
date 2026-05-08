'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { AdPosition, AdSize, AdState } from '@/types/ads';

interface AdUnitProps {
  position: AdPosition;
  size: AdSize;
  className?: string;
}

/** Dimension map for standard ad sizes */
const AD_DIMENSIONS: Record<AdSize, { width: string; height: string }> = {
  '728x90': { width: '728px', height: '90px' },
  '300x250': { width: '300px', height: '250px' },
  responsive: { width: '100%', height: 'auto' },
};

/** Slot IDs per position (placeholder values) */
const SLOT_IDS: Record<AdPosition, string> = {
  leaderboard: 'leaderboard-slot',
  sidebar: 'sidebar-slot',
  'in-content': 'in-content-slot',
};

/**
 * Loads the Google AdSense script asynchronously.
 * Returns a promise that resolves when the script is loaded or rejects on error.
 * If the script is already present in the DOM, resolves immediately.
 */
function loadAdSenseScript(clientId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // If already loaded, resolve immediately
    if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).adsbygoogle) {
      resolve();
      return;
    }

    const existingScript = document.querySelector(
      'script[src*="pagead2.googlesyndication.com"]'
    );
    if (existingScript) {
      // Script tag exists but may still be loading
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', () => reject(new Error('AdSense script failed to load')));
      // If it already loaded before we attached listeners
      if ((existingScript as HTMLScriptElement).dataset.loaded === 'true') {
        resolve();
      }
      return;
    }

    const script = document.createElement('script');
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.dataset.loaded = 'false';

    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = () => {
      reject(new Error('AdSense script failed to load'));
    };

    document.head.appendChild(script);
  });
}

/**
 * AdUnit - Client component for rendering Google AdSense ad placements.
 *
 * Loads the AdSense script asynchronously (non-blocking) and tracks ad state
 * (loaded, filled, error, collapsed). When no fill or error occurs, the
 * container collapses to zero height so surrounding content reflows naturally.
 *
 * Supports positions: leaderboard (728x90), sidebar (300x250), in-content (responsive).
 *
 * Requirements: 10.1, 10.2, 10.6
 */
export default function AdUnit({ position, size, className = '' }: AdUnitProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const [adState, setAdState] = useState<AdState>({
    loaded: false,
    filled: false,
    error: false,
    collapsed: false,
  });

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-XXXXXXXXXXXXXXXX';
  const slotId = SLOT_IDS[position];
  const dimensions = AD_DIMENSIONS[size];

  /**
   * Collapse the ad container when no fill or error occurs.
   * Sets height to 0 and overflow hidden so content reflows.
   */
  const collapseAd = useCallback(() => {
    setAdState((prev) => ({
      ...prev,
      collapsed: true,
      filled: false,
    }));
  }, []);

  useEffect(() => {
    // Don't run on server
    if (typeof window === 'undefined') return;

    let mounted = true;
    let fillTimeout: ReturnType<typeof setTimeout>;

    const initAd = async () => {
      try {
        await loadAdSenseScript(clientId);

        if (!mounted) return;

        setAdState((prev) => ({ ...prev, loaded: true }));

        // Push the ad request
        try {
          const adsbygoogle = (window as unknown as Record<string, unknown[]>).adsbygoogle;
          if (adsbygoogle) {
            adsbygoogle.push({});
          }
        } catch {
          // Ad push failed - collapse
          if (mounted) {
            setAdState((prev) => ({ ...prev, error: true }));
            collapseAd();
          }
          return;
        }

        // Set a timeout to detect no-fill scenario.
        // If the ad container has no rendered content after a delay, collapse it.
        fillTimeout = setTimeout(() => {
          if (!mounted) return;

          const container = adRef.current;
          if (container) {
            const ins = container.querySelector('ins.adsbygoogle');
            const hasContent =
              ins &&
              (ins.getAttribute('data-ad-status') === 'filled' ||
                ins.children.length > 0 ||
                ins.clientHeight > 0);

            if (hasContent) {
              setAdState((prev) => ({ ...prev, filled: true, collapsed: false }));
            } else {
              // No fill detected - collapse
              collapseAd();
            }
          }
        }, 3000);
      } catch {
        // Script load error - collapse gracefully
        if (mounted) {
          setAdState((prev) => ({ ...prev, error: true }));
          collapseAd();
        }
      }
    };

    initAd();

    return () => {
      mounted = false;
      if (fillTimeout) clearTimeout(fillTimeout);
    };
  }, [clientId, collapseAd]);

  // When collapsed, render zero-height container so content reflows
  if (adState.collapsed) {
    return (
      <div
        ref={adRef}
        className={`overflow-hidden transition-all duration-300 ${className}`}
        style={{ height: 0, margin: 0, padding: 0 }}
        aria-hidden="true"
        data-ad-position={position}
        data-ad-state="collapsed"
      />
    );
  }

  return (
    <div
      ref={adRef}
      className={`flex items-center justify-center overflow-hidden transition-all duration-300 ${className}`}
      style={{
        maxWidth: dimensions.width,
        minHeight: size === 'responsive' ? '90px' : dimensions.height,
        width: '100%',
      }}
      aria-hidden="true"
      data-ad-position={position}
      data-ad-state={adState.loaded ? (adState.filled ? 'filled' : 'loading') : 'init'}
    >
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          width: dimensions.width === '100%' ? '100%' : dimensions.width,
          height: size === 'responsive' ? 'auto' : dimensions.height,
        }}
        data-ad-client={clientId}
        data-ad-slot={slotId}
        data-ad-format={size === 'responsive' ? 'auto' : undefined}
        data-full-width-responsive={size === 'responsive' ? 'true' : undefined}
      />
    </div>
  );
}
