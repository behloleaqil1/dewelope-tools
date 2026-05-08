import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NotFound from '@/app/not-found';

// Mock next/link to render as a simple anchor
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe('NotFound Page', () => {
  it('renders 404 heading', () => {
    render(<NotFound />);
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('displays "Page Not Found" message', () => {
    render(<NotFound />);
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  it('displays a descriptive message about the missing page', () => {
    render(<NotFound />);
    expect(
      screen.getByText(/the tool or page you are looking for does not exist/i)
    ).toBeInTheDocument();
  });

  it('includes a link to the homepage', () => {
    render(<NotFound />);
    const link = screen.getByRole('link', { name: /go to homepage/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });
});
