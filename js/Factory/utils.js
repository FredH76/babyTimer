angular.module('app.factory')

.factory('utils', function ($filter) {

  var service = {
    getLangList: getLangList,
    getWeekList : getWeekList,
    getMonthList: getMonthList,
    formatHour: formatHour,
    formatMinute: formatMinute,
    formatSecond: formatSecond,
    fillWithZero: fillWithZero,
    compVersion: compVersion,
  }
  return service;


  /*********************                  GET LANGUAGE LIST                   *****************/
  function getLangList() {
    var l_langList = [
      {
        country: FRENCH,
        label: ($filter('translate')('SETTINGS.GENERAL_LANGUAGE_FRENCH'))
      },
      {
        country: ENGLISH,
        label: ($filter('translate')('SETTINGS.GENERAL_LANGUAGE_ENGLISH'))
      },
    ];

    return (l_langList);
  }

  /*********************                  GET WEEK LIST                       *****************/
  function getWeekList() {
   var transWeek = [
    ($filter('translate')('WEEK.SUNDAY')).slice(0, 1), ($filter('translate')('WEEK.MONDAY')).slice(0, 1), ($filter('translate')('WEEK.TUESDAY')).slice(0, 1), ($filter('translate')('WEEK.WEDNESDAY')).slice(0, 1), ($filter('translate')('WEEK.THURSDAY')).slice(0, 1), ($filter('translate')('WEEK.FRIDAY')).slice(0, 1), ($filter('translate')('WEEK.SATURDAY')).slice(0, 1),
  ];
    return transWeek;
  }

  /*********************                  GET MONTH LIST                       *****************/
  function getMonthList() {
   var transMonth = [
    ($filter('translate')('MONTH.JANUARY')).slice(0, 3), ($filter('translate')('MONTH.FEBRUARY')).slice(0, 3), ($filter('translate')('MONTH.MARCH')).slice(0, 3), ($filter('translate')('MONTH.APRIL')).slice(0, 3), ($filter('translate')('MONTH.MAY')).slice(0, 3), ($filter('translate')('MONTH.JUNE')).slice(0, 4), ($filter('translate')('MONTH.JULY')).slice(0, 4), ($filter('translate')('MONTH.AUGUST')).slice(0, 3), ($filter('translate')('MONTH.SEPTEMBER')).slice(0, 3), ($filter('translate')('MONTH.OCTOBER')).slice(0, 3), ($filter('translate')('MONTH.NOVEMBER')).slice(0, 3), ($filter('translate')('MONTH.DECEMBER')).slice(0, 3),
  ];
return transMonth; 
  }

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