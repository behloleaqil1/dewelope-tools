// Google Ads integration TypeScript interfaces

/**
 * Ad placement positions within the layout
 */
export type AdPosition = 'leaderboard' | 'sidebar' | 'in-content';

/**
 * Standard ad sizes
 */
export type AdSize = '728x90' | '300x250' | 'responsive';

/**
 * Ad Unit component props
 */
export interface AdUnitProps {
  position: AdPosition;
  size: AdSize;
  className?: string;
}

/**
 * Ad configuration for the application
 */
export interface AdConfig {
  clientId: string;
  slots: Record<AdPosition, string>;
  maxMobileAds: 2;
}

/**
 * Ad state tracking for individual ad units
 */
export interface AdState {
  loaded: boolean;
  filled: boolean;               // Whether ad fill was returned
  error: boolean;
  collapsed: boolean;            // True when no fill or error
}
