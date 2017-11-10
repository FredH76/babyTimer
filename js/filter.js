angular.module('app.filters', [])

.filter('extractDayList', function (utils) {
  return function (recList) {
    var dayList = [];
    for (var i = 0; i < recList.length; i++) {
      var recTime = new Date(recList[i].time);
      var alreadyInList = false;
      var j = 0;
      for (j = 0; j < dayList.length; j++) {
        if (dayList[j].toDateString() == recTime.toDateString()) {
          alreadyInList = true;
          break;
        }
      }
      if (alreadyInList === false)
        dayList.push(recTime);
    }
    return dayList;
  }
})

.filter('DayMonthFromDate', function (utils) {
  return function (date) {
    var timeStr = "";
    timeStr = utils.formatHour(date.getDate()) + "/";
    timeStr += utils.formatMinute(date.getMonth() + 1);
    return timeStr;
  }
})

.filter('HourMinFromDate', function (utils) {
  return function (date) {
    var timeStr = "";
    timeStr = utils.formatHour(date.getHours()) + "h";
    timeStr += utils.formatMinute(date.getMinutes());
    return timeStr;
  }
})

.filter('MinutesFromSeconds', function (utils) {
  return function (secondes) {
    return (utils.formatMinute(Math.round(secondes / 60)) + "mn");
  }
});