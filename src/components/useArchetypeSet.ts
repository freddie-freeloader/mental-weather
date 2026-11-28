import { createContext, useContext } from "react"
import type { ArchetypeSet, ArchetypeSetId } from "../archetypes"

export interface ArchetypeSetContextValue {
  setId: ArchetypeSetId
  set: ArchetypeSet
  sets: readonly ArchetypeSet[]
  choose: (id: ArchetypeSetId) => void
}

export const ArchetypeSetContext = createContext<ArchetypeSetContextValue | null>(null)

export function useArchetypeSet(): ArchetypeSetContextValue {
  const value = useContext(ArchetypeSetContext)
  if (!value) throw new Error("useArchetypeSet must be used within ArchetypeSetProvider")
  return value
}
