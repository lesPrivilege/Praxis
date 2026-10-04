// The demo identity a scenario's requests are made as. Each scenario keeps its own.
import { createContext, useContext } from 'react';

export interface PersonaStore {
  get: () => string;
  set: (id: string) => void;
}

export function personaStore(storageKey: string): PersonaStore {
  let current = sessionStorage.getItem(storageKey) ?? '';
  return {
    get: () => current,
    set: (id) => {
      current = id;
      sessionStorage.setItem(storageKey, id);
    },
  };
}

export const PersonaContext = createContext<{ personaId: string; switchPersona: (id: string) => void }>({
  personaId: '',
  switchPersona: () => {},
});
export const usePersona = () => useContext(PersonaContext);
