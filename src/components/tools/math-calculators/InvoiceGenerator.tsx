'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  price: number;
}

/**
 * InvoiceGenerator - Creates a simple invoice with line items, tax calculation,
 * and a formatted text preview. Supports adding/removing items dynamically.
 */
export default function InvoiceGenerator({ toolId, toolName: _toolName }: { toolId: string; toolName: string }) {
  const [fromName, setFromName] = useState('');
  const [toName, setToName] = useState('');
  const [taxRate, setTaxRate] = useState('0');
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: 1, description: '', quantity: 1, price: 0 },
  ]);
  const [error, setError] = useState<string | undefined>();
  const [invoice, setInvoice] = useState<string | null>(null);

  const nextId = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;

  function addItem() {
    setItems([...items, { id: nextId, description: '', quantity: 1, price: 0 }]);
  }

  function removeItem(id: number) {
    if (items.length <= 1) return;
    setItems(items.filter((item) => item.id !== id));
  }

  function updateItem(id: number, field: keyof Omit<InvoiceItem, 'id'>, value: string) {
    setItems(
      items.map((item) => {
        if (item.id !== id) return item;
        if (field === 'description') {
          return { ...item, description: value };
        } else if (field === 'quantity') {
          return { ...item, quantity: parseFloat(value) || 0 };
        } else {
          return { ...item, price: parseFloat(value) || 0 };
        }
      })
    );
  }

  function handleGenerate() {
    setError(undefined);
    setInvoice(null);

    if (!fromName.trim()) {
      setError('Please enter the sender name (From)');
      return;
    }
    if (!toName.trim()) {
      setError('Please enter the recipient name (To)');
      return;
    }

    const validItems = items.filter((item) => item.description.trim() !== '');
    if (validItems.length === 0) {
      setError('Please add at least one item with a description');
      return;
    }

    const tax = parseFloat(taxRate) || 0;
    if (tax < 0 || tax > 100) {
      setError('Tax rate must be between 0 and 100');
      return;
    }

    const subtotal = validItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const taxAmount = subtotal * (tax / 100);
    const total = subtotal + taxAmount;

    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const separator = '─'.repeat(50);
    const itemLines = validItems
      .map(
        (item) =>
          `  ${item.description.padEnd(25)} ${item.quantity.toString().padStart(5)} × $${item.price.toFixed(2).padStart(8)} = $${(item.quantity * item.price).toFixed(2).padStart(10)}`
      )
      .join('\n');

    const invoiceText = `INVOICE
${separator}
Date: ${date}

From: ${fromName.trim()}
To:   ${toName.trim()}

${separator}
Items:
${itemLines}

${separator}
  Subtotal:${' '.repeat(30)}$${subtotal.toFixed(2).padStart(10)}
  Tax (${tax}%):${' '.repeat(28 - tax.toString().length)}$${taxAmount.toFixed(2).padStart(10)}
${separator}
  TOTAL:${' '.repeat(33)}$${total.toFixed(2).padStart(10)}
${separator}`;

    setInvoice(invoiceText);
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputArea error={error}>
          <label htmlFor={`${toolId}-from`} className="block text-sm font-medium text-gray-700 mb-1">
            From (Your Name/Company)
          </label>
          <input
            id={`${toolId}-from`}
            type="text"
            value={fromName}
            onChange={(e) => setFromName(e.target.value)}
            placeholder="Your Company Name"
            aria-label="Invoice sender name"
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-to`} className="block text-sm font-medium text-gray-700 mb-1">
            To (Client Name/Company)
          </label>
          <input
            id={`${toolId}-to`}
            type="text"
            value={toName}
            onChange={(e) => setToName(e.target.value)}
            placeholder="Client Company Name"
            aria-label="Invoice recipient name"
            className="input-field"
          />
        </InputArea>
      </div>

      {/* Items */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Items</h3>
        {items.map((item, idx) => (
          <div key={item.id} className="flex gap-2 items-end">
            <div className="flex-1">
              {idx === 0 && (
                <label className="block text-xs text-gray-500 mb-1">Description</label>
              )}
              <input
                type="text"
                value={item.description}
                onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                placeholder="Item description"
                aria-label={`Item ${idx + 1} description`}
                className="input-field text-sm"
              />
            </div>
            <div className="w-20">
              {idx === 0 && (
                <label className="block text-xs text-gray-500 mb-1">Qty</label>
              )}
              <input
                type="number"
                min={1}
                value={item.quantity || ''}
                onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                placeholder="1"
                aria-label={`Item ${idx + 1} quantity`}
                className="input-field text-sm"
              />
            </div>
            <div className="w-28">
              {idx === 0 && (
                <label className="block text-xs text-gray-500 mb-1">Price ($)</label>
              )}
              <input
                type="number"
                step="0.01"
                value={item.price || ''}
                onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                placeholder="0.00"
                aria-label={`Item ${idx + 1} price`}
                className="input-field text-sm"
              />
            </div>
            <button
              onClick={() => removeItem(item.id)}
              disabled={items.length <= 1}
              aria-label={`Remove item ${idx + 1}`}
              className="px-2 py-2 text-red-500 hover:text-red-700 disabled:text-gray-300 disabled:cursor-not-allowed min-h-[44px]"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          onClick={addItem}
          aria-label="Add new invoice item"
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          + Add Item
        </button>
      </div>

      {/* Tax Rate */}
      <InputArea>
        <label htmlFor={`${toolId}-tax`} className="block text-sm font-medium text-gray-700 mb-1">
          Tax Rate (%)
        </label>
        <input
          id={`${toolId}-tax`}
          type="number"
          step="0.1"
          value={taxRate}
          onChange={(e) => setTaxRate(e.target.value)}
          placeholder="0"
          aria-label="Tax rate percentage"
          className="input-field w-32"
        />
      </InputArea>

      <button
        onClick={handleGenerate}
        aria-label="Generate invoice"
        className="btn-primary"
      >
        Generate Invoice
      </button>

      <OutputArea hasContent={invoice !== null}>
        {invoice && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-700">Invoice Preview</h3>
              <CopyToClipboard text={invoice} />
            </div>
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono p-4 bg-gray-50 rounded-lg border border-gray-100 overflow-x-auto">
              {invoice}
            </pre>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
