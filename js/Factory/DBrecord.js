angular.module('app.services')

.factory('DBrecord', function (utils) {
    var RECORD_PREFIX = "rec_";

    var service = {
        saveRec: saveRec,
        delRec: delRec,
        getRecList: getRecList,
    }
    return service;



    /*********************                  SAVE RECORD UID                     *****************/
    function saveRec(record) {
        localStorage[_createUID(record)] = JSON.stringify(record);
    }

    /*********************                  DELETE RECORD                       *****************/
    function delRec(UID) {
        localStorage.removeItem(UID);
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
            //if (property.startsWith(prefix)) {
            if (property.slice(0, prefix.length) == prefix) {
                var rec = {};
                rec = JSON.parse(localStorage[property]);
                rec.UID = property;
                //recList.push(JSON.parse(localStorage[property]))
                recList.push(rec);
            }
        }

        return recList;
    }

    /********************************************************************************************/
    /*********************                      TOOL BOX                        *****************/
    /********************************************************************************************/
    function _createUID(record) {
        var UID = RECORD_PREFIX;

        // add year/month/day_
        UID += record[0].startTime.getFullYear() + "/";
        UID += utils.fillWithZero(record[0].startTime.getMonth()) + "/";
        UID += utils.fillWithZero(record[0].startTime.getDay()) + "_";

        // add time
        UID += record[0].startTime.toTimeString().slice(0, 8);

        return (UID);
    }
})