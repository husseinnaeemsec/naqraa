import * as React from 'react';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from './context-menu';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from './popover';

export interface ContextMenuAction {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    variant?: 'default' | 'destructive';
    separator?: boolean; // Add separator after this item
    disabled?: boolean;
}

interface CustomContextMenuProps {
    children: React.ReactNode;
    actions?: ContextMenuAction[];
    className?: string;
    trigger?: React.ReactNode; // Optional trigger element (button/icon) to show menu on click
}

/**
 * CustomContextMenu - A wrapper component that adds context menu functionality
 * 
 * @param children - Content to wrap with context menu
 * @param actions - Array of menu actions. If not provided, renders children normally
 * @param className - Optional CSS classes for the wrapper
 * @param trigger - Optional trigger element. When provided, it appears alongside children and opens menu on click
 * 
 * @example
 * // With context menu only (right-click)
 * <CustomContextMenu
 *   actions={[
 *     { label: 'Edit', icon: <Edit />, onClick: handleEdit },
 *     { label: 'Delete', icon: <Trash />, onClick: handleDelete, variant: 'destructive' }
 *   ]}
 * >
 *   <div>Right click me!</div>
 * </CustomContextMenu>
 * 
 * // With both context menu AND trigger button
 * <CustomContextMenu
 *   actions={[...]}
 *   trigger={<button><MoreVertical /></button>}
 * >
 *   <div>Right click me OR click the button!</div>
 * </CustomContextMenu>
 */
export default function CustomContextMenu({ 
    children, 
    actions, 
    className,
    trigger
}: CustomContextMenuProps) {
    const [popoverOpen, setPopoverOpen] = React.useState(false);

    // If no actions provided, render children without menu
    if (!actions || actions.length === 0) {
        return <div className={className}>{children}</div>;
    }

    const menuItems = actions.map((action, index) => (
        <React.Fragment key={index}>
            <button
                onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    action.onClick();
                    setPopoverOpen(false);
                }}
                disabled={action.disabled}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-sm transition-colors text-left cursor-pointer
                    ${action.variant === 'destructive' 
                        ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20' 
                        : 'text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                `}
            >
                {action.icon && <span>{action.icon}</span>}
                {action.label}
            </button>
            {action.separator && index < actions.length - 1 && (
                <div className="h-px bg-slate-200 dark:bg-slate-700 my-1" />
            )}
        </React.Fragment>
    ));

    // If trigger is provided, wrap content with both context menu AND popover trigger
    if (trigger) {
        return (
            <ContextMenu>
                <ContextMenuTrigger asChild>
                    <div className={className}>
                        {children}
                        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                            <PopoverTrigger asChild>
                                {trigger}
                            </PopoverTrigger>
                            <PopoverContent 
                                className="w-56 p-1" 
                                align="end"
                                side="bottom"
                                sideOffset={5}
                            >
                                {menuItems}
                            </PopoverContent>
                        </Popover>
                    </div>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-56">
                    {actions.map((action, index) => (
                        <React.Fragment key={index}>
                            <ContextMenuItem
                                onClick={action.onClick}
                                variant={action.variant}
                                disabled={action.disabled}
                                className="cursor-pointer"
                            >
                                {action.icon && (
                                    <span className="mr-2">{action.icon}</span>
                                )}
                                {action.label}
                            </ContextMenuItem>
                            {action.separator && index < actions.length - 1 && (
                                <ContextMenuSeparator />
                            )}
                        </React.Fragment>
                    ))}
                </ContextMenuContent>
            </ContextMenu>
        );
    }

    // Default: use context menu only (right-click)
    return (
        <ContextMenu>
            <ContextMenuTrigger className={className}>
                {children}
            </ContextMenuTrigger>
            <ContextMenuContent className="w-56">
                {actions.map((action, index) => (
                    <React.Fragment key={index}>
                        <ContextMenuItem
                            onClick={action.onClick}
                            variant={action.variant}
                            disabled={action.disabled}
                            className="cursor-pointer"
                        >
                            {action.icon && (
                                <span className="mr-2">{action.icon}</span>
                            )}
                            {action.label}
                        </ContextMenuItem>
                        {action.separator && index < actions.length - 1 && (
                            <ContextMenuSeparator />
                        )}
                    </React.Fragment>
                ))}
            </ContextMenuContent>
        </ContextMenu>
    );
}


