import React, { useState, useEffect } from "react";
import { Input } from "./Input";

interface CurrencyInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> {
  value: number;
  onChange: (value: number) => void;
}

export function CurrencyInput({
  value,
  onChange,
  ...props
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState("");

  // Format number to IDR string
  const formatValue = (val: number) => {
    if (val === 0 && !displayValue) return "";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(val)
      .replace(/\s/g, " "); // Ensure spaces are consistent
  };

  useEffect(() => {
    // Only update display value from prop if it's different to avoid cursor jumping issues
    // or if the parsed current display value doesn't match the new prop value
    if (value !== undefined) {
      if (value === 0) {
        setDisplayValue("");
        return;
      }
      setDisplayValue(formatValue(value));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Remove non-digit characters
    const numericString = inputValue.replace(/\D/g, "");

    // Parse to number
    const newValue = numericString ? parseInt(numericString, 10) : 0;

    // Update parent
    onChange(newValue);

    // Update local display immediately for responsiveness
    if (newValue === 0) {
      setDisplayValue("");
    } else {
      // Manually format to avoid the useEffect delay which might cause jumping
      // formatting: add Rp and dots
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(newValue);
      setDisplayValue(formatted);
    }
  };

  return (
    <Input
      {...props}
      type="text"
      value={displayValue}
      onChange={handleChange}
    />
  );
}
