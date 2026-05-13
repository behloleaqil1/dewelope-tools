'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * YtDlpCommandGenerator - Generate yt-dlp video download commands.
 * Supports format selection, quality, subtitles, audio extraction, and more.
 */
export default function YtDlpCommandGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [url, setUrl] = useState('https://www.youtube.com/watch?v=example');
  const [mode, setMode] = useState('video');
  const [quality, setQuality] = useState('best');
  const [format, setFormat] = useState('mp4');
  const [audioFormat, setAudioFormat] = useState('mp3');
  const [subtitles, setSubtitles] = useState(false);
  const [subLang, setSubLang] = useState('en');
  const [thumbnail, setThumbnail] = useState(false);
  const [playlist, setPlaylist] = useState(false);
  const [outputTemplate, setOutputTemplate] = useState('%(title)s.%(ext)s');
  const [rateLimit, setRateLimit] = useState('');
  const [proxy, setProxy] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    const parts = ['yt-dlp'];

    if (mode === 'audio') {
      parts.push('-x');
      parts.push(`--audio-format ${audioFormat}`);
      parts.push('--audio-quality 0');
    } else {
      if (quality === 'best') {
        parts.push('-f "bestvideo[ext=' + format + ']+bestaudio/best"');
      } else if (quality === '1080') {
        parts.push('-f "bestvideo[height<=1080][ext=' + format + ']+bestaudio/best[height<=1080]"');
      } else if (quality === '720') {
        parts.push('-f "bestvideo[height<=720][ext=' + format + ']+bestaudio/best[height<=720]"');
      } else if (quality === '480') {
        parts.push('-f "bestvideo[height<=480]+bestaudio/best[height<=480]"');
      } else if (quality === 'worst') {
        parts.push('-f worst');
      }
    }

    if (subtitles) {
      parts.push(`--write-sub --sub-lang ${subLang}`);
    }

    if (thumbnail) {
      parts.push('--write-thumbnail');
    }

    if (playlist) {
      parts.push('--yes-playlist');
    } else {
      parts.push('--no-playlist');
    }

    if (outputTemplate) {
      parts.push(`-o "${outputTemplate}"`);
    }

    if (rateLimit) {
      parts.push(`--limit-rate ${rateLimit}`);
    }

    if (proxy) {
      parts.push(`--proxy "${proxy}"`);
    }

    parts.push(`"${url}"`);

    setOutput(parts.join(' \\\n  '));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-url`} className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
            <input id={`${toolId}-url`} type="text" value={url} onChange={(e) => setUrl(e.target.value)} className="input-field" aria-label={`Video URL for ${toolName}`} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-mode`} className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
              <select id={`${toolId}-mode`} value={mode} onChange={(e) => setMode(e.target.value)} className="input-field" aria-label="Download mode">
                <option value="video">Video</option>
                <option value="audio">Audio Only</option>
              </select>
            </div>
            {mode === 'video' ? (
              <>
                <div>
                  <label htmlFor={`${toolId}-quality`} className="block text-sm font-medium text-gray-700 mb-1">Quality</label>
                  <select id={`${toolId}-quality`} value={quality} onChange={(e) => setQuality(e.target.value)} className="input-field" aria-label="Video quality">
                    <option value="best">Best</option>
                    <option value="1080">1080p</option>
                    <option value="720">720p</option>
                    <option value="480">480p</option>
                    <option value="worst">Worst</option>
                  </select>
                </div>
                <div>
                  <label htmlFor={`${toolId}-format`} className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                  <select id={`${toolId}-format`} value={format} onChange={(e) => setFormat(e.target.value)} className="input-field" aria-label="Video format">
                    <option value="mp4">MP4</option>
                    <option value="webm">WebM</option>
                    <option value="mkv">MKV</option>
                  </select>
                </div>
              </>
            ) : (
              <div>
                <label htmlFor={`${toolId}-audio-format`} className="block text-sm font-medium text-gray-700 mb-1">Audio Format</label>
                <select id={`${toolId}-audio-format`} value={audioFormat} onChange={(e) => setAudioFormat(e.target.value)} className="input-field" aria-label="Audio format">
                  <option value="mp3">MP3</option>
                  <option value="flac">FLAC</option>
                  <option value="wav">WAV</option>
                  <option value="opus">Opus</option>
                  <option value="m4a">M4A</option>
                </select>
              </div>
            )}
          </div>
          <div>
            <label htmlFor={`${toolId}-output`} className="block text-sm font-medium text-gray-700 mb-1">Output Template</label>
            <input id={`${toolId}-output`} type="text" value={outputTemplate} onChange={(e) => setOutputTemplate(e.target.value)} className="input-field" aria-label="Output filename template" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-rate`} className="block text-sm font-medium text-gray-700 mb-1">Rate Limit (e.g. 1M)</label>
              <input id={`${toolId}-rate`} type="text" value={rateLimit} onChange={(e) => setRateLimit(e.target.value)} className="input-field" aria-label="Rate limit" />
            </div>
            <div>
              <label htmlFor={`${toolId}-proxy`} className="block text-sm font-medium text-gray-700 mb-1">Proxy (optional)</label>
              <input id={`${toolId}-proxy`} type="text" value={proxy} onChange={(e) => setProxy(e.target.value)} className="input-field" aria-label="Proxy URL" />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={subtitles} onChange={(e) => setSubtitles(e.target.checked)} className="rounded" />
              Subtitles
            </label>
            {subtitles && (
              <input type="text" value={subLang} onChange={(e) => setSubLang(e.target.value)} className="input-field w-20" placeholder="en" aria-label="Subtitle language" />
            )}
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={thumbnail} onChange={(e) => setThumbnail(e.target.checked)} className="rounded" />
              Thumbnail
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={playlist} onChange={(e) => setPlaylist(e.target.checked)} className="rounded" />
              Playlist
            </label>
          </div>
          <button onClick={generate} className="btn-primary">Generate Command</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated yt-dlp Command</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
