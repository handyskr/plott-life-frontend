import clsx from 'clsx';
import { JSX } from 'preact';
import { forwardRef } from 'preact/compat';

export type InputProps = JSX.IntrinsicElements['input'] & {
  icon?: any; // 정해지면 수정
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, error, icon, ...props }, ref) => {
  return (
    <div className="form-control">
      <label className="input flex items-center">
        <input
          ref={ref}
          {...props}
          className={clsx('grow placeholder:text-gray-400', error && 'border-red-500 focus:border-red-500', className)}
        />
        {icon && <span className="cursor-pointer">{icon}</span>}
      </label>
      {error && <span className="mt-1 text-sm text-red-500">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
