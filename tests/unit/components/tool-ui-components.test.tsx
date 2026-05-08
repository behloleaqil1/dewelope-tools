import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';
import ToolPageShell from '@/components/tools/ToolPageShell';

describe('InputArea', () => {
  it('renders children', () => {
    render(
      <InputArea>
        <input data-testid="test-input" />
      </InputArea>
    );
    expect(screen.getByTestId('test-input')).toBeInTheDocument();
  });

  it('displays validation error when provided', () => {
    render(
      <InputArea error="Please enter a valid number">
        <input />
      </InputArea>
    );
    expect(screen.getByText('Please enter a valid number')).toBeInTheDocument();
  });

  it('has aria-live="assertive" on the error container', () => {
    const { container } = render(
      <InputArea error="Invalid input">
        <input />
      </InputArea>
    );
    const liveRegion = container.querySelector('[aria-live="assertive"]');
    expect(liveRegion).toBeInTheDocument();
  });

  it('does not display error text when no error is provided', () => {
    const { container } = render(
      <InputArea>
        <input />
      </InputArea>
    );
    const liveRegion = container.querySelector('[aria-live="assertive"]');
    expect(liveRegion).toBeInTheDocument();
    expect(liveRegion?.textContent).toBe('');
  });

  it('applies custom className', () => {
    const { container } = render(
      <InputArea className="custom-class">
        <input />
      </InputArea>
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('OutputArea', () => {
  it('renders children when hasContent is true', () => {
    render(
      <OutputArea hasContent={true}>
        <p data-testid="output">Result: 42</p>
      </OutputArea>
    );
    expect(screen.getByTestId('output')).toBeInTheDocument();
  });

  it('shows placeholder when hasContent is false', () => {
    render(
      <OutputArea hasContent={false}>
        <p>Some content</p>
      </OutputArea>
    );
    expect(screen.getByText('Results will appear here')).toBeInTheDocument();
    expect(screen.queryByText('Some content')).not.toBeInTheDocument();
  });

  it('has aria-live="polite" for screen reader announcements', () => {
    const { container } = render(
      <OutputArea hasContent={true}>
        <p>Output</p>
      </OutputArea>
    );
    const liveRegion = container.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <OutputArea hasContent={false} className="my-class">
        <p>Content</p>
      </OutputArea>
    );
    expect(container.firstChild).toHaveClass('my-class');
  });
});

describe('CopyToClipboard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders a copy button', () => {
    render(<CopyToClipboard text="hello" />);
    expect(screen.getByRole('button', { name: /copy to clipboard/i })).toBeInTheDocument();
  });

  it('copies text to clipboard on click', async () => {
    render(<CopyToClipboard text="test content" />);
    const button = screen.getByRole('button', { name: /copy to clipboard/i });

    await act(async () => {
      fireEvent.click(button);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test content');
  });

  it('shows "Copied!" confirmation after clicking', async () => {
    render(<CopyToClipboard text="test" />);
    const button = screen.getByRole('button', { name: /copy to clipboard/i });

    await act(async () => {
      fireEvent.click(button);
    });

    expect(screen.getByText('Copied!')).toBeInTheDocument();
  });

  it('reverts to "Copy" after 3 seconds', async () => {
    render(<CopyToClipboard text="test" />);
    const button = screen.getByRole('button', { name: /copy to clipboard/i });

    await act(async () => {
      fireEvent.click(button);
    });

    expect(screen.getByText('Copied!')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.getByText('Copy')).toBeInTheDocument();
    expect(screen.queryByText('Copied!')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<CopyToClipboard text="test" className="extra" />);
    expect(container.querySelector('button')).toHaveClass('extra');
  });
});

describe('ToolPageShell', () => {
  it('renders tool name as heading', () => {
    render(
      <ToolPageShell toolName="JSON Formatter" description="Format and validate JSON">
        <div>Tool content</div>
      </ToolPageShell>
    );
    expect(screen.getByRole('heading', { name: 'JSON Formatter' })).toBeInTheDocument();
  });

  it('renders tool description', () => {
    render(
      <ToolPageShell toolName="Test Tool" description="A useful description">
        <div>Content</div>
      </ToolPageShell>
    );
    expect(screen.getByText('A useful description')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <ToolPageShell toolName="Test" description="Desc">
        <div data-testid="child">Child content</div>
      </ToolPageShell>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('includes an ad slot placeholder', () => {
    const { container } = render(
      <ToolPageShell toolName="Test" description="Desc">
        <div>Content</div>
      </ToolPageShell>
    );
    const adSlot = container.querySelector('[data-ad-slot="in-content"]');
    expect(adSlot).toBeInTheDocument();
  });
});
