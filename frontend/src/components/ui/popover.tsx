import {
  Popover as HeadlessPopover,
  PopoverButton as HeadlessPopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import React, { Fragment, createContext, useContext } from "react";

interface PopoverContextValue {
  close: () => void;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(" ");
}

export const Popover: React.FC<React.PropsWithChildren> = ({ children }) => (
  <HeadlessPopover as="div" className="relative inline-block">
    {({ close }) => (
      <PopoverContext.Provider value={{ close }}>{children}</PopoverContext.Provider>
    )}
  </HeadlessPopover>
);

export const PopoverTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof HeadlessPopoverButton>
>(({ className, children, ...props }, ref) => (
  <HeadlessPopoverButton
    ref={ref}
    type="button"
    className={cn(
      "inline-flex items-center justify-center gap-2 rounded-md border bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm",
      "hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
      "dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800",
      className
    )}
    {...props}
  >
    {children}
  </HeadlessPopoverButton>
));
PopoverTrigger.displayName = "PopoverTrigger";

export const PopoverContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof PopoverPanel>
>(({ className, children, ...props }, ref) => (
  <Transition
    as={Fragment}
    enter="transition ease-out duration-150"
    enterFrom="opacity-0 translate-y-1"
    enterTo="opacity-100 translate-y-0"
    leave="transition ease-in duration-100"
    leaveFrom="opacity-100 translate-y-0"
    leaveTo="opacity-0 translate-y-1"
  >
    <PopoverPanel
      ref={ref}
      className={cn(
        "absolute left-0 z-50 mt-2 w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-xl",
        "dark:border-gray-700 dark:bg-gray-900",
        className
      )}
      {...props}
    >
      {children}
    </PopoverPanel>
  </Transition>
));
PopoverContent.displayName = "PopoverContent";

export function usePopover() {
  const context = useContext(PopoverContext);

  if (!context) {
    throw new Error("usePopover must be used within a <Popover>");
  }

  return context;
}
