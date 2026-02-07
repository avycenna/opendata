'use client';

import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { ChevronsUpDown, X, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './command';
import { Badge } from './badge';

export interface MultiSelectProps {
  options: string[]
  selected: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  disabled?: boolean
  className?: string
  maxDisplayed?: number
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No results found.',
  disabled = false,
  className,
  maxDisplayed = 2,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const toggleOption = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter(v => v !== value)
        : [...selected, value]
    );
  };

  const removeOption = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter(v => v !== value));
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label={placeholder}
          className={cn(
            'w-full justify-between h-9 text-sm font-normal',
            selected.length === 0 && 'text-muted-foreground',
            className
          )}
          disabled={disabled}
        >
          <div className="flex items-center gap-1 truncate flex-1 min-w-0">
            {selected.length === 0 ? (
              <span>{placeholder}</span>
            ) : selected.length <= maxDisplayed ? (
              <div className="flex flex-wrap gap-1">
                {selected.map(value => (
                  <Badge
                    key={value}
                    variant="secondary"
                    className="text-xs px-1.5 py-0 h-5 font-normal"
                  >
                    {value}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={(e) => removeOption(value, e)}
                    />
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5 font-normal">
                  {selected[0]}
                </Badge>
                <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5 font-normal">
                  +{selected.length - 1} more
                </Badge>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            {selected.length > 0 && (
              <X
                className="h-4 w-4 text-muted-foreground hover:text-foreground"
                onClick={clearAll}
              />
            )}
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map(option => {
                const isSelected = selected.includes(option);
                return (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => toggleOption(option)}
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <Check className="h-3 w-3" />
                    </div>
                    <span className="truncate">{option}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
