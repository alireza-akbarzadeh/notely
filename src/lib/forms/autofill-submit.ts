import type { FormEvent } from "react";
import type {
  FieldValues,
  Path,
  PathValue,
  UseFormReturn,
} from "react-hook-form";

/**
 * iOS Safari (and some password managers) can paint autofilled values into the
 * DOM without firing React `onChange`. Controlled RHF state then stays empty,
 * so submit validation fails and the button looks "dead".
 */
export function syncAutofillValues<T extends FieldValues>(
  form: UseFormReturn<T>,
  formElement: HTMLFormElement,
) {
  const data = new FormData(formElement);
  const values = form.getValues();

  for (const key of Object.keys(values) as Array<Path<T>>) {
    const current = values[key];
    if (typeof current !== "string") continue;

    const raw = data.get(key);
    if (typeof raw === "string" && raw !== current) {
      form.setValue(key, raw as PathValue<T, Path<T>>, {
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }
}

export function autofillSafeSubmit<T extends FieldValues>(
  form: UseFormReturn<T>,
  onValid: Parameters<UseFormReturn<T>["handleSubmit"]>[0],
  onInvalid?: Parameters<UseFormReturn<T>["handleSubmit"]>[1],
) {
  return (event: FormEvent<HTMLFormElement>) => {
    syncAutofillValues(form, event.currentTarget);
    return form.handleSubmit(onValid, onInvalid)(event);
  };
}

export function scrollToFirstInvalidField() {
  const firstInvalid = document.querySelector<HTMLElement>(
    '[data-invalid="true"]',
  );
  firstInvalid?.scrollIntoView({ behavior: "smooth", block: "center" });
  const focusable = firstInvalid?.querySelector<HTMLElement>(
    "input, textarea, select, button",
  );
  focusable?.focus({ preventScroll: true });
}
