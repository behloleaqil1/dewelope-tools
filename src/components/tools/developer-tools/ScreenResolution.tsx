'use client';

import { useState, useEffect, useCallback } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface ScreenInfo {
  screenWidth: number;
  screenHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  devicePixelRatio: number;
  colorDepth: number;
  orientation: string;
}

/**
 * ScreenResolution - Auto-detects screen and viewport dimensions,
 * device pixel ratio, color depth, and orientation.
 * Updates in real-time on window resize.
 */
export default function ScreenResolution({ toolId, toolName: _toolName }: { toolId: string; toolName: string }) {
  const [info, setInfo] = useState<ScreenInfo | null>(null);

  const detectScreen = useCallback(() => {
    if (typeof window === 'undefined') return;

    const orientation =
      window.screen.orientation?.type ||
      (window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');

    setInfo({
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio,
      colorDepth: window.screen.colorDepth,
      orientation: orientation.includes('landscape') ? 'Landscape' : 'Portrait',
    });
  }, []);

  useEffect(() => {
    detectScreen();

    window.addEventListener('resize', detectScreen);
    return () => window.removeEventListener('resize', detectScreen);
  }, [detectScreen]);

  const copyText = info
    ? `Screen Resolution: ${info.screenWidth} × ${info.screenHeight}\nViewport Size: ${info.viewportWidth} × ${info.viewportHeight}\nDevice Pixel Ratio: ${info.devicePixelRatio}\nColor Depth: ${info.colorDepth}-bit\nOrientation: ${info.orientation}`
    : '';

  return (
    <div className="space-y-5" data-tool-id={toolId}>
      <p className="text-sm text-gray-500">
        Screen information is detected automatically and updates on resize.
      </p>

      <OutputArea hasContent={info !== null}>
        {info && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="text-sm text-gray-500">Screen Resolution</div>
                <div className="text-xl font-bold text-gray-800" aria-label="Screen resolution">
                  {info.screenWidth} × {info.screenHeight}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="text-sm text-gray-500">Viewport Size</div>
                <div className="text-xl font-bold text-gray-800" aria-label="Viewport size">
                  {info.viewportWidth} × {info.viewportHeight}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="text-sm text-gray-500">Device Pixel Ratio</div>
                <div className="text-xl font-bold text-gray-800" aria-label="Device pixel ratio">
                  {info.devicePixelRatio}x
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="text-sm text-gray-500">Color Depth</div>
                <div className="text-xl font-bold text-gray-800" aria-label="Color depth">
                  {info.colorDepth}-bit
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 sm:col-span-2">
                <div className="text-sm text-gray-500">Orientation</div>
                <div className="text-xl font-bold text-gray-800" aria-label="Screen orientation">
                  {info.orientation}
                </div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
