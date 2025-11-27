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

  beforeEach(() => {
    mockCloseWindow = vi.fn();
    useWindowStore.mockReturnValue({
      closeWindow: mockCloseWindow,
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
    expect(closeButton).toHaveClass('bg-[#ff5f56]');
  });

  it('should render minimize button (decorative)', () => {
    render(<WindowControls target="finder" />);
    
    const minimizeButton = screen.getByLabelText('Minimize (decorative)');
    expect(minimizeButton).toBeInTheDocument();
    expect(minimizeButton).toHaveClass('bg-[#ffbd2e]');
    expect(minimizeButton).toBeDisabled();
  });

  it('should render maximize button (decorative)', () => {
    render(<WindowControls target="finder" />);
    
    const maximizeButton = screen.getByLabelText('Maximize (decorative)');
    expect(maximizeButton).toBeInTheDocument();
    expect(maximizeButton).toHaveClass('bg-[#27c93f]');
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
    expect(screen.getByLabelText('Minimize (decorative)')).toBeInTheDocument();
    expect(screen.getByLabelText('Maximize (decorative)')).toBeInTheDocument();
  });

  it('should render buttons in correct order (red, yellow, green)', () => {
    render(<WindowControls target="finder" />);
    
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveClass('bg-[#ff5f56]'); // red
    expect(buttons[1]).toHaveClass('bg-[#ffbd2e]'); // yellow
    expect(buttons[2]).toHaveClass('bg-[#27c93f]'); // green
  });

  it('should not propagate events from decorative buttons', () => {
    render(<WindowControls target="finder" />);
    
    const minimizeButton = screen.getByLabelText('Minimize (decorative)');
    const maximizeButton = screen.getByLabelText('Maximize (decorative)');
    
    // These should not trigger any action
    fireEvent.click(minimizeButton);
    fireEvent.click(maximizeButton);
    
    expect(mockCloseWindow).not.toHaveBeenCalled();
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
      expect(button).toHaveClass('rounded-full');
    });
  });
});