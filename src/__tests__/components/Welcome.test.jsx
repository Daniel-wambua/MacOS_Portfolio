import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Welcome from '../../components/Welcome.jsx';
import useWindowStore from '../../store/window.js';

vi.mock('../../store/window.js', () => ({
  default: vi.fn(),
}));

describe('Welcome Component', () => {
  let mockOpenWindow;

  beforeEach(() => {
    mockOpenWindow = vi.fn();
    useWindowStore.mockReturnValue({
      openWindow: mockOpenWindow,
    });
  });

  it('should render welcome message', () => {
    render(<Welcome />);
    // The text is rendered as individual character spans via renderText()
    // The section contains the mobile notice plus the subtitle spans
    const section = document.querySelector('#welcome');
    expect(section).toBeInTheDocument();
    // Check for individual span characters that make up the greeting
    const spans = section.querySelectorAll('span.text-3xl');
    expect(spans.length).toBeGreaterThan(0);
    // Collect text from subtitle spans
    const subtitleText = Array.from(spans).map(s => s.textContent === '\u00A0' ? ' ' : s.textContent).join('');
    expect(subtitleText).toContain("Hey,I'm Daniel");
    expect(subtitleText).toContain("Welcome to my");
  });

  it('should render Portfolio heading', () => {
    render(<Welcome />);
    const section = document.querySelector('#welcome');
    expect(section.textContent).toContain('Portfolio');
  });

  it('should render h1 element for Portfolio', () => {
    render(<Welcome />);
    const heading = document.querySelector('h1');
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toContain('Portfolio');
  });

  it('should render mobile notice text', () => {
    render(<Welcome />);
    expect(screen.getByText(/This PortFolio is designed for Desktop\/Tablet screens only/i)).toBeInTheDocument();
  });

  it('should render text with proper font styles', () => {
    render(<Welcome />);
    const heading = document.querySelector('h1');
    expect(heading).toHaveClass('max-sm:text-5xl');
  });

  it('should have section with welcome id', () => {
    render(<Welcome />);
    const section = document.querySelector('#welcome');
    expect(section).toBeInTheDocument();
    expect(section.tagName).toBe('SECTION');
  });

  it('should render subtitle paragraph', () => {
    render(<Welcome />);
    const section = document.querySelector('#welcome');
    // The subtitle paragraph has the max-sm:text-lg class directly
    // Skip the mobile notice paragraphs and find the subtitle by its ref-based structure
    const subtitleP = section.querySelector('p.max-sm\\:text-lg');
    expect(subtitleP).toBeInTheDocument();
  });

  it('should render individual character spans', () => {
    render(<Welcome />);
    const spans = document.querySelectorAll('span.font-georama');
    expect(spans.length).toBeGreaterThan(0);
  });

  it('should apply font variation settings to text spans', () => {
    render(<Welcome />);
    const spans = document.querySelectorAll('span.font-georama');
    spans.forEach(span => {
      expect(span.style.fontVariationSettings).toBeTruthy();
    });
  });
});
