'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToHillCipher - Encrypts and decrypts text using the Hill cipher.
 * Uses a 2x2 or 3x3 key matrix for matrix-based polygraphic substitution.
 */
export default function TextToHillCipher({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [keyMatrix, setKeyMatrix] = useState('3,3,2,5');
  const [matrixSize, setMatrixSize] = useState<2 | 3>(2);
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();

  const mod = (n: number, m: number): number => ((n % m) + m) % m;

  const determinant2x2 = (m: number[][]): number => m[0][0] * m[1][1] - m[0][1] * m[1][0];

  const determinant3x3 = (m: number[][]): number => {
    return m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1])
      - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0])
      + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
  };

  const modInverse = (a: number, m: number): number | null => {
    const amod = mod(a, m);
    for (let i = 1; i < m; i++) {
      if (mod(amod * i, m) === 1) return i;
    }
    return null;
  };

  const invertMatrix2x2 = (matrix: number[][]): number[][] | null => {
    const det = mod(determinant2x2(matrix), 26);
    const detInv = modInverse(det, 26);
    if (detInv === null) return null;

    return [
      [mod(matrix[1][1] * detInv, 26), mod(-matrix[0][1] * detInv, 26)],
      [mod(-matrix[1][0] * detInv, 26), mod(matrix[0][0] * detInv, 26)],
    ];
  };

  const invertMatrix3x3 = (matrix: number[][]): number[][] | null => {
    const det = mod(determinant3x3(matrix), 26);
    const detInv = modInverse(det, 26);
    if (detInv === null) return null;

    const cofactors: number[][] = [];
    for (let i = 0; i < 3; i++) {
      cofactors[i] = [];
      for (let j = 0; j < 3; j++) {
        const minor = matrix
          .filter((_, ri) => ri !== i)
          .map(row => row.filter((_, ci) => ci !== j));
        const cofactor = minor[0][0] * minor[1][1] - minor[0][1] * minor[1][0];
        cofactors[i][j] = mod(((i + j) % 2 === 0 ? 1 : -1) * cofactor * detInv, 26);
      }
    }

    // Transpose
    const result: number[][] = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        result[j][i] = cofactors[i][j];
      }
    }
    return result;
  };

  const multiplyMatrixVector = (matrix: number[][], vector: number[]): number[] => {
    const size = matrix.length;
    const result: number[] = new Array(size).fill(0);
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        result[i] += matrix[i][j] * vector[j];
      }
      result[i] = mod(result[i], 26);
    }
    return result;
  };

  const process = () => {
    const text = input.trim().toUpperCase().replace(/[^A-Z]/g, '');
    if (!text) {
      setError('Please enter text containing letters');
      setOutput('');
      return;
    }

    const keyValues = keyMatrix.split(',').map(v => parseInt(v.trim()));
    const expectedSize = matrixSize * matrixSize;

    if (keyValues.length !== expectedSize || keyValues.some(isNaN)) {
      setError(`Key must be ${expectedSize} comma-separated integers for a ${matrixSize}x${matrixSize} matrix`);
      setOutput('');
      return;
    }

    // Build matrix
    const matrix: number[][] = [];
    for (let i = 0; i < matrixSize; i++) {
      matrix[i] = [];
      for (let j = 0; j < matrixSize; j++) {
        matrix[i][j] = mod(keyValues[i * matrixSize + j], 26);
      }
    }

    let workMatrix = matrix;
    if (mode === 'decrypt') {
      const inv = matrixSize === 2 ? invertMatrix2x2(matrix) : invertMatrix3x3(matrix);
      if (!inv) {
        setError('Key matrix is not invertible mod 26. Choose a different key.');
        setOutput('');
        return;
      }
      workMatrix = inv;
    }

    // Pad text
    let padded = text;
    while (padded.length % matrixSize !== 0) {
      padded += 'X';
    }

    let result = '';
    for (let i = 0; i < padded.length; i += matrixSize) {
      const vector = [];
      for (let j = 0; j < matrixSize; j++) {
        vector.push(padded.charCodeAt(i + j) - 65);
      }
      const encrypted = multiplyMatrixVector(workMatrix, vector);
      result += encrypted.map(v => String.fromCharCode(v + 65)).join('');
    }

    setError(undefined);
    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Text to {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text (letters only)..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
      </InputArea>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
          <select value={mode} onChange={(e) => setMode(e.target.value as 'encrypt' | 'decrypt')} aria-label="Mode" className="input-field">
            <option value="encrypt">Encrypt</option>
            <option value="decrypt">Decrypt</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Matrix Size</label>
          <select value={matrixSize} onChange={(e) => setMatrixSize(parseInt(e.target.value) as 2 | 3)} aria-label="Matrix size" className="input-field">
            <option value={2}>2×2</option>
            <option value={3}>3×3</option>
          </select>
        </div>
        <div>
          <label htmlFor={`${toolId}-key`} className="block text-sm font-medium text-gray-700 mb-1">
            Key Matrix (comma-separated)
          </label>
          <input
            id={`${toolId}-key`}
            type="text"
            value={keyMatrix}
            onChange={(e) => setKeyMatrix(e.target.value)}
            placeholder={matrixSize === 2 ? '3,3,2,5' : '6,24,1,13,16,10,20,17,15'}
            aria-label="Key matrix values"
            className="input-field"
          />
        </div>
      </div>

      <button onClick={process} aria-label={`${mode === 'encrypt' ? 'Encrypt' : 'Decrypt'} text`} className="btn-primary">
        {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
