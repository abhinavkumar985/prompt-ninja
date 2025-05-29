import type { SVGProps } from 'react';

// New logo from the user's HTML for the contribution page header
export function LogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32" // Default width from h-8
      height="32" // Default height from w-8
      viewBox="0 0 48 48"
      fill="currentColor" // Changed to currentColor to inherit text color
      {...props} // Spread props to allow overriding (e.g., className for size/color)
    >
      <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z"></path>
    </svg>
  );
}
