import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PaginationControls from '@/components/tools/PaginationControls';

describe('PaginationControls', () => {
  it('renders Previous and Next buttons', () => {
    render(
      <PaginationControls currentPage={1} totalPages={5} onPageChange={() => {}} />
    );

    expect(screen.getByRole('button', { name: 'Go to previous page' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to next page' })).toBeInTheDocument();
  });

  it('disables Previous button on first page', () => {
    render(
      <PaginationControls currentPage={1} totalPages={5} onPageChange={() => {}} />
    );

    expect(screen.getByRole('button', { name: 'Go to previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Go to next page' })).not.toBeDisabled();
  });

  it('disables Next button on last page', () => {
    render(
      <PaginationControls currentPage={5} totalPages={5} onPageChange={() => {}} />
    );

    expect(screen.getByRole('button', { name: 'Go to previous page' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'Go to next page' })).toBeDisabled();
  });

  it('calls onPageChange with next page when Next is clicked', () => {
    const onPageChange = vi.fn();
    render(
      <PaginationControls currentPage={2} totalPages={5} onPageChange={onPageChange} />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Go to next page' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange with previous page when Previous is clicked', () => {
    const onPageChange = vi.fn();
    render(
      <PaginationControls currentPage={3} totalPages={5} onPageChange={onPageChange} />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Go to previous page' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('renders page number buttons with aria-labels', () => {
    render(
      <PaginationControls currentPage={1} totalPages={3} onPageChange={() => {}} />
    );

    expect(screen.getByRole('button', { name: 'Go to page 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to page 2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to page 3' })).toBeInTheDocument();
  });

  it('marks current page with aria-current', () => {
    render(
      <PaginationControls currentPage={2} totalPages={5} onPageChange={() => {}} />
    );

    const currentButton = screen.getByRole('button', { name: 'Go to page 2' });
    expect(currentButton).toHaveAttribute('aria-current', 'page');
  });

  it('calls onPageChange when a page number button is clicked', () => {
    const onPageChange = vi.fn();
    render(
      <PaginationControls currentPage={1} totalPages={5} onPageChange={onPageChange} />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Go to page 3' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('shows ellipsis for large page counts', () => {
    const { container } = render(
      <PaginationControls currentPage={5} totalPages={10} onPageChange={() => {}} />
    );

    // Should have ellipsis elements
    const ellipses = container.querySelectorAll('[aria-hidden="true"]');
    // At least one ellipsis (excluding SVG icons)
    const textEllipses = Array.from(ellipses).filter(
      (el) => el.tagName.toLowerCase() === 'span'
    );
    expect(textEllipses.length).toBeGreaterThan(0);
  });

  it('clamps page number to valid range when currentPage exceeds totalPages', () => {
    const onPageChange = vi.fn();
    render(
      <PaginationControls currentPage={10} totalPages={5} onPageChange={onPageChange} />
    );

    // Next should be disabled since clamped page is at totalPages
    expect(screen.getByRole('button', { name: 'Go to next page' })).toBeDisabled();
  });

  it('clamps page number to valid range when currentPage is below 1', () => {
    const onPageChange = vi.fn();
    render(
      <PaginationControls currentPage={0} totalPages={5} onPageChange={onPageChange} />
    );

    // Previous should be disabled since clamped page is 1
    expect(screen.getByRole('button', { name: 'Go to previous page' })).toBeDisabled();
  });

  it('has a navigation landmark with aria-label', () => {
    render(
      <PaginationControls currentPage={1} totalPages={3} onPageChange={() => {}} />
    );

    expect(screen.getByRole('navigation', { name: 'Pagination navigation' })).toBeInTheDocument();
  });
});
