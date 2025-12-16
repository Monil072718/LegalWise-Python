import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

interface StatusSelectProps {
  currentStatus: string;
  onUpdate: (newStatus: string) => void;
  options: string[];
}

export default function StatusSelect({ currentStatus, onUpdate, options }: StatusSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside both dropdown and button
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    // Close on scroll/resize to prevent detached floating element
    const handleScrollOrResize = () => setIsOpen(false);

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScrollOrResize, true);
      window.addEventListener('resize', handleScrollOrResize);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
    setIsOpen(!isOpen);
  };

  const handleSelect = (status: string) => {
    onUpdate(status);
    setIsOpen(false);
  };

  // Only render portal when open and confirming window exists (client-side)
  const dropdownContent = isOpen && typeof document !== 'undefined' ? (
    createPortal(
      <div 
        ref={dropdownRef}
        style={{ 
          position: 'absolute', 
          top: `${position.top + 4}px`, 
          left: `${position.left}px`,
          zIndex: 9999
        }}
        className="w-32 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in duration-200"
      >
        <div className="py-1">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className={`group flex w-full items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 capitalize
                ${currentStatus === option ? 'bg-gray-50 font-medium' : ''}
              `}
            >
              <span>{option}</span>
              {currentStatus === option && (
                <Check className="w-4 h-4 text-blue-600" />
              )}
            </button>
          ))}
        </div>
      </div>,
      document.body
    )
  ) : null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleDropdown}
        className={`inline-flex items-center justify-between space-x-1 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors duration-200 w-24 ${getStatusColor(currentStatus)}`}
      >
        <span className="capitalize">{currentStatus}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      {dropdownContent}
    </>
  );
}
