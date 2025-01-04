"use client";

import * as RadixDialogPrimitive from "@radix-ui/react-dialog";
import type { Primitive } from "@radix-ui/react-primitive";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { AnimatePresence, motion } from "motion/react";
import type { HTMLMotionProps } from "motion/react";
import React, { useId } from "react";
// Enhanced accessibility

interface DialogProps {
  id: string;
  open?: boolean;
  dialog: React.ReactElement;
}

interface DialogContextProps {
  id: {
    title: string;
    description: string;
    content: string;
  };
  dialogs: DialogProps[];
  openDialog: (id: string) => void;
  closeDialog: (id: string) => void;
  clearDialogs: () => void;
}

const DialogContext = React.createContext<DialogContextProps | undefined>(undefined);

const useDialogContext = (): DialogContextProps => {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error("useDialogContext must be used within a DialogProvider");
  }
  return context;
};

interface DialogProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  dialogs?: DialogProps[];
}

const DialogProvider: React.FC<DialogProviderProps> = ({ children, dialogs: initialDialogs }) => {
  const [dialogs, setDialogs] = React.useState<DialogProps[]>(
    initialDialogs?.map((dialog) => ({ ...dialog, open: dialog.open ?? false })) || [],
  );

  const openDialog = (id: string) => {
    setDialogs((prevDialogs) =>
      prevDialogs.map((dialog) =>
        dialog.id === id
          ? {
              ...dialog,
              open: true,
            }
          : dialog,
      ),
    );
  };

  const closeDialog = (id: string) => {
    setDialogs((prevDialogs) =>
      prevDialogs.map((dialog) =>
        dialog.id === id
          ? {
              ...dialog,
              open: false,
            }
          : dialog,
      ),
    );
  };

  const clearDialogs = () => {
    if (dialogs) {
      setDialogs((prevDialogs) =>
        prevDialogs.map((dialog) => ({
          ...dialog,
          open: false,
        })),
      );
    }
  };

  return (
    <DialogContext.Provider
      value={{
        dialogs,
        openDialog,
        closeDialog,
        clearDialogs,
        id: {
          title: `dialux-${useId()}`,
          description: `dialux-${useId()}`,
          content: `dialux-${useId()}`,
        },
      }}
    >
      {children}
    </DialogContext.Provider>
  );
};

type DialogRootProps = RadixDialogPrimitive.DialogProps & {
  dialogs?: DialogProps[];
};

const DialogRoot: React.FC<DialogRootProps> = ({ children, dialogs, onOpenChange, ...props }) => {
  return (
    <DialogProvider dialogs={dialogs}>
      <DialogRootContent onOpenChange={onOpenChange} {...props}>
        {children}
      </DialogRootContent>
    </DialogProvider>
  );
};

const DialogRootContent: React.FC<DialogRootProps> = ({ children, onOpenChange, ...props }) => {
  const { clearDialogs } = useDialogContext();

  const handleOpenChange = (open: boolean) => {
    onOpenChange?.(open);
    if (!open) {
      clearDialogs();
    }
  };

  return (
    <RadixDialogPrimitive.Root onOpenChange={handleOpenChange} {...props}>
      {children}
    </RadixDialogPrimitive.Root>
  );
};

interface DialogTriggerProps extends RadixDialogPrimitive.DialogTriggerProps {
  dialogId?: string;
}

const DialogTrigger: React.FC<DialogTriggerProps> = ({ dialogId, children, ...props }) => {
  const { openDialog } = useDialogContext();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (props.onClick) {
      props.onClick(event);
    }
    if (dialogId) {
      openDialog(dialogId);
    }
  };

  return (
    <RadixDialogPrimitive.Trigger {...props} onClick={handleClick}>
      {children}
    </RadixDialogPrimitive.Trigger>
  );
};

type DialogPortalProps = RadixDialogPrimitive.DialogPortalProps;

const DialogPortal: React.FC<DialogPortalProps> = ({ children, ...props }) => {
  return <RadixDialogPrimitive.Portal {...props}>{children}</RadixDialogPrimitive.Portal>;
};

type DialogOverlayProps = RadixDialogPrimitive.DialogOverlayProps;

const DialogOverlay: React.FC<DialogOverlayProps> = ({ children, ...props }) => {
  return <RadixDialogPrimitive.Overlay {...props}>{children}</RadixDialogPrimitive.Overlay>;
};

type DialogContentProps = RadixDialogPrimitive.DialogContentProps;

const DialogContent: React.FC<DialogContentProps> = ({ children, ...props }) => {
  return <RadixDialogPrimitive.Content {...props}>{children}</RadixDialogPrimitive.Content>;
};

type DialogCloseProps = RadixDialogPrimitive.DialogCloseProps;

const DialogClose: React.FC<DialogCloseProps> = ({ children, ...props }) => {
  return <RadixDialogPrimitive.Close {...props}>{children}</RadixDialogPrimitive.Close>;
};

type DialogTitleProps = RadixDialogPrimitive.DialogTitleProps;

const DialogTitle: React.FC<DialogTitleProps> = ({ children, ...props }) => {
  return <RadixDialogPrimitive.Title {...props}>{children}</RadixDialogPrimitive.Title>;
};

type DialogDescriptionProps = RadixDialogPrimitive.DialogDescriptionProps;

const DialogDescription: React.FC<DialogDescriptionProps> = ({ children, ...props }) => {
  return <RadixDialogPrimitive.Description {...props}>{children}</RadixDialogPrimitive.Description>;
};

type DialogSharedItemProps = HTMLMotionProps<"div">;

const DialogSharedItem: React.FC<DialogSharedItemProps> = ({ children, ...props }) => {
  return <motion.div {...props}>{children}</motion.div>;
};

interface DialogStackProps extends RadixDialogPrimitive.DialogContentProps {
  offsetY?: number;
  offsetScale?: number;
  offsetOpacity?: number;
  initial?: HTMLMotionProps<"div">["initial"];
  animate?: HTMLMotionProps<"div">["animate"];
  exit?: HTMLMotionProps<"div">["exit"];
  transition?: HTMLMotionProps<"div">["transition"];
}

const DialogStack: React.FC<DialogStackProps> = ({
  offsetY = 24,
  offsetScale = 0.05,
  offsetOpacity = 0.33,
  ...props
}) => {
  const { dialogs, clearDialogs } = useDialogContext();
  const openDialogs = dialogs.filter((dialog) => dialog.open);

  return (
    <motion.div
      key="dialog-stack"
      style={{
        display: "flex",
        position: "fixed",
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
        justifyContent: "center",
        alignItems: "center",
      }}
      initial={props.initial}
      animate={props.animate}
      exit={props.exit}
      transition={props.transition}
    >
      <DialogContent
        style={{
          display: "contents",
        }}
        onPointerDownOutside={() => {
          clearDialogs();
        }}
        {...props}
      >
        <VisuallyHidden.Root>
          <DialogTitle>Title</DialogTitle>
          <DialogDescription>Description</DialogDescription>
        </VisuallyHidden.Root>
        <AnimatePresence initial={false}>
          {openDialogs.map((dialog, index) => {
            const position = openDialogs.length - index - 1;
            return (
              <motion.div
                key={dialog.id}
                id={dialog.id}
                initial={{
                  scale: 1,
                  y: offsetY,
                  opacity: 0,
                }}
                animate={{
                  y: position * -offsetY,
                  zIndex: openDialogs.length - position,
                  scale: 1 - offsetScale * position,
                  opacity: 1 - offsetOpacity * position,
                }}
                exit={{
                  scale: 1,
                  y: offsetY * 2,
                  opacity: 0,
                }}
                transition={{
                  ease: [0.19, 1, 0.22, 1],
                  duration: 0.6,
                }}
                style={{
                  position: "absolute",
                  listStyle: "none",
                }}
              >
                {dialog.dialog}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </DialogContent>
    </motion.div>
  );
};

type DialogStackContentProps = React.ComponentPropsWithoutRef<typeof Primitive.h2> &
  React.HTMLAttributes<HTMLHeadingElement>;
const DialogStackContent: React.FC<DialogStackContentProps> = ({ children, ...props }) => {
  const { id } = useDialogContext();
  return (
    <div id={id.content} aria-labelledby={id.title} aria-describedby={id.description} {...props}>
      {children}
    </div>
  );
};

type DialogStackTitleProps = React.ComponentPropsWithoutRef<typeof Primitive.h2> &
  React.HTMLAttributes<HTMLHeadingElement>;
const DialogStackTitle: React.FC<DialogStackTitleProps> = ({ children, ...props }) => {
  const { id } = useDialogContext();
  return (
    <h2 id={id.title} {...props}>
      {children}
    </h2>
  );
};

type DialogStackDescriptionProps = React.ComponentPropsWithoutRef<typeof Primitive.h2> &
  React.HTMLAttributes<HTMLHeadingElement>;
const DialogStackDescription: React.FC<DialogStackDescriptionProps> = ({ children, ...props }) => {
  const { id } = useDialogContext();
  return (
    <p id={id.description} {...props}>
      {children}
    </p>
  );
};

interface DialogStackRemoveProps extends HTMLMotionProps<"button"> {
  dialogId: string;
}

const DialogStackRemove: React.FC<DialogStackRemoveProps> = ({ dialogId, children, ...props }) => {
  const { closeDialog } = useDialogContext();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (props.onClick) {
      props.onClick(event);
    }
    closeDialog(dialogId);
  };

  return (
    <motion.button type="button" {...props} onClick={handleClick}>
      {children}
    </motion.button>
  );
};

interface DialogStackAddProps extends HTMLMotionProps<"button"> {
  dialogId: string;
}

const DialogStackAdd: React.FC<DialogStackAddProps> = ({ dialogId, children, ...props }) => {
  const { openDialog } = useDialogContext();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (props.onClick) {
      props.onClick(event);
    }
    openDialog(dialogId);
  };

  return (
    <motion.button type="button" {...props} onClick={handleClick}>
      {children}
    </motion.button>
  );
};

// Enhanced Sheet/Drawer Component
type DialogSheetSide = "top" | "right" | "bottom" | "left";

interface DialogSheetProps extends RadixDialogPrimitive.DialogContentProps {
  side?: DialogSheetSide;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const DialogSheet: React.FC<DialogSheetProps> = ({ side = "right", size = "md", children, className, ...props }) => {
  const sizeMap: Record<NonNullable<DialogSheetProps["size"]>, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full",
  };

  const sideMap: Record<DialogSheetSide, {
    initial: { x?: string; y?: string; opacity: number };
    animate: { x?: number; y?: number; opacity: number };
    exit: { x?: string; y?: string; opacity: number };
    className: string;
  }> = {
    top: {
      initial: { y: "-100%", opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: "-100%", opacity: 0 },
      className: "inset-x-0 top-0 rounded-b-2xl",
    },
    right: {
      initial: { x: "100%", opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: "100%", opacity: 0 },
      className: "inset-y-0 right-0 rounded-l-2xl",
    },
    bottom: {
      initial: { y: "100%", opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: "100%", opacity: 0 },
      className: "inset-x-0 bottom-0 rounded-t-2xl",
    },
    left: {
      initial: { x: "-100%", opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: "-100%", opacity: 0 },
      className: "inset-y-0 left-0 rounded-r-2xl",
    },
  };

  const sideConfig = sideMap[side];

  return (
    <DialogContent
      {...props}
      className={`fixed ${sideConfig.className} ${sizeMap[size]} bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-800 ${className || ""}`}
    >
      <motion.div
        initial={sideConfig.initial}
        animate={sideConfig.animate}
        exit={sideConfig.exit}
        transition={{
          ease: [0.19, 1, 0.22, 1],
          duration: 0.4,
        }}
        className="h-full w-full"
      >
        {children}
      </motion.div>
    </DialogContent>
  );
};

// Alert Dialog Component
interface DialogAlertProps extends RadixDialogPrimitive.DialogContentProps {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  variant?: "default" | "destructive";
}

const DialogAlert: React.FC<DialogAlertProps> = ({
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "default",
  className,
  ...props
}) => {
  const variantStyles: Record<NonNullable<DialogAlertProps["variant"]>, string> = {
    default: "bg-blue-500 hover:bg-blue-600 text-white",
    destructive: "bg-red-500 hover:bg-red-600 text-white",
  };

  return (
    <DialogContent
      className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4 ${className || ""}`}
      {...props}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</DialogTitle>
        {description && (
          <DialogDescription className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {description}
          </DialogDescription>
        )}
        <div className="flex justify-end gap-3 mt-6">
          {onCancel && (
            <DialogClose
              onClick={onCancel}
              className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {cancelText}
            </DialogClose>
          )}
          <DialogClose
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg ${variantStyles[variant]} transition-colors`}
          >
            {confirmText}
          </DialogClose>
        </div>
      </motion.div>
    </DialogContent>
  );
};

// Confirm Dialog Component
interface DialogConfirmProps extends DialogAlertProps {
  icon?: React.ReactNode;
}

const DialogConfirm: React.FC<DialogConfirmProps> = ({ icon, className, ...props }) => {
  const variantStyles: Record<NonNullable<DialogConfirmProps["variant"]>, string> = {
    default: "bg-blue-500 hover:bg-blue-600 text-white",
    destructive: "bg-red-500 hover:bg-red-600 text-white",
  };

  return (
    <DialogContent
      className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4 ${className || ""}`}
      {...props}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="text-center"
      >
        {icon && <div className="flex justify-center mb-4">{icon}</div>}
        <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">{props.title}</DialogTitle>
        {props.description && (
          <DialogDescription className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {props.description}
          </DialogDescription>
        )}
        <div className="flex justify-center gap-3 mt-6">
          {props.onCancel && (
            <DialogClose
              onClick={props.onCancel}
              className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {props.cancelText || "Cancel"}
            </DialogClose>
          )}
          <DialogClose
            onClick={props.onConfirm}
            className={`px-4 py-2 rounded-lg ${variantStyles[props.variant || "default"]} transition-colors`}
          >
            {props.confirmText || "Confirm"}
          </DialogClose>
        </div>
      </motion.div>
    </DialogContent>
  );
};

export {
  DialogRoot as Root,
  DialogTrigger as Trigger,
  DialogPortal as Portal,
  DialogOverlay as Overlay,
  DialogStack as Stack,
  DialogStackContent as StackContent,
  DialogStackTitle as StackTitle,
  DialogStackDescription as StackDescription,
  DialogStackRemove as StackRemove,
  DialogStackAdd as StackAdd,
  DialogContent as Content,
  DialogClose as Close,
  DialogTitle as Title,
  DialogDescription as Description,
  DialogSharedItem as SharedItem,
  DialogSheet as Sheet,
  DialogAlert as Alert,
  DialogConfirm as Confirm,
};

export type {
  DialogProps as Props,
  DialogRootProps as RootProps,
  DialogTriggerProps as TriggerProps,
  DialogPortalProps as PortalProps,
  DialogOverlayProps as OverlayProps,
  DialogStackProps as StackProps,
  DialogStackContentProps as StackContentProps,
  DialogStackTitleProps as StackTitleProps,
  DialogStackDescriptionProps as StackDescriptionProps,
  DialogStackRemoveProps as StackRemoveProps,
  DialogStackAddProps as StackAddProps,
  DialogContentProps as ContentProps,
  DialogCloseProps as CloseProps,
  DialogTitleProps as TitleProps,
  DialogDescriptionProps as DescriptionProps,
  DialogSharedItemProps as SharedItemProps,
  DialogSheetProps as SheetProps,
  DialogAlertProps as AlertProps,
  DialogConfirmProps as ConfirmProps,
  DialogSheetSide as SheetSide,
};

