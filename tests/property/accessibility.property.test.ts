import { describe, it, expect, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { render, cleanup } from '@testing-library/react';
import React from 'react';

/**
 * Property-based tests for ARIA accessibility attributes.
 *
 * Property 29: ARIA Accessibility Attributes
 * For any tool page:
 * (a) all form inputs and tool controls SHALL have an aria-label or aria-labelledby attribute
 * (b) the output area SHALL have an aria-live attribute set to "polite"
 * (c) validation error containers SHALL have an aria-live attribute set to "assertive"
 *
 * Validates: Requirements 14.3, 14.4, 14.5
 */

describe('Feature: online-tools-hub, Property 29: ARIA Accessibility Attributes', () => {
  afterEach(() => {
    cleanup();
  });

  it('InputArea validation error container SHALL have aria-live="assertive" regardless of error content', async () => {
    const { default: InputArea } = await import('@/components/tools/InputArea');

    // Arbitrary for error messages: either undefined (no error) or a non-empty string
    const errorArb = fc.oneof(
      fc.constant(undefined),
      fc.string({ minLength: 1, maxLength: 200 })
    );

    // Arbitrary for className
    const classNameArb = fc.oneof(
      fc.constant(''),
      fc.constantFrom('mt-4', 'p-2 bg-white', 'custom-class')
    );

    fc.assert(
      fc.property(
        errorArb,
        classNameArb,
        (error, className) => {
          const { container, unmount } = render(
            React.createElement(
              InputArea,
              { error, className },
              React.createElement('input', { type: 'text', 'aria-label': 'Test input' })
            )
          );

          // Find the aria-live="assertive" container
          const assertiveRegion = container.querySelector('[aria-live="assertive"]');
          expect(assertiveRegion).not.toBeNull();
          expect(assertiveRegion!.getAttribute('aria-live')).toBe('assertive');

          // When an error is present, it should be displayed within the assertive region
          if (error) {
            const errorElement = assertiveRegion!.querySelector('[role="alert"]');
            expect(errorElement).not.toBeNull();
            expect(errorElement!.textContent).toBe(error);
          }

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('OutputArea SHALL have aria-live="polite" regardless of content or props', async () => {
    const { default: OutputArea } = await import('@/components/tools/OutputArea');

    // Arbitrary for hasContent flag
    const hasContentArb = fc.boolean();

    // Arbitrary for className
    const classNameArb = fc.oneof(
      fc.constant(''),
      fc.constantFrom('mt-4', 'p-2 bg-gray-100', 'w-full')
    );

    // Arbitrary for child content text
    const childTextArb = fc.string({ minLength: 0, maxLength: 500 });

    fc.assert(
      fc.property(
        hasContentArb,
        classNameArb,
        childTextArb,
        (hasContent, className, childText) => {
          const { container, unmount } = render(
            React.createElement(
              OutputArea,
              { hasContent, className },
              React.createElement('span', null, childText)
            )
          );

          // The output area must have aria-live="polite"
          const politeRegion = container.querySelector('[aria-live="polite"]');
          expect(politeRegion).not.toBeNull();
          expect(politeRegion!.getAttribute('aria-live')).toBe('polite');

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('InputArea and OutputArea consistently produce correct ARIA attributes across varied props', async () => {
    const { default: InputArea } = await import('@/components/tools/InputArea');
    const { default: OutputArea } = await import('@/components/tools/OutputArea');

    // Arbitrary for InputArea props
    const inputAreaPropsArb = fc.record({
      error: fc.oneof(
        fc.constant(undefined),
        fc.string({ minLength: 1, maxLength: 300 })
      ),
      className: fc.oneof(
        fc.constant(undefined),
        fc.constant(''),
        fc.constantFrom('mt-4', 'p-2', 'bg-white', 'w-full', 'space-y-4')
      ),
    });

    // Arbitrary for OutputArea props
    const outputAreaPropsArb = fc.record({
      hasContent: fc.boolean(),
      className: fc.oneof(
        fc.constant(undefined),
        fc.constant(''),
        fc.constantFrom('mt-4', 'p-2', 'bg-gray-100', 'w-full', 'rounded-lg')
      ),
    });

    fc.assert(
      fc.property(
        inputAreaPropsArb,
        outputAreaPropsArb,
        (inputProps, outputProps) => {
          // Render InputArea
          const inputResult = render(
            React.createElement(
              InputArea,
              { error: inputProps.error, className: inputProps.className || '' },
              React.createElement('input', { type: 'text', 'aria-label': 'Test field' })
            )
          );

          // Verify InputArea has aria-live="assertive" for validation errors
          const assertiveRegion = inputResult.container.querySelector('[aria-live="assertive"]');
          expect(assertiveRegion).not.toBeNull();
          expect(assertiveRegion!.getAttribute('aria-live')).toBe('assertive');
          expect(assertiveRegion!.getAttribute('aria-atomic')).toBe('true');

          inputResult.unmount();

          // Render OutputArea
          const outputResult = render(
            React.createElement(
              OutputArea,
              { hasContent: outputProps.hasContent, className: outputProps.className || '' },
              React.createElement('div', null, 'Output content')
            )
          );

          // Verify OutputArea has aria-live="polite"
          const politeRegion = outputResult.container.querySelector('[aria-live="polite"]');
          expect(politeRegion).not.toBeNull();
          expect(politeRegion!.getAttribute('aria-live')).toBe('polite');
          expect(politeRegion!.getAttribute('aria-atomic')).toBe('true');

          outputResult.unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});
