'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SqlToMongodb - Converts basic SQL SELECT queries to MongoDB find() syntax.
 */
export default function SqlToMongodb({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!input.trim()) { setOutput(''); setError(''); return; }

    debounceRef.current = setTimeout(() => {
      try {
        const result = convertSqlToMongo(input.trim());
        setOutput(result);
        setError('');
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Invalid SQL query');
        setOutput('');
      }
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  function convertSqlToMongo(sql: string): string {
    const normalized = sql.replace(/\s+/g, ' ').trim().replace(/;$/, '');
    const selectMatch = normalized.match(/^SELECT\s+(.+?)\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+?))?(?:\s+ORDER\s+BY\s+(.+?))?(?:\s+LIMIT\s+(\d+))?$/i);

    if (!selectMatch) throw new Error('Only basic SELECT ... FROM ... [WHERE ...] [ORDER BY ...] [LIMIT n] queries are supported');

    const [, fields, collection, whereClause, orderClause, limitClause] = selectMatch;

    // Build projection
    const projection: Record<string, number> = {};
    if (fields.trim() !== '*') {
      fields.split(',').map(f => f.trim()).forEach(f => { projection[f] = 1; });
    }

    // Build filter
    const filter: Record<string, unknown> = {};
    if (whereClause) {
      const conditions = whereClause.split(/\s+AND\s+/i);
      for (const cond of conditions) {
        const opMatch = cond.match(/^(\w+)\s*(=|!=|<>|>=|<=|>|<|LIKE|IN)\s*(.+)$/i);
        if (!opMatch) throw new Error(`Cannot parse condition: ${cond}`);
        const [, field, op, rawVal] = opMatch;
        const val = parseValue(rawVal.trim());

        switch (op.toUpperCase()) {
          case '=': filter[field] = val; break;
          case '!=': case '<>': filter[field] = { $ne: val }; break;
          case '>': filter[field] = { $gt: val }; break;
          case '>=': filter[field] = { $gte: val }; break;
          case '<': filter[field] = { $lt: val }; break;
          case '<=': filter[field] = { $lte: val }; break;
          case 'LIKE': filter[field] = { $regex: likeToRegex(String(val)) }; break;
          case 'IN': filter[field] = { $in: parseInValues(rawVal.trim()) }; break;
        }
      }
    }

    // Build sort
    const sort: Record<string, number> = {};
    if (orderClause) {
      orderClause.split(',').forEach(part => {
        const parts = part.trim().split(/\s+/);
        const field = parts[0];
        const dir = parts[1]?.toUpperCase() === 'DESC' ? -1 : 1;
        sort[field] = dir;
      });
    }

    // Build output
    let result = `db.${collection}.find(\n  ${JSON.stringify(filter, null, 2).replace(/\n/g, '\n  ')}`;
    if (Object.keys(projection).length > 0) {
      result += `,\n  ${JSON.stringify(projection, null, 2).replace(/\n/g, '\n  ')}`;
    }
    result += '\n)';
    if (Object.keys(sort).length > 0) result += `.sort(${JSON.stringify(sort)})`;
    if (limitClause) result += `.limit(${limitClause})`;

    return result;
  }

  function parseValue(val: string): string | number | boolean {
    if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
      return val.slice(1, -1);
    }
    if (val.toLowerCase() === 'true') return true;
    if (val.toLowerCase() === 'false') return false;
    if (val.toLowerCase() === 'null') return 'null';
    const num = Number(val);
    return isNaN(num) ? val : num;
  }

  function parseInValues(val: string): (string | number)[] {
    const match = val.match(/\((.+)\)/);
    if (!match) return [val];
    return match[1].split(',').map(v => {
      const trimmed = v.trim();
      const parsed = parseValue(trimmed);
      return typeof parsed === 'boolean' ? String(parsed) : parsed as string | number;
    });
  }

  function likeToRegex(val: string): string {
    const cleaned = val.replace(/^['"]|['"]$/g, '');
    return '^' + cleaned.replace(/%/g, '.*').replace(/_/g, '.') + '$';
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter SQL SELECT query
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="SELECT name, age FROM users WHERE age > 25 AND status = 'active' ORDER BY name LIMIT 10"
          aria-label={`SQL input for ${toolName}`}
          className="input-field h-32 resize-y font-mono text-sm"
        />
        <div className="flex gap-2 mt-2 flex-wrap">
          {[
            "SELECT * FROM users WHERE age > 25",
            "SELECT name, email FROM customers WHERE status = 'active' LIMIT 5",
          ].map((ex, i) => (
            <button key={i} onClick={() => setInput(ex)} className="px-2 py-1 text-xs rounded border bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 text-left">
              Example {i + 1}
            </button>
          ))}
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">MongoDB Query</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
