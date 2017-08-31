angular.module('app.controllers')

.controller('inputCtrl', function($scope, $state, $stateParams, $interval, ionicDatePicker, utils, DBrecord) {
  var vm = this;

  vm.autoMode = false;
  vm.manualMode = false;
  vm.curHour = null;
  vm.curMin = null;
  vm.curSec = null;
  vm.chrHour = "";
  vm.chrMin = "";
  vm.chrSec = "";
  vm.curState = null;
  vm.curDuration = 0;
  vm.curRecord = {};
  vm.durationRec = [];
  vm.selDayStr = "";
  vm.peeSlider = {};
  vm.pooSlider = {};
  vm.toggleSide = false;
  vm.enableSave = false;
  vm.leftSide = false;
  vm.rightSide = false;

  vm.test = function() {
    /*var elt = document.getElementById("test");
    elt.setAttribute("style", "height:200px");*/
  }

  /******************************      FUNCTION DECLARATION            ************************/
  vm.run = run;
  vm.pause = pause;
  vm.save = save;
  vm.cancel = cancel;
  //vm.updateSide = updateSide;
  vm.leftSideClick = leftSideClick;
  vm.rightSideClick = rightSideClick;
  vm.openDatePicker = openDatePicker;
  vm.onDatePicked = onDatePicked;


  /******************************      DEFINE CONSTANT for HTML        ************************/
  vm.STATE_IDLE = 0x00;
  vm.STATE_PAUSED = 0x01
  vm.STATE_RUNNING = 0x02;

  vm.LEFT = {
    id: 0x01,
    string: "left"
  };
  vm.RIGHT = {
    id: 0x02,
    string: "right"
  };
  vm.UNDEF = {
    id: 0x00,
    string: "no side"
  }

  /******************************         INITIALISATION               ************************/
  _extractHMS(new Date());
  if ($stateParams.mode === "auto")
    vm.autoMode = true;
  else {
    vm.manualMode = true;
    /// TODO : initialize date and value from record parameter (if so)
  }
  vm.chrHour = utils.formatHour(0);
  vm.chrMin = utils.formatMinute(0);
  vm.chrSec = utils.formatSecond(0);
  vm.curState = vm.STATE_IDLE;
  vm.selDayStr = (new Date()).toDateString();

  datePickerConf = {
    callback: vm.onDatePicked, //WARNING: callback is Mandatory!
    inputDate: new Date(),
    titleLabel: 'Select a Date',
    setLabel: 'Set',
    todayLabel: 'Today',
    closeLabel: 'Close',
    mondayFirst: true,
    weeksList: ["S", "M", "T", "W", "T", "F", "S"],
    monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
    templateType: 'popup',
    from: new Date(2012, 8, 1),
    to: new Date(2018, 8, 1),
    showTodayButton: true,
    dateFormat: 'dd MMMM yyyy',
    closeOnSelect: false,
    disableWeekdays: []
  }

  vm.peeSlider = {
    value: 0,
    options: {
      floor: 0,
      ceil: 3,
      showTicks: true
    }
  };

  vm.pooSlider = {
    value: 0,
    options: {
      floor: 0,
      ceil: 3,
      showTicks: true
    }
  };


  $interval(function() {
      var durationTotal = 0;

      // get current time
      var curTime = new Date();

      // Extract current time for display
      _extractHMS(curTime);

      // compute previous duration (from run/pause event)
      for (var i = 0; i < vm.durationRec.length; i++)
        durationTotal += vm.durationRec[i].duration;

      // add current duration (if running state)
      if (vm.curState == vm.STATE_RUNNING) {
        var startTime = vm.durationRec[vm.durationRec.length - 1].startTime;

        vm.curDuration = (curTime.getTime() - startTime.getTime()) / 1000;

        durationTotal += vm.curDuration;
      }

      // display current HOUR duration
      vm.chrHour = utils.formatHour(Math.floor(durationTotal / (60 * 60)));
      var minutesLeft = durationTotal - vm.chrHour * 60 * 60;

      // display current MINUTE duration
      vm.chrMin = utils.formatMinute(Math.floor(minutesLeft / 60));
      var secondsLeft = minutesLeft - vm.chrMin * 60;

      // display current SECOND duration
      vm.chrSec = utils.formatSecond(Math.floor(secondsLeft));

    },
    1000
  ); // start clock timer


  /********************************************************************************************/
  /*                              PUBLIC FUNCTIONS IMPLEMENTATION
  /********************************************************************************************/

  /*function updateSide() {

      // enable SAVE/CANCEL BUTTON
      vm.enableSave = true;

      if (vm.curState == vm.STATE_RUNNING) {
          if (vm.toggleSide)
              vm.durationRec[vm.durationRec.length - 1].side = vm.RIGHT;
          else
              vm.durationRec[vm.durationRec.length - 1].side = vm.LEFT;
      }
  }*/

  /*********************         Click on LEFT RADIO BUTTON                *****************/
  function leftSideClick() {
    // update display
    vm.leftSide = !vm.leftSide;
    vm.rightSide = false;

    // update record
    if (vm.curState == vm.STATE_RUNNING) {
      if (vm.leftSide)
        vm.durationRec[vm.durationRec.length - 1].side = vm.LEFT;
      else
        vm.durationRec[vm.durationRec.length - 1].side = vm.UNDEF;
    }
  }

  /*********************         Click on RIGHT RADIO BUTTON                *****************/
  function rightSideClick() {
    // update display
    vm.leftSide = false;
    vm.rightSide = !vm.rightSide;

    // update record
    if (vm.curState == vm.STATE_RUNNING) {
      if (vm.rightSide)
        vm.durationRec[vm.durationRec.length - 1].side = vm.RIGHT;
      else
        vm.durationRec[vm.durationRec.length - 1].side = vm.UNDEF;
    }
  }

  /*********************                  RUN                               *****************/
  function run() {
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;

    //switch to RUNNING state
    vm.curState = vm.STATE_RUNNING;

    // initialize duration counter
    vm.curDuration = 0;

    // create a new time record
    var record = {};

    // store start time
    var date = new Date();
    record.startTime = date;
    record.endTime = null;
    record.duration = 0;
    record.side = vm.leftSide ? vm.LEFT : vm.rightSide ? vm.RIGHT : vm.UNDEF;

    // add new record to list
    vm.durationRec.push(record);
  }


  /*********************                  PAUSE                               *****************/
  function pause() {
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;

    //switch to PAUSED state
    vm.curState = vm.STATE_IDLE;

    // get current record
    var recIndex = vm.durationRec.length - 1;
    if (recIndex < 0) {
      console.warn("RECORDING CAN NOT BE PAUSED : NO RECORD IN PROGRESS");
      return;
    }
    //store ending time
    var date = new Date();
    vm.durationRec[recIndex].endTime = date;
    //compute record duration
    vm.durationRec[recIndex].duration = vm.curDuration;

    //reset current duration
    vm.curDuration = 0;
  }


  /*********************               OPEN DATE PICKER                     *******************/
  function openDatePicker() {
    ionicDatePicker.openDatePicker(datePickerConf);
  };

  function onDatePicked(val) { //Mandatory
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;
    var selDate = new Date(val);
    console.log('Return value from the datepicker popup is : ' + val, selDate);
    vm.selDayStr = selDate.toDateString();
  }


  /*********************                  SAVE                                *****************/
  function save() {

    // save end time if still running
    if (vm.curState == vm.STATE_RUNNING) {
      //store ending time
      var date = new Date();
      vm.durationRec[vm.durationRec.length - 1].endTime = date;
      //compute record duration
      vm.durationRec[vm.durationRec.length - 1].duration = vm.curDuration;
    }

    // save records in DB
    DBrecord.saveRec(vm.durationRec);

    // disable SAVE/CANCEL BUTTON
    vm.enableSave = false;

    // come back to IDDLE state
    vm.curState = vm.STATE_IDLE;

    //reset chrono
    _resetChrono();

    // reset Pee/Poo
    vm.peeSlider.value = 0;
    vm.pooSlider.value = 0;

    // reset side
    vm.leftSide = false;
    vm.rightSide = false;

    // delete records
    vm.durationRec = [];

    // go to historic
    $state.go('tab.historic', {});
  }


  /*********************                  CANCEL                              *****************/
  function cancel() {
    // disable SAVE/CANCEL BUTTON
    vm.enableSave = false;

    // come back to IDDLE state
    vm.curState = vm.STATE_IDLE;

    //reset chrono
    _resetChrono();

    // reset Pee/Poo
    vm.peeSlider.value = 0;
    vm.pooSlider.value = 0;

    // reset side
    vm.leftSide = false;
    vm.rightSide = false;

    // delete records
    vm.durationRec = [];
  }


  /********************************************************************************************/
  /*                                      TOOL BOX
  /********************************************************************************************/

  /*********************         EXTRACT HOUR/MINUTE/SECOND                   *****************/
  function _extractHMS(date) {
    var curTime = date.toTimeString(); // format = 23:19:34 GMT+0200 (Paris, Madrid (heure d’été))

    vm.curHour = curTime.slice(0, 2);
    vm.curMin = curTime.slice(3, 5);
    vm.curSec = curTime.slice(6, 8);
  }

  /*********************                  RESET CHRONO                        *****************/
  function _resetChrono() {
    //reset Duration counter
    vm.curDuration = 0;

    //reset Display
    vm.chrHour = utils.formatHour(0);
    vm.chrMin = utils.formatMinute(0);
    vm.chrSec = utils.formatSecond(0);
  }

})