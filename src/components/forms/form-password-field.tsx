"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface FormPasswordFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  autoComplete?: string;
}

export function FormPasswordField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  autoComplete,
}: FormPasswordFieldProps<T>) {
  const [visible, setVisible] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid || undefined}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          <div className="relative">
            <Input
              id={field.name}
              name={field.name}
              ref={field.ref}
              type={visible ? "text" : "password"}
              value={field.value ?? ""}
              onValueChange={field.onChange}
              onBlur={field.onBlur}
              placeholder={placeholder}
              autoComplete={autoComplete}
              aria-invalid={fieldState.invalid}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="absolute top-1/2 right-1 z-10 -translate-y-1/2 touch-manipulation text-muted-foreground hover:text-foreground"
              onClick={() => setVisible((current) => !current)}
              aria-label={visible ? "Hide password" : "Show password"}
            >
              {visible ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}
