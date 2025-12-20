import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  label: string;
  value: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: (string | SelectOption)[];
  variant?: 'status' | 'default';
  placeholder?: string;
  className?: string; // Additional classes for the button
}

export default function CustomSelect({ 
  value, 
  onChange, 
  options, 
  variant = 'default',
  placeholder = 'Select...',
  className = ''
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  // Helper to normalize options
  const normalizedOptions: SelectOption[] = options.map(opt => 
    typeof opt === 'string' ? { label: opt, value: opt } : opt
  );

  const selectedOption = normalizedOptions.find(opt => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'approved':
      case 'paid':
      case 'completed':
      case 'published':
      case 'available':
      case 'online':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'inactive':
      case 'declined':
      case 'failed':
      case 'refunded':
      case 'closed':
      case 'busy':
      case 'archived':
      case 'offline':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'pending':
      case 'open':
      case 'in-progress':
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'high':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getButtonStyles = () => {
    if (variant === 'status') {
      return `inline-flex items-center justify-between space-x-1 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors duration-200 min-w-[6rem] ${getStatusColor(value)} ${className}`;
    }
    return `w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-left text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between transition-colors duration-200 ${className}`;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

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
        width: rect.width
      });
    }
    setIsOpen(!isOpen);
  };

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  const dropdownContent = isOpen && typeof document !== 'undefined' ? (
    createPortal(
      <div 
        ref={dropdownRef}
        style={{ 
          position: 'absolute', 
          top: `${position.top + 4}px`, 
          left: `${position.left}px`,
          minWidth: variant === 'status' ? '120px' : `${position.width}px`,
          zIndex: 9999
        }}
        className="rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in duration-200 overflow-hidden max-h-60 overflow-y-auto"
      >
        <div className="py-1">
          {normalizedOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`group flex w-full items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 capitalize text-left
                ${value === option.value ? 'bg-gray-50 font-medium' : ''}
              `}
            >
              <span className={variant === 'status' ? 'capitalize' : ''}>{option.label}</span>
              {value === option.value && (
                <Check className="w-4 h-4 text-blue-600 flex-shrink-0 ml-2" />
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
        className={getButtonStyles()}
      >
        <span className={variant === 'status' ? 'capitalize' : 'truncate mr-2'}>{displayLabel}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'transform rotate-180' : ''} ${variant === 'status' ? 'w-3 h-3' : ''}`} />
      </button>
      {dropdownContent}
    </>
  );
}
