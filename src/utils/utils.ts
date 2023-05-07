import { DateTime, ToRelativeUnit } from "luxon";

export const sleepMs = async (timeMs: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeMs);
  });
};

export const formatAgoDate = (time: DateTime) => {
  let unit: ToRelativeUnit = "minutes";
  const diffHours = DateTime.now().diff(time).as("hours");
  if (diffHours < 2) {
    unit = "minutes";
  } else if (diffHours > 2 && diffHours < 72) {
    unit = "hours";
  } else {
    unit = "days";
  }
  return time.toRelative({
    unit,
  });
};
