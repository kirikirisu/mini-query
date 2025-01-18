export type State<T = unknown> = {
  isFetching: boolean;
  data: T | undefined;
  isError: boolean;
};

export abstract class BaseObserver {
  private subscribers = new Set<() => void>();
  protected state: State;
  protected fetcher?: () => Promise<unknown>;

  constructor(fetcher?: () => Promise<unknown>) {
    this.state = { isFetching: false, data: undefined, isError: false };
    this.fetcher = fetcher;
  }

  subscribe(onStoreChange: () => void) {
    this.subscribers.add(onStoreChange);

    return () => {
      this.subscribers.delete(onStoreChange);
    };
  }

  notify() {
    this.subscribers.forEach((onStoreChange) => onStoreChange());
  }

  dispatch<T>(callback: (state: State<T>) => State<T>) {
    this.state = callback(this.state as State<T>);
    this.notify();
  }

  setFetcher<T>(fetcher: () => Promise<T>) {
    this.fetcher = fetcher;
  }

  abstract load(): Promise<void>;

  getState<K>(): State<K> {
    return this.state as State<K>;
  }
}
