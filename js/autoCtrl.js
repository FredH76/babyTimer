angular.module('app.controllers')

.controller('autoCtrl', function ($scope, $interval, utils) {
    var vm = this;

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


    /******************************      FUNCTION DECLARATION            ************************/
    vm.run = run;
    vm.pause = pause;
    vm.save = save;
    vm.cancel = cancel;


    /******************************      DEFINE CONSTANT for HTML        ************************/
    vm.STATE_IDLE = 0x00;
    vm.STATE_PAUSED = 0x01
    vm.STATE_RUNNING = 0x02;


    /******************************         INITIALISATION               ************************/
    _extractHMS(new Date());
    vm.chrHour = utils.formatHour(0);
    vm.chrMin = utils.formatMinute(0);
    vm.chrSec = utils.formatSecond(0);
    vm.curState = vm.STATE_IDLE;


    $interval(function () {
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


    /*********************                  RUN                               *****************/
    function run() {
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

        // add new record to list
        vm.durationRec.push(record);
    }


    /*********************                  PAUSE                               *****************/
    function pause() {
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


    /*********************                  SAVE                                *****************/
    function save() {
        // come back to IDDLE state
        vm.curState = vm.STATE_IDLE;

        //reset chrono
        _resetChrono();

        // delete records
        vm.durationRec = [];
    }


    /*********************                  CANCEL                              *****************/
    function cancel() {
        // come back to IDDLE state
        vm.curState = vm.STATE_IDLE;

        //reset chrono
        _resetChrono();

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
        vm.curDuration = 0

        //reset Display
        vm.chrHour = utils.formatHour(0);
        vm.chrMin = utils.formatMinute(0);
        vm.chrSec = utils.formatSecond(0);
    }
})