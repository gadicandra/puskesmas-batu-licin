import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDown, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavigationMenuProps } from "@/utils/element";

const NavigationMenu = React.forwardRef<HTMLDivElement, NavigationMenuProps>(
  ({ className, children, viewport, ...props }, ref) => (
    <NavigationMenuPrimitive.Root
      ref={ref}
      className={cn(
        "relative z-10 flex flex-1 items-center justify-center lg:max-w-max",
        className
      )}
      {...props}
    >
      {children}
      {/* Only render NavigationMenuViewport if viewport prop is not explicitly false */}
      {viewport !== false && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  )
);
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

const NavigationMenuList = React.forwardRef<
  HTMLUListElement,
  NavigationMenuPrimitive.NavigationMenuListProps
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn("group flex flex-1 list-none items-center justify-center space-x-1", className)}
    {...props}
  />
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

const NavigationMenuItem = React.forwardRef<
  HTMLLIElement,
  NavigationMenuPrimitive.NavigationMenuItemProps
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Item ref={ref} className={cn("relative", className)} {...props}>
    {children}
  </NavigationMenuPrimitive.Item>
));
NavigationMenuItem.displayName = NavigationMenuPrimitive.Item.displayName;

const navigationMenuTriggerStyle = cva(
  "group cursor-pointer inline-flex h-10 w-max items-center text-base justify-center rounded-lg bg-transparent text-white px-4 py-2 text-sm font-medium transition-all duration-300 ease-out hover:bg-white/20 hover:text-white hover:scale-105 hover:shadow-md focus:bg-white/20 focus:text-white focus:scale-105 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 data-[state=open]:text-white data-[state=open]:bg-white/20 data-[state=open]:scale-105 data-[state=open]:shadow-md data-[state=open]:hover:bg-white/30 data-[state=open]:focus:bg-white/30"
);

const NavigationMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  NavigationMenuPrimitive.NavigationMenuTriggerProps
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(
      navigationMenuTriggerStyle(),
      "group cursor-pointer text-white text-base transition-all duration-300 ease-out hover:text-white active:scale-95",
      className
    )}
    {...props}
  >
    {children}
    <ChevronDown
      className="relative top-px ml-1 h-3 w-3 transition-transform duration-300 ease-out group-data-[state=open]:rotate-180"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;

const NavigationMenuContent = React.forwardRef<
  HTMLDivElement,
  NavigationMenuPrimitive.NavigationMenuContentProps
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-10 data-[motion=from-start]:slide-in-from-left-10 data-[motion=to-end]:slide-out-to-right-10 data-[motion=to-start]:slide-out-to-left-10 text-white left-0 h-fit w-full rounded-xl bg-primary/95 backdrop-blur-lg p-1 transition-all duration-300 ease-out md:absolute md:w-auto lg:mt-4 lg:border lg:border-white/20 lg:p-4 lg:shadow-xl",
      className
    )}
    {...props}
  />
));
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

const NavigationMenuLink = NavigationMenuPrimitive.Link;

const NavigationMenuViewport = React.forwardRef<
  HTMLDivElement,
  NavigationMenuPrimitive.NavigationMenuViewportProps
>(({ className, ...props }, ref) => (
  <div className={cn("absolute top-full left-0 flex justify-center")}>
    <NavigationMenuPrimitive.Viewport
      className={cn(
        "origin-top-center bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 relative mt-1.5 h-(--radix-navigation-menu-viewport-height) w-full overflow-hidden rounded-md border shadow-sm md:w-(--radix-navigation-menu-viewport-width)",
        className
      )}
      ref={ref}
      {...props}
    />
  </div>
));
NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName;

const NavigationMenuIndicator = React.forwardRef<
  HTMLDivElement,
  NavigationMenuPrimitive.NavigationMenuIndicatorProps
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      "data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-1 flex h-1.5 items-end justify-center overflow-hidden",
      className
    )}
    {...props}
  >
    <div className="bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md" />
  </NavigationMenuPrimitive.Indicator>
));
NavigationMenuIndicator.displayName = NavigationMenuPrimitive.Indicator.displayName;

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
};