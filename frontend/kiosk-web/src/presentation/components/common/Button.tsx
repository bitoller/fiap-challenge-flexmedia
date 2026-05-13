import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  isLoading = false,
  type = 'button',
  disabled,
  className = '',
  ...props
}) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  const disabledClass = disabled || isLoading ? 'disabled' : '';

  return (
    <button
      type={type}
      className={`${baseClass} ${variantClass} ${sizeClass} ${disabledClass} ${className}`.trim()}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
      {children}
    </button>
  );
};
