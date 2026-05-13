'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * FfmpegCommandGenerator - Generate FFmpeg media conversion commands from input/output settings.
 */
export default function FfmpegCommandGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [inputFile, setInputFile] = useState('');
  const [outputFile, setOutputFile] = useState('');
  const [videoCodec, setVideoCodec] = useState('copy');
  const [audioCodec, setAudioCodec] = useState('copy');
  const [resolution, setResolution] = useState('');
  const [framerate, setFramerate] = useState('');
  const [bitrate, setBitrate] = useState('');
  const [audioBitrate, setAudioBitrate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('');
  const [noAudio, setNoAudio] = useState(false);
  const [noVideo, setNoVideo] = useState(false);
  const [overwrite, setOverwrite] = useState(true);

  const generateCommand = (): string => {
    if (!inputFile || !outputFile) return '';

    const parts: string[] = ['ffmpeg'];
    if (overwrite) parts.push('-y');
    if (startTime) parts.push(`-ss ${startTime}`);
    parts.push(`-i "${inputFile}"`);
    if (duration) parts.push(`-t ${duration}`);
    if (noVideo) {
      parts.push('-vn');
    } else {
      if (videoCodec && videoCodec !== 'copy') parts.push(`-c:v ${videoCodec}`);
      else if (videoCodec === 'copy') parts.push('-c:v copy');
      if (resolution) parts.push(`-s ${resolution}`);
      if (framerate) parts.push(`-r ${framerate}`);
      if (bitrate) parts.push(`-b:v ${bitrate}`);
    }
    if (noAudio) {
      parts.push('-an');
    } else {
      if (audioCodec && audioCodec !== 'copy') parts.push(`-c:a ${audioCodec}`);
      else if (audioCodec === 'copy') parts.push('-c:a copy');
      if (audioBitrate) parts.push(`-b:a ${audioBitrate}`);
    }
    parts.push(`"${outputFile}"`);
    return parts.join(' ');
  };

  const output = generateCommand();

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Input File</label>
              <input id={`${toolId}-input`} type="text" value={inputFile} onChange={(e) => setInputFile(e.target.value)} placeholder="input.mp4" className="input-field" aria-label={`Input file for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-output`} className="block text-sm font-medium text-gray-700 mb-1">Output File</label>
              <input id={`${toolId}-output`} type="text" value={outputFile} onChange={(e) => setOutputFile(e.target.value)} placeholder="output.mkv" className="input-field" aria-label="Output file" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-vcodec`} className="block text-sm font-medium text-gray-700 mb-1">Video Codec</label>
              <select id={`${toolId}-vcodec`} value={videoCodec} onChange={(e) => setVideoCodec(e.target.value)} className="input-field" aria-label="Video codec">
                <option value="copy">Copy (no re-encode)</option>
                <option value="libx264">H.264 (libx264)</option>
                <option value="libx265">H.265 (libx265)</option>
                <option value="libvpx-vp9">VP9</option>
                <option value="libaom-av1">AV1</option>
                <option value="mpeg4">MPEG-4</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-acodec`} className="block text-sm font-medium text-gray-700 mb-1">Audio Codec</label>
              <select id={`${toolId}-acodec`} value={audioCodec} onChange={(e) => setAudioCodec(e.target.value)} className="input-field" aria-label="Audio codec">
                <option value="copy">Copy (no re-encode)</option>
                <option value="aac">AAC</option>
                <option value="libmp3lame">MP3</option>
                <option value="libopus">Opus</option>
                <option value="libvorbis">Vorbis</option>
                <option value="flac">FLAC</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label htmlFor={`${toolId}-res`} className="block text-sm font-medium text-gray-700 mb-1">Resolution</label>
              <input id={`${toolId}-res`} type="text" value={resolution} onChange={(e) => setResolution(e.target.value)} placeholder="1920x1080" className="input-field" aria-label="Video resolution" />
            </div>
            <div>
              <label htmlFor={`${toolId}-fps`} className="block text-sm font-medium text-gray-700 mb-1">Framerate</label>
              <input id={`${toolId}-fps`} type="text" value={framerate} onChange={(e) => setFramerate(e.target.value)} placeholder="30" className="input-field" aria-label="Video framerate" />
            </div>
            <div>
              <label htmlFor={`${toolId}-vbr`} className="block text-sm font-medium text-gray-700 mb-1">Video Bitrate</label>
              <input id={`${toolId}-vbr`} type="text" value={bitrate} onChange={(e) => setBitrate(e.target.value)} placeholder="2M" className="input-field" aria-label="Video bitrate" />
            </div>
            <div>
              <label htmlFor={`${toolId}-abr`} className="block text-sm font-medium text-gray-700 mb-1">Audio Bitrate</label>
              <input id={`${toolId}-abr`} type="text" value={audioBitrate} onChange={(e) => setAudioBitrate(e.target.value)} placeholder="128k" className="input-field" aria-label="Audio bitrate" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-start`} className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input id={`${toolId}-start`} type="text" value={startTime} onChange={(e) => setStartTime(e.target.value)} placeholder="00:01:30" className="input-field" aria-label="Start time" />
            </div>
            <div>
              <label htmlFor={`${toolId}-duration`} className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input id={`${toolId}-duration`} type="text" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="00:00:30" className="input-field" aria-label="Duration" />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={noAudio} onChange={(e) => setNoAudio(e.target.checked)} className="rounded" /> No Audio (-an)</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={noVideo} onChange={(e) => setNoVideo(e.target.checked)} className="rounded" /> No Video (-vn)</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={overwrite} onChange={(e) => setOverwrite(e.target.checked)} className="rounded" /> Overwrite (-y)</label>
          </div>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated FFmpeg Command</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
