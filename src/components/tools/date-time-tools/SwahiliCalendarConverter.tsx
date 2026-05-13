'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SwahiliCalendarConverter - Convert Gregorian dates to the Swahili calendar system.
 * Shows Swahili day names, month names, and cultural context.
 */
export default function SwahiliCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [day, setDay] = useState(new Date().getDate().toString());
  const [output, setOutput] = useState('');

  const convert = () => {
    const y = parseInt(year, 10);
    const m = parseInt(month, 10);
    const d = parseInt(day, 10);

    if (!y || !m || !d || m < 1 || m > 12 || d < 1 || d > 31) {
      setOutput('Error: Please enter a valid date.');
      return;
    }

    const date = new Date(y, m - 1, d);
    if (date.getMonth() !== m - 1) {
      setOutput('Error: Invalid date for the given month.');
      return;
    }

    // Swahili day names (week starts Saturday in traditional Swahili)
    const swahiliDays = ['Jumapili', 'Jumatatu', 'Jumanne', 'Jumatano', 'Alhamisi', 'Ijumaa', 'Jumamosi'];
    // Swahili month names
    const swahiliMonths = [
      'Mwezi wa Kwanza (Januari)',
      'Mwezi wa Pili (Februari)',
      'Mwezi wa Tatu (Machi)',
      'Mwezi wa Nne (Aprili)',
      'Mwezi wa Tano (Mei)',
      'Mwezi wa Sita (Juni)',
      'Mwezi wa Saba (Julai)',
      'Mwezi wa Nane (Agosti)',
      'Mwezi wa Tisa (Septemba)',
      'Mwezi wa Kumi (Oktoba)',
      'Mwezi wa Kumi na Moja (Novemba)',
      'Mwezi wa Kumi na Mbili (Desemba)',
    ];

    const dayOfWeek = date.getDay();
    const swahiliDay = swahiliDays[dayOfWeek];
    const swahiliMonth = swahiliMonths[m - 1];

    // Traditional Swahili time context
    const dayMeaning: Record<string, string> = {
      'Jumapili': 'Day of rest (from Arabic: complete)',
      'Jumatatu': 'First day (from Arabic: one)',
      'Jumanne': 'Second day (from Arabic: two)',
      'Jumatano': 'Third day (from Arabic: three)',
      'Alhamisi': 'Fifth day (from Arabic: five)',
      'Ijumaa': 'Day of gathering (Friday prayer)',
      'Jumamosi': 'Sixth day (from Arabic: six)',
    };

    const result = `Swahili Calendar Conversion
═══════════════════════════════════════
Gregorian Date: ${date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

Swahili Date:
  Day: ${swahiliDay}
  Day Meaning: ${dayMeaning[swahiliDay]}
  Date: Tarehe ${d}
  Month: ${swahiliMonth}
  Year: Mwaka ${y}

Full Swahili Date:
  ${swahiliDay}, Tarehe ${d} ${swahiliMonth.split(' (')[0]}, Mwaka ${y}

Cultural Notes:
- The Swahili week traditionally begins on Saturday (Jumamosi)
- Day names derive from Arabic numerals reflecting Islamic influence
- Month names use ordinal numbers (Kwanza=first, Pili=second, etc.)
- Modern Swahili also uses adapted European month names
- Swahili is spoken across East Africa (Tanzania, Kenya, Uganda, DRC)`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <input id={`${toolId}-year`} type="number" min="1" max="9999" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2024" aria-label={`Year for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-month`} className="block text-sm font-medium text-gray-700 mb-1">Month (1-12)</label>
            <input id={`${toolId}-month`} type="number" min="1" max="12" value={month} onChange={(e) => setMonth(e.target.value)} placeholder="1" aria-label="Month" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-day`} className="block text-sm font-medium text-gray-700 mb-1">Day (1-31)</label>
            <input id={`${toolId}-day`} type="number" min="1" max="31" value={day} onChange={(e) => setDay(e.target.value)} placeholder="1" aria-label="Day" className="input-field" />
          </div>
        </div>
        <button onClick={convert} className="btn-primary mt-4">Convert to Swahili Calendar</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Swahili Calendar Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
