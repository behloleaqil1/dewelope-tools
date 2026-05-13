'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssProfileCardGenerator - Generate CSS profile/user card styles.
 */
export default function CssProfileCardGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [style, setStyle] = useState('modern');
  const [primaryColor, setPrimaryColor] = useState('#3B82F6');
  const [borderRadius, setBorderRadius] = useState('12');
  const [avatarSize, setAvatarSize] = useState('80');
  const [output, setOutput] = useState('');

  const generate = () => {
    const styles: Record<string, string> = {
      modern: `/* Modern Profile Card */
.profile-card {
  background: #ffffff;
  border-radius: ${borderRadius}px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  max-width: 320px;
  transition: transform 0.2s, box-shadow 0.2s;
}
.profile-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}
.profile-card .avatar {
  width: ${avatarSize}px;
  height: ${avatarSize}px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid ${primaryColor};
  margin: 0 auto 1rem;
}
.profile-card .name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}
.profile-card .role {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1rem;
}
.profile-card .btn {
  background: ${primaryColor};
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
  cursor: pointer;
  font-weight: 500;
}`,
      glassmorphism: `/* Glassmorphism Profile Card */
.profile-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${borderRadius}px;
  padding: 2rem;
  text-align: center;
  max-width: 320px;
}
.profile-card .avatar {
  width: ${avatarSize}px;
  height: ${avatarSize}px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.4);
  margin: 0 auto 1rem;
}
.profile-card .name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.25rem;
}
.profile-card .role {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1rem;
}
.profile-card .btn {
  background: ${primaryColor};
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
  cursor: pointer;
}`,
      gradient: `/* Gradient Profile Card */
.profile-card {
  background: linear-gradient(135deg, ${primaryColor}, ${primaryColor}88);
  border-radius: ${borderRadius}px;
  padding: 2rem;
  text-align: center;
  max-width: 320px;
  color: white;
  position: relative;
  overflow: hidden;
}
.profile-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
}
.profile-card .avatar {
  width: ${avatarSize}px;
  height: ${avatarSize}px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.5);
  margin: 0 auto 1rem;
  position: relative;
}
.profile-card .name {
  font-size: 1.25rem;
  font-weight: 700;
  position: relative;
}
.profile-card .role {
  font-size: 0.875rem;
  opacity: 0.85;
  margin-bottom: 1rem;
  position: relative;
}
.profile-card .btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
  cursor: pointer;
  position: relative;
}`,
      minimal: `/* Minimal Profile Card */
.profile-card {
  background: #fafafa;
  border: 1px solid #e5e7eb;
  border-radius: ${borderRadius}px;
  padding: 2rem;
  text-align: center;
  max-width: 320px;
}
.profile-card .avatar {
  width: ${avatarSize}px;
  height: ${avatarSize}px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto 1rem;
}
.profile-card .name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}
.profile-card .role {
  font-size: 0.875rem;
  color: #9ca3af;
  margin-bottom: 1rem;
}
.profile-card .btn {
  background: transparent;
  color: ${primaryColor};
  border: 1px solid ${primaryColor};
  padding: 0.5rem 1.5rem;
  border-radius: ${borderRadius}px;
  cursor: pointer;
  font-weight: 500;
}`,
      dark: `/* Dark Profile Card */
.profile-card {
  background: #1f2937;
  border-radius: ${borderRadius}px;
  padding: 2rem;
  text-align: center;
  max-width: 320px;
  border: 1px solid #374151;
}
.profile-card .avatar {
  width: ${avatarSize}px;
  height: ${avatarSize}px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid ${primaryColor};
  margin: 0 auto 1rem;
}
.profile-card .name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #f9fafb;
}
.profile-card .role {
  font-size: 0.875rem;
  color: #9ca3af;
  margin-bottom: 1rem;
}
.profile-card .btn {
  background: ${primaryColor};
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
  cursor: pointer;
}`,
    };

    const html = `<!-- HTML Structure -->
<div class="profile-card">
  <img class="avatar" src="avatar.jpg" alt="User avatar" />
  <h3 class="name">Jane Doe</h3>
  <p class="role">Senior Developer</p>
  <button class="btn">Follow</button>
</div>`;

    setOutput(`${styles[style]}\n\n${html}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-style`} className="block text-sm font-medium text-gray-700 mb-1">
              Card Style
            </label>
            <select
              id={`${toolId}-style`}
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="input-field"
              aria-label={`Card style for ${toolName}`}
            >
              <option value="modern">Modern</option>
              <option value="glassmorphism">Glassmorphism</option>
              <option value="gradient">Gradient</option>
              <option value="minimal">Minimal</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">
              Primary Color
            </label>
            <input
              id={`${toolId}-color`}
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="input-field h-10"
              aria-label="Primary color"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-radius`} className="block text-sm font-medium text-gray-700 mb-1">
              Border Radius (px)
            </label>
            <input
              id={`${toolId}-radius`}
              type="number"
              value={borderRadius}
              onChange={(e) => setBorderRadius(e.target.value)}
              className="input-field"
              aria-label="Border radius"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-avatar`} className="block text-sm font-medium text-gray-700 mb-1">
              Avatar Size (px)
            </label>
            <input
              id={`${toolId}-avatar`}
              type="number"
              value={avatarSize}
              onChange={(e) => setAvatarSize(e.target.value)}
              className="input-field"
              aria-label="Avatar size"
            />
          </div>
        </div>
        <button onClick={generate} className="btn-primary mt-3">
          Generate Profile Card CSS
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Profile Card CSS</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all max-h-96 overflow-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
