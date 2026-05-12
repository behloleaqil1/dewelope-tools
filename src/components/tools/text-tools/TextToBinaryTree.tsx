'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToBinaryTree - Display text characters as a binary tree structure.
 * Inserts characters into a binary tree and renders it as ASCII art.
 */
export default function TextToBinaryTree({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  interface TreeNode {
    value: string;
    left: TreeNode | null;
    right: TreeNode | null;
  }

  const insertNode = (root: TreeNode | null, value: string): TreeNode => {
    if (!root) return { value, left: null, right: null };
    if (value < root.value) {
      root.left = insertNode(root.left, value);
    } else {
      root.right = insertNode(root.right, value);
    }
    return root;
  };

  const getHeight = (node: TreeNode | null): number => {
    if (!node) return 0;
    return 1 + Math.max(getHeight(node.left), getHeight(node.right));
  };

  const renderTree = (node: TreeNode | null): string => {
    if (!node) return '(empty tree)';

    const lines: string[] = [];

    const buildLines = (node: TreeNode | null, prefix: string, isLeft: boolean, isRoot: boolean): void => {
      if (!node) return;

      if (isRoot) {
        lines.push(`[${node.value}]`);
      } else {
        const connector = isLeft ? '├── ' : '└── ';
        lines.push(`${prefix}${connector}[${node.value}]`);
      }

      const childPrefix = isRoot ? '' : prefix + (isLeft ? '│   ' : '    ');

      if (node.left || node.right) {
        if (node.left) {
          buildLines(node.left, childPrefix, true, false);
        } else {
          lines.push(`${childPrefix}├── (null)`);
        }
        if (node.right) {
          buildLines(node.right, childPrefix, false, false);
        } else {
          lines.push(`${childPrefix}└── (null)`);
        }
      }
    };

    buildLines(node, '', false, true);
    return lines.join('\n');
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!input) { setOutput(''); return; }

    debounceRef.current = setTimeout(() => {
      const chars = input.split('').filter(c => c.trim());
      if (chars.length === 0) { setOutput(''); return; }

      // Limit to 30 characters for readable output
      const limited = chars.slice(0, 30);
      let root: TreeNode | null = null;

      for (const char of limited) {
        root = insertNode(root, char);
      }

      const height = getHeight(root);
      const treeStr = renderTree(root);

      const info = [
        `Input: "${limited.join('')}"${chars.length > 30 ? ` (truncated from ${chars.length} chars)` : ''}`,
        `Tree Height: ${height}`,
        `Nodes: ${limited.length}`,
        `Insertion Order: ${limited.map(c => `'${c}'`).join(' → ')}`,
        '',
        'Binary Search Tree (characters sorted by char code):',
        '─'.repeat(50),
        '',
        treeStr,
      ];

      setOutput(info.join('\n'));
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text (characters become tree nodes)
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to build a binary tree..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Binary Tree Structure</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
