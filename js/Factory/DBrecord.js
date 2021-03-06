angular.module('app.factory', [])

.factory('DBrecord', function ($rootScope, $translate, $filter, utils, fileManager) {
  var RECORD_PREFIX = "rec_";
  var BABY_UID_PREFIX = "babyUID_";

  // DEFAULT BABY STRUCTURE  
  var defaultBaby = {
    uid: BABY_UID_PREFIX + "0",
    name: "",
    firstname: "new baby",
    birthday: new Date(),
    gender: MALE,
    weight: 0,
    height: 0,
    picture: null,
    selected: false,
  }

  // DEFAULT DISPLAY CONFIGURATION STRUCTURE  
  var defaultInputDisplay = {
    medecine: true,
    diapper: true,
    bath: false,
    measure: false,
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
    patchToV1_1_2: patchToV1_1_2,

    // Settings
    getDisplayConf: getDisplayConf,
    saveDisplayConf: saveDisplayConf,
    getCountryConf: getCountryConf,
    setCountryConf: setCountryConf,
    getDayNightConf: getDayNightConf,
    setDayNightConf: setDayNightConf,

    //baby infos
    setCurBaby: setCurBaby,
    getCurBaby: getCurBaby,
    getCurBabyUID: getCurBabyUID,
    createNewBaby: createNewBaby,
    createDemoBaby: createDemoBaby,
    doesDemoBabyExist: doesDemoBabyExist,
    getBabyInfo: getBabyInfo,
    getBabyUIDList: getBabyUIDList,
    getBabyDemoUID: getBabyDemoUID,
    getBabyInfoList: getBabyInfoList,
    saveBaby: saveBaby,
    deleteBaby: deleteBaby,

    // records
    loadRec: loadRec,
    saveRec: saveRec,
    delRec: delRec,
    getRecList: getRecList,
    _createRecUID: _createRecUID,

    // file
    exportBaby: exportBaby,
    importBaby: importBaby,


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
    if (localStorage["config_input_display"] !== undefined)
      displayConf = JSON.parse(localStorage["config_input_display"]);
    return displayConf;
  }

  /*********************            SAVE DISPLAY CONFIGURATION              *****************/
  function saveDisplayConf(displayConf) {
    if (displayConf == undefined)
      displayConf = defaultDayNightPrefs;
    localStorage["config_input_display"] = JSON.stringify(displayConf);
  }


  /*********************           GET COUNTRY CONFIGURATION                *****************/
  function getCountryConf() {
    var countryConf = null;
    if (localStorage["config_country_prefs"] !== undefined)
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
    if (localStorage["config_dayNight_prefs"] !== undefined)
      dayNightConf = JSON.parse(localStorage["config_dayNight_prefs"]);
    return dayNightConf;
  }

  /*********************           SET DAY/NIGHT CONFIGURATION              *****************/
  function setDayNightConf(prefs) {
    localStorage["config_dayNight_prefs"] = JSON.stringify(prefs);
  }

  /*********************              GET CURRENT BABY UID                  *****************/
  function getCurBabyUID() {
    var babyList = getBabyInfoList();
    for (var i = 0; i < babyList.length; i++) {
      if (babyList[i].selected)
        return (babyList[i].uid);
    }
    return null;
  }


  /*********************              GET CURRENT BABY INFOs                 *****************/
  function getCurBaby() {
    var curBaby = {};

    var babyList = getBabyInfoList();
    for (var i = 0; i < babyList.length; i++) {
      if (babyList[i].selected)
        curBaby = babyList[i];
    }
    return curBaby;
  }

  /*********************              SET CURRENT BABY                      *****************/
  function setCurBaby(babyUID) {
    var babyList = getBabyInfoList();
    for (var i = 0; i < babyList.length; i++) {
      if (babyList[i].uid == babyUID)
        babyList[i].selected = true;
      else
        babyList[i].selected = false;
      saveBaby(babyList[i]);
    }
    $rootScope.$broadcast('update_baby_selection');
  }


  /*********************                  CREATE NEW BABY                   *****************/
  function createNewBaby() {
    var uid = _createBabyUID();
    var baby = defaultBaby;
    baby.uid = uid;
    baby.firstname = $filter('translate')('SETTINGS.NEW_BABY_FIRSTNAME');
    baby.firstname += " " + (getBabyUIDList().length + 1);
    localStorage[uid] = JSON.stringify(baby);
    return uid;
  }

  /*********************                 GET DEMO BABY UID                  *****************/
  function getBabyDemoUID() {
    return BABY_UID_PREFIX + "demo";
  }

  /*********************                 CREATE DEMO BABY                   *****************/
  function createDemoBaby() {

    //1- create demo baby entry
    var demoBaby = angular.copy(defaultBaby);
    demoBaby.uid = getBabyDemoUID();
    demoBaby.firstname = $filter('translate')('SETTINGS.DEMO_BABY_FIRSTNAME');;
    demoBaby.name = "DEMO";
    demoBaby.picture = null; //"img/bebeDemo.jpg";
    demoBaby.birthday = moment().subtract(28, 'days').hours(0).minutes(0).seconds(0).toDate();
    demoBaby.gender = MALE;
    demoBaby.weight = 3.5;
    demoBaby.height = 50;
    localStorage[demoBaby.uid] = JSON.stringify(demoBaby);

    // clear previous record
    // go through every property of LocalStorage
    var prefix = RECORD_PREFIX;
    for (var property in localStorage) {
      //if (property.startsWith(prefix)) {
      if (property.slice(0, prefix.length) == prefix && JSON.parse(localStorage[property]).babyUID == demoBaby.uid) {
        delete localStorage[property];
      }
    }


    //2- create week records
    var curDay = moment(demoBaby.birthday);
    var weekParams = [{}, {}, {}, {}];
    weekParams[0].maxBreastNb = 12;
    weekParams[0].minBreastNb = 10;
    weekParams[0].maxBreastDur = 15;
    weekParams[0].minBreastDur = 5;
    weekParams[0].minBottleNb = 0;
    weekParams[0].maxBottleNb = 2;
    weekParams[0].minBottleMl = 3;
    weekParams[0].maxBottleMl = 6;

    weekParams[1].maxBreastNb = 11;
    weekParams[1].minBreastNb = 9;
    weekParams[1].maxBreastDur = 20;
    weekParams[1].minBreastDur = 10;
    weekParams[1].minBottleNb = 1;
    weekParams[1].maxBottleNb = 2;
    weekParams[1].minBottleMl = 3;
    weekParams[1].maxBottleMl = 6;

    weekParams[2].maxBreastNb = 10
    weekParams[2].minBreastNb = 8;
    weekParams[2].maxBreastDur = 25;
    weekParams[2].minBreastDur = 15;
    weekParams[2].minBottleNb = 1;
    weekParams[2].maxBottleNb = 2;
    weekParams[2].minBottleMl = 6;
    weekParams[2].maxBottleMl = 9;

    weekParams[3].maxBreastNb = 9;
    weekParams[3].minBreastNb = 7;
    weekParams[3].maxBreastDur = 30;
    weekParams[3].minBreastDur = 20;
    weekParams[3].minBottleNb = 2;
    weekParams[3].maxBottleNb = 3;
    weekParams[3].minBottleMl = 6;
    weekParams[3].maxBottleMl = 9;

    for (var weekNum = 0; weekNum < 4; weekNum++) {
      var l_maxBreastNb = weekParams[weekNum].maxBreastNb;
      var l_minBreastNb = weekParams[weekNum].minBreastNb;
      var l_maxBreastDur = weekParams[weekNum].maxBreastDur;
      var l_minBreastDur = weekParams[weekNum].minBreastDur;
      var l_maxBottleNb = weekParams[weekNum].maxBottleNb;
      var l_minBottleNb = weekParams[weekNum].minBottleNb;
      var l_maxBottleMl = weekParams[weekNum].maxBottleMl;
      var l_minBottleMl = weekParams[weekNum].minBottleMl;

      for (var i = 0; i < 7; i++) {

        // set medecine
        var l_rec = {};
        curDay.hours(9);
        l_rec.startTime = curDay.toDate();
        l_rec.medecine = true;
        l_rec.vitamin = true;
        l_rec.paracetamol = false;
        l_rec.otherMed = false;
        l_rec.otherMedName = "";
        l_rec.babyUID = demoBaby.uid;
        saveRec(l_rec);

        // set diapper
        curDay.hours(0);
        var nbDayDiapper = (Math.floor(Math.random() * (6 - 4 + 1)) + 4);
        for (diapperNum = 0; diapperNum < nbDayDiapper; diapperNum++) {
          l_rec = {};
          l_rec.startTime = curDay.hours((24 / nbDayDiapper) * diapperNum).minutes(0).seconds(0).toDate();
          var temp = l_rec.startTime;
          l_rec = loadRec(_createRecUID(l_rec)) || l_rec;
          l_rec.diapper = true;
          l_rec.peeLevel = (Math.floor(Math.random() * (3 - 0 + 1)) + 0);
          l_rec.pooLevel = (Math.floor(Math.random() * (3 - 0 + 1)) + 0);
          l_rec.babyUID = demoBaby.uid;
          saveRec(l_rec);
        }

        // set bath
        curDay.hours(0);
        l_rec = {};
        var temp = curDay.date();
        var sd = temp % 3;
        if ((curDay.date() % 3) == 0) {
          l_rec.startTime = curDay.hours(10).minutes(30).seconds(0).toDate();
          l_rec = loadRec(_createRecUID(l_rec)) || l_rec;
          l_rec.bath = true;
          l_rec.babyUID = demoBaby.uid;
          saveRec(l_rec);
        }

        // set breast records
        curDay.hours(0);
        var nbDayBreast = (Math.floor(Math.random() * (l_maxBreastNb - l_minBreastNb + 1)) + l_minBreastNb);
        for (breastNum = 0; breastNum < nbDayBreast; breastNum++) {
          l_rec = {};
          l_rec.startTime = curDay.hours((24 / nbDayBreast) * breastNum).minutes(0).seconds(0).toDate();
          l_rec = loadRec(_createRecUID(l_rec)) || l_rec;
          l_rec.breast = true;
          l_rec.duration = (Math.floor(Math.random() * (l_maxBreastDur - l_minBreastDur + 1)) + l_minBreastDur) * 60;
          l_rec.babyUID = demoBaby.uid;
          saveRec(l_rec);
        }

        // set bottle records
        curDay.hours(0);
        var nbDayBottle = (Math.floor(Math.random() * (l_maxBottleNb - l_minBottleNb + 1)) + l_minBottleNb);
        for (bottleNum = 0; bottleNum < nbDayBottle; bottleNum++) {
          l_rec = {};
          l_rec.startTime = curDay.hours((24 / nbDayBottle) * bottleNum).minutes(0).seconds(0).toDate();
          l_rec = loadRec(_createRecUID(l_rec)) || l_rec;
          l_rec.bottle = true;
          l_rec.quantity = (Math.floor(Math.random() * (l_maxBottleMl - l_minBottleMl + 1)) + l_minBottleMl) * 10;
          l_rec.babyUID = demoBaby.uid;
          saveRec(l_rec);
        }


        curDay.add(moment.duration({
          'days': 1
        }));
      }
    }

    //3- create weight records 
    var l_rec = {};
    var curDay = moment(demoBaby.birthday);
    l_rec = {};
    l_rec.startTime = curDay.toDate();
    l_rec = loadRec(_createRecUID(l_rec)) || l_rec;
    l_rec.measure = true;
    l_rec.weight = 3.4;
    l_rec.babyUID = demoBaby.uid;
    saveRec(l_rec);
    l_rec = {};
    l_rec.startTime = curDay.add(1 * 24 * 60 * 60 * 1000).toDate();
    l_rec = loadRec(_createRecUID(l_rec)) || l_rec;
    l_rec.measure = true;
    l_rec.weight = 3.25;
    l_rec.babyUID = demoBaby.uid;
    saveRec(l_rec);
    l_rec = {};
    l_rec.startTime = curDay.add(1 * 24 * 60 * 60 * 1000).toDate();
    l_rec = loadRec(_createRecUID(l_rec)) || l_rec;
    l_rec.measure = true;
    l_rec.weight = 3.15;
    l_rec.babyUID = demoBaby.uid;
    saveRec(l_rec);
    l_rec = {};
    l_rec.startTime = curDay.add(1 * 24 * 60 * 60 * 1000).toDate();
    l_rec = loadRec(_createRecUID(l_rec)) || l_rec;
    l_rec.measure = true;
    l_rec.weight = 3.22;
    l_rec.babyUID = demoBaby.uid;
    saveRec(l_rec);
    l_rec = {};
    l_rec.startTime = curDay.add(1 * 24 * 60 * 60 * 1000).toDate();
    l_rec = loadRec(_createRecUID(l_rec)) || l_rec;
    l_rec.measure = true;
    l_rec.weight = 3.29;
    l_rec.babyUID = demoBaby.uid;
    saveRec(l_rec);
    l_rec = {};
    l_rec.startTime = curDay.add(1 * 24 * 60 * 60 * 1000).toDate();
    l_rec = loadRec(_createRecUID(l_rec)) || l_rec;
    l_rec.measure = true;
    l_rec.weight = 3.4;
    l_rec.babyUID = demoBaby.uid;
    saveRec(l_rec);
    l_rec = {};
    l_rec.startTime = curDay.add(2 * 24 * 60 * 60 * 1000).toDate();
    l_rec = loadRec(_createRecUID(l_rec)) || l_rec;
    l_rec.measure = true;
    l_rec.weight = 3.5;
    l_rec.babyUID = demoBaby.uid;
    saveRec(l_rec);
    l_rec = {};
    l_rec.startTime = curDay.add(6 * 24 * 60 * 60 * 1000).toDate();
    l_rec = loadRec(_createRecUID(l_rec)) || l_rec;
    l_rec.measure = true;
    l_rec.weight = 3.75;
    l_rec.babyUID = demoBaby.uid;
    saveRec(l_rec);
    l_rec = {};
    l_rec.startTime = curDay.add(3 * 24 * 60 * 60 * 1000).toDate();
    l_rec = loadRec(_createRecUID(l_rec)) || l_rec;
    l_rec.measure = true;
    l_rec.weight = 3.85;
    l_rec.babyUID = demoBaby.uid;
    saveRec(l_rec);
    l_rec = {};
    l_rec.startTime = curDay.add(5 * 24 * 60 * 60 * 1000).toDate();
    l_rec = loadRec(_createRecUID(l_rec)) || l_rec;
    l_rec.measure = true;
    l_rec.weight = 3.95;
    l_rec.babyUID = demoBaby.uid;
    saveRec(l_rec);
    l_rec = {};
    l_rec.startTime = curDay.add(6 * 24 * 60 * 60 * 1000).toDate();
    l_rec = loadRec(_createRecUID(l_rec)) || l_rec;
    l_rec.measure = true;
    l_rec.weight = 4.2;
    l_rec.babyUID = demoBaby.uid;
    saveRec(l_rec);

    return (demoBaby.uid);
  }

  /*********************              DOES DEMO BABY EXIST                  *****************/
  function doesDemoBabyExist() {
    var uid = BABY_UID_PREFIX + "demo";
    if (localStorage[uid] == undefined)
      return false;
    else
      return true;
  }


  /*********************                  GET BABY INFO                     *****************/
  function getBabyInfo(babyUID) {
    if (babyUID == null || babyUID == undefined)
      babyUID = getBabyUIDList()[0];
    var babyInfo = JSON.parse(localStorage[babyUID]);
    if (babyInfo === undefined)
      return null;
    else {
      babyInfo.birthday = new Date(babyInfo.birthday);
      return babyInfo;
    }
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

  /*********************             GET BABY INFO LIST                      *****************/
  function getBabyInfoList() {
    var babyInfoList = [];
    var prefix = BABY_UID_PREFIX;

    // go through every property of LocalStorage
    for (var property in localStorage) {
      if (property.slice(0, prefix.length) == prefix) {
        var l_baby = JSON.parse(localStorage[property]);
        l_baby.birthday = new Date(l_baby.birthday);
        babyInfoList.push(l_baby);
        //babyInfoList[l_baby.uid] = l_baby;
      }
    }
    return babyInfoList;
  }


  /*********************                  SAVE BABY                          *****************/
  function saveBaby(baby) {
    if (baby.$$hashKey)
      delete baby.$$hashKey;
    localStorage[baby.uid] = JSON.stringify(baby);
    $rootScope.$broadcast('update_baby_infos');
  }

  /*********************                  DELETE BABY                        *****************/
  function deleteBaby(baby) {
    var prefix = RECORD_PREFIX;

    // delete baby info
    localStorage.removeItem(baby.uid);

    // delete all baby record
    for (var property in localStorage) {
      var t = localStorage[property];
      if (property.slice(0, prefix.length) == prefix && JSON.parse(localStorage[property]).babyUID == baby.uid) {
        localStorage.removeItem(property);
      }
    }

    // change current baby selection if needed
    if (baby.selected) {
      var len = getBabyUIDList().length;
      if (len > 0)
        setCurBaby(getBabyUIDList()[0]);
      else
        setCurBaby(null);
    }
  }

  /*********************                  LOAD RECORD                        *****************/
  function loadRec(recUID) {
    var rec = null;
    if (localStorage[recUID] !== undefined) {
      rec = JSON.parse(localStorage[recUID]);
      // reformat date
      rec.startTime = new Date(rec.startTime);
    }
    return rec;
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
  function getRecList(babyUID, fromDate) {
    var recList = [];
    var prefix = RECORD_PREFIX;

    /* if a date is provided: set filter on this day
    if (fromDate !== null && fromDate !== undefined) {
      prefix += fromDate.getFullYear() + "/";
      prefix += utils.fillWithZero(fromDate.getMonth()) + "/";
      prefix += utils.fillWithZero(fromDate.getDate()) + "_";
    }*/

    // go through every property of LocalStorage
    for (var property in localStorage) {
      if (property.slice(0, prefix.length) == prefix && JSON.parse(localStorage[property]).babyUID == babyUID) {
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

  /*********************                 EXPORT BABY INFO                  *****************/
  function exportBaby(babyUID, fileType) {
    var prefix = RECORD_PREFIX;
    var data = {};

    fileType = fileType || JSON_FILE;

    // store BABY UID
    data[babyUID] = JSON.parse(localStorage[babyUID]);

    // store BABY REC
    // go through every property of LocalStorage
    for (var property in localStorage) {
      if (property.slice(0, prefix.length) == prefix && JSON.parse(localStorage[property]).babyUID == babyUID) {
        data[property] = JSON.parse(localStorage[property]);
      }
    }

    // save in local/external file system (external for debug)
    fileManager.saveData(babyUID, fileType, data);


  }

  /*********************                 IMPORT BABY INFO                  *****************/
  function importBaby(babyUID, fileType) {
    var data = null;
    // import from local/external file system (external for debug)
    fileManager.importData(babyUID, JSON_FILE, importSuccess, true);

    function importSuccess(data) {
      // copy every property to LocalStorage
      for (var property in data) {
        localStorage[property] = JSON.stringify(data[property]);
      };
    };
  }

  function exportAll(fileType) {
    var data = {};

    fileType = fileType || JSON_FILE;

    // go through every property of LocalStorage
    for (var property in localStorage) {
      data[property] = localStorage[property];
    }

    // save in local/external file system (external for debug)
    var curTime = new Date();
    var fileName = "allDB_";
    fileName += curTime.getFullYear() + "/";
    fileName += utils.fillWithZero(curTime.getMonth()) + "/";
    fileName += utils.fillWithZero(curTime.getDate()) + "_";

    fileManager.saveData(fileName, fileType, data);
  }

  /*********************                  GET MEASURE DATA                    *****************/
  function getMeasureData(babyUID) {
    var prefix = RECORD_PREFIX;
    var dataSet = {
      weight: [],
      height: []
    };

    // go through every property of LocalStorage
    for (var property in localStorage) {
      if (property.slice(0, prefix.length) == prefix && JSON.parse(localStorage[property]).babyUID == babyUID) {
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
  function getBreastData(babyUID) {
    var prefix = RECORD_PREFIX;
    var breastRawData = [];
    var dataSet = {
      number: [],
      sumDuration: [],
      avgDuration: [],
    };

    // go through every property of LocalStorage
    for (var property in localStorage) {
      if (property.slice(0, prefix.length) == prefix && JSON.parse(localStorage[property]).babyUID == babyUID) {
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
  function getBottleData(babyUID) {
    var prefix = RECORD_PREFIX;
    var bottleRawData = [];
    var dataSet = {
      number: [],
      sumQuantity: [],
      avgQuantity: [],
    };

    // go through every property of LocalStorage
    for (var property in localStorage) {
      if (property.slice(0, prefix.length) == prefix && JSON.parse(localStorage[property]).babyUID == babyUID) {
        rec = JSON.parse(localStorage[property]);
        // extract bottle raw data
        if (rec.bottle == true) {
          var l_data = {};
          l_data.date = new Date(rec.startTime);
          l_data.quantity = rec.quantity;
          bottleRawData.push(l_data);
        }
      }
    }

    // merge data into day data
    var nbrecords = bottleRawData.length;
    for (var i = 0; i < nbrecords;) {
      var curDay = bottleRawData[i].date;
      var number = 1;
      var total = bottleRawData[i].quantity;
      var average = null; // will be compute at the end
      i++;
      for (; i < nbrecords; i++) {
        if (bottleRawData[i].date.toDateString() == curDay.toDateString()) {
          number++;
          total += bottleRawData[i].quantity;
        } else
          break;
      }

      l_bottle_number = {};
      l_bottle_number.x = curDay;
      l_bottle_number.y = number;
      dataSet.number.push(l_bottle_number);

      l_bottle_sumQuantity = {};
      l_bottle_sumQuantity.x = curDay;
      l_bottle_sumQuantity.y = parseInt(total);
      dataSet.sumQuantity.push(l_bottle_sumQuantity);

      l_bottle_avgQuantity = {};
      l_bottle_avgQuantity.x = curDay;
      l_bottle_avgQuantity.y = parseInt(total / number);
      dataSet.avgQuantity.push(l_bottle_avgQuantity);
    }

    return dataSet;
  }

  /********************************************************************************************/
  /*********************              DB UPDATE VERSION PATCH                 *****************/
  /********************************************************************************************/

  // create baby demo + add country prefs + add day/night prefs + add display prefs
  function patchToV1_1_2() {
    var prefix = RECORD_PREFIX;

    // delete all records that do not belong a baby
    // go through every property of LocalStorage
    for (var property in localStorage) {
      if (property.slice(0, prefix.length) == prefix && JSON.parse(localStorage[property]).babyUID === undefined) {
        delete localStorage[property];
      }
    }

    // create DEMO BABY (if none in DB) and set it as current
    if (getBabyUIDList().length == 0) {
      var uid = createDemoBaby();
      setCurBaby(uid);
      $rootScope.$broadcast('update_baby_infos');
      $rootScope.$broadcast('update_baby_selection');
    }

    // add country configuration
    var countryConf = getCountryConf();
    if (countryConf === null) {
      countryConf = {};
      // DEFAULT : set to local country unit
      switch ($translate.use()) {
      case 'fr_FR':
      case 'fr':
        countryConf.language = FRENCH;
        countryConf.units = KILO;
        $translate.use('fr');
        break;
      default:
        countryConf.language = ENGLISH;
        countryConf.units = OUNCE;
        $translate.use('en');
      }
      setCountryConf(countryConf);
    }

    // add day/night configuration
    var dayNightConf = getDayNightConf();
    if (dayNightConf === null) {
      setDayNightConf(defaultDayNightPrefs);
    }

    // add display configuration
    var displayConf = getDisplayConf();
    if (displayConf === null) {
      saveDisplayConf(defaultInputDisplay);
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