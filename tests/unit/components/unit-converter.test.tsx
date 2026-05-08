import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UnitConverter from '@/components/tools/unit-converters/UnitConverter';
import { UnitCategory } from '@/lib/converters/units';

// A simple test category with linear conversions for predictable results
const testCategory: UnitCategory = {
  id: 'length',
  name: 'Length',
  units: [
    {
      id: 'meter',
      name: 'Meter',
      symbol: 'm',
      toBase: (v) => v,
      fromBase: (v) => v,
    },
    {
      id: 'kilometer',
      name: 'Kilometer',
      symbol: 'km',
      toBase: (v) => v * 1000,
      fromBase: (v) => v / 1000,
    },
    {
      id: 'centimeter',
      name: 'Centimeter',
      symbol: 'cm',
      toBase: (v) => v / 100,
      fromBase: (v) => v * 100,
    },
  ],
};

describe('UnitConverter', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('renders numeric input field with proper aria-label', () => {
    render(<UnitConverter unitCategory={testCategory} />);
    const input = screen.getByLabelText(/numeric value to convert in length/i);
    expect(input).toBeInTheDocument();
  });

  it('renders source and target unit dropdowns', () => {
    render(<UnitConverter unitCategory={testCategory} />);
    const fromSelect = screen.getByLabelText(/source unit for length conversion/i);
    const toSelect = screen.getByLabelText(/target unit for length conversion/i);
    expect(fromSelect).toBeInTheDocument();
    expect(toSelect).toBeInTheDocument();
  });

  it('populates dropdowns with units from the category', () => {
    render(<UnitConverter unitCategory={testCategory} />);
    const options = screen.getAllByRole('option');
    // 3 units × 2 dropdowns = 6 options
    expect(options.length).toBe(6);
    expect(screen.getAllByText(/Meter \(m\)/)).toHaveLength(2);
    expect(screen.getAllByText(/Kilometer \(km\)/)).toHaveLength(2);
    expect(screen.getAllByText(/Centimeter \(cm\)/)).toHaveLength(2);
  });

  it('renders a swap button with proper aria-label', () => {
    render(<UnitConverter unitCategory={testCategory} />);
    const swapButton = screen.getByLabelText(/swap source and target units/i);
    expect(swapButton).toBeInTheDocument();
  });

  it('shows placeholder when no input is provided', () => {
    render(<UnitConverter unitCategory={testCategory} />);
    expect(screen.getByText('Results will appear here')).toBeInTheDocument();
  });

  it('displays converted result when valid input is entered', () => {
    render(<UnitConverter unitCategory={testCategory} />);
    const input = screen.getByLabelText(/numeric value to convert in length/i);

    // Default: from Meter to Kilometer, so 1000m = 1km
    fireEvent.change(input, { target: { value: '1000' } });

    // Check the formula which contains the full conversion
    expect(screen.getByText('1000 m = 1 km')).toBeInTheDocument();
  });

  it('shows validation error for non-numeric input', () => {
    render(<UnitConverter unitCategory={testCategory} />);
    const input = screen.getByLabelText(/numeric value to convert in length/i);

    fireEvent.change(input, { target: { value: 'abc' } });

    expect(screen.getByText('Please enter a valid number')).toBeInTheDocument();
    expect(screen.getByText('Results will appear here')).toBeInTheDocument();
  });

  it('clears error when input is corrected', () => {
    render(<UnitConverter unitCategory={testCategory} />);
    const input = screen.getByLabelText(/numeric value to convert in length/i);

    fireEvent.change(input, { target: { value: 'abc' } });
    expect(screen.getByText('Please enter a valid number')).toBeInTheDocument();

    fireEvent.change(input, { target: { value: '42' } });
    expect(screen.queryByText('Please enter a valid number')).not.toBeInTheDocument();
  });

  it('swaps source and target units when swap button is clicked', () => {
    render(<UnitConverter unitCategory={testCategory} />);
    const fromSelect = screen.getByLabelText(/source unit for length conversion/i) as HTMLSelectElement;
    const toSelect = screen.getByLabelText(/target unit for length conversion/i) as HTMLSelectElement;

    // Initially: from=meter, to=kilometer
    expect(fromSelect.value).toBe('meter');
    expect(toSelect.value).toBe('kilometer');

    const swapButton = screen.getByLabelText(/swap source and target units/i);
    fireEvent.click(swapButton);

    // After swap: from=kilometer, to=meter
    expect(fromSelect.value).toBe('kilometer');
    expect(toSelect.value).toBe('meter');
  });

  it('displays the conversion formula', () => {
    render(<UnitConverter unitCategory={testCategory} />);
    const input = screen.getByLabelText(/numeric value to convert in length/i);

    fireEvent.change(input, { target: { value: '5000' } });

    // 5000 m = 5 km
    expect(screen.getByText('5000 m = 5 km')).toBeInTheDocument();
  });

  it('renders CopyToClipboard button when result is shown', () => {
    render(<UnitConverter unitCategory={testCategory} />);
    const input = screen.getByLabelText(/numeric value to convert in length/i);

    fireEvent.change(input, { target: { value: '100' } });

    const copyButton = screen.getByLabelText(/copy to clipboard/i);
    expect(copyButton).toBeInTheDocument();
  });

  it('does not show error when input is empty', () => {
    render(<UnitConverter unitCategory={testCategory} />);
    const input = screen.getByLabelText(/numeric value to convert in length/i);

    fireEvent.change(input, { target: { value: '' } });

    expect(screen.queryByText('Please enter a valid number')).not.toBeInTheDocument();
  });

  it('handles changing the source unit dropdown', () => {
    render(<UnitConverter unitCategory={testCategory} />);
    const input = screen.getByLabelText(/numeric value to convert in length/i);
    const fromSelect = screen.getByLabelText(/source unit for length conversion/i);

    fireEvent.change(input, { target: { value: '1' } });
    // Change from meter to centimeter: 1 cm -> km = 0.00001 km
    fireEvent.change(fromSelect, { target: { value: 'centimeter' } });

    expect(screen.getByText('1 cm = 0.00001 km')).toBeInTheDocument();
  });

  it('handles changing the target unit dropdown', () => {
    render(<UnitConverter unitCategory={testCategory} />);
    const input = screen.getByLabelText(/numeric value to convert in length/i);
    const toSelect = screen.getByLabelText(/target unit for length conversion/i);

    fireEvent.change(input, { target: { value: '1' } });
    // Change to centimeter: 1 m -> cm = 100 cm
    fireEvent.change(toSelect, { target: { value: 'centimeter' } });

    expect(screen.getByText('1 m = 100 cm')).toBeInTheDocument();
  });

  it('sets aria-invalid on input when there is an error', () => {
    render(<UnitConverter unitCategory={testCategory} />);
    const input = screen.getByLabelText(/numeric value to convert in length/i);

    fireEvent.change(input, { target: { value: 'invalid' } });

    expect(input).toHaveAttribute('aria-invalid', 'true');
  });
});
