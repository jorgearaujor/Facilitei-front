import { Toaster } from "react-hot-toast";

export function ThemedToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "rgb(var(--color-surface))",
          color: "rgb(var(--color-text))",
          border: "1px solid rgb(var(--color-primary))",
        },
        success: {
          iconTheme: {
            primary: "rgb(var(--color-accent))",
            secondary: "rgb(var(--color-surface))",
          },
        },
        error: {
          iconTheme: {
            primary: "#EF4444",
            secondary: "rgb(var(--color-surface))",
          },
        },
      }}
    />
  );
}
