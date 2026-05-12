'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ProtobufToJson - Converts Protocol Buffer message definitions to JSON schema.
 * Parses .proto message syntax and generates equivalent JSON schema representation.
 */
export default function ProtobufToJson({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const protoTypeToJsonType = (protoType: string): { type: string; format?: string } => {
    switch (protoType) {
      case 'double':
      case 'float':
        return { type: 'number', format: protoType };
      case 'int32':
      case 'int64':
      case 'uint32':
      case 'uint64':
      case 'sint32':
      case 'sint64':
      case 'fixed32':
      case 'fixed64':
      case 'sfixed32':
      case 'sfixed64':
        return { type: 'integer', format: protoType };
      case 'bool':
        return { type: 'boolean' };
      case 'string':
        return { type: 'string' };
      case 'bytes':
        return { type: 'string', format: 'byte' };
      default:
        return { type: 'object' };
    }
  };

  const convert = () => {
    setError('');
    setOutput('');

    if (!input.trim()) {
      setError('Please enter a Protocol Buffer message definition.');
      return;
    }

    try {
      const lines = input.split('\n');
      const messages: Record<string, { type: string; properties: Record<string, unknown>; required: string[] }> = {};
      let currentMessage = '';
      const messageStack: string[] = [];

      for (const rawLine of lines) {
        const line = rawLine.trim();

        // Skip empty lines, comments, syntax, package, import
        if (!line || line.startsWith('//') || line.startsWith('syntax') || line.startsWith('package') || line.startsWith('import') || line.startsWith('option')) {
          continue;
        }

        // Message start
        const msgMatch = line.match(/^message\s+(\w+)\s*\{/);
        if (msgMatch) {
          currentMessage = msgMatch[1];
          messageStack.push(currentMessage);
          messages[currentMessage] = { type: 'object', properties: {}, required: [] };
          continue;
        }

        // Closing brace
        if (line === '}') {
          messageStack.pop();
          currentMessage = messageStack[messageStack.length - 1] || '';
          continue;
        }

        // Field definition
        if (currentMessage && messages[currentMessage]) {
          const fieldMatch = line.match(/^\s*(repeated|optional|required)?\s*(\w+)\s+(\w+)\s*=\s*\d+/);
          if (fieldMatch) {
            const modifier = fieldMatch[1];
            const fieldType = fieldMatch[2];
            const fieldName = fieldMatch[3];
            const jsonType = protoTypeToJsonType(fieldType);

            if (modifier === 'repeated') {
              messages[currentMessage].properties[fieldName] = {
                type: 'array',
                items: jsonType,
              };
            } else {
              messages[currentMessage].properties[fieldName] = jsonType;
            }

            if (modifier === 'required') {
              messages[currentMessage].required.push(fieldName);
            }
          }

          // Map field
          const mapMatch = line.match(/^\s*map<(\w+),\s*(\w+)>\s+(\w+)\s*=\s*\d+/);
          if (mapMatch) {
            const valueType = mapMatch[2];
            const fieldName = mapMatch[3];
            messages[currentMessage].properties[fieldName] = {
              type: 'object',
              additionalProperties: protoTypeToJsonType(valueType),
            };
          }
        }
      }

      if (Object.keys(messages).length === 0) {
        setError('No valid message definitions found. Please check your protobuf syntax.');
        return;
      }

      // Build JSON Schema
      const schema: Record<string, unknown> = {
        $schema: 'http://json-schema.org/draft-07/schema#',
      };

      const messageNames = Object.keys(messages);
      if (messageNames.length === 1) {
        const msg = messages[messageNames[0]];
        schema.title = messageNames[0];
        schema.type = msg.type;
        schema.properties = msg.properties;
        if (msg.required.length > 0) schema.required = msg.required;
      } else {
        schema.definitions = {};
        for (const [name, msg] of Object.entries(messages)) {
          const def: Record<string, unknown> = {
            type: msg.type,
            properties: msg.properties,
          };
          if (msg.required.length > 0) def.required = msg.required;
          (schema.definitions as Record<string, unknown>)[name] = def;
        }
        schema.title = messageNames[0];
        schema.$ref = `#/definitions/${messageNames[0]}`;
      }

      setOutput(JSON.stringify(schema, null, 2));
    } catch {
      setError('Failed to parse protobuf definition. Please check the syntax.');
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Protocol Buffer Definition
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`message Person {\n  string name = 1;\n  int32 age = 2;\n  repeated string emails = 3;\n}`}
          aria-label={`Protobuf input for ${toolName}`}
          className="input-field h-56 resize-y font-mono text-sm"
        />
      </InputArea>

      <button onClick={convert} aria-label="Convert protobuf to JSON schema" className="btn-primary">
        Convert to JSON Schema
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">JSON Schema Output</label>
              <CopyToClipboard text={output} />
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-auto max-h-96">{output}</pre>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
