import {
  createContext,
  PropsWithChildren,
  useSyncExternalStore,
  useContext,
  useState,
  useCallback,
} from "react";
import {
  MiniQueryClient,
  State,
  MutationOption,
} from "@kiririk/mini-query-core";

const StoreContext = createContext<MiniQueryClient | undefined>(undefined);

export function MiniQueryProvider({
  client,
  children,
}: PropsWithChildren<{ client: MiniQueryClient }>) {
  useState(() => {
    const load = async () => {
      await client.loadAll();
    };

    void load();
  });

  return (
    <StoreContext.Provider value={client}>{children}</StoreContext.Provider>
  );
}

export function useQuery<K>(key: string, fetcher: () => Promise<K>) {
  const mapper = useContext(StoreContext);
  if (!mapper) {
    throw new Error("wrap Provider");
  }

  const observer = mapper.registerQuery(key, fetcher);

  if (!observer) {
    throw new Error("can not find observer");
  }

  useState(() => {
    observer.load();
  });

  const state = useSyncExternalStore(
    useCallback(
      (onStoreChange) => {
        const unsbscribe = observer.subscribe(onStoreChange);
        return unsbscribe;
      },
      [observer]
    ),
    () => observer.getState<K>()
  );

  return { data: state, refetch: observer.load.bind(observer) };
}

export function useRegisteredQuery<K>(key: string) {
  const mapper = useContext(StoreContext);
  if (!mapper) {
    throw new Error("wrap Provider");
  }

  const observer = mapper.getObserver(key);

  if (!observer) {
    throw new Error("can not find observer.");
  }

  return useSyncExternalStore(observer.subscribe.bind(observer), () =>
    observer.getState<K>()
  );
}

export function useSetState<K>(key: string) {
  const mapper = useContext(StoreContext);
  if (!mapper) {
    throw new Error("wrap Provider");
  }

  const observer = mapper.getObserver(key);

  if (!observer) {
    throw new Error("can not find observer.");
  }

  const dispatch = (callback: (state: State<K>) => State<K>) => {
    observer.dispatch(callback);
  };

  return { dispatch };
}

export function useMutation<K>(
  key: string,
  fetcher: () => Promise<K>,
  options?: MutationOption
) {
  const mapper = useContext(StoreContext);
  if (!mapper) {
    throw new Error("wrap Provider");
  }

  const observer = mapper.registerMutation(key, fetcher, options);

  const state = useSyncExternalStore(
    useCallback(
      (onStoreChange) => {
        const unsbscribe = observer.subscribe(onStoreChange);
        return unsbscribe;
      },
      [observer]
    ),
    () => observer.getState<K>()
  );

  return { data: state, mutate: observer.load.bind(observer) };
}
