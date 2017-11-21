angular.module('app.factory', [])

.factory('DBrecord', function (utils) {
  var RECORD_PREFIX = "rec_";
  var BABY_UID_PREFIX = "babyUID_";

  // DEFAULT BABY STRUCTURE  
  var defaultBaby = {
    uid: BABY_UID_PREFIX + "0",
    name: "My new",
    firstname: "baby",
    birthday: new Date(),
    gender: MALE,
    weight: 3.5,
    height: 50,
  }

  var service = {
    //version
    getAppVersion: getAppVersion,
    storeAppVersion: storeAppVersion,
    patchToV0_1_1: patchToV0_1_1,
    patchToV0_1_3: patchToV0_1_3,

    //baby infos
    createNewBaby: createNewBaby,
    getBabyInfo: getBabyInfo,
    getBabyUIDList: getBabyUIDList,
    saveBaby: saveBaby,

    // records
    loadRec: loadRec,
    saveRec: saveRec,
    delRec: delRec,
    getRecList: getRecList,
    _createRecUID: _createRecUID,
  }
  return service;

  /*********************                  GET APP VERSION                   *****************/
  function getAppVersion() {
    var version = null;
    if (localStorage["app_version"] === undefined)
      version = "0.0.0";
    else
      version = JSON.parse(localStorage["app_version"]);
    return version;
  }


  /*********************               STORE APP VERSION                    *****************/
  function storeAppVersion(version) {
    localStorage["app_version"] = JSON.stringify(version);
  }


  /*********************                  GET CURRENT BABY ID               *****************/
  function createNewBaby() {
    var uid = _createBabyUID();
    var baby = defaultBaby;
    baby.uid = uid;
    localStorage[uid] = JSON.stringify(baby);
  }

  /*********************                  GET BABY INFO                     *****************/
  function getBabyInfo(babyUID) {
    var babyInfo = JSON.parse(localStorage[babyUID]);
    if (babyInfo === undefined)
      return null;
    else
      return babyInfo;
  }

  /*********************                  GET BABY LIST                      *****************/
  function getBabyUIDList() {
    var babyUIDList = [];
    var prefix = BABY_UID_PREFIX;

    // go through every property of LocalStorage
    for (var property in localStorage) {
      if (property.slice(0, prefix.length) == prefix) {
        babyUIDList.push(property);
      }
    }
    return babyUIDList;
  }

  /*********************                  SAVE BABY                          *****************/
  function saveBaby(baby) {
    localStorage[baby.uid] = JSON.stringify(baby);
  }


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
    localStorage[_createRecUID(record)] = JSON.stringify(record);
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


    /* manually sort records (to fix iphone4S limitation on Array.sort() function)
    var sortedRecList = [];
    if(recList.length > 0)
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

    return sortedRecList;*/
    return recList;

  }

  /********************************************************************************************/
  /*********************              DB UPDATE VERSION PATCH                 *****************/
  /********************************************************************************************/
  // create a default baby record + add babyUID to all records
  function patchToV0_1_1() {
    var babyUID = null;

    // create a baby
    if (getBabyUIDList().length == 0)
      babyUID = createNewBaby();
    else {
      console.error("ERROR : DBrecord.patchToV0_1_1 >> a baby already exist. Its UID wil be used");
      babyUID = getBabyUIDList()[0];
    }

    var prefix = RECORD_PREFIX;
    // go through every property of LocalStorage
    for (var property in localStorage) {
      if (property.slice(0, prefix.length) == prefix) {
        // Attribute babyUID to all record
        rec = JSON.parse(localStorage[property]);
        rec.babyUID = babyUID;
        // add new properties: message, msgTxt
        rec.message = false;
        rec.msgTxt = "";
        localStorage[property] = JSON.stringify(rec);
      }
    }
  }

  // add MEDECINE + TEXT fields to all records
  function patchToV0_1_3() {
    var babyUID = null;
    var prefix = RECORD_PREFIX;

    // go through every property of LocalStorage
    for (var property in localStorage) {
      if (property.slice(0, prefix.length) == prefix) {
        // Attribute Medecine fields to all record
        rec = JSON.parse(localStorage[property]);
        // add new properties: medecine, vitamin,..
        rec.medecine = false;
        rec.vitamin = false;
        rec.paracetamol = false;
        rec.otherMed = false;
        rec.otherMedName = "";

        localStorage[property] = JSON.stringify(rec);
      }
    }
  }

  /********************************************************************************************/
  /*********************                      TOOL BOX                        *****************/
  /********************************************************************************************/
  function _createBabyUID() {
    var UID = BABY_UID_PREFIX;
    var timeStamp = (new Date()).getTime();
    UID += timeStamp;
    return UID;
  }

  function _createRecUID(record) {
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