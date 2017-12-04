angular.module('app.factory', [])

.factory('DBrecord', function($filter, utils) {
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

  // DEFAULT DISPLAY CONFIGURATION STRUCTURE  
  var defaultInputDisplay = {
    medecine: true,
    diapper: true,
    bath: true,
    measure: true,
    note: true,
  }

  // DEFAULT COUNTRY PREFERENCES
  var defaultCountryPrefs = {
    language: null, //$filter('translate')('SETTINGS.GENERAL_ENGLISH'),
    units: null //$filter('translate')('SETTINGS.GENERAL_UNITS'),
  }

  // DEFAULT DAY/NIGHT CONFIGURATION
  var defaultDayNightPrefs = {
    modeDayOn: true,
    modeAuto: false,
    nightLuminosity: 0.1,
    autoThreshold: 4
  }

  var service = {
    //version
    getAppVersion: getAppVersion,
    storeAppVersion: storeAppVersion,
    patchToV0_1_1: patchToV0_1_1,
    patchToV0_1_3: patchToV0_1_3,
    patchToV0_1_4: patchToV0_1_4,
    patchToV0_2_0: patchToV0_2_0,
    patchToV0_2_1: patchToV0_2_1,

    // Settings
    getDisplayConf: getDisplayConf,
    saveDisplayConf: saveDisplayConf,
    getCountryConf: getCountryConf,
    setCountryConf: setCountryConf,
    getDayNightConf: getDayNightConf,
    setDayNightConf: setDayNightConf,

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

    // graph data
    getMeasureData: getMeasureData,
    getBreastData: getBreastData,
    getBottleData: getBottleData,

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

  /*********************                STORE APP VERSION                  *****************/
  function storeAppVersion(version) {
    localStorage["app_version"] = JSON.stringify(version);
  }


  /*********************             GET DISPLAY CONFIGURATION             *****************/
  function getDisplayConf() {
    var displayConf = null;
    if (localStorage["config_input_display"] === undefined)
      displayConf = defaultInputDisplay;
    else
      displayConf = JSON.parse(localStorage["config_input_display"]);
    return displayConf;
  }

  /*********************            SAVE DISPLAY CONFIGURATION              *****************/
  function saveDisplayConf(displayConf) {
    localStorage["config_input_display"] = JSON.stringify(displayConf);
  }


  /*********************           GET COUNTRY CONFIGURATION                *****************/
  function getCountryConf() {
    var countryConf = null;
    if (localStorage["config_country_prefs"] === undefined)
      countryConf = defaultCountryPrefs;
    else
      countryConf = JSON.parse(localStorage["config_country_prefs"]);
    return countryConf;
  }

  /*********************           SET COUNTRY CONFIGURAITON                *****************/
  function setCountryConf(prefs) {
    localStorage["config_country_prefs"] = JSON.stringify(prefs);
  }


  /*********************           GET DAY/NIGHT CONFIGURATION              *****************/
  function getDayNightConf() {
    var dayNightConf = null;
    if (localStorage["config_dayNight_prefs"] === undefined)
      dayNightConf = defaultDayNightPrefs;
    else
      dayNightConf = JSON.parse(localStorage["config_dayNight_prefs"]);
    return dayNightConf;
  }

  /*********************           SET DAY/NIGHT CONFIGURATION              *****************/
  function setDayNightConf(prefs) {
    localStorage["config_dayNight_prefs"] = JSON.stringify(prefs);
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
    if (babyUID == null || babyUID == undefined)
      babyUID = getBabyUIDList()[0];
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

  /*********************                  GET MEASURE DATA                    *****************/
  function getMeasureData() {
    var prefix = RECORD_PREFIX;
    var dataSet = {
      weight: [],
      height: []
    };

    // go through every property of LocalStorage
    for (var property in localStorage) {
      if (property.slice(0, prefix.length) == prefix) {
        rec = JSON.parse(localStorage[property]);
        // extract data
        if (rec.measure == true) {
          if (rec.weight > 0) {
            l_weight_data = {};
            l_weight_data.x = new Date(rec.startTime);
            l_weight_data.y = rec.weight;
            dataSet.weight.push(l_weight_data);
          }
          if (rec.height > 0) {
            l_height_data = {};
            l_height_data.x = new Date(rec.startTime);
            l_height_data.y = rec.height;
            dataSet.height.push(l_height_data);
          }
        }
      }
    }

    return dataSet;
  }

  /*********************                  GET BREAST DATA                    *****************/
  function getBreastData() {
    var prefix = RECORD_PREFIX;
    var breastRawData = [];
    var dataSet = {
      number: [],
      sumDuration: [],
      avgDuration: [],
    };


    // go through every property of LocalStorage
    for (var property in localStorage) {
      if (property.slice(0, prefix.length) == prefix) {
        rec = JSON.parse(localStorage[property]);
        // extract breast raw data
        if (rec.breast == true) {
          var l_data = {};
          l_data.date = new Date(rec.startTime);
          l_data.duration = rec.duration;
          breastRawData.push(l_data);
        }
      }
    }

    // merge data into day data
    var nbrecords = breastRawData.length;
    for (var i = 0; i < nbrecords;) {
      var curDay = breastRawData[i].date;
      var number = 1;
      var total = breastRawData[i].duration;
      var average = null; // will be compute at the end
      i++;
      for (; i < nbrecords; i++) {
        if (breastRawData[i].date.toDateString() == curDay.toDateString()) {
          number++;
          total += breastRawData[i].duration;
        } else
          break;
      }

      l_breast_number = {};
      l_breast_number.x = curDay;
      l_breast_number.y = number;
      dataSet.number.push(l_breast_number);

      l_breast_sumduration = {};
      l_breast_sumduration.x = curDay;
      l_breast_sumduration.y = parseInt(total / 60);
      dataSet.sumDuration.push(l_breast_sumduration);

      l_breast_avgDuration = {};
      l_breast_avgDuration.x = curDay;
      l_breast_avgDuration.y = parseInt(total / number / 60);
      dataSet.avgDuration.push(l_breast_avgDuration);
    }

    return dataSet;
  }

  /*********************                  GET BOTTLE DATA                   *****************/
  function getBottleData() {
    var prefix = RECORD_PREFIX;
    var dataSet = {
      number: [],
      sumQuantity: [],
      avgQuantity: [],
    };

    // go through every property of LocalStorage
    for (var property in localStorage) {
      if (property.slice(0, prefix.length) == prefix) {
        rec = JSON.parse(localStorage[property]);
        // extract data
      }
    }

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

  // add MEASURES fields to all records
  // add CONFIG_INPUT_DISPLAY param
  function patchToV0_1_4() {
    var babyUID = null;
    var prefix = RECORD_PREFIX;

    // go through every property of LocalStorage
    for (var property in localStorage) {
      if (property.slice(0, prefix.length) == prefix) {
        // Attribute Measure fields to all record
        rec = JSON.parse(localStorage[property]);
        // add new properties: medecine, vitamin,..
        rec.measure = false;
        rec.weight = 0;
        rec.height = 0;

        localStorage[property] = JSON.stringify(rec);
      }
    }

    saveDisplayConf(defaultInputDisplay);
  }

  // add CONFIG_COUNTRY_PREFS param
  function patchToV0_2_0() {
    setCountryConf(defaultCountryPrefs);
  }

  // add CONFIG_DAYNIGHT_MODE param
  function patchToV0_2_1() {
    setDayNightConf(defaultDayNightPrefs);
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