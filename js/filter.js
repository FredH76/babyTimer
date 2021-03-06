angular.module('app.filters', [])

.filter('extractRecListForDay', function(utils) {
  return function(recList, day) {
    var dayRecList = [];
    for (var i = 0; i < recList.length; i++) {
      if (recList[i].time.toDateString() == day.toDateString())
        dayRecList.push(recList[i]);
    }
    return dayRecList;
  }
})

.filter('extractDayList', function(utils) {
  return function(recList) {
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

.filter('DayMonthFromDate', function(utils) {
  return function(date) {
    var timeStr = "";
    timeStr = utils.formatHour(date.getDate()) + "/";
    timeStr += utils.formatMinute(date.getMonth() + 1);
    return timeStr;
  }
})

.filter('HourMinFromDate', function(utils) {
  return function(date) {
    var timeStr = "";
    timeStr = utils.formatHour(date.getHours()) + "h";
    timeStr += utils.formatMinute(date.getMinutes());
    return timeStr;
  }
})

.filter('MinutesFromSeconds', function(utils) {
  return function(secondes) {
    return (utils.formatMinute(Math.round(secondes / 60)) + " mn");
  }
})

.filter('todayOrNot', function(utils, $filter) {
  return function(date) {
    if (date.toDateString() == (new Date()).toDateString())
      return $filter('translate')('GRAPH.TODAY_TEXT');
    else return date.toLocaleDateString();
  }
});