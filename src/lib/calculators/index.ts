/**
 * Calculator engine functions for the Math and Calculators category.
 * All functions are pure and return results with formula strings where applicable.
 */

/**
 * Calculates a percentage of a given value.
 * @param value - The base value
 * @param percentage - The percentage to calculate
 * @returns The result and the formula used
 */
export function calculatePercentage(
  value: number,
  percentage: number
): { result: number; formula: string } {
  const result = (value * percentage) / 100;
  return {
    result,
    formula: `${percentage}% of ${value} = (${value} × ${percentage}) / 100 = ${result}`,
  };
}

/**
 * Calculates Body Mass Index from weight and height.
 * @param weightKg - Weight in kilograms
 * @param heightCm - Height in centimeters
 * @returns BMI value, category, and formula
 */
export function calculateBMI(
  weightKg: number,
  heightCm: number
): { bmi: number; category: string; formula: string } {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const roundedBmi = Math.round(bmi * 100) / 100;

  let category: string;
  if (bmi < 18.5) {
    category = 'Underweight';
  } else if (bmi < 25) {
    category = 'Normal weight';
  } else if (bmi < 30) {
    category = 'Overweight';
  } else {
    category = 'Obese';
  }

  return {
    bmi: roundedBmi,
    category,
    formula: `BMI = weight(kg) / height(m)² = ${weightKg} / (${heightM})² = ${roundedBmi}`,
  };
}

/**
 * Calculates loan/mortgage monthly payment, total payment, and total interest.
 * Uses the standard amortization formula.
 * @param principal - Loan amount
 * @param annualRate - Annual interest rate as a percentage (e.g., 5 for 5%)
 * @param termYears - Loan term in years
 * @returns Monthly payment, total payment, total interest, and formula
 */
export function calculateLoan(
  principal: number,
  annualRate: number,
  termYears: number
): {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  formula: string;
} {
  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = termYears * 12;

  let monthlyPayment: number;

  if (monthlyRate === 0) {
    monthlyPayment = principal / numberOfPayments;
  } else {
    monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  }

  monthlyPayment = Math.round(monthlyPayment * 100) / 100;
  const totalPayment = Math.round(monthlyPayment * numberOfPayments * 100) / 100;
  const totalInterest = Math.round((totalPayment - principal) * 100) / 100;

  return {
    monthlyPayment,
    totalPayment,
    totalInterest,
    formula: `M = P[r(1+r)^n] / [(1+r)^n - 1] where P=${principal}, r=${monthlyRate.toFixed(6)}/month, n=${numberOfPayments} months`,
  };
}

/**
 * Calculates tip amount, total bill, and per-person split.
 * @param billAmount - The original bill amount
 * @param tipPercent - Tip percentage
 * @param people - Number of people splitting the bill (minimum 1)
 * @returns Tip amount, total amount, per-person amount, and formula
 */
export function calculateTip(
  billAmount: number,
  tipPercent: number,
  people: number
): {
  tipAmount: number;
  totalAmount: number;
  perPerson: number;
  formula: string;
} {
  const tipAmount = Math.round((billAmount * tipPercent) / 100 * 100) / 100;
  const totalAmount = Math.round((billAmount + tipAmount) * 100) / 100;
  const splitPeople = Math.max(1, people);
  const perPerson = Math.round((totalAmount / splitPeople) * 100) / 100;

  return {
    tipAmount,
    totalAmount,
    perPerson,
    formula: `Tip = ${billAmount} × ${tipPercent}% = ${tipAmount}; Total = ${billAmount} + ${tipAmount} = ${totalAmount}; Per person = ${totalAmount} / ${splitPeople} = ${perPerson}`,
  };
}

/**
 * Calculates discount amount and final price.
 * @param originalPrice - The original price
 * @param discountPercent - Discount percentage
 * @returns Discount amount, final price, and formula
 */
export function calculateDiscount(
  originalPrice: number,
  discountPercent: number
): { discountAmount: number; finalPrice: number; formula: string } {
  const discountAmount = Math.round((originalPrice * discountPercent) / 100 * 100) / 100;
  const finalPrice = Math.round((originalPrice - discountAmount) * 100) / 100;

  return {
    discountAmount,
    finalPrice,
    formula: `Discount = ${originalPrice} × ${discountPercent}% = ${discountAmount}; Final price = ${originalPrice} - ${discountAmount} = ${finalPrice}`,
  };
}

/**
 * Calculates age from a birth date relative to the current date.
 * @param birthDate - The date of birth
 * @returns Years, months, days, and total days since birth
 */
export function calculateAge(birthDate: Date): {
  years: number;
  months: number;
  days: number;
  totalDays: number;
} {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const birth = new Date(birthDate);
  birth.setHours(0, 0, 0, 0);

  // Calculate total days
  const diffMs = today.getTime() - birth.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Calculate years, months, days
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    // Get the last day of the previous month
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return {
    years,
    months,
    days,
    totalDays,
  };
}

/**
 * Converts a number from one base to binary, octal, decimal, and hexadecimal.
 * Handles integers from 0 to 2^64 - 1 using BigInt.
 * @param value - The string representation of the number in the source base
 * @param fromBase - The base of the input value (2, 8, 10, or 16)
 * @returns The number represented in binary, octal, decimal, and hexadecimal
 */
export function convertNumberBase(
  value: string,
  fromBase: number
): { binary: string; octal: string; decimal: string; hexadecimal: string } {
  const trimmed = value.trim();

  // Parse the value as BigInt in the given base
  let num: bigint;

  if (fromBase === 10) {
    num = BigInt(trimmed);
  } else if (fromBase === 16) {
    num = BigInt('0x' + trimmed);
  } else if (fromBase === 8) {
    num = BigInt('0o' + trimmed);
  } else if (fromBase === 2) {
    num = BigInt('0b' + trimmed);
  } else {
    // For other bases, manually parse
    num = parseBigIntFromBase(trimmed, fromBase);
  }

  // Validate range: 0 to 2^64 - 1
  const maxValue = BigInt('18446744073709551615'); // 2^64 - 1
  if (num < BigInt(0) || num > maxValue) {
    throw new RangeError('Value must be between 0 and 2^64 - 1');
  }

  return {
    binary: num.toString(2),
    octal: num.toString(8),
    decimal: num.toString(10),
    hexadecimal: num.toString(16).toUpperCase(),
  };
}

/**
 * Parses a string as a BigInt from an arbitrary base (2-36).
 * @param str - The string to parse
 * @param base - The numeric base
 * @returns The parsed BigInt value
 */
function parseBigIntFromBase(str: string, base: number): bigint {
  const digits = '0123456789abcdefghijklmnopqrstuvwxyz';
  let result = BigInt(0);
  const bigBase = BigInt(base);

  for (const char of str.toLowerCase()) {
    const digitValue = digits.indexOf(char);
    if (digitValue === -1 || digitValue >= base) {
      throw new Error(`Invalid digit '${char}' for base ${base}`);
    }
    result = result * bigBase + BigInt(digitValue);
  }

  return result;
}


// ─── Pixel to REM Converter ──────────────────────────────────────────────────

/**
 * Convert pixels to rem units.
 *
 * @param px - Pixel value to convert
 * @param baseFontSize - Base font size in pixels (default 16)
 * @returns REM value
 */
export function pxToRem(px: number, baseFontSize: number = 16): number {
  if (baseFontSize <= 0) return 0;
  return parseFloat((px / baseFontSize).toFixed(4));
}

/**
 * Convert rem units to pixels.
 *
 * @param rem - REM value to convert
 * @param baseFontSize - Base font size in pixels (default 16)
 * @returns Pixel value
 */
export function remToPx(rem: number, baseFontSize: number = 16): number {
  return parseFloat((rem * baseFontSize).toFixed(4));
}

// ─── Hex to Decimal Converter ────────────────────────────────────────────────

/**
 * Convert a hexadecimal string to decimal.
 *
 * @param hex - Hexadecimal string (with or without 0x prefix)
 * @returns Decimal number as string
 */
export function hexToDecimal(hex: string): string {
  if (!hex) return '';
  const cleaned = hex.trim().replace(/^0x/i, '');
  if (!/^[0-9a-fA-F]+$/.test(cleaned)) return 'Invalid hex value';
  return parseInt(cleaned, 16).toString(10);
}

/**
 * Convert a decimal number to hexadecimal.
 *
 * @param decimal - Decimal number string
 * @returns Hexadecimal string (uppercase)
 */
export function decimalToHex(decimal: string): string {
  if (!decimal) return '';
  const num = parseInt(decimal.trim(), 10);
  if (isNaN(num) || num < 0) return 'Invalid decimal value';
  return num.toString(16).toUpperCase();
}
