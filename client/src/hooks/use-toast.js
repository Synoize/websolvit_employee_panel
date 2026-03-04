import { toast as sonnerToast } from "sonner";

const DEFAULT_DURATION = 3000;

const resolveToastMethod = (variant) => {
  if (variant === "destructive") return sonnerToast.error;
  return sonnerToast;
};

function toast({ title, description, variant, duration = DEFAULT_DURATION, ...options } = {}) {
  const method = resolveToastMethod(variant);
  const id = method(title, { description, duration, ...options });

  return {
    id,
    dismiss: () => sonnerToast.dismiss(id),
    update: (next) => {
      sonnerToast.dismiss(id);
      return toast({ title, description, variant, duration, ...options, ...next });
    },
  };
}

function useToast() {
  return {
    toast,
  };
}

export { useToast, toast };
