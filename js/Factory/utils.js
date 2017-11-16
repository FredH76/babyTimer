angular.module('app.factory')

.factory('utils', function () {

  // Might use a resource here that returns a JSON array
  var service = {
    formatHour: formatHour,
    formatMinute: formatMinute,
    formatSecond: formatSecond,
    fillWithZero: fillWithZero,
    compVersion: compVersion,
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

  /*********************                      FILL with ZERO                     *****************/
  function fillWithZero(str, len) {
    var l_len = len || 2;

    for (var i = 0; i < l_len; i++)
      if (i >= str.toString().length)
        str = "0" + str;

    return str;
  }

  /**
   * Compare two versions
   * @param  {String} a   The first version
   * @param  {String} b   The second version
   * @return {Integer}    -1 if a < b, 0 if a == b and 1 if a > b
   */
  function compVersion(a, b) {
    var len = Math.max(a.length, b.length);
    a = a.split(".");
    b = b.split(".");

    for (var i = 0; i < len; i++) {
      if (parseInt(a[i]) > parseInt(b[i])) {
        return 1;
      } else if (parseInt(a[i]) < parseInt(b[i])) {
        return -1;
      }
    }
    return 0;
  }
})