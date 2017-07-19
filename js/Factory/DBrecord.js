angular.module('app.services')

.factory('DBrecord', function (utils) {
    var RECORD_PREFIX = "rec_";

    var service = {
        saveRec: saveRec,
        getRecList: getRecList,
    }
    return service;



    /*********************                  SAVE RECORD UID                     *****************/
    function saveRec(record) {
        localStorage[_createUID(record)] = JSON.stringify(record);
    }

    /*********************                  GET REC LIST                       *****************/
    function getRecList(date) {
        var recList = [];
        var prefix = RECORD_PREFIX;

        // if a date is provided: set filter on this day
        if (date !== null && date !== undefined) {
            prefix += date.getYear() + "/";
            prefix += date.getMonth() + "/";
            prefix += date.getDay() + "_";
        }

        // go through every property of LocalStorage
        for (var property in localStorage) {
            if (property.startsWith(prefix)) {
                recList.push(JSON.parse(localStorage[property]))
            }
        }

        return recList;
    }

    /********************************************************************************************/
    /*********************                      TOOL BOX                        *****************/
    /********************************************************************************************/
    function _createUID(record) {
        var uid = RECORD_PREFIX;

        // add year/month/day_
        uid += record[0].startTime.getFullYear() + "/";
        uid += utils.fillWithZero(record[0].startTime.getMonth()) + "/";
        uid += utils.fillWithZero(record[0].startTime.getDay()) + "_";

        // add time
        uid += record[0].startTime.toTimeString().slice(0, 8);

        return (uid);
    }
})