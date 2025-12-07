import React, { useMemo } from "react";
import {
  Apple,
  BadgePercent,
  Beef,
  Beer,
  Cake,
  Carrot,
  CupSoda,
  Fish,
  Milk,
  ShoppingBasket,
  ShoppingCart,
  Utensils,
} from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger, usePopover } from "./ui/popover";

export interface IconPickerProps {
  value: string | null;
  onChange: (iconName: string | null) => void;
}

type IconOption = {
  name: string;
  label: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const iconOptions: IconOption[] = [
  { name: "Apple", label: "Apple", Icon: Apple },
  { name: "CupSoda", label: "Cup Soda", Icon: CupSoda },
  { name: "Carrot", label: "Carrot", Icon: Carrot },
  { name: "Beef", label: "Beef", Icon: Beef },
  { name: "Fish", label: "Fish", Icon: Fish },
  { name: "Cake", label: "Cake", Icon: Cake },
  { name: "ShoppingCart", label: "Carrito", Icon: ShoppingCart },
  { name: "Beer", label: "Beer", Icon: Beer },
  { name: "Milk", label: "Milk", Icon: Milk },
  { name: "ShoppingBasket", label: "Basket", Icon: ShoppingBasket },
  { name: "Utensils", label: "Utensilios", Icon: Utensils },
  { name: "BadgePercent", label: "Descuento", Icon: BadgePercent },
];

function IconGridButton({
  option,
  isSelected,
  onSelect,
}: {
  option: IconOption;
  isSelected: boolean;
  onSelect: (name: string | null) => void;
}) {
  const { close } = usePopover();

  const handleSelect = () => {
    onSelect(option.name);
    close();
  };

  return (
    <button
      type="button"
      onClick={handleSelect}
      className={`flex flex-col items-center gap-2 rounded-md border px-3 py-2 text-sm transition
        ${
          isSelected
            ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950/40 dark:text-blue-100"
            : "border-transparent bg-gray-50 text-gray-700 hover:border-gray-200 hover:bg-white dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        }
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
    >
      <option.Icon className="h-6 w-6" aria-hidden="true" />
      <span className="text-xs font-medium">{option.label}</span>
    </button>
  );
}

function NoneGridButton({ isSelected, onSelect }: { isSelected: boolean; onSelect: (name: string | null) => void }) {
  const { close } = usePopover();

  const handleSelect = () => {
    onSelect(null);
    close();
  };

  return (
    <button
      type="button"
      onClick={handleSelect}
      className={`flex flex-col items-center gap-2 rounded-md border px-3 py-2 text-sm transition
        ${
          isSelected
            ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950/40 dark:text-blue-100"
            : "border-transparent bg-gray-50 text-gray-700 hover:border-gray-200 hover:bg-white dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        }
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-700 dark:bg-gray-700 dark:text-gray-100">
        Ø
      </span>
      <span className="text-xs font-medium">Ninguno</span>
    </button>
  );
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const selectedOption = useMemo(() => iconOptions.find((option) => option.name === value) || null, [value]);

  return (
    <Popover>
      <PopoverTrigger aria-label="Seleccionar icono" className="w-full justify-between">
        <div className="flex items-center gap-3">
          {selectedOption ? (
            <selectedOption.Icon className="h-5 w-5" aria-hidden="true" />
          ) : (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-[10px] font-semibold uppercase text-gray-600 dark:bg-gray-700 dark:text-gray-100">
              <span>?</span>
            </span>
          )}
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {selectedOption ? selectedOption.label : "Elegir icono"}
          </span>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">{value ? "Cambiar" : "Seleccionar"}</span>
      </PopoverTrigger>
      <PopoverContent>
        <div className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Elige un icono</div>
        <div className="grid grid-cols-4 gap-3">
          <NoneGridButton isSelected={value === null} onSelect={onChange} />
          {iconOptions.map((option) => (
            <IconGridButton
              key={option.name}
              option={option}
              isSelected={value === option.name}
              onSelect={onChange}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function IconPickerFormExample() {
  const [icon, setIcon] = React.useState<string | null>(null);

  return (
    <form className="space-y-3">
      <label className="flex flex-col gap-2 text-sm font-medium text-gray-900 dark:text-gray-100">
        Icono del producto
        <IconPicker value={icon} onChange={setIcon} />
      </label>
      <div className="text-xs text-gray-600 dark:text-gray-300">Icono seleccionado: {icon ?? "Ninguno"}</div>
    </form>
  );
}
