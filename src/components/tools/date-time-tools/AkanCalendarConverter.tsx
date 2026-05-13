'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AkanCalendarConverter - Convert Gregorian dates to Akan calendar (Ghanaian).
 * Shows Akan day names, which are culturally significant in Ghanaian naming traditions.
 */
export default function AkanCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [year, setYear] = useState('2024');
  const [month, setMonth] = useState('1');
  const [day, setDay] = useState('1');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const y = parseInt(year);
    const m = parseInt(month);
    const d = parseInt(day);

    if (isNaN(y) || isNaN(m) || isNaN(d) || m < 1 || m > 12 || d < 1 || d > 31) {
      setOutput('Error: Please enter a valid date.');
      return;
    }

    const date = new Date(y, m - 1, d);
    if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
      setOutput('Error: Invalid date.');
      return;
    }

    const dayOfWeek = date.getDay(); // 0=Sunday

    // Akan day names (male and female)
    const akanDays = [
      { day: 'Kwesida', male: 'Kwesi', female: 'Akosua', meaning: 'Universe/Sunday' },
      { day: 'Ɛdwoada', male: 'Kojo', female: 'Adjoa', meaning: 'Patience/Monday' },
      { day: 'Ɛbenada', male: 'Kwabena', female: 'Abenaa', meaning: 'Ocean/Tuesday' },
      { day: 'Wukuada', male: 'Kwaku', female: 'Akua', meaning: 'Spider/Wednesday' },
      { day: 'Yawoada', male: 'Yaw', female: 'Yaa', meaning: 'Earth/Thursday' },
      { day: 'Efiada', male: 'Kofi', female: 'Afua', meaning: 'Fertility/Friday' },
      { day: 'Memeneda', male: 'Kwame', female: 'Ama', meaning: 'God/Saturday' },
    ];

    // Akan months (Fante tradition)
    const akanMonths = [
      'Ɛbɔ', 'Oforisuo', 'Obenim', 'Obrɛw', 'Esusow Aketseaba',
      'Obirade', 'Ayɛwohomumu', 'Difuu', 'Fankwa', 'Ɔbɛsɛ',
      'Obira Adeɛ', 'Ɔpenimba'
    ];

    const akan = akanDays[dayOfWeek];
    const akanMonth = akanMonths[m - 1];

    // Adinkra symbol associated with the day
    const adinkra = [
      'Sankofa', 'Dwennimmen', 'Adinkrahene', 'Ananse Ntontan',
      'Gye Nyame', 'Akoma', 'Nyame Dua'
    ];

    const results = [
      `=== Akan Calendar Conversion ===`,
      ``,
      `--- Gregorian Date ---`,
      `${date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
      ``,
      `--- Akan Day ---`,
      `Day Name: ${akan.day}`,
      `Meaning: ${akan.meaning}`,
      ``,
      `--- Akan Day Names (Soul Names) ---`,
      `Male name: ${akan.male}`,
      `Female name: ${akan.female}`,
      ``,
      `--- Akan Month ---`,
      `Month: ${akanMonth}`,
      ``,
      `--- Cultural Significance ---`,
      `Associated Adinkra: ${adinkra[dayOfWeek]}`,
      ``,
      `In Akan tradition, a child born on ${akan.day}`,
      `would be given the day name ${akan.male} (male) or ${akan.female} (female).`,
      `This naming system reflects the belief that the day of birth`,
      `influences a person's character and destiny.`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input id={`${toolId}-year`} type="number" value={year} onChange={e => setYear(e.target.value)} className="input-field" aria-label={`Year for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-month`} className="block text-sm font-medium text-gray-700 mb-1">Month (1-12)</label>
              <input id={`${toolId}-month`} type="number" min="1" max="12" value={month} onChange={e => setMonth(e.target.value)} className="input-field" aria-label="Month" />
            </div>
            <div>
              <label htmlFor={`${toolId}-day`} className="block text-sm font-medium text-gray-700 mb-1">Day (1-31)</label>
              <input id={`${toolId}-day`} type="number" min="1" max="31" value={day} onChange={e => setDay(e.target.value)} className="input-field" aria-label="Day" />
            </div>
          </div>
          <button onClick={calculate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors min-h-[44px]">Convert to Akan</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Akan Calendar Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
