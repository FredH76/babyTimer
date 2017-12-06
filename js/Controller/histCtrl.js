angular.module('app.controllers')

.controller('histCtrl', function($rootScope, $scope, $state, $filter, $timeout, $interval, $ionicScrollDelegate, utils, DBrecord) {
  var vm = this;

  vm.displayConf = null;
  vm.recList = [];
  vm.dayList = [];
  vm.dispList = [];
  vm.durDay = 0;
  vm.durHour = 0;
  vm.durMin = 0;

  /******************************      FUNCTION DECLARATION            ************************/
  vm.doRefresh = doRefresh;
  vm.switchEditMode = switchEditMode;
  vm.showHideDayRec = showHideDayRec;
  vm.delRec = delRec;
  vm.editRec = editRec;

  /******************************      DEFINE CONSTANT for HTML        ************************/
  vm.vitaminName = $filter('translate')('INPUT.MEDECINE_VITAMIN');
  vm.paracetamolName = $filter('translate')('INPUT.MEDECINE_PARACETAMOL');
  vm.otherMedName = ""; // to be defined item per item

  /******************************         INITIALISATION               ************************/
  vm.displayConf = DBrecord.getDisplayConf();
  refreshRecList();
  vm.editMode = false;

  _updateInterval();

  //start clock timer
  $interval(_updateInterval, 60000);


  /********************************************************************************************/
  /*                              PUBLIC FUNCTIONS IMPLEMENTATION
  /********************************************************************************************/

  /******************************     SHOW/HIDE DAY RECORD             ************************/
  function showHideDayRec(item) {
    item.show = !item.show;
  }


  /******************************       REFRESH RECORD LIST            ************************/
  function doRefresh() {
    refreshRecList();

    $scope.$broadcast('scroll.refreshComplete');
  }


  /******************************         SWITCH EDIT MODE             ************************/
  function switchEditMode() {
    vm.editMode = !vm.editMode;
  }


  /******************************         DELETE RECORD                ************************/
  function delRec(dispRecord) {
    // remove from DB
    DBrecord.delRec(dispRecord.UID);

    // remove from display list
    for (var i = 0; i < vm.dispList.length; i++) {
      if (vm.dispList[i].UID == dispRecord.UID) {
        vm.dispList.splice(i, 1);
      }
    }
  }


  /******************************         EDIT RECORD                  ************************/
  function editRec(dispRecord) {
    // go to edit 
    $state.go('edit_record', {
      mode: MODE_EDIT,
      recUID: dispRecord.UID
    });
  }


  /********************************************************************************************/
  /*                                      EVENT MANAGEMENT
  /********************************************************************************************/
  $rootScope.$on('display_configuration_updated', function() {
    vm.displayConf = DBrecord.getDisplayConf();
  })


  /********************************************************************************************/
  /*                                      TOOL BOX
  /********************************************************************************************/
  function refreshRecList() {
    vm.dispList = [];
    vm.dayList = [];
    vm.recList = DBrecord.getRecList();

    if (vm.recList.length === 0)
      return;

    for (var i = 0; i < vm.recList.length; i++) {
      var dispItem = {};

      dispItem.UID = vm.recList[i].UID;

      // set properties
      dispItem.time = new Date(vm.recList[i].startTime);
      dispItem.leftSide = vm.recList[i].leftSide;
      dispItem.rightSide = vm.recList[i].rightSide;
      dispItem.breast = vm.recList[i].breast;
      dispItem.duration = vm.recList[i].duration;
      dispItem.bottle = vm.recList[i].bottle;
      dispItem.quantity = vm.recList[i].quantity;
      dispItem.diapper = vm.recList[i].diapper;
      dispItem.peeLevel = vm.recList[i].peeLevel;
      dispItem.pooLevel = vm.recList[i].pooLevel;
      dispItem.bath = vm.recList[i].bath;
      dispItem.medecine = vm.recList[i].medecine;
      dispItem.vitamin = vm.recList[i].vitamin;
      dispItem.paracetamol = vm.recList[i].paracetamol;
      dispItem.otherMed = vm.recList[i].otherMed;
      dispItem.otherMedName = vm.recList[i].otherMedName;
      dispItem.message = vm.recList[i].message;
      dispItem.msgTxt = vm.recList[i].msgTxt;

      vm.dispList[i] = dispItem;
    }

    /* sort the list (but already done ) // WARNING: this function has bug when dispList.lenght > 10
    vm.dispList.sort(function(a, b) {
      return (a.time.getTime() > b.time.getTime());
    })*/

    _refreshDayList();

    /* display recList from BOTTOM */
    $timeout(function() {
      var view = $ionicScrollDelegate.$getByHandle('histView').getScrollView();
      view.resize();
      var y = view.getScrollMax();
      $ionicScrollDelegate.scrollTo(0, y.top);
      //$ionicScrollDelegate.scrollBottom();
    });

  };


  function _refreshDayList() {
    vm.dayList = [];
    for (var i = 0; i < vm.dispList.length; i++) {
      var recTime = new Date(vm.dispList[i].time);
      var alreadyInList = false;
      var j = 0;
      for (j = 0; j < vm.dayList.length; j++) {
        if (vm.dayList[j].toDateString() == recTime.toDateString()) {
          alreadyInList = true;
          break;
        }
      }
      if (alreadyInList === false) {
        // set show state
        //if (recTime.getDate() == (new Date()).getDate())
        recTime.show = true;
        vm.dayList.push(recTime);
      }
    }
  }

  function _updateInterval() {
    var durationTotal = 0;

    // get current time
    var curTime = new Date();

    // get last starting time
    var lastFeedTime;
    if (vm.recList.length > 0) {
      lastFeedTime = new Date(vm.recList[vm.recList.length - 1].startTime);
      durationTotal = (curTime.getTime() - lastFeedTime.getTime()) / 1000;
    }
    //display DAY duration
    vm.durDay = Math.floor(durationTotal / (60 * 60 * 24));

    // display HOUR duration
    vm.durHour = utils.formatHour(Math.floor(durationTotal / (60 * 60) - vm.durDay * 24));
    var curHour = Math.floor(durationTotal / (60 * 60) - vm.durDay * 24);
    var minutesLeft = durationTotal - (vm.durDay * 24 + curHour) * 60 * 60;

    // display MINUTE duration
    vm.durMin = utils.formatMinute(Math.floor(minutesLeft / 60));
  };

  _updateInterval();

})