import { BaseObserver } from "./base-observer";

export class QueryObserver extends BaseObserver {
  constructor(fetcher: () => Promise<unknown>) {
    super(fetcher);
  }

  async load() {
    if (this.fetcher === undefined) {
      throw new Error("Register a fetcher.");
    }
    if (this.state.isFetching) return;

    try {
      this.dispatch((state) => {
        return {
          ...state,
          isFetching: true,
        };
      });

      const response = await this.fetcher();

      this.dispatch((state) => {
        return {
          ...state,
          isFetching: false,
          data: response,
        };
      });
    } catch {
      this.dispatch((state) => {
        return {
          ...state,
          isFetching: false,
          isError: true,
        };
      });
    }
  }
}
