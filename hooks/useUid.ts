import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

export function useUid(id?: string | null): string {
  const [uid, setUid] = useState<string>();
  useEffect(() => {
    if (!id) setUid(uuid());
  }, []);
  return id ?? uid ?? '';
}
