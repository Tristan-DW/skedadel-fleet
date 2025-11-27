import React, { useState, useRef, useEffect } from 'react';

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  menuWidth?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ trigger, children, menuWidth = 'w-56' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          className={`absolute right-0 mt-2 ${menuWidth} origin-top-right bg-surface rounded-md shadow-lg ring-1 ring-border ring-opacity-5 focus:outline-none z-50 animate-fade-in-up`}
        >
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {children}
          </div>
        </div>
      )}
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(-10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export const DropdownItem: React.FC<React.PropsWithChildren<{ onClick?: () => void; }>> = ({ children, onClick }) => (
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); onClick?.(); }}
      className="flex items-center px-4 py-2 text-sm text-text-primary hover:bg-secondary transition-colors"
      role="menuitem"
    >
      {children}
    </a>
);


export default Dropdown;