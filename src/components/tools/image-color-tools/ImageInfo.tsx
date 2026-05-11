'use client';

import { useState, useCallback } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface ImageData {
  width: number;
  height: number;
  fileSize: number;
  fileSizeFormatted: string;
  type: string;
  aspectRatio: string;
  name: string;
}

/**
 * ImageInfo - Upload an image and display its dimensions, file size, type, and aspect ratio.
 * Uses FileReader + Image object for dimensions. No external dependencies.
 */
export default function ImageInfo({ toolId, toolName: _toolName }: { toolId: string; toolName: string }) {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [error, setError] = useState<string | undefined>();
  const [preview, setPreview] = useState<string | null>(null);

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const units = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = bytes / Math.pow(1024, i);
    return `${size.toFixed(2)} ${units[i]}`;
  }

  function gcd(a: number, b: number): number {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }

  function calculateAspectRatio(width: number, height: number): string {
    if (width <= 0 || height <= 0) return '0:0';
    const divisor = gcd(Math.round(width), Math.round(height));
    return `${Math.round(width) / divisor}:${Math.round(height) / divisor}`;
  }

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('File must be smaller than 10 MB');
      setImageData(null);
      setPreview(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      setImageData(null);
      setPreview(null);
      return;
    }

    setError(undefined);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setPreview(dataUrl);

      const img = new Image();
      img.onload = () => {
        setImageData({
          width: img.width,
          height: img.height,
          fileSize: file.size,
          fileSizeFormatted: formatFileSize(file.size),
          type: file.type,
          aspectRatio: calculateAspectRatio(img.width, img.height),
          name: file.name,
        });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copyText = imageData
    ? `File: ${imageData.name}\nDimensions: ${imageData.width} × ${imageData.height} px\nSize: ${imageData.fileSizeFormatted}\nType: ${imageData.type}\nAspect Ratio: ${imageData.aspectRatio}`
    : '';

  return (
    <div className="space-y-4">
      <InputArea error={error}>
        <label htmlFor={`${toolId}-file`} className="block text-sm font-medium text-gray-700 mb-1">
          Upload Image
        </label>
        <input
          id={`${toolId}-file`}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          aria-label="Upload image file to analyze"
          className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </InputArea>

      <OutputArea hasContent={!!imageData}>
        {imageData && (
          <div className="space-y-3">
            {preview && (
              <div className="flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="Uploaded image preview"
                  className="max-w-full max-h-48 rounded-lg border border-gray-200"
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">File Name</p>
                <p className="text-sm font-medium text-gray-800 break-all">{imageData.name}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">File Size</p>
                <p className="text-sm font-medium text-gray-800">{imageData.fileSizeFormatted}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Dimensions</p>
                <p className="text-sm font-medium text-gray-800">{imageData.width} × {imageData.height} px</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">File Type</p>
                <p className="text-sm font-medium text-gray-800">{imageData.type}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg col-span-2">
                <p className="text-xs text-gray-500">Aspect Ratio</p>
                <p className="text-sm font-medium text-gray-800">{imageData.aspectRatio}</p>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
