angular.module('app.controllers')

.controller('histCtrl', function ($scope, $state, utils, DBrecord) {
    var vm = this;

    vm.recList = [];
    vm.dispList = [];

    /******************************      FUNCTION DECLARATION            ************************/
    vm.doRefresh = doRefresh;
    vm.switchEditMode = switchEditMode;
    vm.delRec = delRec;
    vm.editRec = editRec;

    /******************************         INITIALISATION               ************************/
    refreshRecList();
    vm.editMode = false;

    /********************************************************************************************/
    /*                              PUBLIC FUNCTIONS IMPLEMENTATION
    /********************************************************************************************/

    /******************************     REFRESH RECORD LIST              ************************/
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


    /******************************         SWITCH EDIT MODE             ************************/
    function editRec(dispRecord) {

        // go to manual 
        $state.go('tab.manual', {recUID : dispRecord.UID});
    }



    /********************************************************************************************/
    /*                                      TOOL BOX
    /********************************************************************************************/
    function refreshRecList() {
        vm.dispList = [];
        vm.recList = DBrecord.getRecList();

        for (var i = 0; i < vm.recList.length; i++) {
            var dispItem = {};

            dispItem.UID = vm.recList[i].UID;

            // set time
            dispItem.time = new Date(vm.recList[i][0].startTime);
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
    };

})