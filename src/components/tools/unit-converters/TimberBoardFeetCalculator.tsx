'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function TimberBoardFeetCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [thickness, setThickness] = useState('');
  const [width, setWidth] = useState('');
  const [length, setLength] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [pricePerBF, setPricePerBF] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const t = parseFloat(thickness);
    const w = parseFloat(width);
    const l = parseFloat(length);
    const qty = parseInt(quantity) || 1;
    const price = parseFloat(pricePerBF);

    if (isNaN(t) || isNaN(w) || isNaN(l) || t <= 0 || w <= 0 || l <= 0) {
      setOutput('Please enter valid dimensions (thickness in inches, width in inches, length in feet).');
      return;
    }

    // Board Feet = (Thickness × Width × Length) / 12
    // where thickness and width are in inches, length in feet
    const boardFeetPerPiece = (t * w * l) / 12;
    const totalBoardFeet = boardFeetPerPiece * qty;

    const lines = [
      `=== Board Feet Calculator ===`,
      ``,
      `Dimensions:`,
      `  Thickness: ${t}" × Width: ${w}" × Length: ${l}'`,
      `  Quantity: ${qty} piece${qty > 1 ? 's' : ''}`,
      ``,
      `--- Results ---`,
      `Board Feet per piece: ${boardFeetPerPiece.toFixed(3)} BF`,
      `Total Board Feet: ${totalBoardFeet.toFixed(3)} BF`,
      ``,
      `Volume: ${(totalBoardFeet / 12).toFixed(3)} cubic feet`,
      `Volume: ${(totalBoardFeet * 2359.74 / 12).toFixed(1)} cubic centimeters`,
    ];

    if (!isNaN(price) && price > 0) {
      lines.push(``, `--- Cost ---`);
      lines.push(`Price per BF: $${price.toFixed(2)}`);
      lines.push(`Total Cost: $${(totalBoardFeet * price).toFixed(2)}`);
    }

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-t`} className="block text-sm font-medium text-gray-700 mb-1">Thickness (inches)</label>
            <input id={`${toolId}-t`} type="number" step="0.25" value={thickness} onChange={(e) => setThickness(e.target.value)} className="input-field" placeholder="e.g. 1" aria-label={`Thickness for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-w`} className="block text-sm font-medium text-gray-700 mb-1">Width (inches)</label>
            <input id={`${toolId}-w`} type="number" step="0.25" value={width} onChange={(e) => setWidth(e.target.value)} className="input-field" placeholder="e.g. 6" aria-label="Width in inches" />
          </div>
          <div>
            <label htmlFor={`${toolId}-l`} className="block text-sm font-medium text-gray-700 mb-1">Length (feet)</label>
            <input id={`${toolId}-l`} type="number" step="0.5" value={length} onChange={(e) => setLength(e.target.value)} className="input-field" placeholder="e.g. 8" aria-label="Length in feet" />
          </div>
          <div>
            <label htmlFor={`${toolId}-qty`} className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input id={`${toolId}-qty`} type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="input-field" placeholder="1" aria-label="Quantity of boards" />
          </div>
          <div className="col-span-2">
            <label htmlFor={`${toolId}-price`} className="block text-sm font-medium text-gray-700 mb-1">Price per Board Foot (optional)</label>
            <input id={`${toolId}-price`} type="number" step="0.01" value={pricePerBF} onChange={(e) => setPricePerBF(e.target.value)} className="input-field" placeholder="e.g. 5.50" aria-label="Price per board foot" />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-3">Calculate Board Feet</button>
      </InputArea>
      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Board Feet Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
