import type { Config } from "tailwindcss"

const config = {
	content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px"
			}
		},
		extend: {
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" }
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" }
				}
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out"
			},
			colors: {
				"custom-background": {
					100: "#16161a"
				},
				"custom-text": {
					100: "#fffffe",
					200: "#94a1b2"
				},
				"custom-button": {
					100: "#7f5af0"
				}
			}
		}
	},
	plugins: [require("tailwindcss-animate")]
} satisfies Config

export default config
