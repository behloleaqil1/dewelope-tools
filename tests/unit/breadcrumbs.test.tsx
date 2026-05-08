import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';

// Mock next/link to render as a simple anchor
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe('Breadcrumbs', () => {
  it('renders Home and category when no tool is provided', () => {
    render(
      <Breadcrumbs
        category={{ name: 'Text Tools', slug: 'text-tools' }}
      />
    );

    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(nav).toBeInTheDocument();

    // Home should be a link
    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toHaveAttribute('href', '/');

    // Category should be the current page (not a link)
    expect(screen.getByText('Text Tools')).toBeInTheDocument();
    expect(screen.getByText('Text Tools')).toHaveAttribute('aria-current', 'page');
  });

  it('renders Home, category link, and tool name when tool is provided', () => {
    render(
      <Breadcrumbs
        category={{ name: 'Unit Converters', slug: 'unit-converters' }}
        tool={{ name: 'Temperature Converter', slug: 'temperature-converter' }}
      />
    );

    // Home should be a link
    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toHaveAttribute('href', '/');

    // Category should be a link
    const categoryLink = screen.getByRole('link', { name: 'Unit Converters' });
    expect(categoryLink).toHaveAttribute('href', '/unit-converters');

    // Tool should be the current page (not a link)
    expect(screen.getByText('Temperature Converter')).toBeInTheDocument();
    expect(screen.getByText('Temperature Converter')).toHaveAttribute('aria-current', 'page');
  });

  it('has proper aria-label on the nav element', () => {
    render(
      <Breadcrumbs
        category={{ name: 'Developer Tools', slug: 'developer-tools' }}
      />
    );

    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(nav).toBeInTheDocument();
  });

  it('includes JSON-LD structured data for BreadcrumbList', () => {
    const { container } = render(
      <Breadcrumbs
        category={{ name: 'Math and Calculators', slug: 'math-calculators' }}
        tool={{ name: 'Percentage Calculator', slug: 'percentage-calculator' }}
      />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();

    const data = JSON.parse(script!.textContent!);
    expect(data['@context']).toBe('https://schema.org');
    expect(data['@type']).toBe('BreadcrumbList');
    expect(data.itemListElement).toHaveLength(3);

    // Verify positions
    expect(data.itemListElement[0].position).toBe(1);
    expect(data.itemListElement[0].name).toBe('Home');

    expect(data.itemListElement[1].position).toBe(2);
    expect(data.itemListElement[1].name).toBe('Math and Calculators');

    expect(data.itemListElement[2].position).toBe(3);
    expect(data.itemListElement[2].name).toBe('Percentage Calculator');
  });

  it('includes only 2 items in structured data when no tool is provided', () => {
    const { container } = render(
      <Breadcrumbs
        category={{ name: 'Text Tools', slug: 'text-tools' }}
      />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent!);
    expect(data.itemListElement).toHaveLength(2);
    expect(data.itemListElement[0].name).toBe('Home');
    expect(data.itemListElement[1].name).toBe('Text Tools');
  });

  it('renders separator arrows between breadcrumb segments', () => {
    const { container } = render(
      <Breadcrumbs
        category={{ name: 'Unit Converters', slug: 'unit-converters' }}
        tool={{ name: 'Length Converter', slug: 'length-converter' }}
      />
    );

    // Separators should be aria-hidden
    const separators = container.querySelectorAll('[aria-hidden="true"]');
    expect(separators.length).toBe(2); // Two arrows: Home→Category, Category→Tool
  });
});
