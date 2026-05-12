'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * BalineseCalendarConverter - Convert Gregorian dates to the Balinese Pawukon calendar.
 * The Pawukon calendar is a 210-day cycle with multiple concurrent week systems.
 */
export default function BalineseCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dateInput, setDateInput] = useState('');
  const [output, setOutput] = useState('');

  // Balinese Pawukon week names
  const wuku = [
    'Sinta', 'Landep', 'Ukir', 'Kulantir', 'Tolu', 'Gumbreg', 'Wariga',
    'Warigadean', 'Julungwangi', 'Sungsang', 'Dungulan', 'Kuningan',
    'Langkir', 'Medangsia', 'Pujut', 'Pahang', 'Krulut', 'Merakih',
    'Tambir', 'Medangkungan', 'Matal', 'Uye', 'Menail', 'Prangbakat',
    'Bala', 'Ugu', 'Wayang', 'Klawu', 'Dukut', 'Watugunung',
  ];

  const pancawara = ['Umanis', 'Paing', 'Pon', 'Wage', 'Kliwon'];
  const saptawara = ['Redite', 'Soma', 'Anggara', 'Buda', 'Wraspati', 'Sukra', 'Saniscara'];
  const triwara = ['Pasah', 'Beteng', 'Kajeng'];
  const sadwara = ['Tungleh', 'Aryang', 'Urukung', 'Paniron', 'Was', 'Maulu'];

  // Reference date: 1 January 1970 is Pawukon day 78 (Redite Umanis Sinta, wuku Medangsia)
  // Using a known reference: 1 Jan 2000 = day 83 in the 210-day cycle
  const referenceDate = new Date(2000, 0, 1);
  const referencePawukonDay = 83;

  const convert = () => {
    if (!dateInput) {
      setOutput('Please select a date.');
      return;
    }

    const date = new Date(dateInput + 'T00:00:00');
    if (isNaN(date.getTime())) {
      setOutput('Invalid date.');
      return;
    }

    // Calculate days difference from reference
    const diffTime = date.getTime() - referenceDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Calculate Pawukon day (0-209)
    const pawukonDay = ((referencePawukonDay + diffDays) % 210 + 210) % 210;

    // Calculate week systems
    const wukuIndex = Math.floor(pawukonDay / 7);
    const saptawaraIndex = pawukonDay % 7;
    const pancawaraIndex = pawukonDay % 5;
    const triwaraIndex = pawukonDay % 3;
    const sadwaraIndex = pawukonDay % 6;

    // Urip values (spiritual weight)
    const saptawaraUrip = [5, 4, 3, 7, 8, 6, 9];
    const pancawaraUrip = [1, 2, 3, 4, 5];

    const totalUrip = saptawaraUrip[saptawaraIndex] + pancawaraUrip[pancawaraIndex];

    const lines: string[] = [];
    lines.push(`Gregorian Date: ${date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`);
    lines.push(``);
    lines.push(`═══ Balinese Pawukon Calendar ═══`);
    lines.push(``);
    lines.push(`Wuku (7-day week name): ${wuku[wukuIndex]}`);
    lines.push(`Saptawara (7-day): ${saptawara[saptawaraIndex]}`);
    lines.push(`Pancawara (5-day): ${pancawara[pancawaraIndex]}`);
    lines.push(`Triwara (3-day): ${triwara[triwaraIndex]}`);
    lines.push(`Sadwara (6-day): ${sadwara[sadwaraIndex]}`);
    lines.push(``);
    lines.push(`Full Pawukon Name: ${saptawara[saptawaraIndex]} ${pancawara[pancawaraIndex]} ${wuku[wukuIndex]}`);
    lines.push(``);
    lines.push(`Pawukon Day: ${pawukonDay + 1} of 210`);
    lines.push(`Wuku Week: ${wukuIndex + 1} of 30`);
    lines.push(``);
    lines.push(`═══ Spiritual Values ═══`);
    lines.push(`Saptawara Urip: ${saptawaraUrip[saptawaraIndex]}`);
    lines.push(`Pancawara Urip: ${pancawaraUrip[pancawaraIndex]}`);
    lines.push(`Total Urip: ${totalUrip}`);
    lines.push(``);
    lines.push(`Note: The Pawukon calendar is a 210-day cycle used in Bali`);
    lines.push(`for determining ceremonial days and auspicious dates.`);

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">
          Select Gregorian Date
        </label>
        <input
          id={`${toolId}-date`}
          type="date"
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
          aria-label={`Date input for ${toolName}`}
          className="input-field mb-3"
        />
        <button onClick={convert} className="btn-primary">
          Convert to Balinese Calendar
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Balinese Pawukon Date</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
