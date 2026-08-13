import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, helperText, required, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label className="font-poppins font-medium text-xs uppercase tracking-wider text-stone-500">
            {label} {required && <span className="text-accent">*</span>}
          </label>
        )}
        
        <input
          ref={ref}
          className={`w-full h-[54px] px-[20px] border rounded-full bg-white font-poppins text-sm text-primary outline-none transition-all placeholder:text-stone-400
            ${error 
              ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" 
              : "border-stone-300 focus:border-accent focus:ring-1 focus:ring-accent"
            }
            ${className}`}
          required={required}
          {...props}
        />
        
        {(error || helperText) && (
          <span className={`font-poppins text-xs ${error ? "text-red-500" : "text-stone-500"}`}>
            {error || helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
