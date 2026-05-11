'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface Product {
  name: string;
  price: string;
  quantity: string;
}

/**
 * UnitPriceCalculator - Compares unit prices across 2-3 products.
 * Highlights the best deal based on lowest price per unit.
 */
export default function UnitPriceCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [products, setProducts] = useState<Product[]>([
    { name: 'Product A', price: '', quantity: '' },
    { name: 'Product B', price: '', quantity: '' },
  ]);
  const [results, setResults] = useState<{ name: string; unitPrice: number }[] | null>(null);
  const [error, setError] = useState<string | undefined>();

  const updateProduct = (index: number, field: keyof Product, value: string) => {
    const updated = [...products];
    updated[index] = { ...updated[index], [field]: value };
    setProducts(updated);
  };

  const addProduct = () => {
    if (products.length < 3) {
      setProducts([...products, { name: `Product ${String.fromCharCode(65 + products.length)}`, price: '', quantity: '' }]);
    }
  };

  const removeProduct = (index: number) => {
    if (products.length > 2) {
      setProducts(products.filter((_, i) => i !== index));
    }
  };

  const calculate = () => {
    const calculated: { name: string; unitPrice: number }[] = [];

    for (const product of products) {
      const price = parseFloat(product.price);
      const quantity = parseFloat(product.quantity);

      if (!product.price.trim() || !product.quantity.trim() || isNaN(price) || isNaN(quantity)) {
        setError('Please fill in price and quantity for all products');
        setResults(null);
        return;
      }

      if (price < 0 || quantity <= 0) {
        setError('Price must be non-negative and quantity must be positive');
        setResults(null);
        return;
      }

      calculated.push({
        name: product.name.trim() || `Product ${calculated.length + 1}`,
        unitPrice: price / quantity,
      });
    }

    setError(undefined);
    setResults(calculated);
  };

  const bestDealIndex = results
    ? results.indexOf(results.reduce((min, curr) => (curr.unitPrice < min.unitPrice ? curr : min), results[0]))
    : -1;

  const copyText = results
    ? results
        .map((r, i) => `${r.name}: $${r.unitPrice.toFixed(4)}/unit${i === bestDealIndex ? ' ★ Best Deal' : ''}`)
        .join('\n')
    : '';

  return (
    <div className="space-y-6" data-tool-id={toolId}>
      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <InputArea>
                <label htmlFor={`${toolId}-name-${index}`} className="block text-sm font-medium text-gray-700">
                  Product Name
                </label>
                <input
                  id={`${toolId}-name-${index}`}
                  type="text"
                  value={product.name}
                  onChange={(e) => updateProduct(index, 'name', e.target.value)}
                  placeholder={`Product ${String.fromCharCode(65 + index)}`}
                  aria-label={`Product ${index + 1} name for ${toolName}`}
                  className="input-field"
                />
              </InputArea>
              {products.length > 2 && (
                <button
                  onClick={() => removeProduct(index)}
                  aria-label={`Remove product ${index + 1}`}
                  className="ml-2 text-red-500 hover:text-red-700 text-sm font-medium min-h-[44px] min-w-[44px]"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <InputArea>
                <label htmlFor={`${toolId}-price-${index}`} className="block text-sm font-medium text-gray-700">
                  Price ($)
                </label>
                <input
                  id={`${toolId}-price-${index}`}
                  type="text"
                  inputMode="decimal"
                  value={product.price}
                  onChange={(e) => updateProduct(index, 'price', e.target.value)}
                  placeholder="5.99"
                  aria-label={`Product ${index + 1} price for ${toolName}`}
                  className="input-field"
                />
              </InputArea>
              <InputArea>
                <label htmlFor={`${toolId}-quantity-${index}`} className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  id={`${toolId}-quantity-${index}`}
                  type="text"
                  inputMode="decimal"
                  value={product.quantity}
                  onChange={(e) => updateProduct(index, 'quantity', e.target.value)}
                  placeholder="12"
                  aria-label={`Product ${index + 1} quantity for ${toolName}`}
                  className="input-field"
                />
              </InputArea>
            </div>
          </div>
        ))}

        <InputArea error={error}>
          <div className="flex gap-2">
            {products.length < 3 && (
              <button
                onClick={addProduct}
                aria-label="Add another product to compare"
                className="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                + Add Product
              </button>
            )}
            <button onClick={calculate} className="btn-primary" aria-label="Compare unit prices">
              Compare
            </button>
          </div>
        </InputArea>
      </div>

      <OutputArea hasContent={results !== null}>
        {results && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Price Comparison</h3>
            <div className="grid gap-2">
              {results.map((r, i) => (
                <div
                  key={i}
                  className={`flex justify-between items-center py-3 px-4 rounded-lg ${
                    i === bestDealIndex
                      ? 'bg-emerald-50 border border-emerald-200'
                      : 'bg-gray-50'
                  }`}
                >
                  <span className="text-sm font-medium text-gray-700">
                    {r.name}
                    {i === bestDealIndex && (
                      <span className="ml-2 text-xs font-semibold text-emerald-600">★ Best Deal</span>
                    )}
                  </span>
                  <span className="text-sm font-semibold text-gray-800">
                    ${r.unitPrice.toFixed(4)}/unit
                  </span>
                </div>
              ))}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
