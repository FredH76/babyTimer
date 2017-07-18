angular.module('app.filters', [])

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
        return (utils.formatMinute(Math.round(secondes / 60)));
    }
});