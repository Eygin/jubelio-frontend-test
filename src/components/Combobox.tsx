import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CommandList } from "cmdk";
import { useEffect, useState } from "react";

export interface ComboboxType {
  value: string | number;
  label: string | number;
}

interface ComboboxProps {
  data: Array<ComboboxType>;
  className?: string;
  label: string;
  classNameButton?: string;
  onChange?: (value: string) => void;
  value?: string;
}

export function Combobox(props: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(props.value || "");

  useEffect(() => {
    if (props.value) {
      console.log("props.value", props.value);
      setValue(props.value);
    }
  }, [props.value]);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", props.classNameButton)}
        >
          {value
            ? props.data.find((data) => data.value === value)?.label
            : `Pilih ${props.label}...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className={cn("w-full p-0", props.className)}
      >
        <Command>
          <CommandInput placeholder={`Cari ${props.label}...`} />
          <CommandEmpty>Data {props.label} is empty.</CommandEmpty>
          <div className="max-h-[200px] overflow-y-auto">
            <CommandGroup>
              <CommandList>
                {props.data.map((data) => (
                  <CommandItem
                    key={data.value}
                    value={data?.value || ""}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                      if (props.onChange) {
                        props.onChange(
                          currentValue === value ? "" : currentValue,
                        );
                      }
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === data.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {data.label}
                  </CommandItem>
                ))}
              </CommandList>
            </CommandGroup>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
