import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import NotFound from '../../components/NotFound.jsx';

describe('NotFound Component', () => {
  it('should render 404 heading', () => {
    render(<NotFound />);
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('should render error message', () => {
    render(<NotFound />);
    expect(screen.getByText(/Lost in the system/i)).toBeInTheDocument();
    expect(screen.getByText(/This page doesn't exist/i)).toBeInTheDocument();
  });

  it('should render return link', () => {
    render(<NotFound />);
    const link = screen.getByText('Return to Desktop');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });

  it('should render detective emoji', () => {
    render(<NotFound />);
    expect(screen.getByText('🕵️‍♂️')).toBeInTheDocument();
  });

  it('should render traffic light indicators', () => {
    const { container } = render(<NotFound />);
    const indicators = container.querySelectorAll('.rounded-full');
    expect(indicators.length).toBe(3);
    expect(indicators[0]).toHaveClass('bg-red-500');
    expect(indicators[1]).toHaveClass('bg-yellow-400');
    expect(indicators[2]).toHaveClass('bg-green-500');
  });

  it('should have proper styling', () => {
    const { container } = render(<NotFound />);
    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass('flex');
    expect(mainDiv).toHaveClass('flex-col');
    expect(mainDiv).toHaveClass('items-center');
    expect(mainDiv).toHaveClass('justify-center');
  });

  it('should have accessible link with hover state', () => {
    render(<NotFound />);
    const link = screen.getByText('Return to Desktop');
    expect(link).toHaveClass('text-blue-500');
    expect(link).toHaveClass('hover:underline');
  });
});