var currentWeightTracker = new WeightTracker();
app.controller('weightListController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $interpolate, $routeParams) {
    $scope.updateWeight = function (weightTracker) {
        var userInfo = JSON.parse(localStorage[userLocalStorage]);
        if (weightTracker.editFlag != "false") {
            currentWeightTracker = weightTracker;
            currentWeightTracker.prePath = "weightList";
            localStorage[currentWeightTrackerLocalStorage] = JSON.stringify(currentWeightTracker);
            $location.path("/trackWeightModify");
        } else {
            alertWarning($scope.$eval($interpolate("{{'message_introduce_weight_site'|translate}}")), $scope, $interpolate);
        }
    };

    $scope.$watch('$viewContentLoaded', function () {
        var userInfo = JSON.parse(localStorage[userLocalStorage]);
        var token = localStorage[tokenLocalStorage];
        httpRequest.Get('/weights/trackers', { "token": token }).then(function (result) {
            if (result.status) {
                var weightTrackers = [];
//                var leftShift = 0;
                for (var i = result.weightTrackers.length - 1; i >= 0; i--) {
                    var weightTracker = new WeightTracker();
                    var showDate = new Date(parseFloat(result.weightTrackers[i].weekDate));
                    var displayShowDate = new Date(parseFloat(result.weightTrackers[i].weekDate));
                    showDate.setDate(showDate.getDate() + parseFloat(userInfo.trackDay));
                    displayShowDate.setDate(displayShowDate.getDate() + parseFloat(userInfo.trackDay));

//                    if (Date.parse(showDate) > Date.parse(new Date())) {
//                        leftShift = 1;
//                    }
//                    if (1 == leftShift) {
//                        showDate.setDate(showDate.getDate() - 7);
//                        displayShowDate.setDate(displayShowDate.getDate() - 7);
//
//                        weightTracker.showDate = showDate;
//                        weightTracker.showWeekDate = new Date(parseFloat(result.weightTrackers[i].weekDate)).setDate(
//                            new Date(parseFloat(result.weightTrackers[i].weekDate)).getDate() - 7
//                        );
//                    } else {
//                        weightTracker.showDate = showDate;
//                        weightTracker.showWeekDate = result.weightTrackers[i].weekDate;
//                    }
                    weightTracker.showDate = showDate;
                    weightTracker.showWeekDate = result.weightTrackers[i].weekDate;

                    weightTracker.weekDate = result.weightTrackers[i].weekDate;
                    var b = new Date(displayShowDate.setHours(displayShowDate.getHours() + parseFloat(1)));
                    weightTracker.pageWeekDate = b.format("dd/mm/yy");
                    weightTracker.enterDate = result.weightTrackers[i].enterDate;
                    weightTracker.dateOfWeekDate = result.weightTrackers[i].dateOfWeekDate;
                    if (i == 0) {
                        weightTracker.editFlag = "false";
                    } else {
                        weightTracker.editFlag = "true";
                    }
                    if (result.weightTrackers[i].weight > 0) {
                        weightTracker.noWeight = false;
                        weightTracker.weightClass = "trWhite";
                        weightTracker.note = result.weightTrackers[i].note;
                        weightTracker.weight = result.weightTrackers[i].weight;
                        weightTracker.lostWeight = result.weightTrackers[i].lostWeight;
                        weightTracker.lostWeightTotal = result.weightTrackers[i].lostWeightTotal;
                        weightTracker.highestPriorityMilestone = result.weightTrackers[i].highestPriorityMilestone;
                        weightTracker.milestones = result.weightTrackers[i].milestones;
                        weightTracker.allMilestones = result.weightTrackers[i].allMilestones;
                        if (weightTracker.highestPriorityMilestone > 0) {
                            weightTracker.noStar = false;
                            for (var k = 0; k < MilestonesImgs.length; k++) {
                                if (weightTracker.highestPriorityMilestone == MilestonesImgs[k].value) {
                                    weightTracker.showMileston = MilestonesImgs[k].MilestonesImg;
                                }
                            }
                        } else {
                            weightTracker.noStar = true;
                        }
                    } else {
                        weightTracker.noWeight = true;
                        weightTracker.weightClass = "trGray";
                        weightTracker.weight = "No weight entered ";
                    }
                    weightTrackers.push(weightTracker);
                }
                $scope.weightTrackers = weightTrackers;
            } else {
                alertError(result.error, $scope, $interpolate);
            }
        });
    });

    $scope.back = function () {
        $location.path("/tracking");
    };

    $scope.gotoPage = function () {
        $location.path("/tracking");
    };

    window.onresize = function () {
        if ($("#bodyData").length > 0) {
            var winHeight = getWindowHeight();
            var titleHeight = $("#head").outerHeight();
            $(".myProgress_body").height(winHeight - titleHeight - 45);
        }
    };
    window.onresize();
});

app.controller('weightModifyController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $interpolate) {

    $scope.$watch('$viewContentLoaded', function () {
        if (localStorage[currentWeightTrackerLocalStorage] != "") {
            currentWeightTracker = JSON.parse(localStorage[currentWeightTrackerLocalStorage]);
            var tempWeight = "";
            if (currentWeightTracker.prePath == "") {
                tempWeight = "No weight entered ";
            } else {
                tempWeight = currentWeightTracker.weight;
            }
            currentWeightTracker.weight = isNaN(parseFloat(tempWeight)) ? "" : currentWeightTracker.weight;
            $scope.currentWeightTracker = currentWeightTracker;
            $scope.weight = toFloatFormatString(currentWeightTracker.weight);

            var weekDate = currentWeightTracker.showWeekDate;
//            var weekDate = currentWeightTracker.weekDate;
            var dateOfWeekDate;
            var displayDateOfWeekDate;
            if (currentWeightTracker.weekDate != "") {
                dateOfWeekDate = new Date(parseFloat(weekDate));
                displayDateOfWeekDate = new Date(parseFloat(weekDate));

                displayDateOfWeekDate = new Date(displayDateOfWeekDate.setHours(displayDateOfWeekDate.getHours() + parseFloat(1)));
                displayDateOfWeekDate.setDate(displayDateOfWeekDate.getDate() + parseFloat(JSON.parse(localStorage[userLocalStorage]).trackDay));

                dateOfWeekDate.setDate(dateOfWeekDate.getDate() + parseFloat(JSON.parse(localStorage[userLocalStorage]).trackDay));

            } else {
                weekDate = new Date().getTime();
            }
            dateOfWeekDate = dateOfWeekDate.getTime();
            displayDateOfWeekDate = displayDateOfWeekDate.getTime();

            $scope.minDate = new Date(displayDateOfWeekDate).format("yyyy-mm-dd");
//            $scope.maxDate = new Date(new Date($scope.minDate).getTime() + 6 * 24 * 60 * 60 * 1000).format("yyyy-mm-dd");
            $scope.maxDate = new Date(displayDateOfWeekDate + 6 * 24 * 60 * 60 * 1000).format("yyyy-mm-dd");
//            $scope.currentWeekDate = new Date($scope.minDate).format("dddd mmmm d");
            $scope.currentWeekDate = new Date(displayDateOfWeekDate).format("dddd mmmm d");

            $scope.notes = currentWeightTracker.note;

            if (!Modernizr.inputtypes.date) {
                if (tempWeight == "No weight entered ") {
//                    $scope.dateOfWeekDate = new Date($scope.minDate).format("mm/dd/yyyy");
//                    $scope.dateOfWeekDate = new Date(dateOfWeekDate).format("mm/dd/yyyy");
                    $scope.dateOfWeekDate1 = new Date(displayDateOfWeekDate).format("mm/dd/yyyy");
                    $scope.dateOfWeekDate = new Date(displayDateOfWeekDate);
                } else {
//                    $scope.dateOfWeekDate = new Date(parseInt(currentWeightTracker.dateOfWeekDate)).format("mm/dd/yyyy");
                    $scope.dateOfWeekDate1 = new Date(parseInt(currentWeightTracker.dateOfWeekDate)).format("mm/dd/yyyy");
                    $scope.dateOfWeekDate = new Date(parseInt(currentWeightTracker.dateOfWeekDate));
                }
                $scope.isShowD = 1;
                $("#dateInput").Zebra_DatePicker({
                    onSelect: function(view, elements) {
                        $scope.dateOfWeekDate = elements;
                    },
                    format: 'm/d/Y',
//                    direction: [new Date($scope.minDate).format("mm/dd/yyyy"), new Date($scope.maxDate).format("mm/dd/yyyy")]
                    direction: [new Date(displayDateOfWeekDate).format("mm/dd/yyyy"), new Date(displayDateOfWeekDate + 6 * 24 * 60 * 60 * 1000).format("mm/dd/yyyy")]
                });
            } else {
                if (tempWeight == "No weight entered ") {
//                    $scope.dateOfWeekDate = new Date($scope.minDate).format("yyyy-mm-dd");
//                    $scope.dateOfWeekDate = new Date(dateOfWeekDate).format("yyyy-mm-dd");
                    $scope.dateOfWeekDate = new Date(displayDateOfWeekDate);
                } else {
//                    $scope.dateOfWeekDate = new Date(parseInt(currentWeightTracker.dateOfWeekDate)).format("yyyy-mm-dd");
                    $scope.dateOfWeekDate = new Date(parseInt(currentWeightTracker.dateOfWeekDate));
                }
                if (isATF()) {
                    if (tempWeight == "No weight entered ") {
//                        $scope.dateOfWeekDate = new Date($scope.minDate).format("mm/dd/yyyy");
//                        $scope.dateOfWeekDate = new Date(dateOfWeekDate).format("mm/dd/yyyy");
                        $scope.dateOfWeekDate1 = new Date(displayDateOfWeekDate).format("mm/dd/yyyy");
                        $scope.dateOfWeekDate = new Date(displayDateOfWeekDate);
                    } else {
//                        $scope.dateOfWeekDate = new Date(parseInt(currentWeightTracker.dateOfWeekDate)).format("mm/dd/yyyy");
                        $scope.dateOfWeekDate1 = new Date(parseInt(currentWeightTracker.dateOfWeekDate)).format("mm/dd/yyyy");
                        $scope.dateOfWeekDate = new Date(parseInt(currentWeightTracker.dateOfWeekDate));
                    }
                    $scope.isShowD = 1;
                    $("#dateInput").Zebra_DatePicker({
                        onSelect: function(view, elements) {
                            $scope.dateOfWeekDate = elements;
                        },
                        format: 'm/d/Y',
//                        direction: [new Date($scope.minDate).format("mm/dd/yyyy"), new Date($scope.maxDate).format("mm/dd/yyyy")]
                        direction: [new Date(displayDateOfWeekDate).format("mm/dd/yyyy"), new Date(displayDateOfWeekDate + 6 * 24 * 60 * 60 * 1000).format("mm/dd/yyyy")]
                    });
                }
            }
        }
    });

    $scope.daySelected = function () {

        var showWeekDate = new Date(currentWeightTracker.showWeekDate);
        var currentDate = showWeekDate;
        var date = new Date(currentDate.getTime() - (currentDate.getHours() * 60 * 60 + currentDate.getMinutes() * 60 + currentDate.getSeconds()) * 1000);
        var maxDayTime = currentDate.getTime() + 7 * 24 * 60 * 60 * 1000;
        if (new Date($scope.dateOfWeekDate).getTime() < date.getTime() || new Date($scope.dateOfWeekDate).getTime() > maxDayTime) {
            alertWarning($scope.$eval($interpolate("{{'message_weight_enterDate'|translate}}")), $scope, $interpolate);
//            $scope.dateOfWeekDate = new Date(currentWeightTracker.showWeekDate).format("yyyy-dd-mm");
            $scope.dateOfWeekDate = new Date(currentWeightTracker.showWeekDate);
        }

    };

    $scope.deleteWeight = function () {
        var arrButton = [$scope.$eval($interpolate("{{'button_ok'|translate}}")), $scope.$eval($interpolate("{{'button_cancel'|translate}}"))];
        openDialog($scope.$eval($interpolate("{{'title_track_delete'|translate}}")), $scope.$eval($interpolate("{{'message_track_delete'|translate}}")), arrButton, function (flag) {
            if (flag == 0) {
                var weekDate = "";
                if ($scope.dateOfWeekDate != "") {
                    if (currentWeightTracker.weekDate != "") {
                        weekDate = new Date(parseFloat(currentWeightTracker.weekDate)).getTime();
                    }
                }
                var url = "/weights/trackers/" + weekDate;
                var token = localStorage[tokenLocalStorage];
                if (token) {
                    httpRequest.Request('delete', url, { "token": token }).then(function (result) {
                        if (result.status == 1) {
                            $location.path("/weightList");
                        } else {
                            alertError(result.error, $scope, $interpolate);
                        }
                    });
                }
            }
        });


    };

    $scope.saveWeight = function () {
        var dateOfWeekDate = new Date($scope.dateOfWeekDate).getTime();
//        var displayDateOfWeekDate = new Date($scope.dateOfWeekDate).setHours(new Date($scope.dateOfWeekDate).getHours() - parseFloat(1));


//        var dateOfWeekDate = new Date(formatDate($scope.dateOfWeekDate)).getTime();
        if (localStorage[currentWeightTrackerLocalStorage] == "") {
            return;
        }
        currentWeightTracker = JSON.parse(localStorage[currentWeightTrackerLocalStorage]);
//        var showDate = new Date(currentWeightTracker.showDate).getTime();
        var showDate = getWeeHoursDay(new Date(currentWeightTracker.showDate));
        var weekDate = parseFloat(currentWeightTracker.weekDate);
        var userInfo = JSON.parse(localStorage[userLocalStorage]);
        var maxDayTime = showDate + 6 * 24 * 60 * 60 * 1000;
        if ($scope.dateOfWeekDate == undefined) {
            alertWarning($scope.$eval($interpolate("{{'message_weight_enterDate'|translate}}")), $scope, $interpolate);
            return;
        }
        if (dateOfWeekDate < showDate || dateOfWeekDate > maxDayTime) {
            alertWarning($scope.$eval($interpolate("{{'message_weight_enterDate'|translate}}")), $scope, $interpolate);
//            $scope.dateOfWeekDate = new Date(weekDate).format("yyyy-dd-mm");
            return;
        }
//        if (dateOfWeekDate < showDate || dateOfWeekDate > maxDayTime) {
//            alertWarning($scope.$eval($interpolate("{{'message_weight_enterDate'|translate}}")), $scope, $interpolate);
////            $scope.dateOfWeekDate = new Date(weekDate).format("yyyy-dd-mm");
//            return;
//        }

        if (parseInt($scope.weight) < 44 || parseInt($scope.weight) > 200) {
            alertWarning($scope.$eval($interpolate("{{'message_introduce_weight_between_500'|translate}}")), $scope, $interpolate);
            return;
        }
        var requestBody = { "weekDate": weekDate,
            "dateOfWeekDate": dateOfWeekDate,
            "weight": toFloatByLanguage($scope.weight),
            "note": $scope.notes,
            "milestonType": 0
        };
        var token = localStorage[tokenLocalStorage];
        if (token) {
            httpRequest.PUT("/weights/trackers", requestBody, { "token": token }).then(function (result) {
                if (result.status == 1) {
                    currentWeightTracker.weight = $scope.weight;
                    currentWeightTracker.initialWeight = userInfo.weight;
                    currentWeightTracker.messageCode = result.messageCode;
                    currentWeightTracker.healthWeightMax = result.healthWeightMax;
                    currentWeightTracker.healthWeightMin = result.healthWeightMin;
                    currentWeightTracker.highestPriorityMilestone = result.milestone;
                    if (result.lostWeight < 0)  result.lostWeight = result.lostWeight.toString().replace("-", "");
                    currentWeightTracker.lostWeight = toCommaString(result.lostWeight);
                    currentWeightTracker.dptChanged = result.dptChanged;
                    if (result.messageCode > 0) {
                        $location.path("/weightMessage");
                    } else {
                        if (currentWeightTracker.prePath == "weightList") {
                            $location.path("/weightList");
                        } else {
                            $location.path("/tracking");
                        }
                    }
                } else {
                    alertError(result.error, $scope, $interpolate);
                }
            });
        }
    };

    $scope.back = function () {
        localStorage[currentWeightTrackerLocalStorage] = "";
        if (currentWeightTracker.prePath == "weightList") {
            $location.path("/weightList");
        } else {
            $location.path("/tracking");
        }
    };

    $scope.clearGoalNoNum = function () {
        $scope.weight = limitDecimalDigitsByLanguage($scope.weight, 3, 1);
        $scope.currentWeightTracker.weight = toFloatByLanguage($scope.weight);
    };
});

app.controller('weightGoalController', function ($rootScope, $scope, httpRequest, analytics, $location, $interpolate) {

    $scope.$watch('$viewContentLoaded', function () {
        var userInfo = JSON.parse(localStorage[userLocalStorage]);
        $scope.aboveGoalWeight = Math.round(20 * (userInfo.height * userInfo.height));
        $scope.goalWeight = toFloatFormatString(userInfo.goalWeight);
        $scope.currGoalWeight = userInfo.goalWeight;
    });

    $scope.saveWeight = function () {
        var userInfo = JSON.parse(localStorage[userLocalStorage]);
        if (!$scope.goalWeight || $scope.goalWeight == "") {
            alertWarning($scope.$eval($interpolate("{{'message_introduce_goal_less'|translate}}")), $scope, $interpolate);
            return;
        }
        var goalWeight = toFloatByLanguage($scope.goalWeight);
        if (goalWeight >= parseFloat(userInfo.weight)) {
            alertWarning($scope.$eval($interpolate("{{'message_introduce_goal_less'|translate}}")), $scope, $interpolate);
            return;
        }
        if (goalWeight < parseFloat($scope.aboveGoalWeight)) {
            alertWarning($scope.$eval($interpolate("{{'message_introduce_goal_above'|translate}}")) + $scope.aboveGoalWeight, $scope, $interpolate, $scope, $interpolate);
            return;
        }
//        if (goalWeight > userInfo.goalWeight) {
//            alertWarning($scope.$eval($interpolate("{{'message_introduce_goal_less_current_goalWeight'|translate}}")), $scope, $interpolate, $scope, $interpolate);
//            return;
//        }
        if (goalWeight > toFloatByLanguage(userInfo.currentWeight)) {
            alertWarning($scope.$eval($interpolate("{{'message_introduce_goal_less_currentWeight'|translate}}")), $scope, $interpolate, $scope, $interpolate);
            return;
        }
        var requestBody = { "goalWeight": goalWeight ,"dailyPoint":-1, "weeklyPoint":-1};
        var token = localStorage[tokenLocalStorage];
        if (token) {
            httpRequest.PUT("/weights", requestBody, { "token": token }).then(function (result) {
                if (result.status == 1) {
                    var userInfo = JSON.parse(localStorage[userLocalStorage]);
                    userInfo.goalWeight = goalWeight;
                    localStorage[userLocalStorage] = JSON.stringify(userInfo);
                    var requestSetting = {
                        "maintance":0,
                        "askedSelectWeightMode" : 1
                    };
                    httpRequest.PUT('/user/settings', requestSetting, { "token": token }).then(function (result) {
                        if (result.status) {
                            var userInfo = JSON.parse(localStorage[userLocalStorage]);
                            userInfo.maintance = 0;
                            userInfo.askedSelectWeightMode = 1;
                            localStorage[userLocalStorage] = JSON.stringify(userInfo);
                        } else {
                            alertError(result.error, $scope, $interpolate)
                        }
                    });
                    $location.path("/tracking");
                } else {
                    alertError(result.error, $scope, $interpolate);
                }
            });
        }
    };

    $scope.back = function () {
        $location.path("/tracking");

    };

    $scope.clearGoalNoNum = function () {
        $scope.goalWeight = limitDecimalDigitsByLanguage($scope.goalWeight, 3, 1);
    };
});

app.controller('weightTrackingController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $routeParams, $interpolate) {

    $scope.chartType = 0;

    $scope.$watch('$viewContentLoaded', function () {
        var token = localStorage[tokenLocalStorage];
        if (token) {
            var userInfo = JSON.parse(localStorage[userLocalStorage]);
            $scope.goalWeight = userInfo.goalWeight;
            $scope.startingWeight = userInfo.weight;
            var currentWeight = 0;

            httpRequest.Get('/weights/trackers', { "token": token }).then(function (result) {
                if (result.status) {
                    var weightTrackers = [];
//                    var leftShift = 0;
                    if (result.weightTrackers.length > 0) {
                        var lastWeight = result.weightTrackers[result.weightTrackers.length - 1];
                        var weekDate = new Date(parseFloat(lastWeight.weekDate));
                        weekDate.setDate(weekDate.getDate() + parseFloat(userInfo.trackDay));
//                        if (Date.parse(weekDate) > Date.parse(new Date())) {
//                            leftShift = 1;
//                        }

                        for (var i = 0; i < result.weightTrackers.length; i++) {
                            var weightTracker = new WeightTracker();
                            var showDate = new Date(parseFloat(result.weightTrackers[i].weekDate));
                            showDate.setDate(showDate.getDate() + parseFloat(userInfo.trackDay));
                            weightTracker.enterDate = result.weightTrackers[i].enterDate;
                            weightTracker.dateOfWeekDate = result.weightTrackers[i].dateOfWeekDate;
//                            if (1 == leftShift) {
//                                showDate.setDate(showDate.getDate() - 7);
//                                weightTracker.showDate = showDate;
//                                weightTracker.showWeekDate = new Date(parseFloat(result.weightTrackers[i].weekDate)).setDate(
//                                    new Date(parseFloat(result.weightTrackers[i].weekDate)).getDate() - 7
//                                );
//                            } else {
//                                weightTracker.showDate = showDate;
//                                weightTracker.showWeekDate = result.weightTrackers[i].weekDate;
//                            }
                            weightTracker.showDate = showDate;
                            weightTracker.showWeekDate = result.weightTrackers[i].weekDate;

                            weightTracker.weekDate = result.weightTrackers[i].weekDate;
                            weightTracker.pageWeekDate = showDate.format("mm/dd/yy");
                            weightTracker.weightGoal = userInfo.goalWeight;
                            if (result.weightTrackers[i].weight > 0) {
                                currentWeight = result.weightTrackers[i].weight;
                                weightTracker.note = result.weightTrackers[i].note;
                                weightTracker.weight = result.weightTrackers[i].weight;
                                weightTracker.highestPriorityMilestone = result.weightTrackers[i].highestPriorityMilestone;
                                if (weightTracker.highestPriorityMilestone > 0) {
                                    for (var k = 0; k < MilestonesImgs.length; k++) {
                                        if (weightTracker.highestPriorityMilestone == MilestonesImgs[k].value) {
                                            weightTracker.showMileston = MilestonesImgs[k].MilestonesImg;
                                        }
                                    }
                                }
                            }
                            weightTrackers.push(weightTracker);
                        }
                    }
                    $scope.currentWeight = currentWeight == 0 ? userInfo.weight : currentWeight;
                    localStorage[currentWeightTrackerLocalStorage] = JSON.stringify(weightTrackers[weightTrackers.length - 1]);
                    userInfo.currentWeight = $scope.currentWeight;
                    localStorage[userLocalStorage] = JSON.stringify(userInfo);
                    updateChart(weightTrackers, $window.innerWidth, $scope.chartType);
                    window.onresize = function () {
                        if ($("#plotChart").length > 0) {
                            $("#plotChart").empty();
                            updateChart(weightTrackers, $window.innerWidth, $scope.chartType);
                        }
                    };
                    $scope.weightTrackers = weightTrackers;
                    localStorage[trackingLocalStorage] = JSON.stringify(weightTrackers);
                    $scope.name = userInfo.firstName;
                    var milestonesPics = [];
                    var milestones = [];
                    if (result.allMilestones.length > 0) {
                        $scope.noStarText = false;

                        var hashObject = {};
                        for (var i = 0; i < result.allMilestones.length; i++) {
                            if (!hashObject[result.allMilestones[i]]) {
                                milestones.push(result.allMilestones[i]);
                                hashObject[result.allMilestones[i]] = true;
                            }
                        }

                        for (var a = 0; a < milestones.length; a++) {
                            for (var k = 0; k < MilestonesImgs.length; k++) {
                                if (milestones[a] == MilestonesImgs[k].value) {
                                    milestonesPics.push(MilestonesImgs[k].MilestonesImg);
                                }
                            }
                        }
                    } else {
                        $scope.noStarText = true;
                    }
                    $scope.isTrackedWeight = result.isTrackedWeight > 0 ? false : true;
                    $scope.milestonesPics = milestonesPics;
                } else {
                    alertError(result.error, $scope, $interpolate)
                }
            });
            //            $("#plotChart").bind("jqplotDataClick", function(ev, si, pi, data) {
            //                alert("helloWorld!!!"+data);
            //            });
        }
    });

    $scope.changeChart = function (type) {
        $scope.chartType = type;
        $("#plotChart").empty();
        updateChart($scope.weightTrackers, $window.innerWidth, type);
    };

    $scope.showMainBar = function () {
        if ($routeParams.mark != null && $routeParams.mark == 3) {
            $("#learnMoreBar").attr("style", "display: none");
            $("#mainBar").attr("style", "display: none");
            $("#simpleBar").attr("style", "display: block");
            $("#barLog").attr("src", "image/logo_vigilantesdopeso_red.png");
        } else {
            $("#mainBar").attr("style", "display: block");
            $("#learnMoreBar").attr("style", "display: none");
            $("#simpleBar").attr("style", "display: none");
            $("#barLog").attr("src", "image/nav_logo.png");
        }
        $scope.toggle('mainSidebar');
    };

    $scope.updateWeight = function () {
        currentWeightTracker.prePath = "";
        $location.path("/trackWeightModify");
    };

    $scope.setGoldWeight = function () {
        $location.path("/trackGoalWeight");
    };

    $scope.gotoPage = function () {
        $location.path("/weightList");
    };

    $scope.showLearnBar = function () {
        if ($routeParams.mark != null && $routeParams.mark == 3) {
            $("#mainBar").attr("style", "display: none");
            $("#learnMoreBar").attr("style", "display: none");
            $("#simpleBar").attr("style", "display: block");
            $("#barLog").attr("src", "image/logo_vigilantesdopeso_red.png");
        } else {
            $("#mainBar").attr("style", "display: block");
            $("#learnMoreBar").attr("style", "display: none");
            $("#simpleBar").attr("style", "display: none");
            $("#barLog").attr("src", "image/nav_logo.png");
        }
        $scope.toggle('mainSidebar');
    };

    $scope.back = function () {
        $location.path("/help");
    };

    window.onresize = function () {
        if ($("#bodyData").length > 0) {
            var winHeight = getWindowHeight();
            var titleHeight = $("#head").outerHeight();
            $(".myProgress_body").height(winHeight - titleHeight + 20);
        }
    };
    window.onresize();
});

app.controller('weightMessageController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $interpolate) {
    currentWeightTracker.weight = currentWeightTracker.weight != "" ? currentWeightTracker.weight : 0;
    currentWeightTracker.initialWeight = currentWeightTracker.initialWeight != "" ? currentWeightTracker.initialWeight : 0;
    currentWeightTracker.lostWeight = currentWeightTracker.lostWeight != "" ? currentWeightTracker.lostWeight : 0;
    var userInfo = JSON.parse(localStorage[userLocalStorage]);

    $scope.detailsModel = [
        {messageCode: "101",
            weightDetail: $scope.$eval($interpolate("{{'message_weight_details_1_1'|translate}}")),
            weightLostDetail: $scope.$eval($interpolate("{{'message_weight_details_1_2'|translate}}")),
            initialWeightDetail: "",
            congratulationDetail: $scope.$eval($interpolate("{{'message_weight_details_1_3'|translate}}")),
            trackerDetail: $scope.$eval($interpolate("{{'message_weight_details_1'|translate}}"))},
        {messageCode: "102",
            weightDetail: $scope.$eval($interpolate("{{'message_weight_details_1_1'|translate}}")),
            weightLostDetail: $scope.$eval($interpolate("{{'message_weight_details_2_1'|translate}}")),
            initialWeightDetail: "",
            congratulationDetail: $scope.$eval($interpolate("{{'message_weight_details_1_3'|translate}}")),
            trackerDetail: $scope.$eval($interpolate("{{'message_weight_details_2'|translate}}"))},
        {messageCode: "103",
            weightDetail: $scope.$eval($interpolate("{{'message_weight_details_1_1'|translate}}")),
            weightLostDetail: $scope.$eval($interpolate("{{'message_weight_details_1_2'|translate}}")),
            initialWeightDetail: "",
            congratulationDetail: $scope.$eval($interpolate("{{'message_weight_details_1_3'|translate}}")),
            trackerDetail: $scope.$eval($interpolate("{{'message_weight_details_3'|translate}}")) },
        {messageCode: "201",
            weightDetail: $scope.$eval($interpolate("{{'message_weight_details_1_1'|translate}}")),
            weightLostDetail: $scope.$eval($interpolate("{{'message_weight_details_1_2'|translate}}")),
            initialWeightDetail: "",
            congratulationDetail: $scope.$eval($interpolate("{{'message_weight_details_1_3'|translate}}")),
            trackerDetail: $scope.$eval($interpolate("{{'message_weight_details_4'|translate}}"))},
        {messageCode: "202",
            weightDetail: $scope.$eval($interpolate("{{'message_weight_details_1_1'|translate}}")),
            weightLostDetail: $scope.$eval($interpolate("{{'message_weight_details_2_1'|translate}}")),
            initialWeightDetail: "",
            congratulationDetail: $scope.$eval($interpolate("{{'message_weight_details_1_3'|translate}}")),
            trackerDetail: $scope.$eval($interpolate("{{'message_weight_details_5'|translate}}"))},
        {messageCode: "203",
            weightDetail: $scope.$eval($interpolate("{{'message_weight_details_1_1'|translate}}")),
            weightLostDetail: $scope.$eval($interpolate("{{'message_weight_details_1_2'|translate}}")),
            initialWeightDetail: "",
            congratulationDetail: $scope.$eval($interpolate("{{'message_weight_details_1_3'|translate}}")),
            trackerDetail: $scope.$eval($interpolate("{{'message_weight_details_6'|translate}}"))},
        {messageCode: "301",
            weightDetail: $scope.$eval($interpolate("{{'message_weight_details_1_1'|translate}}")),
            weightLostDetail: $scope.$eval($interpolate("{{'message_weight_details_1_2'|translate}}")),
            initialWeightDetail: "",
            congratulationDetail: $scope.$eval($interpolate("{{'message_weight_details_1_3'|translate}}")),
            trackerDetail: $scope.$eval($interpolate("{{'message_weight_details_7'|translate}}"))},
        {messageCode: "302",
            weightDetail: $scope.$eval($interpolate("{{'message_weight_details_1_1'|translate}}")),
            weightLostDetail: $scope.$eval($interpolate("{{'message_weight_details_1_2'|translate}}")),
            initialWeightDetail: "",
            congratulationDetail: $scope.$eval($interpolate("{{'message_weight_details_1_3'|translate}}")),
            trackerDetail:$scope.$eval($interpolate("{{'message_weight_details_8'|translate}}"))},
        {messageCode: "303",
            weightDetail: $scope.$eval($interpolate("{{'message_weight_details_1_1'|translate}}")),
            weightLostDetail: $scope.$eval($interpolate("{{'message_weight_details_1_2'|translate}}")),
            initialWeightDetail: "",
            congratulationDetail: $scope.$eval($interpolate("{{'message_weight_details_1_3'|translate}}")),
            trackerDetail: $scope.$eval($interpolate("{{'message_weight_details_9'|translate}}"))},
        {messageCode: "304",
            weightDetail: $scope.$eval($interpolate("{{'message_weight_details_1_1'|translate}}")),
            weightLostDetail: $scope.$eval($interpolate("{{'message_weight_details_1_2'|translate}}")),
            initialWeightDetail: "",
            congratulationDetail: $scope.$eval($interpolate("{{'message_weight_details_1_3'|translate}}")),
            trackerDetail: $scope.$eval($interpolate("{{'message_weight_details_10'|translate}}"))},
        {messageCode: "401",
            weightDetail: $scope.$eval($interpolate("{{'message_weight_details_1_1'|translate}}")),
            weightLostDetail: $scope.$eval($interpolate("{{'message_weight_details_1_2'|translate}}")),
            initialWeightDetail: "",
            congratulationDetail: $scope.$eval($interpolate("{{'message_weight_details_1_3'|translate}}")),
            trackerDetail: $scope.$eval($interpolate("{{'message_weight_details_11'|translate}}"))},
        {messageCode: "402",
            weightDetail: $scope.$eval($interpolate("{{'message_weight_details_1_1'|translate}}")),
            weightLostDetail: $scope.$eval($interpolate("{{'message_weight_details_2_1'|translate}}")),
            initialWeightDetail: "",
            congratulationDetail: $scope.$eval($interpolate("{{'message_weight_details_3_1'|translate}}")),
            trackerDetail:
                $scope.$eval($interpolate("{{'message_weight_details_13'|translate}}"))},
        {messageCode: "403",
            weightDetail: $scope.$eval($interpolate("{{'message_weight_details_1_1'|translate}}")),
            weightLostDetail: $scope.$eval($interpolate("{{'message_weight_details_1_2'|translate}}")),
            initialWeightDetail: "",
            congratulationDetail:   $scope.$eval($interpolate("{{'message_weight_details_2_3'|translate}}")),
            trackerDetail:
                $scope.$eval($interpolate("{{'message_weight_details_12'|translate}}"))},
        {messageCode: "404",
            weightDetail: $scope.$eval($interpolate("{{'message_weight_details_1_1'|translate}}")),
            weightLostDetail: $scope.$eval($interpolate("{{'message_weight_details_1_2'|translate}}")),
            initialWeightDetail: "",
            congratulationDetail: $scope.$eval($interpolate("{{'message_weight_details_10_1'|translate}}")),
            trackerDetail: $scope.$eval($interpolate("{{'message_weight_details_10_2'|translate}}")) },
        {messageCode: "405",
            weightDetail: $scope.$eval($interpolate("{{'message_weight_details_1_1'|translate}}")),
            weightLostDetail: $scope.$eval($interpolate("{{'message_weight_details_1_2'|translate}}")),
            initialWeightDetail: "",
            congratulationDetail: $scope.$eval($interpolate("{{'message_weight_details_15_1'|translate}}")),
            trackerDetail:
                $scope.$eval($interpolate("{{'message_weight_details_15'|translate}}"))},
        {messageCode: "501",
            weightDetail: $scope.$eval($interpolate("{{'message_weight_details_1_1'|translate}}")),
            weightLostDetail: $scope.$eval($interpolate("{{'message_weight_details_1_2'|translate}}")),
            initialWeightDetail: "",
            congratulationDetail: $scope.$eval($interpolate("{{'message_weight_details_1_3'|translate}}")),
            trackerDetail: $scope.$eval($interpolate("{{'message_weight_details_16'|translate}}"))},
        {messageCode: "502",
            weightDetail: $scope.$eval($interpolate("{{'message_weight_details_1_1'|translate}}")),
            weightLostDetail: $scope.$eval($interpolate("{{'message_weight_details_1_2'|translate}}")),
            initialWeightDetail: "",
            congratulationDetail: $scope.$eval($interpolate("{{'message_weight_details_2_3'|translate}}")),
            trackerDetail: $scope.$eval($interpolate("{{'message_weight_details_17'|translate}}")) },
        {messageCode: "503",
            weightDetail: $scope.$eval($interpolate("{{'message_weight_details_1_1'|translate}}")),
            weightLostDetail: $scope.$eval($interpolate("{{'message_weight_details_2_1'|translate}}")),
            initialWeightDetail: "",
            congratulationDetail: $scope.$eval($interpolate("{{'message_weight_details_3_1'|translate}}")),
            trackerDetail: $scope.$eval($interpolate("{{'message_weight_details_18'|translate}}")) },
        {messageCode: "601",
            weightDetail: $scope.$eval($interpolate("{{'message_weight_details_1_1'|translate}}")),
            weightLostDetail: $scope.$eval($interpolate("{{'message_weight_details_1_2'|translate}}")),
            initialWeightDetail: $scope.$eval($interpolate("{{'message_weight_details_2_2'|translate}}")),
            congratulationDetail: $scope.$eval($interpolate("{{'message_weight_details_19_1'|translate}}")) ,
            trackerDetail: ""},
        {messageCode: "602",
            weightDetail: $scope.$eval($interpolate("{{'message_weight_details_1_1'|translate}}")),
            weightLostDetail: $scope.$eval($interpolate("{{'message_weight_details_1_2'|translate}}")),
            initialWeightDetail: $scope.$eval($interpolate("{{'message_weight_details_2_2'|translate}}")),
            congratulationDetail: $scope.$eval($interpolate("{{'message_weight_details_20_1'|translate}}")),
            trackerDetail: ""},
        {messageCode: "603",
            weightDetail: $scope.$eval($interpolate("{{'message_weight_details_1_1'|translate}}")),
            weightLostDetail: $scope.$eval($interpolate("{{'message_weight_details_1_2'|translate}}")),
            initialWeightDetail: "",
            congratulationDetail: $scope.$eval($interpolate("{{'message_weight_details_244'|translate}}")),
            trackerDetail:  $scope.$eval($interpolate("{{'message_weight_details_20'|translate}}"))},
        {messageCode: "701",
            weightDetail: $scope.$eval($interpolate("{{'message_weight_details_1_1'|translate}}")),
            weightLostDetail: $scope.$eval($interpolate("{{'message_weight_details_1_2'|translate}}")),
            initialWeightDetail: "",
            congratulationDetail: $scope.$eval($interpolate("{{'message_weight_details_1_3'|translate}}")),
            trackerDetail:
                $scope.$eval($interpolate("{{'message_weight_details_21'|translate}}")) },
        {messageCode: "702",
            weightDetail: $scope.$eval($interpolate("{{'message_weight_details_1_1'|translate}}")),
            weightLostDetail: $scope.$eval($interpolate("{{'message_weight_details_1_2'|translate}}")),
            initialWeightDetail: $scope.$eval($interpolate("{{'message_weight_details_2_2'|translate}}")),
            congratulationDetail:
                $scope.$eval($interpolate("{{'message_weight_details_19_1'|translate}}")),
            trackerDetail:
                $scope.$eval($interpolate("{{'message_weight_details_24'|translate}}"))  },
        {messageCode: "703",
            weightDetail: $scope.$eval($interpolate("{{'message_weight_details_1_1'|translate}}")),
            weightLostDetail: $scope.$eval($interpolate("{{'message_weight_details_1_2'|translate}}")),
            initialWeightDetail: $scope.$eval($interpolate("{{'message_weight_details_2_2'|translate}}")),
            congratulationDetail:
                $scope.$eval($interpolate("{{'message_weight_details_20_1'|translate}}")),
            trackerDetail:
                $scope.$eval($interpolate("{{'message_weight_details_24'|translate}}")) },
        {messageCode: "704",
            weightDetail: $scope.$eval($interpolate("{{'message_weight_details_1_1'|translate}}")),
            weightLostDetail: $scope.$eval($interpolate("{{'message_weight_details_1_2'|translate}}")),
            initialWeightDetail: $scope.$eval($interpolate("{{'message_weight_details_2_2'|translate}}")),
            congratulationDetail:
                $scope.$eval($interpolate("{{'message_weight_details_19_1'|translate}}")),
            trackerDetail:
                $scope.$eval($interpolate("{{'message_weight_details_23'|translate}}")) },
        {messageCode: "705",
            weightDetail: $scope.$eval($interpolate("{{'message_weight_details_1_1'|translate}}")),
            weightLostDetail: $scope.$eval($interpolate("{{'message_weight_details_1_2'|translate}}")),
            initialWeightDetail: $scope.$eval($interpolate("{{'message_weight_details_2_2'|translate}}")),
            congratulationDetail:
                $scope.$eval($interpolate("{{'message_weight_details_20_1'|translate}}")),
            trackerDetail:
                $scope.$eval($interpolate("{{'message_weight_details_23'|translate}}")) }

    ];
    $scope.goalFlag = 0;
    for (var k = 0; k < $scope.detailsModel.length; k++) {
        if ($scope.detailsModel[k].messageCode == currentWeightTracker.messageCode) {
            $scope.congratulationDetail = $scope.detailsModel[k].congratulationDetail;
            $scope.weightDetail = $scope.detailsModel[k].weightDetail.replace("@@", currentWeightTracker.weight);
            if ("" != $scope.detailsModel[k].initialWeightDetail) {
                $scope.initialWeightDetail = $scope.detailsModel[k].initialWeightDetail.replace("@@", toFloatByLanguage(currentWeightTracker.initialWeight));
            } else {
                $scope.initialWeightDetail = "";
            }
            if (currentWeightTracker.highestPriorityMilestone > 0) {
                $scope.imgShowFlag = true;
                for (var a = 0; a < MilestonesImgs.length; a++) {
                    if (currentWeightTracker.highestPriorityMilestone == MilestonesImgs[a].value) {
                        $scope.starPath = MilestonesImgs[a].MilestonesImg;
                    }
                }
            } else {
                $scope.imgShowFlag = false;
            }
            $scope.weightLostDetail = $scope.detailsModel[k].weightLostDetail.replace("@@", currentWeightTracker.lostWeight);
            $scope.detailsModel[k].trackerDetail = $scope.detailsModel[k].trackerDetail.replace("@@", currentWeightTracker.healthWeightMin);
            $scope.detailsModel[k].trackerDetail = $scope.detailsModel[k].trackerDetail.replace("##", currentWeightTracker.healthWeightMax);
            $scope.trackerDetail = $scope.detailsModel[k].trackerDetail;
            break;
        } else {
            $scope.congratulationDetail = $scope.detailsModel[0].congratulationDetail;
            $scope.weightDetail = $scope.detailsModel[0].weightDetail.replace("@@", currentWeightTracker.weight);
            $scope.initialWeightDetail = "";
            $scope.weightLostDetail = $scope.detailsModel[0].weightLostDetail.replace("@@", currentWeightTracker.lostWeight);
            $scope.trackerDetail = $scope.detailsModel[0].trackerDetail;
        }
    }
    if (toFloatByComma(currentWeightTracker.weight) <= userInfo.goalWeight && userInfo.maintance == 0) {
        $scope.goalFlag = 1;
    }

    userInfo.currentWeight = currentWeightTracker.weight;
    localStorage[userLocalStorage] = JSON.stringify(userInfo);

    $scope.goWeightGoal = function() {
        currentWeightTracker.prePath = "weightModify";
        $location.path("/trackGoalWeight");
    }

    $scope.goMaintain = function() {
        var token = localStorage[tokenLocalStorage];
        httpRequest.PUT('/user/settings/maintance', {"maintance":1}, { "token": token }).then(function (result) {
            if (result.status) {
                var userInfo = JSON.parse(localStorage[userLocalStorage]);
                userInfo.maintance = 1;
                localStorage[userLocalStorage] = JSON.stringify(userInfo);
                httpRequest.Get('/user/info', { "token": token }).then(function (result) {
                    if (result.status == 1) {
                        var dailyPoint = result.userInfo.dailyPoint;
                        var userInfo = JSON.parse(localStorage[userLocalStorage]);
                        userInfo.dailyPoint = dailyPoint;
                        localStorage[userLocalStorage] = JSON.stringify(userInfo);
                        $scope.goWeightOK();
                    }
                });
            }
        });
    }

    $scope.goWeightOK = function () {
        var token = localStorage[tokenLocalStorage];
        httpRequest.Get('/user/info', { "token": token }).then(function (result) {
            if (result.status == 1) {
                var dailyPoint = result.userInfo.dailyPoint;
                var userInfo = JSON.parse(localStorage[userLocalStorage]);
                userInfo.dailyPoint = dailyPoint;
                localStorage[userLocalStorage] = JSON.stringify(userInfo);
                if (currentWeightTracker.dptChanged == 1) {
                    if (userInfo.maintance == 1) {
                        alertWarning($scope.$eval($interpolate("{{'message_weight_Dpt_maintain'|translate}}")) + dailyPoint, $scope, $interpolate);
                    } else {
                        alertWarning($scope.$eval($interpolate("{{'message_weight_Dpt_change'|translate}}")) + dailyPoint, $scope, $interpolate);
                    }
                }
            }
        });
        if (currentWeightTracker.prePath == "weightList") {
            $location.path("/" + currentWeightTracker.prePath);
        } else {
            $location.path("/tracking");
        }
    };

    $scope.back = function () {
        $location.path("/tracking");
    };
});