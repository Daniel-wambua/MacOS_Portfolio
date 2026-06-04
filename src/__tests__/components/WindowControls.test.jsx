import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import WindowControls from '../../components/WindowControls.jsx';
import useWindowStore from '../../store/window.js';

// Mock the store
vi.mock('../../store/window.js', () => ({
  default: vi.fn(),
}));

describe('WindowControls Component', () => {
  let mockCloseWindow;
  let mockMinimizeWindow;

  beforeEach(() => {
    mockCloseWindow = vi.fn();
    mockMinimizeWindow = vi.fn();
    useWindowStore.mockReturnValue({
      closeWindow: mockCloseWindow,
      minimizeWindow: mockMinimizeWindow,
    });
  });

  it('should render three control buttons', () => {
    render(<WindowControls target="finder" />);
    
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
  });

  it('should render close button with correct styles', () => {
    render(<WindowControls target="finder" />);
    
    const closeButton = screen.getByLabelText('Close');
    expect(closeButton).toBeInTheDocument();
    // The color class is on the inner span, not the button itself
    const span = closeButton.querySelector('span');
    expect(span).toHaveClass('bg-[#ff5f56]');
  });

  it('should render minimize button as functional', () => {
    render(<WindowControls target="finder" />);
    
    const minimizeButton = screen.getByLabelText('Minimize');
    expect(minimizeButton).toBeInTheDocument();
    const span = minimizeButton.querySelector('span');
    expect(span).toHaveClass('bg-[#ffbd2e]');
    expect(minimizeButton).not.toBeDisabled();
  });

  it('should render maximize button (decorative)', () => {
    render(<WindowControls target="finder" />);
    
    const maximizeButton = screen.getByLabelText('Maximize (decorative)');
    expect(maximizeButton).toBeInTheDocument();
    const span = maximizeButton.querySelector('span');
    expect(span).toHaveClass('bg-[#27c93f]');
    expect(maximizeButton).toBeDisabled();
  });

  it('should call closeWindow when close button is clicked', () => {
    render(<WindowControls target="finder" />);
    
    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);
    
    expect(mockCloseWindow).toHaveBeenCalledTimes(1);
    expect(mockCloseWindow).toHaveBeenCalledWith('finder');
  });

  it('should work with different window targets', () => {
    const { rerender } = render(<WindowControls target="terminal" />);
    
    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);
    expect(mockCloseWindow).toHaveBeenCalledWith('terminal');
    
    mockCloseWindow.mockClear();
    
    rerender(<WindowControls target="safari" />);
    fireEvent.click(closeButton);
    expect(mockCloseWindow).toHaveBeenCalledWith('safari');
  });

  it('should have proper accessibility attributes', () => {
    render(<WindowControls target="finder" />);
    
    expect(screen.getByLabelText('Close')).toBeInTheDocument();
    expect(screen.getByLabelText('Minimize')).toBeInTheDocument();
    expect(screen.getByLabelText('Maximize (decorative)')).toBeInTheDocument();
  });

  it('should render buttons in correct order (red, yellow, green)', () => {
    render(<WindowControls target="finder" />);
    
    const buttons = screen.getAllByRole('button');
    // Colors are on inner spans
    expect(buttons[0].querySelector('span')).toHaveClass('bg-[#ff5f56]'); // red
    expect(buttons[1].querySelector('span')).toHaveClass('bg-[#ffbd2e]'); // yellow
    expect(buttons[2].querySelector('span')).toHaveClass('bg-[#27c93f]'); // green
  });

  it('should call minimizeWindow when minimize button is clicked', () => {
    render(<WindowControls target="finder" />);
    
    const minimizeButton = screen.getByLabelText('Minimize');
    fireEvent.click(minimizeButton);
    
    expect(mockMinimizeWindow).toHaveBeenCalledWith('finder');
  });

  it('should have hover and active states', () => {
    render(<WindowControls target="finder" />);
    
    const closeButton = screen.getByLabelText('Close');
    expect(closeButton).toHaveClass('active:scale-95');
  });

  it('should have consistent button sizes', () => {
    render(<WindowControls target="finder" />);
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      // The rounded-full class is on the inner span
      const span = button.querySelector('span');
      expect(span).toHaveClass('rounded-full');
    });
  });
});
