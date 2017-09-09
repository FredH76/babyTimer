angular.module('app.controllers')

.controller('inputCtrl', function($scope, $state, $stateParams, $interval, ionicDatePicker, ionicTimePicker, utils, DBrecord) {
  var vm = this;

  vm.autoMode = false;
  vm.manualMode = false;
  //vm.curHour = null;
  //vm.curMin = null;
  //vm.curSec = null;
  vm.chrHour = "";
  vm.chrMin = "";
  vm.chrSec = "";
  vm.leftSide = false;
  vm.rightSide = false;
  vm.curState = null;
  vm.curDuration = 0;
  vm.curRecord = {};
  vm.durationRec = [];
  vm.selDayStr = "";
  vm.selHour = "";
  vm.selMin = "";
  vm.enableDiaper = false;
  vm.enableBath = false;
  vm.peeSlider = {};
  vm.pooSlider = {};
  vm.durationSlider = {};
  vm.enableSave = false;

  vm.test = function() {
    /*var elt = document.getElementById("test");
    elt.setAttribute("style", "height:200px");*/
  }

  /******************************      FUNCTION DECLARATION            ************************/
  vm.openDatePicker = openDatePicker;
  vm.openTimePicker = openTimePicker;
  vm.onLeftSideClick = onLeftSideClick;
  vm.onRightSideClick = onRightSideClick;
  vm.onToggleDiapper = onToggleDiapper;
  vm.onToggleBath = onToggleBath;
  vm.run = run;
  vm.pause = pause;
  vm.save = save;
  vm.cancel = cancel;


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
  //_extractHMS(new Date());
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
  vm.selHour = utils.formatHour((new Date()).getHours());
  vm.selMin = utils.formatMinute(parseInt(new Date().getMinutes() / 5) * 5);

  vm.peeSlider = {
    value: 0,
    options: {
      onEnd: _onSliderPee,
      floor: 0,
      ceil: 3,
      showTicks: true
    }
  };

  vm.pooSlider = {
    value: 0,
    options: {
      onEnd: _onSliderPoo,
      floor: 0,
      ceil: 3,
      showTicks: true
    }
  };

  vm.durationSlider = {
    value: 0,
    options: {
      onEnd: _onSliderDuration,
      floor: 0,
      ceil: 40,
      ceilLabel: '40 mn',
      step: 5,
      //autoHideLimitLabels: false,
      ticksArray: [0, 2],
      //showTicks: true,
      showTicksValues: true,
    }
  };

  $interval(function() {
      var durationTotal = 0;

      // get current time
      var curTime = new Date();

      // Extract current time for display
      //_extractHMS(curTime);

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

  /*********************         Click on LEFT RADIO BUTTON                *****************/
  function onLeftSideClick() {
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;

    // update display
    vm.leftSide = !vm.leftSide;
    if (vm.autoMode)
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
  function onRightSideClick() {
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;

    // update display
    if (vm.autoMode)
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


  /*********************         Change Manual DURATION SLIDER              *****************/
  function _onSliderDuration() {
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;

    // TODO : update vm.durationRec[0] ...
  }


  /*********************           Click on DIAPPER BUTTON                  *****************/
  function onToggleDiapper() {
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;

    // update display
    vm.enableDiaper = !vm.enableDiaper;
  }

  /*********************            Change PEE DIAPPER SLIDER               *****************/
  function _onSliderPee() {
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;

    // TODO : update vm.diapper ...
  }

  /*********************            Change POO DIAPPER SLIDER               *****************/
  function _onSliderPoo() {
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;

    // TODO : update vm.diapper ...
  }

  /*********************            Click on BATH BUTTON                    *****************/
  function onToggleBath() {
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;

    // update display
    vm.enableBath = !vm.enableBath;
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
    var datePickerConf = {
      callback: _onDatePicked, //WARNING: callback is Mandatory!
      inputDate: new Date(vm.selDayStr),
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
    };
    ionicDatePicker.openDatePicker(datePickerConf);
  };

  function _onDatePicked(val) { //Mandatory
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;

    var selDate = new Date(val);
    console.log('Return value from the datepicker popup is : ' + val, selDate);
    vm.selDayStr = selDate.toDateString();
  }
  openTimePicker

  /*********************               OPEN TIME PICKER                     *******************/
  function openTimePicker() {
    var timePickerConf = {
      callback: _onTimePicked, //WARNING: callback is Mandatory!
      inputTime: vm.selHour * 60 * 60 + vm.selMin * 60,
      format: 24,
      step: 5,
      setLabel: 'Set',
      closeLabel: 'Cancel'
    };
    ionicTimePicker.openTimePicker(timePickerConf);
  };

  function _onTimePicked(val) { //Mandatory
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;

    var selTime = new Date(val * 1000);
    console.log('Return value from the datepicker popup is : ' + val, selTime);
    vm.selHour = utils.formatHour(selTime.getUTCHours());
    vm.selMin = utils.formatMinute(selTime.getUTCMinutes());
  }

  /*********************                  SAVE                                *****************/
  /*  update and save current record according to foloowing format
  /*  rec.duration = [] : array of duration rec
  /*  
  /*  rec.side
  /*  rec.diapper
  /*  rec.bath
  /********************************************************************************************/
  function save() {

    if (vm.enableSave === false)
      return;

    var l_rec = {};

    // set default start time if not 
    if (vm.durationRec.length === 0) {
      vm.durationRec[0] = {};
      vm.durationRec[0].startTime = new Date();
    }

    // set end time if still running
    if (vm.curState == vm.STATE_RUNNING) {
      //store ending time
      var date = new Date();
      vm.durationRec[vm.durationRec.length - 1].endTime = date;
      //compute record duration
      vm.durationRec[vm.durationRec.length - 1].duration = vm.curDuration;
    }

    l_rec.duration = vm.durationRec;

    // add pee/poo info
    l_rec.diapper = {};
    if (vm.enableDiaper) {
      l_rec.diapper.peeLevel = vm.peeSlider.value;
      l_rec.diapper.pooLevel = vm.pooSlider.value;
    }

    // add bath info
    l_rec.bath = vm.enableBath;

    // save records in DB
    DBrecord.saveRec(l_rec);

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

  /*********************         EXTRACT HOUR/MINUTE/SECOND                   *****************
  function _extractHMS(date) {
    var curTime = date.toTimeString(); // format = 23:19:34 GMT+0200 (Paris, Madrid (heure d’été))

    vm.curHour = curTime.slice(0, 2);
    vm.curMin = curTime.slice(3, 5);
    vm.curSec = curTime.slice(6, 8);
  }*/

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