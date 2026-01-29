import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"

export interface NavigationMenuProps
    extends React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root> {
    viewport?: boolean
}
