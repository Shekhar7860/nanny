module.exports.timeAgo = (timegot) => {
  const utc1 = new Date(timegot);
  const utc2 = new Date();
  const week = Math.floor((utc2 - utc1) / (1000 * 7 * 24 * 60 * 60));
  if (week == 1) {
    return timetosend = '1 week';
  }
  else if (week > 1) {
    return timetosend = week + ' week';
  }
  else {
    const day = Math.floor((utc2 - utc1) / (1000 * 24 * 60 * 60));
    var timetosend;
    if (day == 1) {
      return timetosend = 'Yesterday';
    }
    else if (day > 1) {
      return timetosend = day + ' Days';
    }
    else {
      const hour = Math.floor((utc2 - utc1) / (1000 * 60 * 60));
      if (hour == 1) {
        return timetosend = hour + ' Hour';
      }
      else if (hour > 1) {
        return timetosend = hour + ' Hours';
      }
      else {
        const minuts = Math.floor((utc2 - utc1) / (1000 * 60));
        if (minuts == 1) {
          return timetosend = minuts + ' Minute';
        }
        else if (minuts > 1) {
          return timetosend = minuts + ' Minutes';
        }
        else {
          const seconds = Math.floor((utc2 - utc1) / (1000));
          if (seconds == 1) {
            return timetosend = seconds + ' Second';
          }
          else if (seconds < 1) {
            return timetosend = '0 Second'
          }
          else {
            return timetosend = seconds + ' Seconds'
          }
        }
      }
    }
  }
}