angular.module('app.factory')

.factory('fileManager', function() {

  var service = {
    loadWeightData: loadWeightData,
  }
  return service;


  /*********************                 LOAD WEIGHT DATA                  *****************/
  function loadWeightData() {

    weightArray = _getTestData(); //[];

    return weightArray;
  }

  function fail(obj) {
    console.error("ERROR:>> failed to open file", obj);
  }

  function _getTestData() {
    var testArray = [];

    // ORIGIN 1 : HARD CODED DATA
    testArray.push({
      'x': new Date("2017/07/07"),
      'y': 3.400
    });
    testArray.push({
      'x': new Date("2017/07/08"),
      'y': 3.250
    });
    testArray.push({
      'x': new Date("2017/07/09"),
      'y': 3.150
    });
    testArray.push({
      'x': new Date("2017/07/10"),
      'y': 3.220
    });
    testArray.push({
      'x': new Date("2017/07/11"),
      'y': 3.290
    });
    testArray.push({
      'x': new Date("2017/07/12"),
      'y': 3.400
    });
    testArray.push({
      'x': new Date("2017/07/14"),
      'y': 3.500
    });
    testArray.push({
      'x': new Date("2017/07/20"),
      'y': 3.750
    });
    testArray.push({
      'x': new Date("2017/07/23"),
      'y': 3.800
    });
    testArray.push({
      'x': new Date("2017/07/28"),
      'y': 4.000
    });

    /*
    // ORIGIN 2: DATA FROM DOWLOADED EXCEL FILE
    // 1- resolve external storage Directory URL
    if (ionic.Platform.isWebView())
      window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, createFileEntry, fail);
    else {
      // ask permission to store data
      navigator.webkitPersistentStorage.requestQuota(56 * 1024,
        function(grantedBytes) {
          //init window.requestFileSystem to work with smartphone and google Chrome 12
          window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
          // get the file system
          window.requestFileSystem(PERSISTENT, grantedBytes, createFileEntry, fail);
        },
        fail
      );

    }

    // 2- create a file entry
    function createFileEntry(SDdir) {
      var srcFile = null;

      if (ionic.Platform.isWebView()) {
        srcFile = SDdir.nativeURL + "book.csv";
        window.resolveLocalFileSystemURL(srcFile, openFile, fail);
      } else {
        srcFile = SDdir.fullPath + "book.csv";
        window.resolveLocalFileSystemURI(srcFile, openFile, fail);
      }

    };

    // 3- open file
    function openFile(fileEntry) {
      fileEntry.file(loadData, fail);
    };

    // 4- load data
    function loadData(file) {
      var reader = new FileReader();
      reader.readAsText(file);
      reader.onloadend = function() {
        console.log("Successful file read: " + this.result);
        processData(this.result);
      }
    };

    //5- processData
    function processData(rawData) {
      // split data into an array of record
      var recStrArray = rawData.split('\n');

      // extract data
      for (var i = 1; i < recStrArray.length - 1; i++) {
        var splitedRec = recStrArray[i].split(";");
        var l_data = {};
        var l_date = splitedRec[0].split("/");
        l_data.date = new Date(l_date[2], l_date[1] - 1, l_date[0]);
        l_data.weight = parseFloat(splitedRec[1]);
        weightArray.push(l_data);
      }
    }; 
    */

    return testArray;
  }

})