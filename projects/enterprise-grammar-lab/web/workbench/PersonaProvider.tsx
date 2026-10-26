// Picks the demo identity for a scenario and holds everything else back until one is set.
import type { UseQueryResult } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { W } from '../api/core.ts';
import { PersonaContext } from '../api/persona.ts';
import type { PersonaStore } from '../api/persona.ts';
import { Loaded } from './Loaded.tsx';

export function PersonaProvider({
  store,
  users,
  children,
}: {
  store: PersonaStore;
  users: UseQueryResult<W['User'][], Error>;
  children: (personas: W['User'][]) => ReactNode;
}) {
  const [personaId, setPersonaId] = useState(store.get);
  const personas = useMemo(() => (users.data ?? []).filter((u) => u.demoPersona), [users.data]);
  const known = personas.some((u) => u.id === personaId);

  // Nothing chosen yet, or the stored choice no longer exists: take the first identity the backend offers.
  useEffect(() => {
    if (!known && personas.length > 0) {
      store.set(personas[0].id);
      setPersonaId(personas[0].id);
    }
  }, [known, personas, store]);

  const value = useMemo(
    () => ({
      personaId,
      switchPersona: (id: string) => {
        store.set(id);
        setPersonaId(id);
      },
    }),
    [personaId, store],
  );
  return (
    <Loaded query={users} what="演示身份">
      {() => (known ? <PersonaContext.Provider value={value}>{children(personas)}</PersonaContext.Provider> : null)}
    </Loaded>
  );
}
