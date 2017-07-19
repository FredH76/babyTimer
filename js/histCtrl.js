angular.module('app.controllers')

.controller('histCtrl', function ($scope, utils, DBrecord) {
    var vm = this;

    vm.recList = [];
    vm.dispList = [];

    /******************************      FUNCTION DECLARATION            ************************/
    vm.doRefresh = doRefresh;

    /******************************         INITIALISATION               ************************/
    refreshRecList();

    /********************************************************************************************/
    /*                              PUBLIC FUNCTIONS IMPLEMENTATION
    /********************************************************************************************/
    function doRefresh() {
        refreshRecList();

        $scope.$broadcast('scroll.refreshComplete');
    }

    /********************************************************************************************/
    /*                                      TOOL BOX
    /********************************************************************************************/
    function refreshRecList() {
        vm.dispList = [];
        vm.recList = DBrecord.getRecList();

        for (var i = 0; i < vm.recList.length; i++) {
            var dispItem = {};

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