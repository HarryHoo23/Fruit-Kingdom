import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        fruit: ["Nunito", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      colors: {
        fruit: {
          cream: "#f7f3df",
          paper: "#f8f8f0",
          parchment: "#fff9e6",
          card: "#faf8f2",
          cardBorder: "#d4c4a8",
          cardDashed: "#e8dcc8",
          input: "#fffdf3",
          inputFocus: "#19c8b9",
          primary: "#19a89d",
          text: "#725d42",
          brown: "#794f27",
          soft: "#8a7b66",
          muted: "#7c5734",
          border: "#aaa69d",
          borderLight: "#e8e2d6",
          switch: "#d4c9b4",
          switchBorder: "#c4b89e",
          sky: "#b7c6e5",
          grass: "#7dc395",
          grassMap: "#9bd987",
          grassLight: "#80d7b0",
          apple: "#fc736d",
          appleLight: "#fde4e8",
          strawberry: "#f8a6b2",
          strawberryLight: "#fff0f4",
          banana: "#f7cd67",
          bananaLight: "#fff8dc",
          path: "#f6db90",
          kiwi: "#8ac68a",
          kiwiLight: "#e8f5e8",
          grape: "#b77dee",
          grapeLight: "#f0e8ff",
          orange: "#e59266",
          orangeLight: "#fff0e8",
          teal: "#82d5bb",
          tealLight: "#e8faf5",
          coconut: "#9a835a",
          coconutLight: "#f4ecd8",
          lake: "#8ad1c7",
          river: "#7ed5db",
          riverDeep: "#71b5da",
          blue: "#889df0",
          blueLight: "#e8edff",
          danger: "#e05a5a",
          dangerDark: "#c94444",
          lift: "#bdaea0",
          transparentInk: "#3d3428",
          shadowLeaf: "#518559",
          shadowWood: "#725d42",
          shadowPath: "#9a835a",
          dot: "#c4b89e",
        },
        bedtime: {
          night: "#52629e",
          background: "#171f4b",
          sky: "#414885",
          purple: "#626ea8",
          border: "#4f5a91",
          moon: "#fff9dc",
          star: "#fff9d8",
        },
      },
      borderRadius: {
        fruit: "20px",
        "fruit-lg": "30px",
        "fruit-xl": "32px",
        blob: "42% 58% 48% 52% / 54% 42% 58% 46%",
        river: "54% 46% 48% 52%",
        "region-blob": "36% 64% 49% 51% / 48% 38% 62% 52%",
      },
      boxShadow: {
        "fruit-sm": "0 2px 4px rgb(61 52 40 / 0.06)",
        fruit: "0 3px 10px rgb(61 52 40 / 0.1)",
        "fruit-lg": "0 8px 24px rgb(61 52 40 / 0.14)",
        "button-lift": "0 5px 0 theme(colors.fruit.lift)",
        "button-hover": "0 6px 0 theme(colors.fruit.lift)",
        "button-press": "0 1px 0 theme(colors.fruit.lift)",
        "danger-lift": "0 5px 0 theme(colors.fruit.dangerDark)",
        "danger-press": "0 1px 0 theme(colors.fruit.dangerDark)",
        "brand-lift": "0 4px 0 theme(colors.fruit.lift)",
        "character-lift": "0 6px 0 theme(colors.fruit.lift)",
        "map-soft": "0 28px 70px rgb(61 52 40 / 0.22), inset 0 -18px 0 rgb(81 133 89 / 0.14)",
        "region-art": "inset 0 -16px 0 rgb(114 93 66 / 0.12), 0 18px 42px rgb(61 52 40 / 0.16)",
        "river-ring": "inset 0 0 0 8px rgb(255 255 255 / 0.18)",
        "map-path": "inset 0 -4px 0 rgb(154 131 90 / 0.12)",
        "pin-low": "0 7px 0 rgb(114 93 66 / 0.28)",
        "pin-high": "0 11px 0 rgb(114 93 66 / 0.24)",
        "sticker-lift": "0 7px 0 rgb(114 93 66 / 0.22)",
        "switch-inner": "inset 0 2px 4px rgb(114 93 66 / 0.15)",
        "input-focus": "0 0 0 3px rgb(25 200 185 / 0.15)",
      },
      dropShadow: {
        cloud: "0 5px 0 rgb(114 93 66 / 0.08)",
        moon: "0 0 18px rgb(255 255 220 / 0.55)",
        emoji: "0 12px 0 rgb(114 93 66 / 0.18)",
      },
      textShadow: {
        fruit: "0 5px 1px rgb(0 0 0 / 0.34)",
        brand: "0 2px 0 rgb(255 255 255 / 0.7)",
        switch: "0 1px 1px rgb(0 0 0 / 0.13)",
      },
      backgroundImage: {
        "fruit-shell":
          "url('/src/assets/img/home_bg.webp'), linear-gradient(theme(colors.fruit.grass), theme(colors.fruit.grass))",
        "fruit-shell-bedtime":
          "linear-gradient(180deg, rgb(23 31 75 / 0.65), rgb(65 72 133 / 0.5)), url('/src/assets/img/home_bg.webp'), linear-gradient(theme(colors.bedtime.night), theme(colors.bedtime.night))",
        "animal-dots":
          "radial-gradient(circle, rgb(196 184 158 / 0.15) 1.5px, transparent 1.5px), radial-gradient(circle, rgb(255 255 255 / 0.18) 1px, transparent 1px)",
        "map-land":
          "radial-gradient(circle at 22% 24%, rgb(255 255 255 / 0.35) 0 10%, transparent 11%), radial-gradient(circle at 72% 62%, rgb(255 255 255 / 0.26) 0 8%, transparent 9%), linear-gradient(140deg, theme(colors.fruit.grassMap), theme(colors.fruit.grassLight) 45%, theme(colors.fruit.banana) 46% 54%, theme(colors.fruit.lake) 55%, theme(colors.fruit.kiwi))",
        "map-noise":
          "radial-gradient(circle, rgb(196 184 158 / 0.18) 1.5px, transparent 1.5px), radial-gradient(circle, rgb(255 255 255 / 0.12) 1px, transparent 1px)",
        "map-river": "linear-gradient(180deg, rgb(126 213 219 / 0.92), rgb(113 181 218 / 0.72))",
        "region-apple":
          "linear-gradient(135deg, theme(colors.fruit.appleLight), rgb(255 249 230 / 0.88))",
        "region-strawberry":
          "linear-gradient(135deg, theme(colors.fruit.strawberryLight), rgb(255 249 230 / 0.88))",
        "region-banana":
          "linear-gradient(135deg, theme(colors.fruit.bananaLight), rgb(255 249 230 / 0.88))",
        "region-watermelon":
          "linear-gradient(135deg, theme(colors.fruit.tealLight), rgb(255 249 230 / 0.88))",
        "region-grape":
          "linear-gradient(135deg, theme(colors.fruit.grapeLight), rgb(255 249 230 / 0.88))",
        "region-kiwi":
          "linear-gradient(135deg, theme(colors.fruit.kiwiLight), rgb(255 249 230 / 0.88))",
        "region-orange":
          "linear-gradient(135deg, theme(colors.fruit.orangeLight), rgb(255 249 230 / 0.88))",
        "region-coconut":
          "linear-gradient(135deg, theme(colors.fruit.coconutLight), rgb(255 249 230 / 0.88))",
        "region-art-apple":
          "radial-gradient(circle at 28% 22%, rgb(255 255 255 / 0.42) 0 10%, transparent 11%), linear-gradient(135deg, theme(colors.fruit.apple), theme(colors.fruit.banana))",
        "region-art-strawberry":
          "radial-gradient(circle at 28% 22%, rgb(255 255 255 / 0.42) 0 10%, transparent 11%), linear-gradient(135deg, theme(colors.fruit.strawberry), theme(colors.fruit.banana))",
        "region-art-banana":
          "radial-gradient(circle at 28% 22%, rgb(255 255 255 / 0.42) 0 10%, transparent 11%), linear-gradient(135deg, theme(colors.fruit.banana), theme(colors.fruit.banana))",
        "region-art-watermelon":
          "radial-gradient(circle at 28% 22%, rgb(255 255 255 / 0.42) 0 10%, transparent 11%), linear-gradient(135deg, theme(colors.fruit.teal), theme(colors.fruit.banana))",
        "region-art-grape":
          "radial-gradient(circle at 28% 22%, rgb(255 255 255 / 0.42) 0 10%, transparent 11%), linear-gradient(135deg, theme(colors.fruit.grape), theme(colors.fruit.banana))",
        "region-art-kiwi":
          "radial-gradient(circle at 28% 22%, rgb(255 255 255 / 0.42) 0 10%, transparent 11%), linear-gradient(135deg, theme(colors.fruit.kiwi), theme(colors.fruit.banana))",
        "region-art-orange":
          "radial-gradient(circle at 28% 22%, rgb(255 255 255 / 0.42) 0 10%, transparent 11%), linear-gradient(135deg, theme(colors.fruit.orange), theme(colors.fruit.banana))",
        "region-art-coconut":
          "radial-gradient(circle at 28% 22%, rgb(255 255 255 / 0.42) 0 10%, transparent 11%), linear-gradient(135deg, theme(colors.fruit.coconut), theme(colors.fruit.banana))",
      },
      backgroundSize: {
        "fruit-shell": "auto, auto",
        "fruit-shell-bedtime": "auto, auto, auto",
        "animal-dots": "28px 28px, 14px 14px",
      },
      backgroundPosition: {
        "animal-dots": "0 0, 7px 7px",
      },
      keyframes: {
        bgScroll: {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "320px 320px" },
        },
        cloudDrift: {
          from: { transform: "translateX(-12vw)" },
          to: { transform: "translateX(112vw)" },
        },
        floatGentle: {
          "0%, 100%": { translate: "0 0" },
          "50%": { translate: "0 -9px" },
        },
        popIn: {
          from: { opacity: "0", scale: "0.82" },
          to: { opacity: "1", scale: "1" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.35", transform: "scale(0.82)" },
          "50%": { opacity: "1", transform: "scale(1.16)" },
        },
      },
      animation: {
        "bg-scroll": "bgScroll 80s linear infinite",
        "bg-scroll-slow": "bgScroll 120s linear infinite",
        "cloud-drift": "cloudDrift 26s linear infinite",
        "cloud-drift-slow": "cloudDrift 32s linear infinite",
        "cloud-drift-slower": "cloudDrift 38s linear infinite",
        "float-gentle": "floatGentle 4.5s ease-in-out infinite",
        "float-moon": "floatGentle 5s ease-in-out infinite",
        pin: "popIn 0.45s ease both, floatGentle 4.5s ease-in-out infinite",
        twinkle: "twinkle 2.6s ease-in-out infinite",
      },
    },
  },
  plugins: [
    ({ matchUtilities, theme }) => {
      matchUtilities(
        {
          "text-shadow": (value) => ({
            textShadow: value,
          }),
        },
        { values: theme("textShadow") },
      );
    },
  ],
} satisfies Config;
