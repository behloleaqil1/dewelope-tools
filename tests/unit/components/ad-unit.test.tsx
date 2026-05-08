import { render, screen, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AdUnit from '@/components/ads/AdUnit';

describe('AdUnit', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Clean up any scripts added to head
    document.head.innerHTML = '';
    // Reset adsbygoogle
    (window as unknown as Record<string, unknown>).adsbygoogle = undefined;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders with aria-hidden for accessibility', () => {
    const { container } = render(
      <AdUnit position="leaderboard" size="728x90" />
    );
    const adContainer = container.querySelector('[data-ad-position="leaderboard"]');
    expect(adContainer).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders with correct data-ad-position attribute', () => {
    const { container } = render(
      <AdUnit position="sidebar" size="300x250" />
    );
    const adContainer = container.querySelector('[data-ad-position="sidebar"]');
    expect(adContainer).toBeInTheDocument();
  });

  it('renders ins element with ad client and slot', () => {
    const { container } = render(
      <AdUnit position="in-content" size="responsive" />
    );
    const ins = container.querySelector('ins.adsbygoogle');
    expect(ins).toBeInTheDocument();
    expect(ins).toHaveAttribute('data-ad-client');
    expect(ins).toHaveAttribute('data-ad-slot', 'in-content-slot');
  });

  it('sets responsive format attributes for responsive size', () => {
    const { container } = render(
      <AdUnit position="in-content" size="responsive" />
    );
    const ins = container.querySelector('ins.adsbygoogle');
    expect(ins).toHaveAttribute('data-ad-format', 'auto');
    expect(ins).toHaveAttribute('data-full-width-responsive', 'true');
  });

  it('does not set responsive format attributes for fixed sizes', () => {
    const { container } = render(
      <AdUnit position="leaderboard" size="728x90" />
    );
    const ins = container.querySelector('ins.adsbygoogle');
    expect(ins).not.toHaveAttribute('data-ad-format');
    expect(ins).not.toHaveAttribute('data-full-width-responsive');
  });

  it('collapses to zero height on script load error', async () => {
    // Mock createElement to simulate script error
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const el = originalCreateElement(tag);
      if (tag === 'script') {
        // Simulate error after being appended
        setTimeout(() => {
          if (el.onerror) {
            (el.onerror as () => void)();
          }
        }, 10);
      }
      return el;
    });

    const { container } = render(
      <AdUnit position="leaderboard" size="728x90" />
    );

    await act(async () => {
      vi.advanceTimersByTime(50);
    });

    const adContainer = container.querySelector('[data-ad-position="leaderboard"]');
    expect(adContainer).toHaveAttribute('data-ad-state', 'collapsed');
    expect(adContainer).toHaveStyle({ height: '0px' });
  });

  it('collapses when no fill is detected after timeout', async () => {
    // Simulate script already loaded
    (window as unknown as Record<string, unknown[]>).adsbygoogle = [];

    const { container } = render(
      <AdUnit position="sidebar" size="300x250" />
    );

    // Flush the initial async effect (script load resolves immediately)
    await act(async () => {
      await Promise.resolve();
    });

    // Wait for the 3-second fill detection timeout
    await act(async () => {
      vi.advanceTimersByTime(3100);
    });

    const adContainer = container.querySelector('[data-ad-position="sidebar"]');
    expect(adContainer).toHaveAttribute('data-ad-state', 'collapsed');
    expect(adContainer).toHaveStyle({ height: '0px' });
  });

  it('applies custom className', () => {
    const { container } = render(
      <AdUnit position="leaderboard" size="728x90" className="my-custom-class" />
    );
    const adContainer = container.querySelector('[data-ad-position="leaderboard"]');
    expect(adContainer).toHaveClass('my-custom-class');
  });

  it('pushes to adsbygoogle array when script is loaded', async () => {
    const adsArray: unknown[] = [];
    (window as unknown as Record<string, unknown[]>).adsbygoogle = adsArray;

    render(<AdUnit position="in-content" size="responsive" />);

    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    expect(adsArray.length).toBe(1);
  });

  it('starts with init state before script loads', () => {
    const { container } = render(
      <AdUnit position="leaderboard" size="728x90" />
    );
    const adContainer = container.querySelector('[data-ad-position="leaderboard"]');
    expect(adContainer).toHaveAttribute('data-ad-state', 'init');
  });
});
