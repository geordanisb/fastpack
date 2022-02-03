import { useQuery } from 'react-query';
import { Item } from '@prisma/client';

interface Options {
  staleTime?: number;
  enabled?: boolean;
}

const fetchItem = async (id: number) => {
  if (!id) return undefined;
  const res = await fetch(`/api/item/${id}`);
  if(!res.ok) return undefined;
  return res.json();
};

const useItem = (id: number, options?: Options) => {
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  return useQuery<Item|undefined>(['ITEM', id], () => fetchItem(id), {
    staleTime,
    enabled
  });
};

export { useItem, fetchItem };
