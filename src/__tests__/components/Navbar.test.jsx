import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../../components/Navbar.jsx';
import useWindowStore from '../../store/window.js';
import useSpotlightStore from '../../store/spotlight.js';
import usePanelsStore from '../../store/panels.js';

vi.mock('../../store/window.js', () => ({
  default: vi.fn(),
}));

vi.mock('../../store/spotlight.js', () => ({
  default: vi.fn(),
}));

vi.mock('../../store/panels.js', () => ({
  default: vi.fn(),
}));

vi.mock('../../components/NotificationCenterPanel.jsx', () => ({
  default: () => <div data-testid="notification-center-panel" />,
}));

vi.mock('../../components/OwnerDetailsPanel.jsx', () => ({
  default: () => <div data-testid="owner-details-panel" />,
}));

vi.mock('dayjs', () => ({
  default: vi.fn(() => ({
    format: vi.fn(() => 'Mon Jan 1 12:00 PM'),
  })),
}));

describe('Navbar Component', () => {
  let mockOpenWindow;
  let mockToggleSpotlight;
  let mockToggleNotificationCenter;
  let mockToggleOwnerDetails;

  beforeEach(() => {
    mockOpenWindow = vi.fn();
    mockToggleSpotlight = vi.fn();
    mockToggleNotificationCenter = vi.fn();
    mockToggleOwnerDetails = vi.fn();
    useWindowStore.mockReturnValue({
      openWindow: mockOpenWindow,
    });
    useSpotlightStore.mockReturnValue({
      toggleSpotlight: mockToggleSpotlight,
    });
    usePanelsStore.mockReturnValue({
      toggleNotificationCenter: mockToggleNotificationCenter,
      toggleOwnerDetails: mockToggleOwnerDetails,
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

  it('should render all nav links with proper structure', () => {
    render(<Navbar />);
    
    const navLinks = ['Projects', 'Contact', 'Resume'];
    navLinks.forEach(linkText => {
      const link = screen.getByText(linkText);
      expect(link.tagName).toBe('P');
      expect(link.parentElement.tagName).toBe('LI');
    });
  });

  it('should render four nav icons', () => {
    render(<Navbar />);
    
    const icons = screen.getAllByAltText(/icon-\d+/);
    expect(icons).toHaveLength(4);
  });

  it('should render icons with correct sources', () => {
    render(<Navbar />);
    
    const icon1 = screen.getByAltText('icon-1');
    expect(icon1).toHaveAttribute('src', '/icons/wifi.svg');
    
    const icon2 = screen.getByAltText('icon-2');
    expect(icon2).toHaveAttribute('src', '/icons/search.svg');
  });

  it('should have icon-hover class on nav icons', () => {
    render(<Navbar />);
    
    const icons = screen.getAllByAltText(/icon-\d+/);
    icons.forEach(icon => {
      expect(icon).toHaveClass('icon-hover');
    });
  });

  it('should call toggleSpotlight when search icon (id:2) is clicked', () => {
    render(<Navbar />);
    
    const searchIcon = screen.getByAltText('icon-2');
    fireEvent.click(searchIcon.parentElement);
    expect(mockToggleSpotlight).toHaveBeenCalledTimes(1);
  });

  it('should call toggleOwnerDetails when user icon (id:3) is clicked', () => {
    render(<Navbar />);
    
    const userIcon = screen.getByAltText('icon-3');
    fireEvent.click(userIcon.parentElement);
    expect(mockToggleOwnerDetails).toHaveBeenCalledTimes(1);
  });

  it('should call toggleNotificationCenter when mode icon (id:4) is clicked', () => {
    render(<Navbar />);
    
    const modeIcon = screen.getByAltText('icon-4');
    fireEvent.click(modeIcon.parentElement);
    expect(mockToggleNotificationCenter).toHaveBeenCalledTimes(1);
  });

  it('should render data-panel-trigger attribute on user icon li', () => {
    render(<Navbar />);
    
    const userIcon = screen.getByAltText('icon-3');
    expect(userIcon.parentElement).toHaveAttribute('data-panel-trigger', 'owner-details');
  });

  it('should render NotificationCenterPanel and OwnerDetailsPanel', () => {
    render(<Navbar />);
    
    expect(screen.getByTestId('notification-center-panel')).toBeInTheDocument();
    expect(screen.getByTestId('owner-details-panel')).toBeInTheDocument();
  });
});
