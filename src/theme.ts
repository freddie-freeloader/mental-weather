import { createTheme, type PaletteMode, type Theme } from "@mui/material/styles"

export const FONT_SANS = '"Outfit", "Avenir Next", "Segoe UI", sans-serif'
export const FONT_SERIF = '"Fraunces", "Iowan Old Style", Palatino, "Palatino Linotype", Georgia, serif'

interface Ink {
  paper: string
  sheet: string
  ink: string
  inkSoft: string
  line: string
  moss: string
  mossDeep: string
  onMoss: string
  wax: string
  waxDeep: string
  onWax: string
  danger: string
  dangerBg: string
  success: string
  successBg: string
  infoBg: string
  focus: string
  nav: string
  wait: string
  washSage: string
  washBlush: string
  shadow: string
}

const darkInk: Ink = {
  paper: "#141c18",
  sheet: "#1c2621",
  ink: "#f6f1e6",
  inkSoft: "#c9d4cb",
  line: "#6d8176",
  moss: "#347556",
  mossDeep: "#214a36",
  onMoss: "#f4f7f2",
  wax: "#a34d56",
  waxDeep: "#7c3840",
  onWax: "#fff6f4",
  danger: "#f3c2bc",
  dangerBg: "#3a2426",
  success: "#d5eadc",
  successBg: "#1a3328",
  infoBg: "#24302b",
  focus: "#d5ead0",
  nav: "#24362d",
  wait: "#e2c27a",
  washSage: "rgba(120, 168, 140, 0.18)",
  washBlush: "rgba(180, 110, 110, 0.14)",
  shadow: "rgba(0, 0, 0, 0.35)",
}

const lightInk: Ink = {
  paper: "#f6f1e6",
  sheet: "#fffaf4",
  ink: "#1c2820",
  inkSoft: "#3e5146",
  line: "#8a7d6c",
  moss: "#1f4d38",
  mossDeep: "#173c2c",
  onMoss: "#f7f4ec",
  wax: "#7a2e36",
  waxDeep: "#5c2228",
  onWax: "#fff8f5",
  danger: "#7a2e36",
  dangerBg: "#f8e4e0",
  success: "#1c4634",
  successBg: "#e4f0e7",
  infoBg: "#efe8dc",
  focus: "#1a4030",
  nav: "#e3eee6",
  wait: "#8a5a12",
  washSage: "rgba(47, 107, 78, 0.16)",
  washBlush: "rgba(138, 62, 68, 0.1)",
  shadow: "rgba(60, 40, 20, 0.12)",
}

const focusRing = (color: string) => ({
  outline: `3px solid ${color}`,
  outlineOffset: 3,
})

export function createPansiesTheme(mode: PaletteMode): Theme {
  const c = mode === "light" ? lightInk : darkInk
  return createTheme({
    palette: {
      mode,
      primary: { main: c.moss, dark: c.mossDeep, light: c.nav, contrastText: c.onMoss },
      secondary: { main: c.wax, dark: c.waxDeep, light: c.dangerBg, contrastText: c.onWax },
      background: { default: c.paper, paper: c.sheet },
      text: { primary: c.ink, secondary: c.inkSoft, disabled: c.inkSoft },
      divider: c.line,
      error: { main: c.danger, contrastText: mode === "light" ? c.onWax : c.ink },
      success: { main: c.success, contrastText: mode === "light" ? c.onMoss : c.ink },
      warning: { main: c.wait, contrastText: mode === "light" ? c.onWax : "#1c2820" },
      info: { main: c.moss, contrastText: c.onMoss },
    },
    shape: { borderRadius: 16 },
    typography: {
      fontFamily: FONT_SANS,
      fontSize: 16,
      htmlFontSize: 16,
      h1: { fontFamily: FONT_SERIF, fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1.08, fontSize: "clamp(2.15rem, 4.6vw, 3.5rem)" },
      h2: { fontFamily: FONT_SERIF, fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1.08, fontSize: "1.55rem" },
      h3: { fontFamily: FONT_SERIF, fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1.15, fontSize: "1.85rem" },
      h4: { fontFamily: FONT_SERIF, fontWeight: 500, letterSpacing: "-0.02em", fontSize: "1.45rem" },
      h5: { fontFamily: FONT_SERIF, fontWeight: 500, fontSize: "1.25rem" },
      h6: { fontFamily: FONT_SERIF, fontWeight: 500, fontSize: "1.05rem" },
      body1: { fontSize: "1rem", lineHeight: 1.55 },
      body2: { fontSize: "0.95rem", lineHeight: 1.55 },
      button: { fontWeight: 600, textTransform: "none", fontSize: "0.95rem" },
      subtitle1: { fontFamily: FONT_SERIF, fontStyle: "italic", fontWeight: 500 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            color: c.ink,
            backgroundColor: c.paper,
            backgroundImage: `radial-gradient(880px 460px at -8% -12%, ${c.washSage}, transparent 58%), radial-gradient(720px 420px at 108% -8%, ${c.washBlush}, transparent 52%)`,
          },
        },
      },
      MuiButtonBase: {
        styleOverrides: {
          root: {
            "&.Mui-focusVisible": focusRing(c.focus),
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            textTransform: "none",
            fontWeight: 600,
            minHeight: 44,
            paddingInline: "0.95rem",
            "&.seal-button": {
              display: "grid",
              justifyItems: "center",
              gap: "0.55rem",
              width: "auto",
              minWidth: 0,
              height: "auto",
              margin: "0.4rem auto 0",
              padding: "0.2rem",
              border: 0,
              borderRadius: "1.4rem",
              backgroundColor: "transparent",
              color: c.ink,
              boxShadow: "none",
              "&:hover": { backgroundColor: "transparent", boxShadow: "none" },
              "&.Mui-disabled": { backgroundColor: "transparent", color: c.inkSoft },
            },
          },
          outlined: {
            borderColor: c.line,
            color: c.ink,
            "&:hover": { borderColor: c.moss, backgroundColor: c.nav },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: { color: c.ink },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backgroundColor: c.sheet,
            color: c.ink,
            border: `1px solid ${c.line}`,
            borderRadius: "1.35rem",
            boxShadow: `0 12px 32px ${c.shadow}`,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: { borderRadius: "1.35rem" },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: "0.95rem",
            backgroundColor: c.paper,
            "& .MuiOutlinedInput-notchedOutline": { borderColor: c.line },
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: c.moss },
            "&.Mui-focused": { ...focusRing(c.focus) },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: c.moss, borderWidth: 2 },
          },
          input: { fontSize: 16 },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: c.inkSoft,
            "&.Mui-focused": { color: c.moss },
          },
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          root: { color: c.inkSoft },
        },
      },
      MuiSlider: {
        styleOverrides: {
          root: { color: c.moss },
          thumb: {
            width: 22,
            height: 22,
            backgroundColor: c.moss,
            border: `2px solid ${c.sheet}`,
            "&.Mui-focusVisible": focusRing(c.focus),
          },
          track: { height: 8, border: "none" },
          rail: { height: 8, opacity: 1, backgroundColor: c.line },
          valueLabel: { backgroundColor: c.moss, color: c.onMoss, borderRadius: 8 },
          markLabel: { color: c.inkSoft },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 999, fontWeight: 650, borderColor: c.line },
        },
      },
      MuiAlert: {
        styleOverrides: {
          colorSuccess: {
            backgroundColor: c.successBg,
            color: c.success,
            "& .MuiAlert-icon": { color: c.success },
          },
          colorError: {
            backgroundColor: c.dangerBg,
            color: c.danger,
            "& .MuiAlert-icon": { color: c.danger },
          },
          colorInfo: {
            backgroundColor: c.infoBg,
            color: c.ink,
            "& .MuiAlert-icon": { color: c.moss },
          },
          colorWarning: {
            backgroundColor: c.infoBg,
            color: c.ink,
            "& .MuiAlert-icon": { color: c.wait },
          },
        },
      },
      MuiSnackbarContent: {
        styleOverrides: {
          root: {
            backgroundColor: c.sheet,
            color: c.ink,
            border: `1px solid ${c.line}`,
            borderRadius: "1rem",
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: { backgroundColor: c.nav, borderRadius: 999 },
          bar: { backgroundColor: c.moss, borderRadius: 999 },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            borderColor: c.line,
            color: c.ink,
            textTransform: "none",
            minHeight: 44,
            "&.Mui-selected": {
              backgroundColor: c.moss,
              color: c.onMoss,
              "&:hover": { backgroundColor: c.mossDeep },
            },
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: { borderColor: c.line },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: { color: c.moss },
        },
      },
    },
  })
}
