import { lazy, Suspense, useEffect, useMemo, useState, type ReactNode } from "react"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { Box } from "@mui/material"
import MorningCheckIn from "./components/MorningCheckIn"
import EveningCheckIn from "./components/EveningCheckIn"
import ZiggyStardustOMeter from "./components/ZiggyStardustOMeter"
import CoffeeTab from "./components/CoffeeTab"
import WasserTab from "./components/WasserTab"
import AnimalDisplay from "./components/AnimalDisplay"
import SectionNav from "./components/SectionNav"
import Welcome from "./components/Welcome"
import { PansyMark } from "./components/PansyMark"
import { ArchetypeSetProvider } from "./components/ArchetypeSetProvider"
import { useArchetypeSet } from "./components/useArchetypeSet"
import { archetypeCopy } from "./archetypes"
import { createPansiesTheme } from "./theme"
import { THEME_KEY, WELCOME_KEY, applyInkMode, readInkMode, type InkMode } from "./branding"

const History = lazy(() => import("./components/History"))
const QuestionnaireEditor = lazy(() => import("./components/QuestionnaireEditor"))

const TAB_ANIMAL = 2

function tabLabels(archetypeTab: string): string[] {
  return [
    "Morning Check-In",
    "Evening Check-In",
    archetypeTab,
    "History",
    "Coffee",
    "Wasser",
    "Ziggy",
    "Customize",
  ]
}

function greeting(now: Date): string {
  const hour = now.getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

function todayLabel(now: Date): string {
  return now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })
}

interface TabPanelProps {
  children: ReactNode
  value: number
  index: number
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`}>
      {value === index && <Box sx={{ pt: 1 }}>{children}</Box>}
    </div>
  )
}

export default function App() {
  const [mode, setMode] = useState<InkMode>(readInkMode)
  const theme = useMemo(() => createPansiesTheme(mode), [mode])

  useEffect(() => {
    applyInkMode(mode)
    try {
      localStorage.setItem(THEME_KEY, mode)
    } catch {
      return
    }
  }, [mode])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ArchetypeSetProvider>
        <WeatherLog mode={mode} onToggleTheme={() => setMode((current) => (current === "dark" ? "light" : "dark"))} />
      </ArchetypeSetProvider>
    </ThemeProvider>
  )
}

function WeatherLog({ mode, onToggleTheme }: { mode: InkMode; onToggleTheme: () => void }) {
  const { set } = useArchetypeSet()
  const copy = archetypeCopy(set)
  const tabs = tabLabels(copy.tabLabel)
  const [currentTab, setCurrentTab] = useState(() => (new Date().getHours() >= 16 ? 1 : 0))
  const [analysisKey, setAnalysisKey] = useState(0)
  const [welcomed, setWelcomed] = useState(() => {
    try {
      return localStorage.getItem(WELCOME_KEY) === "1"
    } catch {
      return false
    }
  })
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const refresh = () => setNow(new Date())
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh()
    }
    document.addEventListener("visibilitychange", onVisible)
    const timer = window.setInterval(refresh, 60_000)
    return () => {
      document.removeEventListener("visibilitychange", onVisible)
      window.clearInterval(timer)
    }
  }, [])

  const begin = () => {
    try {
      localStorage.setItem(WELCOME_KEY, "1")
    } catch {
      // The check-in still opens for this visit.
    }
    setWelcomed(true)
  }

  const goHome = () => {
    begin()
    setCurrentTab(0)
    window.scrollTo({ top: 0 })
  }

  const handleEveningSaved = () => {
    setAnalysisKey((k) => k + 1)
    setCurrentTab(TAB_ANIMAL)
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="app">
      <header className="topbar">
        <button type="button" className="brand" onClick={goHome}>
          <PansyMark />
          <span className="brand-copy">
            <span className="brand-kicker">Ophelia's</span>
            <span className="brand-title">Pansies</span>
          </span>
        </button>
        {welcomed && (
          <SectionNav labels={tabs} current={currentTab} onSelect={setCurrentTab} />
        )}
        <button type="button" className="btn btn-ghost theme-btn" onClick={onToggleTheme}>
          {mode === "dark" ? "Light" : "Dark"}
        </button>
      </header>

      {welcomed ? (
        <>
          <p className="today">{todayLabel(now)}</p>
          <h1 className="greeting">{greeting(now)}</h1>
          <p className="lede">{copy.headerSubtitle}</p>
          <div className="screen">
            <TabPanel value={currentTab} index={0}>
              <MorningCheckIn />
            </TabPanel>
            <TabPanel value={currentTab} index={1}>
              <EveningCheckIn onSaved={handleEveningSaved} />
            </TabPanel>
            <TabPanel value={currentTab} index={2}>
              <div data-testid="animal-card">
                <AnimalDisplay refreshKey={analysisKey} />
              </div>
            </TabPanel>
            <TabPanel value={currentTab} index={3}>
              <Suspense fallback={null}>
                <History />
              </Suspense>
            </TabPanel>
            <TabPanel value={currentTab} index={4}>
              <CoffeeTab />
            </TabPanel>
            <TabPanel value={currentTab} index={5}>
              <WasserTab />
            </TabPanel>
            <TabPanel value={currentTab} index={6}>
              <ZiggyStardustOMeter />
            </TabPanel>
            <TabPanel value={currentTab} index={7}>
              <Suspense fallback={null}>
                <QuestionnaireEditor />
              </Suspense>
            </TabPanel>
          </div>
        </>
      ) : (
        <Welcome onBegin={begin} />
      )}
    </div>
  )
}
