angular.module('app.controllers')

.controller('manualCtrl', function ($scope, ionicDatePicker) {
    var vm = this;

    var datePickerConf = {};
    vm.enableSave = false;
    vm.selDayStr = "";
    vm.peeSlider = {};
    vm.pooSlider = {};
    vm.rightSide = false;

    /******************************      FUNCTION DECLARATION            ************************/
    vm.openDatePicker = openDatePicker;
    vm.onDatePicked = onDatePicked;
    vm.addBreast = addBreast;
    vm.addBottle = addBottle;
    //vm.leftSideClick = leftSideClick;
    //vm.rightSideClick = rightSideClick;
    vm.save = save;
    vm.cancel = cancel;


    /******************************      DEFINE CONSTANT for HTML        ************************/
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


    /********************************************************************************************/
    /*                              PUBLIC FUNCTIONS IMPLEMENTATION
    /********************************************************************************************/

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
    /*********************                  ADD BREAST                        *******************/
    function addBreast() {
        // enable SAVE/CANCEL BUTTON
        vm.enableSave = true;

    }

    /*********************                  ADD BOTTLE                        *******************/
    function addBottle() {
        // enable SAVE/CANCEL BUTTON
        vm.enableSave = true;

    }

    /*********************         Click on LEFT RADIO BUTTON                *****************
    function leftSideClick() {
            // enable SAVE/CANCEL BUTTON
            vm.enableSave = true;

    }*/

    /*********************         Click on RIGHT RADIO BUTTON                *****************
    function rightSideClick() {
            // enable SAVE/CANCEL BUTTON
            vm.enableSave = true;

    }*/

    /*********************                  SAVE                                *****************/
    function save() {

    }

    /*********************                  CANCEL                              *****************/
    function cancel() {
        // disable SAVE/CANCEL BUTTON
        vm.enableSave = false;

        // reset current day
        //vm.selDayStr = (new Date()).toDateString();


    }

})