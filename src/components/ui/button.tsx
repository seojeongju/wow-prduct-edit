import * as React from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'accent';
    size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'default', ...props }, ref) => {

        const variants = {
            default: "bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90 shadow-sm",
            outline: "border border-neutral-200 bg-white hover:bg-neutral-100 hover:text-neutral-900",
            ghost: "hover:bg-neutral-100 hover:text-neutral-900",
            secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80",
            accent: "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
        }

        const sizes = {
            default: "h-11 px-4 py-2",
            sm: "h-9 rounded-md px-3",
            lg: "h-14 rounded-md px-8 text-base",
            icon: "h-10 w-10",
        }

        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
                    variants[variant],
                    sizes[size],
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
