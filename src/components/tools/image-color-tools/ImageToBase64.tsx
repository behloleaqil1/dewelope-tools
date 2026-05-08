'use client';

import { useState, useCallback, useRef } from 'react';
import { ToolEngineProps } from '@/types';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';
import { imageToBase64 } from '@/lib/image-color-tools';

const ACCEPTED_FORMATS = '.png,.jpg,.jpeg,.gif,.webp,.svg';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * ImageToBase64 - Converts an uploaded image file to a Base64 data URL.
 * Supports PNG, JPEG, GIF, WEBP, SVG with max 5MB file size.
 * Requirements: 7.4, 7.7
 */
export default function ImageToBase64({ toolId, toolName }: ToolEngineProps) {
  const [base64Output, setBase64Output] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setBase64Output('');
      setFileName('');
      setFileSize('');
      setError(undefined);
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError('File must be smaller than 5 MB');
      setBase64Output('');
      setFileName('');
      setFileSize('');
      return;
    }

    // Validate file type
    const supportedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!supportedTypes.includes(file.type)) {
      setError('Supported formats: PNG, JPEG, GIF, WEBP, SVG');
      setBase64Output('');
      setFileName('');
      setFileSize('');
      return;
    }

    setError(undefined);
    setIsProcessing(true);
    setFileName(file.name);
    setFileSize(formatFileSize(file.size));

    try {
      const result = await imageToBase64(file);
      setBase64Output(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to convert image');
      setBase64Output('');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setBase64Output('');
    setFileName('');
    setFileSize('');
    setError(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <div className="space-y-6" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-file`} className="block text-sm font-medium text-gray-700 mb-1">
          Upload Image
        </label>
        <div className="flex flex-col gap-3">
          <input
            id={`${toolId}-file`}
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_FORMATS}
            onChange={handleFileChange}
            aria-label={`Upload image file for ${toolName}`}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer file:min-h-[44px]"
          />
          <p className="text-xs text-gray-500">
            Supported: PNG, JPEG, GIF, WEBP, SVG — Max 5 MB
          </p>
          {fileName && (
            <div className="flex items-center justify-between bg-white p-2 rounded-md border border-gray-200">
              <span className="text-sm text-gray-700 truncate">{fileName} ({fileSize})</span>
              <button
                onClick={handleReset}
                aria-label="Remove uploaded file"
                className="text-sm text-red-600 hover:text-red-800 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[44px] min-w-[44px]"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </InputArea>

      <OutputArea hasContent={!!base64Output || isProcessing}>
        {isProcessing ? (
          <p className="text-sm text-gray-600">Converting image...</p>
        ) : base64Output ? (
          <div className="space-y-3">
            <div className="text-xs text-gray-500 uppercase font-medium">Base64 Output</div>
            <textarea
              readOnly
              value={base64Output}
              aria-label="Base64 encoded output"
              className="w-full h-40 p-3 border border-gray-200 rounded-md text-xs font-mono bg-white resize-y"
            />
            <div className="flex items-center gap-3">
              <CopyToClipboard text={base64Output} />
              <span className="text-xs text-gray-500">
                {base64Output.length.toLocaleString()} characters
              </span>
            </div>
          </div>
        ) : null}
      </OutputArea>
    </div>
  );
}

/**
 * Format file size in human-readable format.
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
