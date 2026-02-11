import { InputHTMLAttributes, forwardRef } from 'react'

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full px-4 py-2.5 rounded-xl bg-white border border-[#E8E3DE] text-[#2C2C2C] placeholder-[#B5B0A8] focus:outline-none focus:border-[#E07862] focus:ring-1 focus:ring-[#E07862]/30 transition-colors text-sm shadow-warm-sm ${className}`}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'
export default Input
