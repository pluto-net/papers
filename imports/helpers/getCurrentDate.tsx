let date: Date | undefined;

export function getCurrentDate() {
  if (!date) {
    date = new Date();
    return date;
  } else {
    const newDate = new Date();
    if (+newDate - +date > 5 * 60 * 1000) {
      date = newDate;
      return date;
    } else {
      return date;
    }
  }
}
