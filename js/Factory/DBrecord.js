angular.module('app.services')

.factory('DBrecord', function(utils) {
  var RECORD_PREFIX = "rec_";

  var service = {
    loadRec: loadRec,
    saveRec: saveRec,
    delRec: delRec,
    getRecList: getRecList,
  }
  return service;

  /*********************                  LOAD RECORD                        *****************/
  function loadRec(recUID) {
    var rec = null;
    rec = JSON.parse(localStorage[recUID]);
    if (rec !== null && rec !== undefined)
      return rec;
    else
      return null;
  }

  /*********************                  SAVE RECORD UID                     *****************/
  function saveRec(record) {
    localStorage[_createUID(record)] = JSON.stringify(record);
  }

  /*********************                  DELETE RECORD                       *****************/
  function delRec(UID) {
    localStorage.removeItem(UID);
  }

  /*********************                  GET REC LIST                        *****************/
  function getRecList(date) {
    var recList = [];
    var prefix = RECORD_PREFIX;

    // if a date is provided: set filter on this day
    if (date !== null && date !== undefined) {
      prefix += date.getFullYear() + "/";
      prefix += utils.fillWithZero(date.getMonth()) + "/";
      prefix += utils.fillWithZero(date.getDate()) + "_";
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

    // manually sort records (to fix iphone4S limitation on Array.sort() function)
    var sortedRecList = [];
    sortedRecList[0] = recList[0]; // init sortedRecList with one record
    for (var i = 1; i < recList.length; i++) {
      var j;
      for (j = 0; j < sortedRecList.length; j++) {
        var recTime = new Date(recList[i].startTime);
        var sortRecTime = new Date(sortedRecList[j].startTime);
        if (recTime.getTime() < sortRecTime.getTime())
          break
      }
      sortedRecList.splice(j, 0, recList[i]);
    }

    return sortedRecList;

  }

  /********************************************************************************************/
  /*********************                      TOOL BOX                        *****************/
  /********************************************************************************************/
  function _createUID(record) {
    var UID = RECORD_PREFIX;

    // add year/month/day_
    UID += record.startTime.getFullYear() + "/";
    UID += utils.fillWithZero(record.startTime.getMonth()) + "/";
    UID += utils.fillWithZero(record.startTime.getDate()) + "_";

    // add time
    UID += record.startTime.toTimeString().slice(0, 8);

    return (UID);
  }
})