angular.module('app.controllers')

.controller('graphCtrl', function($document, $rootScope, $scope, $filter, $timeout, utils, ionicDatePicker, DBrecord, fileManager) {
  var vm = this;

  vm.durationList = null;
  vm.duration = null;
  vm.startDate = null;
  vm.endDate = null;
  var lineColor = null;
  var backgroundColor = null;
  vm.weightChart = null;
  var measureData = null;
  var weightLabel = [];
  var weightConfig = null;
  vm.breastNbChart = null;
  var breastDataSets = null;
  var breastDataLabel = [];
  var breastNbConfig = null;

  /******************************      DEFINE CONSTANT for HTML        ************************/
  vm.TODAY_TEXT = $filter('translate')('GRAPH.TODAY_TEXT');

  /******************************      FUNCTION DECLARATION            ************************/
  vm.doRefresh = doRefresh;
  vm.openDatePicker = openDatePicker;
  vm.changeDuration = changeDuration;

  /******************************         INITIALISATION               ************************/
  vm.durationList = utils.getDurationList();
  vm.duration = vm.durationList[0];
  vm.endDate = new Date;
  vm.startDate = new Date(moment(vm.endDate).subtract(vm.duration.nbDay, 'days'));

  // set COLOR depending on baby gender
  var baby = DBrecord.getBabyInfo();
  if (baby.gender == MALE) {
    // color for boy (darkTurquoise #00CED1)
    lineColor = 'rgb(0, 206, 209)'; //#00CED1;
    backgroundColor = 'rgba(0, 206, 209, 0.1)';
  } else {
    // color for girl (LightPink #FFB6C1)
    lineColor = 'rgb(255, 128, 147)';
    backgroundColor = 'rgba(255, 128, 147, 0.1)';
  }

  // get MEASURE data to display
  measureData = DBrecord.getMeasureData();

  // get BREAST FEEDING data to display
  breastData = DBrecord.getBreastData();

  // create weightLabel:
  weightLabel = _createWeightAxisLabel();

  // update breast Data (label and sets):
  _updateBreastDataSets(vm.startDate, vm.endDate);

  //---------------------------   INIT CHART DEFAULT OPTIONS   --------------------------------
  Chart.defaults.global.animation.duration = 0;
  Chart.defaults.global.maintainAspectRatio = false;
  Chart.defaults.global.title.display = true;
  Chart.defaults.global.title.padding = 15;
  Chart.defaults.global.title.fontSize = 12;
  Chart.defaults.global.elements.line.borderColor = lineColor;
  Chart.defaults.global.elements.line.backgroundColor = backgroundColor;
  Chart.defaults.global.elements.rectangle.borderColor = lineColor;
  Chart.defaults.global.elements.rectangle.backgroundColor = backgroundColor;
  Chart.defaults.global.elements.point.radius = 3;
  Chart.defaults.global.elements.point.hoverRadius = 10;

  Chart.defaults.scale.ticks.beginAtZero = true;

  // TOOLTIPS: default property
  Chart.defaults.global.tooltips.enabled = true;
  Chart.defaults.global.tooltips.mode = 'nearest';
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
  };

  //---------------------------     INIT WEIGHT CHART CONFIG    --------------------------------
  weightConfig = {
    type: 'line',
    data: {
      labels: weightLabel,
      datasets: [{
        //borderColor: lineColor, // for drawing lines and points
        data: measureData.weight,
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
            callback: function(value, index, values) {
              if (index % 7)
                return "";
              else
                return value;
            },
          }
        }],
        yAxes: [{
          ticks: {
            min: measureData.weight[0].y - .5,
            max: measureData.weight[0].y + 1,
          },
        }],
      },
      tooltips: {
        callbacks: {
          title: formatTooltipDateTitle,
          label: function(tooltipItem) {
            return tooltipItem.yLabel + ' kg';
          },
        },
      },

    }
  };

  //---------------------------     INIT BREAST CHART CONFIG    --------------------------------
  breastNbConfig = {
    type: 'bar',
    data: {
      labels: breastDataSets.label, // define x-label to display (must fit to total data number)
      datasets: [{
        data: breastDataSets.number,
      }],
    },
    options: {
      title: {
        text: $filter('translate')('GRAPH.BREAST_FEEDING_TITLE'),
      },
    }
  };

  //-----------------------     INIT BREAST SUM/AVG CHART CONFIG    ---------------------------
  breastSumAvgConfig = {
    type: 'bar',
    data: {
      labels: breastDataSets.label, // define x-label to display (must fit to total data number)
      datasets: [{
        data: breastDataSets.sumDuration,
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

  /*********************               OPEN DATE PICKER                     *******************/
  function openDatePicker() {
    var datePickerConf = {
      callback: _onDatePicked, //WARNING: callback is Mandatory!
      inputDate: vm.endDate,
      titleLabel: $filter('translate')('POPUP.DATEPICKER_TITLE'),
      setLabel: $filter('translate')('BUTTON.OK'),
      todayLabel: $filter('translate')('BUTTON.TODAY'),
      closeLabel: $filter('translate')('BUTTON.CANCEL'),
      mondayFirst: true,
      weeksList: utils.getWeekList(),
      monthsList: utils.getMonthList(),
      templateType: 'popup',
      from: new Date(2017, 6, 1),
      to: new Date(2025, 7, 1),
      showTodayButton: true,
      dateFormat: 'dd MMMM yyyy',
      closeOnSelect: false,
      disableWeekdays: []
    };
    ionicDatePicker.openDatePicker(datePickerConf);
  };

  function _onDatePicked(val) { //Mandatory
    vm.endDate = new Date(val);
    changeDuration();
    console.log('Return value from the datepicker popup is : ' + val, vm.endDate);
  }

  // APPLY CHART CONFIGURATION
  $document.ready(function() {
    //changeDuration();

    $timeout(function() {
        // initialize WEIGHT CHART
        var ctx1 = document.getElementById("weightChart");
        vm.weightChart = new Chart(ctx1, weightConfig);

        // initialize BREAST NB CHART
        var ctx2 = document.getElementById("breastFeedingNbChart");
        vm.breastNbChart = new Chart(ctx2, breastNbConfig);

        // initialize BREAST SUM CHART
        var ctx2 = document.getElementById("breastFeedingSumChart");
        vm.breastSumAvgChart = new Chart(ctx2, breastSumAvgConfig);

      },
      50
    );
  });

  /********************************************************************************************/
  /*                                      EVENT MANAGEMENT
  /********************************************************************************************/


  /********************************************************************************************/
  /*                              PUBLIC FUNCTIONS IMPLEMENTATION
  /********************************************************************************************/

  /******************************       REFRESH DISPLAY                ************************/
  function doRefresh() {
    $scope.$broadcast('scroll.refreshComplete');
  }

  /******************************       CHANGE DURATION REFERENCE      ************************/
  function changeDuration() {
    vm.startDate = new Date(moment(vm.endDate).subtract(vm.duration.nbDay, 'days'));
    _updateBreastDataSets(vm.startDate, vm.endDate);

    breastNbConfig.data.labels = breastDataSets.label;
    breastSumAvgConfig.data.labels = breastDataSets.label;

    breastNbConfig.data.datasets[0].data = breastDataSets.number;
    breastSumAvgConfig.data.datasets[0].data = breastDataSets.sumDuration;

    breastNbConfig.options.scales.xAxes[0].ticks.min = breastDataSets.label[0];
    breastNbConfig.options.scales.xAxes[0].ticks.max = breastDataSets.label[breastDataSets.label.length - 1];
    breastSumAvgConfig.options.scales.xAxes[0].ticks.min = breastDataSets.label[0];
    breastSumAvgConfig.options.scales.xAxes[0].ticks.max = breastDataSets.label[breastDataSets.label.length - 1];
    vm.breastNbChart.update();
    vm.breastSumAvgChart.update()
  }

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

  /********************************************************************************************/
  /*                            CONFIGURATION EXAMPLE FOR CHART
  /********************************************************************************************/

  // Set CHART default font value
  //Chart.defaults.global.defaultFontColor/defaultFontFamily/defaultFontSize/defaultFontStyle 
  //Chart.defaults.global.elements.line.tension = 0.4;
  //Chart.defaults.global.elements.line.fill = 'bottom';
  //Chart.defaults.global.elements.line.stepped = true; 

  // example of COMMON USED OPTIONs to configure a CHART
  var exampleConfig = {
    type: 'line',
    data: {
      labels: [], // define x-label to display (must fit to total data number)
      datasets: [{
        label: "", //used in tooltip, between colored square and value
        backgroundcolor: 'rgb(255, 99, 132)', // for what and where?
        borderColor: lineColor, // for drawing lines and points
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
          title: formatTooltipDateTitle,
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
  };

})