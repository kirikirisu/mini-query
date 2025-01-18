import { BaseObserver } from "./base-observer";

export type MutationOption = {
  onSuccess?: () => void;
  onError?: () => void;
};

export class MutaionObserver extends BaseObserver {
  private option?: MutationOption;

  constructor(fetcher: () => Promise<unknown>, option?: MutationOption) {
    super(fetcher);

    this.option = option;
  }

  setOptions(option: MutationOption) {
    this.option = { ...this.option, ...option };
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

      if (this.option && this.option.onSuccess) {
        this.option.onSuccess();
      }
    } catch {
      this.dispatch((state) => {
        return {
          ...state,
          isFetching: false,
          isError: true,
        };
      });

      if (this.option && this.option.onError) {
        this.option.onError();
      }
    }
  }
}
