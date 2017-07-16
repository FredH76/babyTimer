angular.module('app.services')

.factory('utils', function () {
    // Might use a resource here that returns a JSON array
    var service = {
        formatHour: formatHour,
        formatMinute: formatMinute,
        formatSecond: formatSecond,
    }
    return service;

    /*********************                  FORMAT hour Display                 *****************/
    function formatHour(hour, pmEnable) {
        var strHour = "";

        if ((pmEnable === true) && (hour > 11)) hour = hour - 12;

        if (hour < 10)
            strHour = "0";

        strHour += hour.toString();

        return (strHour);
    }

    /*********************                  FORMAT Minute Display               *****************/
    function formatMinute(min) {
        return (formatSecond(min));
    }

    /*********************                  FORMAT Second Display               *****************/
    function formatSecond(sec) {
        var strSec = "";

        if (sec < 10)
            strSec = "0";

        strSec += sec.toString();

        return (strSec);
    }
})