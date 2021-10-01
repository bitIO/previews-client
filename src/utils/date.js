import dayjs from "dayjs";
import dayjsRelative from "dayjs/plugin/relativeTime";

function fromNow(date, locale = "es-ES") {
  dayjs.extend(dayjsRelative);
  return dayjs(date).fromNow();
}

export { fromNow };
