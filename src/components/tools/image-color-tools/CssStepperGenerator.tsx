'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssStepperGenerator - Generate CSS stepper/wizard component styles.
 */
export default function CssStepperGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [steps, setSteps] = useState('3');
  const [activeStep, setActiveStep] = useState('2');
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [style, setStyle] = useState<'circles' | 'pills' | 'arrows'>('circles');
  const [output, setOutput] = useState('');

  const generate = () => {
    const numSteps = parseInt(steps) || 3;
    const active = parseInt(activeStep) || 1;

    let css = '';
    let html = '';

    if (style === 'circles') {
      css = `.stepper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
}

.stepper-step {
  display: flex;
  align-items: center;
}

.stepper-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  border: 3px solid #e5e7eb;
  background: #fff;
  color: #6b7280;
  transition: all 0.3s ease;
}

.stepper-circle.active {
  border-color: ${primaryColor};
  background: ${primaryColor};
  color: #fff;
}

.stepper-circle.completed {
  border-color: ${primaryColor};
  background: ${primaryColor};
  color: #fff;
}

.stepper-line {
  width: 60px;
  height: 3px;
  background: #e5e7eb;
}

.stepper-line.completed {
  background: ${primaryColor};
}`;

      const stepItems = Array.from({ length: numSteps }, (_, i) => {
        const stepNum = i + 1;
        const isCompleted = stepNum < active;
        const isActive = stepNum === active;
        const circleClass = isCompleted ? 'completed' : isActive ? 'active' : '';
        const lineClass = isCompleted ? 'completed' : '';
        const line = i < numSteps - 1 ? `\n    <div class="stepper-line ${lineClass}"></div>` : '';
        return `  <div class="stepper-step">
    <div class="stepper-circle ${circleClass}">${isCompleted ? '✓' : stepNum}</div>${line}
  </div>`;
      });

      html = `<div class="stepper">\n${stepItems.join('\n')}\n</div>`;
    } else if (style === 'pills') {
      css = `.stepper-pills {
  display: flex;
  gap: 8px;
}

.stepper-pill {
  padding: 8px 20px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 500;
  background: #f3f4f6;
  color: #6b7280;
  transition: all 0.3s ease;
}

.stepper-pill.active {
  background: ${primaryColor};
  color: #fff;
}

.stepper-pill.completed {
  background: ${primaryColor}33;
  color: ${primaryColor};
}`;

      const stepItems = Array.from({ length: numSteps }, (_, i) => {
        const stepNum = i + 1;
        const cls = stepNum < active ? 'completed' : stepNum === active ? 'active' : '';
        return `  <div class="stepper-pill ${cls}">Step ${stepNum}</div>`;
      });

      html = `<div class="stepper-pills">\n${stepItems.join('\n')}\n</div>`;
    } else {
      css = `.stepper-arrows {
  display: flex;
}

.stepper-arrow {
  padding: 10px 24px 10px 36px;
  position: relative;
  font-size: 14px;
  font-weight: 500;
  background: #f3f4f6;
  color: #6b7280;
  clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%, 12px 50%);
}

.stepper-arrow:first-child {
  clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%);
  padding-left: 20px;
}

.stepper-arrow.active {
  background: ${primaryColor};
  color: #fff;
}

.stepper-arrow.completed {
  background: ${primaryColor}cc;
  color: #fff;
}`;

      const stepItems = Array.from({ length: numSteps }, (_, i) => {
        const stepNum = i + 1;
        const cls = stepNum < active ? 'completed' : stepNum === active ? 'active' : '';
        return `  <div class="stepper-arrow ${cls}">Step ${stepNum}</div>`;
      });

      html = `<div class="stepper-arrows">\n${stepItems.join('\n')}\n</div>`;
    }

    setOutput(`/* CSS */\n${css}\n\n/* HTML */\n${html}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-steps`} className="block text-sm font-medium text-gray-700 mb-1">Number of Steps</label>
            <input id={`${toolId}-steps`} type="number" min="2" max="10" value={steps} onChange={(e) => setSteps(e.target.value)} aria-label={`Number of steps for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-active`} className="block text-sm font-medium text-gray-700 mb-1">Active Step</label>
            <input id={`${toolId}-active`} type="number" min="1" max={steps} value={activeStep} onChange={(e) => setActiveStep(e.target.value)} aria-label="Active step number" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
            <input id={`${toolId}-color`} type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} aria-label="Primary color" className="input-field h-10" />
          </div>
          <div>
            <label htmlFor={`${toolId}-style`} className="block text-sm font-medium text-gray-700 mb-1">Style</label>
            <select id={`${toolId}-style`} value={style} onChange={(e) => setStyle(e.target.value as 'circles' | 'pills' | 'arrows')} aria-label="Stepper style" className="input-field">
              <option value="circles">Circles with Lines</option>
              <option value="pills">Pills</option>
              <option value="arrows">Arrows</option>
            </select>
          </div>
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate Stepper CSS</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated CSS & HTML</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
