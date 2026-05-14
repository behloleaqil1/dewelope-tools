'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MockDataGenerator - Generate mock data from schema/fields and count.
 */
export default function MockDataGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [count, setCount] = useState('5');
  const [fields, setFields] = useState('id:number,name:name,email:email,age:number,city:city');

  const firstNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Wilson', 'Moore'];
  const cities = ['New York', 'London', 'Tokyo', 'Paris', 'Berlin', 'Sydney', 'Toronto', 'Mumbai', 'São Paulo', 'Seoul'];
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'example.com', 'company.org'];

  const generateValue = (type: string, index: number): unknown => {
    switch (type.trim().toLowerCase()) {
      case 'number': return index + 1;
      case 'name': return `${firstNames[index % firstNames.length]} ${lastNames[(index + 3) % lastNames.length]}`;
      case 'email': {
        const fn = firstNames[index % firstNames.length].toLowerCase();
        const ln = lastNames[(index + 3) % lastNames.length].toLowerCase();
        return `${fn}.${ln}@${domains[index % domains.length]}`;
      }
      case 'city': return cities[index % cities.length];
      case 'boolean': return index % 2 === 0;
      case 'date': {
        const d = new Date(2024, index % 12, (index % 28) + 1);
        return d.toISOString().split('T')[0];
      }
      case 'uuid': return `${Math.random().toString(36).slice(2, 10)}-${Math.random().toString(36).slice(2, 6)}-4${Math.random().toString(36).slice(2, 5)}-${Math.random().toString(36).slice(2, 6)}-${Math.random().toString(36).slice(2, 14)}`;
      case 'phone': return `+1-${String(200 + index).slice(0, 3)}-${String(1000 + index * 7).slice(0, 3)}-${String(1000 + index * 13).slice(0, 4)}`;
      default: return `value_${index}`;
    }
  };

  const generate = (): string => {
    const n = Math.min(Math.max(parseInt(count) || 1, 1), 100);
    const fieldDefs = fields.split(',').map(f => {
      const [name, type] = f.split(':');
      return { name: name?.trim() || 'field', type: type?.trim() || 'string' };
    });

    const data = Array.from({ length: n }, (_, i) => {
      const obj: Record<string, unknown> = {};
      for (const fd of fieldDefs) {
        obj[fd.name] = generateValue(fd.type, i);
      }
      return obj;
    });

    return JSON.stringify(data, null, 2);
  };

  const result = generate();

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div>
        <label htmlFor={`${toolId}-fields`} className="block text-sm font-medium text-gray-700 mb-1">Fields (name:type, comma-separated)</label>
        <input id={`${toolId}-fields`} type="text" value={fields} onChange={(e) => setFields(e.target.value)} placeholder="id:number,name:name,email:email" aria-label={`Fields for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <p className="text-xs text-gray-500 mt-1">Types: number, name, email, city, boolean, date, uuid, phone</p>
      </div>
      <div>
        <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">Count (1-100)</label>
        <input id={`${toolId}-count`} type="number" value={count} onChange={(e) => setCount(e.target.value)} min="1" max="100" aria-label={`Count for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <OutputArea hasContent={!!result}>
        <div className="space-y-2">
          <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-lg max-h-96 overflow-y-auto">{result}</pre>
          <CopyToClipboard text={result} />
        </div>
      </OutputArea>
    </div>
  );
}
