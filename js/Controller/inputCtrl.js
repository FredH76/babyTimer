angular.module('app.controllers')

.controller('inputCtrl', function($document, $scope, $state, $stateParams, $ionicHistory, $interval, $timeout, ionicDatePicker, ionicTimePicker, utils, DBrecord) {
  var vm = this;

  vm.curMode = 0;
  vm.autoMode = false;
  vm.manualMode = false;
  //vm.curHour = null;
  //vm.curMin = null;
  //vm.curSec = null;
  var startRunTime = null;
  vm.chrHour = "";
  vm.chrMin = "";
  vm.chrSec = "";
  vm.leftSide = false;
  vm.rightSide = false;
  vm.curState = null;
  vm.curDuration = 0;
  vm.curRecord = {};
  vm.startTime = null;
  vm.selDayStr = "";
  vm.selHour = "";
  vm.selMin = "";
  vm.diapper = false;
  vm.bath = false;
  vm.peeSlider = {};
  vm.pooSlider = {};
  vm.durationSlider = {};
  vm.enableSave = false;

  vm.test = function() {
    /*var elt = document.getElementById("test");
    elt.setAttribute("style", "height:200px");*/
  }

  /******************************      FUNCTION DECLARATION            ************************/
  vm.goBack = goBack;
  vm.openDatePicker = openDatePicker;
  vm.openTimePicker = openTimePicker;
  vm.onLeftSideClick = onLeftSideClick;
  vm.onRightSideClick = onRightSideClick;
  vm.onToggleDiapper = onToggleDiapper;
  vm.onToggleBath = onToggleBath;
  vm.run = run;
  vm.pause = pause;
  vm.save = save;
  vm.reset = reset;
  vm.cancel = cancel;

  /******************************      DEFINE CONSTANT for HTML        ************************/
  vm.STATE_IDLE = 0x00;
  vm.STATE_PAUSED = 0x01
  vm.STATE_RUNNING = 0x02;

  vm.MODE_AUTO = MODE_AUTO;
  vm.MODE_MANUAL = MODE_MANUAL;
  vm.MODE_EDIT = MODE_EDIT;

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
  // set up current mode (AUTO/EDIT/MANUAL)
  switch (parseInt($stateParams.mode)) {
    case MODE_AUTO:
      vm.curMode = MODE_AUTO;
      break;
    case MODE_EDIT:
      vm.curMode = MODE_EDIT;
      break;
    default:
      vm.curMode = MODE_MANUAL;
  }

  vm.peeSlider = {
    value: 2,
    options: {
      onEnd: _onSliderPee,
      floor: 0,
      ceil: 3,
      showTicks: true
    }
  };

  vm.pooSlider = {
    value: 3,
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

  // init displayed data
  _initData();

  // start timer for each second
  $interval(function() {
      // if running state
      if (vm.curState == vm.STATE_RUNNING) {

        // init time data
        var l_durationTotal = vm.duration; // init total with already stored duration
        var l_elapsedTime = 0;

        // compute elapsed time
        l_elapsedTime = ((new Date()).getTime() - startRunTime.getTime()) / 1000;
        l_durationTotal += l_elapsedTime;

        // display current HOUR duration
        vm.chrHour = utils.formatHour(Math.floor(l_durationTotal / (60 * 60)));
        var minutesLeft = l_durationTotal - vm.chrHour * 60 * 60;

        // display current MINUTE duration
        vm.chrMin = utils.formatMinute(Math.floor(minutesLeft / 60));
        var secondsLeft = minutesLeft - vm.chrMin * 60;

        // display current SECOND duration
        vm.chrSec = utils.formatSecond(Math.floor(secondsLeft));
      }
    },
    1000
  );

  // update diapper slider after the DOM is loaded
  $document.ready(function() {
    $timeout(function() {
      $scope.$broadcast('rzSliderForceRender');
    }, 10);
  });

  /********************************************************************************************/
  /*                              PUBLIC FUNCTIONS IMPLEMENTATION
  /********************************************************************************************/

  /****************************        GO back         ****************************************/
  function goBack() {
    var backView = $ionicHistory.backView();
    backView.go();
  }

  /*********************          Click on LEFT SIDE  BUTTON                  *****************/
  function onLeftSideClick() {
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;

    // update display
    vm.leftSide = !vm.leftSide;
  }

  /*********************          Click on RIGHT SIDE BUTTON                  *****************/
  function onRightSideClick() {
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;

    // update display
    vm.rightSide = !vm.rightSide;
  }


  /*********************         Change Manual DURATION SLIDER              *****************/
  function _onSliderDuration() {
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;
  }


  /*********************           Click on DIAPPER BUTTON                  *****************/
  function onToggleDiapper() {
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;
  }

  /*********************            Change PEE DIAPPER SLIDER               *****************/
  function _onSliderPee() {
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;
  }

  /*********************            Change POO DIAPPER SLIDER               *****************/
  function _onSliderPoo() {
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;
  }

  /*********************            Click on BATH BUTTON                    *****************/
  function onToggleBath() {
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;
  }

  /*********************                  RUN                               *****************/
  function run() {
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;

    // switch to RUNNING state
    vm.curState = vm.STATE_RUNNING;

    // store run time start
    if (startRunTime === null)
      startRunTime = new Date();
  }


  /*********************                  PAUSE                               *****************/
  function pause() {
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;

    // switch to PAUSED state
    vm.curState = vm.STATE_IDLE;

    // add elapsed time to stored duration
    var elapsedTime = ((new Date()).getTime() - startRunTime.getTime()) / 1000;
    vm.duration += elapsedTime;

    // reset run time start
    startRunTime = null;
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
  /*  update and save current record according to following format
  /*  rec.startTime
  /*  rec.duration
  /*  rec.leftSide
  /*  rec.rightSide
  /*  rec.diapper
  /*  rec.peeLevel
  /*  rec.pooLevel
  /*  rec.bath
  /********************************************************************************************/
  function save() {
    var l_rec = {};

    // add START TIME info
    l_rec.startTime = vm.startTime;

    // add DURATION info
    if (vm.curMode == MODE_AUTO) {
      //if still running : compute elapsed time and add it to duration
      if (vm.curState == vm.STATE_RUNNING) {
        var elapsedTime = ((new Date()).getTime() - startRunTime.getTime()) / 1000;
        vm.duration += elapsedTime;
      }
      l_rec.duration = vm.duration;
    }
    // else get duration slider value
    else
      l_rec.duration = vm.durationSlider.value;

    // add SIDE info
    l_rec.leftSide = vm.leftSide;
    l_rec.rightSide = vm.rightSide;

    // add DIAPPER/PEE/POO info
    l_rec.diapper = vm.diapper;
    l_rec.peeLevel = vm.peeSlider.value;
    l_rec.pooLevel = vm.pooSlider.value;

    // add BATH info
    l_rec.bath = vm.bath;

    // save records in DB
    DBrecord.saveRec(l_rec);

    // disable SAVE/CANCEL BUTTON
    vm.enableSave = false;

    // reset data
    _initData();

    // go to historic
    $state.go('tab.historic', {});
  }

  /*********************                  CANCEL                              *****************/
  function cancel() {
    //TODO : define cancel behavior
  }

  /*********************                  RESET                              *****************/
  function reset() {
    _initData();
  }


  /********************************************************************************************/
  /*                                      TOOL BOX
  /********************************************************************************************/

  function _initData() {

    // if mode AUTO
    if (vm.curMode === MODE_AUTO) {
      // day
      vm.startTime = new Date();
      // chrono
      startRunTime = null;
      vm.chrHour = utils.formatHour(0);
      vm.chrMin = utils.formatMinute(0);
      vm.chrSec = utils.formatSecond(0);
      // side 
      vm.leftSide = false;
      vm.rightSide = false;
      // state
      vm.curState = vm.STATE_IDLE;
      // duration
      vm.duration = 0;
      // diapper
      vm.diapper = false;
      vm.peeSlider.value = null;
      vm.pooSlider.value = null;
      // bath
      vm.bath = false;
    }

    //if mode MANUAL
    if (vm.curMode === MODE_MANUAL) {
      // day
      vm.startTime = new Date();
      // side 
      vm.leftSide = false;
      vm.rightSide = false;
      // duration
      vm.durationSlider.value = 0;
      // diapper
      vm.diapper = false;
      vm.peeSlider.value = null;
      vm.pooSlider.value = null;
      // bath :
      vm.bath = false;
    }

    //if mode EDIT
    if (vm.curMode === MODE_EDIT) {
      // control that recUID is linked to a valid record in DB
      var loaded_rec = DBrecord.loadRec($stateParams.recUID);
      if (loaded_rec === null) {
        //TODO : display warning popup
        // go back to historic
        $state.go('tab.historic', {});
        return;
      }
      // day
      vm.startTime = new Date(loaded_rec.startTime);
      // side
      vm.leftSide = loaded_rec.leftSide;
      vm.rightSide = loaded_rec.rightSide;
      // duration
      vm.durationSlider.value = loaded_rec.duration;
      // diapper
      vm.diapper = loaded_rec.diapper;
      vm.peeSlider.value = loaded_rec.peeLevel;
      vm.pooSlider.value = loaded_rec.pooLevel;
      // bath 
      vm.bath = loaded_rec.bath;
    }

    // string day
    vm.selDayStr = vm.startTime.toDateString();

    // hour and minute
    vm.selHour = utils.formatHour(vm.startTime.getHours());
    vm.selMin = utils.formatMinute(vm.startTime.getMinutes());
    //vm.selMin = utils.formatMinute(parseInt(vm.startTime.getMinutes() / 5) * 5);

    // disable save button
    vm.enableSave = false;

  }

  /*********************         EXTRACT HOUR/MINUTE/SECOND                   *****************
  function _extractHMS(date) {
    var curTime = date.toTimeString(); // format = 23:19:34 GMT+0200 (Paris, Madrid (heure d’été))

    vm.curHour = curTime.slice(0, 2);
    vm.curMin = curTime.slice(3, 5);
    vm.curSec = curTime.slice(6, 8);
  }*/

})