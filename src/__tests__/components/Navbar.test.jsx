import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../../components/Navbar.jsx';
import useWindowStore from '../../store/window.js';

vi.mock('../../store/window.js', () => ({
  default: vi.fn(),
}));

vi.mock('dayjs', () => ({
  default: vi.fn(() => ({
    format: vi.fn(() => 'Mon Jan 1 12:00 PM'),
  })),
}));

describe('Navbar Component', () => {
  let mockOpenWindow;

  beforeEach(() => {
    mockOpenWindow = vi.fn();
    useWindowStore.mockReturnValue({
      openWindow: mockOpenWindow,
    });
  });

  it('should render the logo', () => {
    render(<Navbar />);
    
    const logo = screen.getByAltText('logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/images/logo.svg');
  });

  it('should render the portfolio title', () => {
    render(<Navbar />);
    
    expect(screen.getByText("Daniel's Portfolio")).toBeInTheDocument();
  });

  it('should render navigation links', () => {
    render(<Navbar />);
    
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('Resume')).toBeInTheDocument();
  });

  it('should call openWindow when nav link is clicked', () => {
    render(<Navbar />);
    
    fireEvent.click(screen.getByText('Projects'));
    expect(mockOpenWindow).toHaveBeenCalledWith('finder');
    
    mockOpenWindow.mockClear();
    
    fireEvent.click(screen.getByText('Contact'));
    expect(mockOpenWindow).toHaveBeenCalledWith('contact');
    
    mockOpenWindow.mockClear();
    
    fireEvent.click(screen.getByText('Resume'));
    expect(mockOpenWindow).toHaveBeenCalledWith('resume');
  });

  it('should render nav icons', () => {
    render(<Navbar />);
    
    const icons = screen.getAllByAltText(/icon-\d+/);
    expect(icons.length).toBeGreaterThan(0);
  });

  it('should display current time', () => {
    render(<Navbar />);
    
    const timeElement = screen.getByText('Mon Jan 1 12:00 PM');
    expect(timeElement).toBeInTheDocument();
    expect(timeElement.tagName).toBe('TIME');
  });

  it('should render mobile menu button', () => {
    render(<Navbar />);
    
    const menuButton = screen.getByText('Menu');
    expect(menuButton).toBeInTheDocument();
  });

  it('should open finder when mobile menu is clicked', () => {
    render(<Navbar />);
    
    const menuButton = screen.getByText('Menu');
    fireEvent.click(menuButton);
    
    expect(mockOpenWindow).toHaveBeenCalledWith('finder');
  });

  it('should have proper responsive classes on mobile menu', () => {
    render(<Navbar />);
    
    const menuButton = screen.getByText('Menu');
    expect(menuButton).toHaveClass('sm:hidden');
  });

  it('should render all nav links with proper structure', () => {
    render(<Navbar />);
    
    const navLinks = ['Projects', 'Contact', 'Resume'];
    navLinks.forEach(linkText => {
      const link = screen.getByText(linkText);
      expect(link.tagName).toBe('P');
      expect(link.parentElement.tagName).toBe('LI');
    });
  });
});