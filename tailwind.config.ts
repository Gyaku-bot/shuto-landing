import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'warm-sm': '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)',
        'warm': '0 2px 8px rgba(0,0,0,0.06)',
        'warm-md': '0 4px 16px rgba(0,0,0,0.08)',
        'warm-lg': '0 8px 32px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [typography],
};

export default config;
