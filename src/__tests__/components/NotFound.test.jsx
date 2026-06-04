import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import NotFound from '../../components/NotFound.jsx';

// Mock GSAP to prevent animation side effects in tests
vi.mock('gsap', () => ({
  default: {
    fromTo: vi.fn(),
    to: vi.fn(),
  },
}));

describe('NotFound Component', () => {
  it('should render 404 heading', () => {
    render(<NotFound />);
    expect(screen.getByText('404 Error')).toBeInTheDocument();
  });

  it('should render error message', () => {
    render(<NotFound />);
    expect(screen.getByText(/Page Lost in Cyberspace/i)).toBeInTheDocument();
    expect(screen.getByText(/Whoops/i)).toBeInTheDocument();
  });

  it('should render return link', () => {
    render(<NotFound />);
    const link = screen.getByText('Back to Home');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', '/');
  });

  it('should have proper styling', () => {
    const { container } = render(<NotFound />);
    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass('fixed');
    expect(mainDiv).toHaveClass('inset-0');
    expect(mainDiv).toHaveClass('flex');
    expect(mainDiv).toHaveClass('items-center');
    expect(mainDiv).toHaveClass('justify-center');
  });

  it('should render subtitle with gradient text', () => {
    render(<NotFound />);
    const subtitle = screen.getByText('Page Lost in Cyberspace');
    expect(subtitle).toHaveClass('bg-clip-text');
    expect(subtitle).toHaveClass('text-transparent');
  });

  it('should have accessible link', () => {
    render(<NotFound />);
    const link = screen.getByText('Back to Home').closest('a');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });

  it('should render error code footer text', () => {
    render(<NotFound />);
    expect(screen.getByText(/Error Code: 404/i)).toBeInTheDocument();
  });
});
