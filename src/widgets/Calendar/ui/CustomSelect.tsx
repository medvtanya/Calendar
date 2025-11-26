'use client';

import { FC, useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

type Option = {
  value: string | number;
  label: string;
};

type CustomSelectProps = {
  options: Option[];
  value: string | number;
  onChange: (value: string | number) => void;
};

export const CustomSelect: FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (newValue: string | number) => {
    onChange(newValue);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 cursor-pointer custom-select-button"
      >
        <span className="text-lg font-semibold">{selectedOption?.label}</span>
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-auto border rounded-md shadow-lg max-h-60 overflow-y-auto custom-select-dropdown">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className="px-4 py-2 text-lg cursor-pointer custom-select-option"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
