# Dialux

An enhanced improved polished refined polished improved optimized improved optimized optimized refined optimized improved optimized optimized dialog component library for React built on top of Radix UI with multiple variants, modern styling, and smooth animations.

## Features

- 🎨 **Modern Styling** - Beautiful, polished components with dark mode support
- 🚀 **Multiple Variants** - Standard dialogs, sheets, alerts, confirms, and stacked dialogs
- ✨ **Smooth Animations** - Powered by Motion for fluid transitions
- ♿ **Accessible** - Built on Radix UI primitives for full accessibility
- 📦 **TypeScript** - Fully typed for better developer experience
- 🎯 **Flexible** - Highly customizable with easy theming

## Installation

```bash
npm install dialux
# or
pnpm add dialux
# or
yarn add dialux
```

## Quick Start

### Basic Dialog

```tsx
import * as Dialog from "dialux";

function App() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>Open Dialog</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6">
          <Dialog.Title>Dialog Title</Dialog.Title>
          <Dialog.Description>Dialog description goes here.</Dialog.Description>
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

### Sheet/Drawer

```tsx
import * as Dialog from "dialux";

function App() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>Open Sheet</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Sheet side="right" size="md">
          <div className="p-6">
            <Dialog.Title>Side Sheet</Dialog.Title>
            <Dialog.Description>Content goes here</Dialog.Description>
          </div>
        </Dialog.Sheet>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

### Alert Dialog

```tsx
import * as Dialog from "dialux";

function App() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>Show Alert</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Alert
          title="Confirm Action"
          description="Are you sure you want to proceed?"
          confirmText="Yes, proceed"
          cancelText="Cancel"
          onConfirm={() => console.log("Confirmed")}
          onCancel={() => setOpen(false)}
          variant="default"
        />
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

### Stacked Dialogs

```tsx
import * as Dialog from "dialux";

function App() {
  const [open, setOpen] = useState(false);

  const dialogs: Dialog.Props[] = [
    {
      id: "first",
      dialog: (
        <Dialog.StackContent className="rounded-lg bg-white p-6">
          <Dialog.StackTitle>First Dialog</Dialog.StackTitle>
          <Dialog.StackAdd dialogId="second">Next</Dialog.StackAdd>
        </Dialog.StackContent>
      ),
    },
    {
      id: "second",
      dialog: (
        <Dialog.StackContent className="rounded-lg bg-white p-6">
          <Dialog.StackTitle>Second Dialog</Dialog.StackTitle>
          <Dialog.StackRemove dialogId="second">Back</Dialog.StackRemove>
        </Dialog.StackContent>
      ),
    },
  ];

  return (
    <Dialog.Root open={open} onOpenChange={setOpen} dialogs={dialogs}>
      <Dialog.Trigger dialogId="first">Open Stack</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Stack />
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

## Components

### Core Components

- `Root` - Main dialog root component
- `Trigger` - Button to trigger dialog
- `Portal` - Portal wrapper for dialog content
- `Overlay` - Backdrop overlay
- `Content` - Main dialog content container
- `Title` - Dialog title
- `Description` - Dialog description
- `Close` - Close button

### Enhanced Components

- `Sheet` - Side sheet/drawer component with configurable side and size
- `Alert` - Alert dialog with confirm/cancel actions
- `Confirm` - Confirmation dialog with optional icon
- `Stack` - Stacked dialog container
- `StackContent` - Content for stacked dialogs
- `StackTitle` - Title for stacked dialogs
- `StackDescription` - Description for stacked dialogs
- `StackAdd` - Button to add/open next dialog in stack
- `StackRemove` - Button to remove/close current dialog from stack
- `SharedItem` - Shared element for smooth transitions

## API Reference

### Sheet Props

```typescript
interface SheetProps {
  side?: "top" | "right" | "bottom" | "left";
  size?: "sm" | "md" | "lg" | "xl" | "full";
}
```

### Alert Props

```typescript
interface AlertProps {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  variant?: "default" | "destructive";
}
```

## Styling

Dialux uses Tailwind CSS classes by default, but you can customize all styling through className props. All components accept standard HTML attributes and className props for complete styling control.

## License

MIT

