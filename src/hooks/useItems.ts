import { useQuery } from 'react-query';
import { Item } from '@prisma/client';

interface Options {
  staleTime?: number;
  enabled?: boolean;
}

const fetchItems = async () => {
  const res = await fetch(`/api/item/findAll`);
  if(!res.ok)return undefined;
  return res.json();
};

const useItems = (options?: Options) => {
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  return useQuery<Item[]>('ITEMS', () => fetchItems(), {
    staleTime,
    enabled
  });
};

export { useItems, fetchItems };
