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
    expect(screen.getByText(/Hey,I'm Daniel!/i)).toBeInTheDocument();
    expect(screen.getByText(/Welcome to my/i)).toBeInTheDocument();
  });

  it('should render Portfolio heading', () => {
    render(<Welcome />);
    expect(screen.getByText('Portfolio')).toBeInTheDocument();
  });

  it('should render mobile helper text', () => {
    render(<Welcome />);
    expect(screen.getByText(/Tip: On phones, apps open full-screen/i)).toBeInTheDocument();
  });

  it('should render quick action buttons', () => {
    render(<Welcome />);
    expect(screen.getByText('Open Tech Stack')).toBeInTheDocument();
    expect(screen.getByText('Open Resume')).toBeInTheDocument();
  });

  it('should open terminal when Tech Stack button is clicked', () => {
    render(<Welcome />);
    const button = screen.getByText('Open Tech Stack');
    button.click();
    expect(mockOpenWindow).toHaveBeenCalledWith('terminal');
  });

  it('should open resume when Resume button is clicked', () => {
    render(<Welcome />);
    const button = screen.getByText('Open Resume');
    button.click();
    expect(mockOpenWindow).toHaveBeenCalledWith('resume');
  });

  it('should have proper accessibility labels', () => {
    render(<Welcome />);
    const techStackButton = screen.getByLabelText('Open Tech Stack');
    const resumeButton = screen.getByLabelText('Open Resume');
    expect(techStackButton).toBeInTheDocument();
    expect(resumeButton).toBeInTheDocument();
  });

  it('should have mobile-specific styling', () => {
    render(<Welcome />);
    const section = screen.getByText('Portfolio').closest('section');
    expect(section).toHaveClass('max-sm:pt-10');
    expect(section).toHaveClass('max-sm:px-2');
  });

  it('should render text with proper font styles', () => {
    render(<Welcome />);
    const subtitle = screen.getByText(/Hey,I'm Daniel!/i).closest('p');
    expect(subtitle).toHaveClass('max-sm:text-lg');
    
    const title = screen.getByText('Portfolio').closest('h1');
    expect(title).toHaveClass('max-sm:text-5xl');
  });
});