import { computed, reactive, toRef } from "vue";
import { api } from "@/types";

type _Result<T> = Promise<api.Result<{ Variables: { list: T[], count: string | number } }>>;

interface Option<T = any> {
  fetch: (query: Record<string, any>) => _Result<T>;
}
export function usePagging<T = any>(option: Option<T>) {
  const state = reactive<{ query: { page: number }; list: T[], done: boolean }>({
    query: {
      page: 1,
    },
    list: [],
    done: false
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
      state.list = [...state.list, ...res.data.Variables.list];
      state.done = state.list.length >= Number(res.data.Variables.count)
    });
  };

  return { query, page, fetch, list: toRef(state, "list"), done: toRef(state, 'done') };
}
