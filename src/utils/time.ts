import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import zh from "dayjs/locale/zh-cn";
dayjs.locale(zh);
dayjs.extend(relativeTime);

export const fmt = (tpl: string) => (v: dayjs.ConfigType) => {
  const d = dayjs(v);
  return d.isValid() ? d.format(tpl) : v;
};

export const relative = (value: dayjs.ConfigType) => dayjs(value).fromNow();
