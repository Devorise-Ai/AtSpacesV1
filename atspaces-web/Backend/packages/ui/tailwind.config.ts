import type { Config } from "tailwindcss";

const sharedConfig: Pick<Config, "theme"> = {
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    DEFAULT: "var(--primary)",
                    hover: "var(--primary-hover)",
                    foreground: "var(--primary-foreground)",
                },
                card: {
                    DEFAULT: "var(--card)",
                    foreground: "var(--card-foreground)",
                },
                border: "var(--border)",
                muted: {
                    DEFAULT: "var(--muted)",
                    foreground: "var(--muted-foreground)",
                },
            },
            fontFamily: {
                sans: ["var(--font-sans)"],
            },
        },
    },
};

export default sharedConfig;
