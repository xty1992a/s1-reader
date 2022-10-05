import { computed, reactive, toRef } from "vue";
import { api } from "@/types";

type _Result<T> = Promise<api.Result<{ Variables: { list: T[] } }>>;

interface Option<T = any> {
  fetch: (query: Record<string, any>) => _Result<T>;
}
export function usePagging<T = any>(option: Option<T>) {
  const state = reactive<{ query: { page: number }; list: T[] }>({
    query: {
      page: 1,
    },
    list: [],
  });

  const page = computed({
    get: () => state.query.page,
    set: (v) => {
      state.query = {
        ...state.query,
        page: v,
      };
    },
  });
  const query = computed(() => state.query);

  const fetch = async () => {
    option.fetch(state.query).then((res) => {
      console.log(res);
      if (!res.success) return;
      // @ts-ignore
      state.list = res.data.Variables.list;
    });
  };

  return { query, page, fetch, list: toRef(state, "list") };
}
