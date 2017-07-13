angular.module('app.controllers')

.controller('autoCtrl', function ($scope, $interval) {
    var vm = this;

    vm.curHour = null;
    vm.curMin = null;
    vm.curSec = null;
    vm.chrHour = "";
    vm.chrMin = "";
    vm.chrSec = "";
    vm.curState = null;
    vm.durationTotal = new Date();
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
    _getTime();
    vm.chrHour = _formatHour(0);
    vm.chrMin = _formatMinute(0);
    vm.chrSec = _formatSecond(0);
    vm.curState = vm.STATE_IDLE;


    $interval(function () {
            // get current time
            _getTime();

            if (vm.curState == vm.STATE_RUNNING) {
                // compute previous duration (from pause/resume event)
                for (var i = 0; i < vm.durationRec.length; i++)
                    vm.durationTotal += vm.durationRec[i].duration;

                // compute current duration
                var startTime = vm.durationRec[vm.durationRec.length - 1].startTime;
                var curTime = new Date();
                vm.durationTotal += curTime.getTime() - startTime.getTime();

                var curDuration = vm.durationTotal.toTimeString(); // format = 23:19:34 GMT+0200 (Paris, Madrid (heure d’été))

                vm.chrHour = curDuration.slice(0, 2);
                vm.chrMin = curDuration.slice(3, 5);
                vm.chrSec = curDuration.slice(6, 8);

            }
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
        vm.curState = vm.STATE_PAUSED;

        // get current record
        var recIndex = vm.durationRec.length - 1;
        if (recIndex < 0) {
            console.warn("RECORDING CAN NOT BE PAUSED : NO RECORD IN PROGRESS");
            return;
        }
        var curRecord = vm.durationRec[recIndex];
        //store ending time
        var date = new Date();
        curRecord.endTime = date;
        //compute record duration
        curRecord.duration = curRecord.startTime - curRecord.endTime;

    }


    /*********************                  SAVE                                *****************/
    function save() {
        // come back to IDDLE state
        vm.curState = vm.STATE_IDLE;

        // delete records
        durationRec = [];
    }


    /*********************                  CANCEL                              *****************/
    function cancel() {
        // come back to IDDLE state
        vm.curState = vm.STATE_IDLE;

        // delete records
        durationRec = [];
    }


    /********************************************************************************************/
    /*                                      TOOL BOX
    /********************************************************************************************/

    /*********************                  SET TIME                            *****************/
    function _getTime() {
        var date = new Date();
        var curTime = date.toTimeString(); // format = 23:19:34 GMT+0200 (Paris, Madrid (heure d’été))

        vm.curHour = curTime.slice(0, 2);
        vm.curMin = curTime.slice(3, 5);
        vm.curSec = curTime.slice(6, 8);
    }

    /*********************                  FORMAT hour Display                 *****************/
    function _formatHour(hour, pmEnable) {
        var strHour = "";

        if ((pmEnable === true) && (hour > 11)) hour = hour - 12;

        if (hour < 10)
            strHour = "0";

        strHour += hour.toString();

        return (strHour);
    }

    /*********************                  FORMAT Minute Display               *****************/
    function _formatMinute(min) {
        return (_formatSecond(min));
    }

    /*********************                  FORMAT Second Display               *****************/
    function _formatSecond(sec) {
        var strSec = "";

        if (sec < 10)
            strSec = "0";

        strSec += sec.toString();

        return (strSec);
    }

})