angular.module('app.controllers')

.controller('histCtrl', function($scope, $state, $interval, utils, DBrecord) {
  var vm = this;

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
  //vm.getDayRec = getDayRec;
  vm.delRec = delRec;
  vm.editRec = editRec;

  /******************************         INITIALISATION               ************************/
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
    vm.showHideDay = !vm.showHideDay;
  }


  /******************************     GET DAY RECORDS             ************************
  function getDayRec(day) {
    var l_dispList = [];
    var dayRecList = DBrecord.getRecList(day);

    if (dayRecList.length === 0)
      return;


    for (var i = 0; i < 3; i++) {
      var dispItem = {};

      dispItem.UID = dayRecList[i].UID;

      // set time
      dispItem.time = new Date(dayRecList[i][0].startTime);
      var test = dispItem.time.getTime();

      // set duration and side
      dispItem.left = false;
      dispItem.right = false;
      dispItem.duration = 0;
      /*
      for (var j = 0; j < dayRecList[i].length; j++) {
        dispItem.duration += dayRecList[i][j].duration;
        if (dayRecList[i][j].side.id == LEFT.id)
          dispItem.left = true;
        if (dayRecList[i][j].side.id == RIGHT.id)
          dispItem.right = true;
      }
      //set pee/poo : TODO

      l_dispList.push(dispItem);
    }

    return l_dispList;
  }*/


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

      // set time
      dispItem.time = new Date(vm.recList[i].startTime);
      var test = dispItem.time.getTime();

      // set duration and side
      dispItem.left = false;
      dispItem.right = false;
      dispItem.duration = 0;
      for (var j = 0; j < vm.recList[i].length; j++) {
        dispItem.duration += vm.recList[i][j].duration;
        if (vm.recList[i][j].side.id == LEFT.id)
          dispItem.left = true;
        if (vm.recList[i][j].side.id == RIGHT.id)
          dispItem.right = true;
      }
      //set pee/poo : TODO

      vm.dispList[i] = dispItem;
    }

    // sort the list (but already done )
    vm.dispList.sort(function(a, b) {
      return (a.time.getTime() > b.time.getTime());
    })

    //_refreshDayList();
  };

  /*
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
      if (alreadyInList === false)
        vm.dayList.push(recTime);
    }
  }*/

  function _updateInterval() {
    var durationTotal = 0;

    // get current time
    var curTime = new Date();

    // get last starting time
    var lastFeedTime = new Date(vm.recList[vm.recList.length - 1].startTime);

    durationTotal = (curTime.getTime() - lastFeedTime.getTime()) / 1000;

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