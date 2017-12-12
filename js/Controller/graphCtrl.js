angular.module('app.controllers')

.controller('graphCtrl', function ($document, $rootScope, $scope, $filter, $timeout, utils, ionicDatePicker, DBrecord, fileManager) {
  var vm = this;

  var refreshTimeout = null;
  vm.babyName = null;
  vm.breastSumChoice = true;
  vm.durationList = null;
  vm.duration = null;
  vm.startDate = null;
  vm.endDate = null;
  var lineColor = [];
  var backgroundColor = [];
  vm.weightChart = null;
  var measureData = null;
  var weightLabel = [];
  var weightConfig = null;
  vm.breastNbChart = null;
  vm.breastSumAvgChart = null;
  vm.breastSumChoice = null;
  var breastDataSets = null;
  var breastNbConfig = null;
  var breastSumAvgConfig = null;
  vm.bottleNbChart = null;
  vm.bottleSumAvgChart = null;
  vm.bottleSumChoice = null;
  var bottleDataSets = null;
  var bottleNbConfig = null;
  var bottleSumAvgConfig = null;


  /******************************      DEFINE CONSTANT for HTML        ************************/
  vm.TODAY_TEXT = $filter('translate')('GRAPH.TODAY_TEXT');

  /******************************      FUNCTION DECLARATION            ************************/
  vm.doRefresh = doRefresh;
  vm.onBreastSumClick = onBreastSumClick;
  vm.onBreastAverageClick = onBreastAverageClick;
  vm.onBottleSumClick = onBottleSumClick;
  vm.onBottleAverageClick = onBottleAverageClick;
  vm.changeDuration = changeDuration;
  vm.openDatePicker = openDatePicker;

  /******************************         INITIALISATION               ************************/
  refreshTimeout = 10;
  vm.durationList = utils.getDurationList();
  vm.duration = vm.durationList[2];
  vm.endDate = new Date;
  vm.startDate = new Date(moment(vm.endDate).subtract(vm.duration.nbDay, 'days'));

  // set COLOR depending on baby gender
  var baby = DBrecord.getCurBaby();
  /*if(baby == null){
    DBrecord.loadDemoBaby();
    baby = DBrecord.getBabyInfo();
  }*/
  vm.babyName = baby.firstname;
  if (baby.gender == MALE) {
    // color for boy (darkTurquoise #00CED1)
    //lineColor = ['#00CED1', '#74A2D2', '#00C795', '#6DD1B8']; //#00CED1;
    lineColor = [
      'rgb(0, 206, 209)', //#00CED1;
      'rgb(116, 162, 210)',
      'rgb(0, 199, 149)',
      'rgb(109, 209, 184)'
    ];
    backgroundColor = [
      'rgba(0, 206, 209, 0.1)',
      'rgba(116, 162, 210, 0.1)',
      'rgba(0, 199, 149, 0.1)',
      'rgba(109, 209, 184, 0.1 )',
    ];
  } else {
    // color for girl (LightPink #FFB6C1)
    //lineColor = ['#F68097', '#FF8B7F', '#FF6281', '#F278B6', '#FD61B9'];
    lineColor = [
      'rgb(246, 128, 151)',
      'rgb(255, 139, 127)',
      'rgb(242, 120, 182)',
      'rgb(242, 120, 182)',
      'rgb(253, 97, 185)'
    ]
    backgroundColor = [
      'rgba(246, 128, 151, 0.1)',
      'rgba(255, 139, 127, 0.1)',
      'rgba(242, 120, 182, 0.1)',
      'rgba(242, 120, 182, 0.1)',
      'rgba(253, 97, 185, 0.1)'
    ];
  }

  // get BREAST data to display
  breastData = DBrecord.getBreastData(baby.uid);
  // update breast Data (label and sets):
  _updateBreastDataSets(vm.startDate, vm.endDate);

  // get BOTTLE  data to display
  bottleData = DBrecord.getBottleData(baby.uid);
  // update bottle Data (label and sets):
  _updateBottleDataSets(vm.startDate, vm.endDate);

  // get MEASURE data to display
  measureData = DBrecord.getMeasureData(baby.uid);
  // create weightLabel:
  weightLabel = _createWeightAxisLabel();

  //---------------------------   INIT CHART DEFAULT OPTIONS   --------------------------------
  Chart.defaults.global.animation.duration = 0;
  Chart.defaults.global.maintainAspectRatio = false;
  Chart.defaults.global.title.display = true;
  Chart.defaults.global.title.padding = 15;
  Chart.defaults.global.title.fontSize = 12;
  Chart.defaults.global.elements.line.borderColor = lineColor[0];
  //Chart.defaults.global.elements.line.backgroundColor = backgroundColor[0];
  Chart.defaults.global.elements.rectangle.borderColor = lineColor[0];
  //Chart.defaults.global.elements.rectangle.backgroundColor = backgroundColor[0];
  Chart.defaults.global.elements.point.radius = 0; //  0 <=> NOTHING
  Chart.defaults.global.elements.point.hoverRadius = 10;
  //Chart.defaults.scale.ticks.beginAtZero = true;

  //TOOLTIPS: default property
  Chart.defaults.global.tooltips.enabled = false;
  /*Chart.defaults.global.tooltips.mode = 'nearest';
  Chart.defaults.global.tooltips.position = 'top'; // self made positioner
  Chart.defaults.global.tooltips.caretPadding = 0;
  Chart.defaults.global.tooltips.caretSize = 0;
  Chart.defaults.global.tooltips.displayColors = false; // don't show the line color before
  Chart.defaults.global.tooltips.callbacks.title = formatTooltipDateTitle;
  // TOOLTIPS: display on top
  Chart.Tooltip.positioners.top = function(elements, eventPosition) {
    var tooltip = this;
    return {
      x: eventPosition.x,
      y: (eventPosition.y - 50)
    };
  };
  // TOOLTIPS: format displayed date
  function formatTooltipDateTitle(tooltipItem, chart) {
    var date = new Date(tooltipItem[0].xLabel);
    return date.toLocaleDateString();
  };*/

  //---------------------------     INIT WEIGHT CHART CONFIG    --------------------------------
  var minWeight_y = measureData.weight.length > 0 ? measureData.weight[0].y - .5 : 2;
  var maxWeight_y = measureData.weight.length > 0 ? measureData.weight[0].y + 1 : 5;
  weightConfig = {
    type: 'line',
    data: {
      labels: weightLabel,
      datasets: [{
        data: measureData.weight,
        borderColor: lineColor[2],
        backgroundColor: backgroundColor[2],
        spanGaps: false,
      }],
    },
    options: {
      maintainAspectRatio: false,
      animation: {
        duration: 0,
      },
      title: {
        display: true,
        text: $filter('translate')('GRAPH.WEIGHT_TITLE'),
        padding: 15,
        fontSize: 12,
      },
      scales: {
        xAxes: [{
          type: 'time',
          distribution: 'linear',
          time: {
            unit: 'day',
            displayFormats: {
              day: 'D MMM'
            },
            min: weightLabel[0],
            max: weightLabel[weightLabel.length - 1],
            stepSize: 1,
          },
          ticks: {
            autoSkip: false,
            callback: function (value, index, values) {
              if (index % 7)
                return "";
              else
                return value;
            },
          }
        }],
        yAxes: [{
          ticks: {
            min: minWeight_y,
            max: maxWeight_y,
          },
        }],
      },
      elements: {
        point: {
          radius: 3
        }
      },
      /*tooltips: {
        callbacks: {
          title: formatTooltipDateTitle,
          label: function(tooltipItem) {
            return tooltipItem.yLabel + ' kg';
          },
        },
      },*/

    }
  };

  //---------------------------     INIT BREAST CHART CONFIG    --------------------------------
  breastNbConfig = {
    type: 'bar',
    data: {
      // labels: breastDataSets.label, // define x-label. Set by changeDuration()
      datasets: [{
        // data: breastDataSets.number, // Set by changeDuration()
        borderColor: lineColor[0],
        backgroundColor: backgroundColor[0],
      }],
    },
    options: {
      title: {
        text: $filter('translate')('GRAPH.BREAST_NUMBER_TITLE'),
      },
    }
  };

  //-----------------------     INIT BREAST SUM/AVG CHART CONFIG    ---------------------------
  vm.breastSumChoice = true;
  breastSumAvgConfig = {
    type: 'bar',
    data: {
      //labels: breastDataSets.label, // define x-label. Set by changeDuration()
      datasets: [{
        // data: breastDataSets.sumDuration, // Set by changeDuration()
        borderColor: lineColor[0],
        backgroundColor: backgroundColor[0],
        type: 'line',
        lineTension: 0,
      }],
    },
    options: {
      title: {
        text: $filter('translate')('GRAPH.BREAST_SUM_TITLE'),
      },
    }
  };

  //---------------------------     INIT BOTTLE CHART CONFIG    --------------------------------
  bottleNbConfig = {
    type: 'bar',
    data: {
      //labels: bottleDataSets.label, // define x-label. Set by changeDuration()
      datasets: [{
        // data: bottleDataSets.number, // Set by changeDuration()
        borderColor: lineColor[1],
        backgroundColor: backgroundColor[1],
      }],
    },
    options: {
      title: {
        text: $filter('translate')('GRAPH.BOTTLE_NUMBER_TITLE'),
      },
    }
  };

  //-----------------------     INIT BOTTLE SUM/AVG CHART CONFIG    ---------------------------
  vm.bottleSumChoice = true;
  bottleSumAvgConfig = {
    type: 'bar',
    data: {
      //labels: bottleDataSets.label, // define x-label. Set by changeDuration()
      datasets: [{
        //data: bottleDataSets.sumQuantity, // Set by changeDuration()
        type: 'line',
        lineTension: 0,
        borderColor: lineColor[1],
        backgroundColor: backgroundColor[1],
      }],
    },
    options: {
      title: {
        text: $filter('translate')('GRAPH.BOTTLE_SUM_TITLE'),
      },
    }
  };

  /*********************               OPEN DATE PICKER                     *******************/
  function openDatePicker() {
    var datePickerConf = {
      callback: _onDatePicked, //WARNING: callback is Mandatory!
      inputDate: vm.endDate,
      //titleLabel: $filter('translate')('POPUP.DATEPICKER_TITLE'),
      setLabel: $filter('translate')('BUTTON.OK'),
      todayLabel: $filter('translate')('BUTTON.TODAY'),
      closeLabel: $filter('translate')('BUTTON.CANCEL'),
      mondayFirst: true,
      weeksList: utils.getWeekList(),
      monthsList: utils.getMonthList(),
      templateType: 'popup',
      from: new Date(2017, 6, 1),
      to: new Date(2025, 7, 1),
      showTodayButton: false,
      dateFormat: 'dd MMMM yyyy',
      closeOnSelect: true,
      disableWeekdays: []
    };
    ionicDatePicker.openDatePicker(datePickerConf);

    $timeout(function () {
        var elt = document.getElementsByClassName("selected_date_full");
        elt[0].firstChild.data = $filter('translate')('POPUP.DATEPICKER_TITLE');
      },
      refreshTimeout);
  };

  function _onDatePicked(val) { //Mandatory
    vm.endDate = new Date(val);
    changeDuration();
    console.log('Return value from the datepicker popup is : ' + val, vm.endDate);
  }

  // APPLY CHART CONFIGURATION
  $document.ready(function () {

    $timeout(function () {
      // initialize WEIGHT CHART
      var ctx1 = document.getElementById("weightChart");
      vm.weightChart = new Chart(ctx1, weightConfig);

      // initialize BREAST NB CHART
      var ctx2 = document.getElementById("breastNbChart");
      vm.breastNbChart = new Chart(ctx2, breastNbConfig);

      // initialize BREAST SUM CHART
      var ctx3 = document.getElementById("breastSumChart");
      vm.breastSumAvgChart = new Chart(ctx3, breastSumAvgConfig);

      // initialize BOTTLE NB CHART
      var ctx4 = document.getElementById("bottleNbChart");
      vm.bottleNbChart = new Chart(ctx4, bottleNbConfig);

      // initialize BOTTLE SUM CHART
      var ctx5 = document.getElementById("bottleSumChart");
      vm.bottleSumAvgChart = new Chart(ctx5, bottleSumAvgConfig);

      changeDuration();
    }, );
  });

  /********************************************************************************************/
  /*                              PUBLIC FUNCTIONS IMPLEMENTATION
  /********************************************************************************************/

  /******************************       REFRESH DISPLAY                ************************/
  function doRefresh() {
    vm.weightChart.update();
    vm.breastNbChart.update();
    vm.breastSumAvgChart.update();
    vm.bottleSumAvgChart.update();

    $scope.$broadcast('scroll.refreshComplete');
  }

  /******************************       ON BREAST SUM CLICK            ************************/
  function onBreastSumClick() {
    vm.breastSumChoice = true;
    breastSumAvgConfig.data.datasets[0].data = breastDataSets.sumDuration;
    //breastSumAvgConfig.data.datasets[0].borderColor = lineColor[0];
    //breastSumAvgConfig.data.datasets[0].backgroundColor = backgroundColor[0];
    breastSumAvgConfig.options.animation.duration = 200;
    breastSumAvgConfig.options.title.text = $filter('translate')('GRAPH.BREAST_SUM_TITLE');
    vm.breastSumAvgChart.update();
  }

  /******************************      ON BREAST AVERAGE CLICK         ************************/
  function onBreastAverageClick() {
    vm.breastSumChoice = false;
    breastSumAvgConfig.data.datasets[0].data = breastDataSets.avgDuration;
    //breastSumAvgConfig.data.datasets[0].borderColor = lineColor[1];
    //breastSumAvgConfig.data.datasets[0].backgroundColor = backgroundColor[1];
    breastSumAvgConfig.options.animation.duration = 200;
    breastSumAvgConfig.options.title.text = $filter('translate')('GRAPH.BREAST_AVG_TITLE');
    vm.breastSumAvgChart.update();
  }

  /******************************        ON BOTTLE SUM CLICK           ************************/
  function onBottleSumClick() {
    vm.bottleSumChoice = true;
    bottleSumAvgConfig.data.datasets[0].data = bottleDataSets.sumQuantity;
    //bottleSumAvgConfig.data.datasets[0].borderColor = lineColor[0];
    //bottleSumAvgConfig.data.datasets[0].backgroundColor = backgroundColor[0];
    bottleSumAvgConfig.options.animation.duration = 200;
    bottleSumAvgConfig.options.title.text = $filter('translate')('GRAPH.BOTTLE_SUM_TITLE');
    vm.bottleSumAvgChart.update();
  }

  /******************************      ON BOTTLE AVERAGE CLICK         ************************/
  function onBottleAverageClick() {
    vm.bottleSumChoice = false;
    bottleSumAvgConfig.data.datasets[0].data = bottleDataSets.avgQuantity;
    //bottleSumAvgConfig.data.datasets[0].borderColor = lineColor[1];
    //bottleSumAvgConfig.data.datasets[0].backgroundColor = backgroundColor[1];
    bottleSumAvgConfig.options.animation.duration = 200;
    bottleSumAvgConfig.options.title.text = $filter('translate')('GRAPH.BOTTLE_AVG_TITLE');
    vm.bottleSumAvgChart.update();
  }

  /******************************      CHANGE DURATION REFERENCE       ************************/
  function changeDuration() {
    vm.startDate = new Date(moment(vm.endDate).subtract(vm.duration.nbDay, 'days'));

    // for BREAST //////////////////////////////////////////////////////////////////////////////
    _updateBreastDataSets(vm.startDate, vm.endDate);

    // set up animation
    breastSumAvgConfig.options.animation.duration = 0;

    // set up Data 
    breastNbConfig.data.labels = breastDataSets.label;
    breastSumAvgConfig.data.labels = breastDataSets.label;
    breastNbConfig.data.datasets[0].data = breastDataSets.number;
    if (vm.breastSumChoice) {
      breastSumAvgConfig.data.datasets[0].data = breastDataSets.sumDuration;
    } else {
      breastSumAvgConfig.data.datasets[0].data = breastDataSets.avgDuration;
    }

    // set up Y scale
    breastNbConfig.options.scales.yAxes[0].ticks.min = Math.max(_min(breastDataSets.number) - 1, 0);

    // set up X scale
    breastNbConfig.options.scales.xAxes[0].ticks.min = breastDataSets.label[0];
    breastNbConfig.options.scales.xAxes[0].ticks.max = breastDataSets.label[breastDataSets.label.length - 1];
    breastSumAvgConfig.options.scales.xAxes[0].ticks.min = breastDataSets.label[0];
    breastSumAvgConfig.options.scales.xAxes[0].ticks.max = breastDataSets.label[breastDataSets.label.length - 1];

    vm.breastNbChart.update();
    vm.breastSumAvgChart.update()

    // for BOTTLE //////////////////////////////////////////////////////////////////////////////
    _updateBottleDataSets(vm.startDate, vm.endDate);

    // set up animation
    bottleSumAvgConfig.options.animation.duration = 0;

    // set up Data for 
    bottleNbConfig.data.labels = bottleDataSets.label;
    bottleSumAvgConfig.data.labels = bottleDataSets.label;
    bottleNbConfig.data.datasets[0].data = bottleDataSets.number;
    if (vm.bottleSumChoice) {
      bottleSumAvgConfig.data.datasets[0].data = bottleDataSets.sumQuantity;
    } else {
      bottleSumAvgConfig.data.datasets[0].data = bottleDataSets.avgQuantity;
    }

    // set up Y scale
    bottleNbConfig.options.scales.yAxes[0].ticks.min = Math.max(_min(bottleDataSets.number) - 1, 0);

    // set up X scale
    bottleNbConfig.options.scales.xAxes[0].ticks.min = bottleDataSets.label[0];
    bottleNbConfig.options.scales.xAxes[0].ticks.max = bottleDataSets.label[bottleDataSets.label.length - 1];
    bottleSumAvgConfig.options.scales.xAxes[0].ticks.min = bottleDataSets.label[0];
    bottleSumAvgConfig.options.scales.xAxes[0].ticks.max = bottleDataSets.label[bottleDataSets.label.length - 1];

    vm.bottleNbChart.update();
    vm.bottleSumAvgChart.update();

    // for WEIGHT //////////////////////////////////////////////////////////////////////////////
    // TODO: move this code to a more appropriate place
    minWeight_y = measureData.weight.length > 0 ? measureData.weight[0].y - .5 : 2;
    maxWeight_y = measureData.weight.length > 0 ? measureData.weight[0].y + 1 : 5;
    weightConfig.data.labels = weightLabel;
    weightConfig.data.datasets[0].data = measureData.weight;
    weightConfig.options.scales.xAxes[0].time.min = weightLabel[0];
    weightConfig.options.scales.xAxes[0].time.max = weightLabel[weightLabel.length - 1];
    weightConfig.options.scales.yAxes[0].ticks.min = minWeight_y;
    weightConfig.options.scales.yAxes[0].ticks.max = maxWeight_y;
    vm.weightChart.update();

  }


  /********************************************************************************************/
  /*                                      EVENT MANAGEMENT
  /********************************************************************************************/
  $rootScope.$on('update_baby_selection', function () {
    baby = DBrecord.getCurBaby();

    // get BREAST data to display
    breastData = DBrecord.getBreastData(baby.uid);
    // update breast Data (label and sets):
    _updateBreastDataSets(vm.startDate, vm.endDate);

    // get BOTTLE  data to display
    bottleData = DBrecord.getBottleData(baby.uid);
    // update bottle Data (label and sets):
    _updateBottleDataSets(vm.startDate, vm.endDate);

    // get MEASURE data to display
    measureData = DBrecord.getMeasureData(baby.uid);
    // create weightLabel:
    weightLabel = _createWeightAxisLabel();

    //refresh display with new data
    changeDuration();
  })

  /********************************************************************************************/
  /*                                      TOOL BOX
  /********************************************************************************************/

  /***************************       CREATE WEIGHT AXIS LABEL          ************************/
  function _createWeightAxisLabel() {
    var xLabel = [];
    var count = 0;
    var day = new moment(baby.birthday);
    for (var i = 0; i < 30; i++) {
      xLabel.push(day.toDate());
      day.add(1, 'days');
    };
    return xLabel;
  }


  /***************************   UPDATE BREAST DATA (LABEL & SETS)     ************************/
  function _updateBreastDataSets(startDate, endDate) {
    var nbDay = parseInt((endDate - startDate) / (24 * 60 * 60 * 1000));
    var curDay = moment(startDate);

    // reset data
    breastDataSets = {};
    breastDataSets.label = [];
    breastDataSets.number = [];
    breastDataSets.sumDuration = [];
    breastDataSets.avgDuration = [];

    for (var i = 0; i <= nbDay; i++) {
      var l_number = null;
      var l_sumDuration = null;
      var l_avgDuration = null;

      // scan original breastData to find a data corresponding to current day
      for (var j = 0; j < breastData.number.length; j++) {
        var tp1 = (new Date(breastData.number[j].x)).toDateString();
        var tp2 = (new Date(curDay)).toDateString();
        if ((new Date(breastData.number[j].x)).toDateString() ==
          (new Date(curDay).toDateString())) {
          l_number = breastData.number[j].y;
          l_sumDuration = breastData.sumDuration[j].y;
          l_avgDuration = breastData.avgDuration[j].y;
        }
      }
      breastDataSets.label.push(curDay.format('D MMM'));
      breastDataSets.number.push(l_number);
      breastDataSets.sumDuration.push(l_sumDuration);
      breastDataSets.avgDuration.push(l_avgDuration);

      curDay.add(1, 'days');
    }

    return breastDataSets;
  }

  /***************************   UPDATE BOTTLE DATA (LABEL & SETS)     ************************/
  function _updateBottleDataSets(startDate, endDate) {
    var nbDay = parseInt((endDate - startDate) / (24 * 60 * 60 * 1000));
    var curDay = moment(startDate);

    // reset data
    bottleDataSets = {};
    bottleDataSets.label = [];
    bottleDataSets.number = [];
    bottleDataSets.sumQuantity = [];
    bottleDataSets.avgQuantity = [];

    for (var i = 0; i <= nbDay; i++) {
      var l_number = null;
      var l_sumQuantity = null;
      var l_avgQuantity = null;

      // scan original bottleData to find a data corresponding to current day
      for (var j = 0; j < bottleData.number.length; j++) {
        var tp1 = (new Date(bottleData.number[j].x)).toDateString();
        var tp2 = (new Date(curDay)).toDateString();
        if ((new Date(bottleData.number[j].x)).toDateString() ==
          (new Date(curDay).toDateString())) {
          l_number = bottleData.number[j].y;
          l_sumQuantity = bottleData.sumQuantity[j].y;
          l_avgQuantity = bottleData.avgQuantity[j].y;
        }
      }
      bottleDataSets.label.push(curDay.format('D MMM'));
      bottleDataSets.number.push(l_number);
      bottleDataSets.sumQuantity.push(l_sumQuantity || 0);
      bottleDataSets.avgQuantity.push(l_avgQuantity || 0);

      curDay.add(1, 'days');
    }

    return bottleDataSets;
  }

  function _min(array) {
    min = array[0];
    for (var i = 1; i < array.length; i++) {
      if (array[i] !== null && array[i] < min)
        min = array[i];
    }
    return (min || 0);
  }

  /********************************************************************************************/
  /*                            CONFIGURATION EXAMPLE FOR CHART
  /********************************************************************************************/

  // Set CHART default font value
  //Chart.defaults.global.defaultFontColor/defaultFontFamily/defaultFontSize/defaultFontStyle 
  //Chart.defaults.global.elements.line.tension = 0.4;
  //Chart.defaults.global.elements.line.fill = 'bottom';
  //Chart.defaults.global.elements.line.stepped = true; 

  // example of COMMON USED OPTIONs to configure a CHART
  /*var exampleConfig = {
    type: 'line',
    data: {
      labels: [], // define x-label to display (must fit to total data number)
      datasets: [{
        label: "", //used in tooltip, between colored square and value
        backgroundcolor: 'rgb(255, 99, 132)', // for what and where?
        borderColor: lineColor[0], // for drawing lines and points
        borderWidth: 4, // drawing line width
        data: [], // or [{x,y}] for time
        yAxisID: 'first-y-axis', // to select y axis to be linked to
      }],
    },
    options: {
      maintainAspectRatio: false,
      tooltips: {
        enabled: true,
        mode: 'nearest',
        position: 'top', // 'nearest','average'
        caretPadding: 0,
        caretSize: 0,
        displayColors: false, // show the line color before
        callbacks: {
          //title: formatTooltipDateTitle,
          label: function(tooltipItem) {
            return tooltipItem.yLabel + ' kg';
          },
        },
      },
      events: ["mousemove", "mouseout", "click", "touchstart", "touchmove", "touchend"], // event to listen to for tooltip and hover . ALL by DEFAULT
      onHover: function() {},
      onClick: function() {},
      animation: {
        duration: 500, // set to 0 to cancel annimation
        easing: 'easeOutExpo',
        onProgress: function() {}, // callback function during animation
        onComplete: function() {}, // callback function during animation
      },
      layout: {
        padding: {
          left: 50,
          right: 0,
          top: 0,
          bottom: 0
        }
      },
      legend: { // display dataset name
        display: true,
        position: 'bottom',
        labels: {
          fontColor: 'rgb(255, 99, 132)',
          boxWidth: 40,
          usePointStyle: true,
        },
      },
      title: {
        display: false,
        text: 'Custom Chart Title',
        padding: 20,
        fontSize: 20,
      },
      scales: {
        xAxes: [{
          type: 'time',
          position: 'bottom', // 'top', 'left',  'right'
          offset: true, //mainly for bar chart
          time: {
            unit: 'day',
            displayFormats: {
              day: 'D MMM'
            },
            max: (new moment(measureData.weight[0].x)).add(30, 'days').toDate(),
          },
          display: true,
          scaleLabel: {
            display: true,
            labelString: "day",
          },
        }],
        yAxes: [{
          id: 'first-y-axis',
          ticks: {
            beginAtZero: true, // start from 0
            min: measureData.weight[0].y - .5,
            max: measureData.weight[0].y + 1,
            callback: function(value, index, values) {
              return value.slice(4) + 'kg';
            },
          },
          gridLines: {
            borderDash: [5],
            lineWidth: 1,
            drawTicks: true,
          },
          scaleLabel: {
            display: true,
            labelString: "kg",
          },
        }]
      }
    }
  };*/

})