import { QueryObserver } from "./query-observer";
import { MutaionObserver, MutationOption } from "./mutation-observer";

export class MiniQueryClient {
  private readonly map = new Map<string, QueryObserver | MutaionObserver>();

  registerQuery<T>(key: string, fetcher: () => Promise<T>) {
    const ob = this.map.get(key);
    if (ob instanceof QueryObserver) return ob;
    if (ob instanceof MutaionObserver)
      throw new Error(
        "This is a duplicate of the key registered with useMutation."
      );

    const observer = new QueryObserver(fetcher);
    this.map.set(key, observer);

    return observer;
  }

  registerMutation<T>(
    key: string,
    fetcher: () => Promise<T>,
    option?: MutationOption
  ) {
    const ob = this.map.get(key);
    if (ob instanceof MutaionObserver) return ob;
    if (ob instanceof QueryObserver)
      throw new Error(
        "This is a duplicate of the key registered with useQuery."
      );

    const observer = new MutaionObserver(fetcher, option);
    this.map.set(key, observer);

    return observer;
  }

  async loadAll() {
    await Promise.all([...this.map.values()].map((ob) => ob.load()));
  }

  async loadByKey(key: string) {
    const observer = this.map.get(key);
    if (!observer) return;

    await observer.load();
  }

  getObserver(key: string) {
    return this.map.get(key);
  }
}
