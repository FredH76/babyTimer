angular.module('app.factory')

.factory('fileManager', function($timeout) {

  var service = {
    saveData: saveData,
    importData: importData,
    loadWeightData: loadWeightData,
  }
  return service;

  /*****************************************************************************************/
  /*********************                 SAVE DATA                         *****************/
  /*****************************************************************************************/
  function saveData(fileName, fileType, data) {
    var fullName = null;
    var blobData = null;

    fileType = fileType || JSON_FILE;

    switch (fileType) {
      case JSON_FILE:
        fullName = fileName + "." + JSON_EXT;
        blobData = JSON.stringify(data);
        break;
      case BABY_FILE:
        fullName = fileName + "." + BABY_EXT;
        // blobData = _formatToBABY(data);
        break;
      case CSV_FILE:
        fullName = fileName + "." + CSV_EXT;
        // blobData = _formatToCSV(data);
        break;
      case TXT_FILE:
        fullName = fileName + "." + TXT_EXT;
        // blobData = _formatToTXT(data);
        break;
      default:
        fullName = fileName + "." + JSON_EXT;
        blobData = JSON.stringify(data);
    }

    // request quota (needed for Chrome)
    var requestedBytes = 1024 * 100; // 100KB
    navigator.webkitPersistentStorage.requestQuota(requestedBytes, quotaSuccess, onError);

    // request file system
    function quotaSuccess(grantedBytes) {
      //Taking care of the browser-specific prefix
      window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
      window.requestFileSystem(PERSISTENT, grantedBytes, requestSuccess, onError);
    }

    // create file
    function requestSuccess(fileSystem) {
      fileSystem.root.getFile( // fileSystem.root is a FileSystemDirectoryEntry object
        fullName, {
          create: true
        }, createSuccess, onError);
    }

    // write into file 
    function createSuccess(fileEntry) { // fileEntry is a FileSystemFileEntry object
      fileEntry.createWriter(function(fileWriter) {

          fileWriter.onwriteend = function(e) {
            //copy file in external directory
            _copyFile(fileEntry);
          };

          fileWriter.onerror = function(e) {
            onError(e);
          };

          // fileWriter.seek(fileWriter.length); // Start write position at EOF.

          // Create a new Blob and write it to log.txt.
          var blob = new Blob([blobData], {
            type: 'text/plain'
          });
          fileWriter.write(blob);
        },
        onError
      );
    }

    function onError(e) {
      console.error('FILE ERROR: ', e);
    }

  }

  /*****************************************************************************************/
  /*********************                 IMPORT DATA                       *****************/
  /*****************************************************************************************/
  function importData(fileName, fileType, importSuccess) {
    var fullName = null;

    fileType = fileType || JSON_FILE;

    switch (fileType) {
      case JSON_FILE:
        fullName = fileName + "." + JSON_EXT;
        break;
      case BABY_FILE:
        fullName = fileName + "." + BABY_EXT;
        break;
      case CSV_FILE:
        fullName = fileName + "." + CSV_EXT;
        break;
      case TXT_FILE:
        fullName = fileName + "." + TXT_EXT;
        break;
      default:
        fullName = fileName + "." + JSON_EXT;
    }

    // request quota (needed for Chrome)
    var requestedBytes = 1024 * 100; // 100KB
    navigator.webkitPersistentStorage.requestQuota(requestedBytes, quotaSuccess, onError);

    // request file system
    function quotaSuccess(grantedBytes) {
      //Taking care of the browser-specific prefix
      window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
      window.requestFileSystem(PERSISTENT, grantedBytes, requestSuccess, onError);
    }

    // create file
    function requestSuccess(fileSystem) {
      fileSystem.root.getFile( // fileSystem.root is a FileSystemDirectoryEntry object
        fullName, {
          create: false
        }, getSuccess, onError);
    }

    // read from file 
    function getSuccess(fileEntry) { // fileEntry is a FileSystemFileEntry object
      fileEntry.file(function(file) {
          var reader = new FileReader();

          reader.onloadend = function(e) {
            parseFile(this.result);
          };

          reader.readAsText(file);
        },
        onError
      );
    }

    // convert read data
    function parseFile(fileData) {
      var data = {};
      switch (fileType) {
        case JSON_FILE:
          data = JSON.parse(fileData);
          break;
        case BABY_FILE:
          //data = parseCSV(this.result); // TODO : implent CSV parsing
          //break;
        case CSV_FILE:
          //data = parseCSV(this.result); // TODO : implent CSV parsing
          //break;
        case TXT_FILE:
          //data = parseTXT(this.result); // TODO : implent TXT parsing
          //break;
        default:
          data = JSON.parse(fileData);
      }
    }

    function onError(e) {
      console.error('READ FILE ERROR: ', e);
    }

  }


  /*********************          COPY FILE IN EXTERNAL DIRECTORY            *****************/
  function _copyFile(fileEntry) { // file Entry is a FileSystemFileEntry object

    // copy file only if not a browser
    if (ionic.Platform.isWebView()) {
      if (ionic.Platform.isAndroid())
        appFileDir = cordova.file.externalDataDirectory;
      else
        appFileDir = cordova.file.dataDirectory;

      var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
      window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(destDir) {
          fileEntry.copyTo(
            destDir,
            name,
            copySuccess,
            fail
          );
        },
        fail);

      function copySuccess(e) {
        console.log('COPY file success', fileEntry);
      }
    }
  }


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