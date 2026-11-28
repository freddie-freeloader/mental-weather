import { useCallback, useMemo, useState } from "react"
import type { ReactNode } from "react"
import { archetypeSetList, getArchetypeSet, type ArchetypeSetId } from "../archetypes"
import { loadSettings, saveSettings } from "../storage"
import { ArchetypeSetContext } from "./useArchetypeSet"

export function ArchetypeSetProvider({ children }: { children: ReactNode }) {
  const [setId, setSetId] = useState<ArchetypeSetId>(() => loadSettings().archetypeSet)
  const choose = useCallback((id: ArchetypeSetId) => {
    saveSettings({ archetypeSet: id })
    setSetId(id)
  }, [])
  const reload = useCallback(() => {
    setSetId(loadSettings().archetypeSet)
  }, [])
  const set = getArchetypeSet(setId)
  const value = useMemo(
    () => ({ setId, set, sets: archetypeSetList, choose, reload }),
    [setId, set, choose, reload],
  )
  return <ArchetypeSetContext.Provider value={value}>{children}</ArchetypeSetContext.Provider>
}
