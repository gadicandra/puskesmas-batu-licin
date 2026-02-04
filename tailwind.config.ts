import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                avenir: ["Avenir", "system-ui", "-apple-system", "sans-serif"],
                "avenir-light": ["Avenir", "system-ui", "-apple-system", "sans-serif"],
                "avenir-book": ["Avenir", "system-ui", "-apple-system", "sans-serif"],
                "avenir-regular": ["Avenir", "system-ui", "-apple-system", "sans-serif"],
                "avenir-heavy": ["Avenir", "system-ui", "-apple-system", "sans-serif"],
                "avenir-black": ["Avenir", "system-ui", "-apple-system", "sans-serif"],
            },
            fontWeight: {
                light: "300",
                book: "400",
                regular: "500",
                heavy: "700",
                black: "900",
            },
            colors: {
                base: "#EFF1EB",
                primary: {
                    DEFAULT: "#233115",
                    50: "#f4f6f7",
                    100: "#e2e7eb",
                    200: "#c8d1d9",
                    300: "#a1b0be",
                    400: "#738899",
                    500: "#586d7f",
                    600: "#4b5c6b",
                    700: "#414e5a",
                    800: "#3a444d",
                    900: "#233115",
                    950: "#1f2936",
                },
                secondary: {
                    DEFAULT: "#697644",
                    50: "#eefbf3",
                    100: "#d6f5e1",
                    200: "#b0eac8",
                    300: "#7cd9a7",
                    400: "#45c182",
                    500: "#697644",
                    600: "#188550",
                    700: "#136a42",
                    800: "#125436",
                    900: "#10452e",
                    950: "#08271a",
                },
                tertiary: {
                    DEFAULT: "#6B7584",
                    50: "#f6f7f8",
                    100: "#ebedef",
                    200: "#d3d7dc",
                    300: "#adb5be",
                    400: "#818c99",
                    500: "#6B7584",
                    600: "#555d6a",
                    700: "#464c56",
                    800: "#3d424a",
                    900: "#363a40",
                    950: "#24262a",
                },
            },
        },
    },
    plugins: [],
};

export default config;
