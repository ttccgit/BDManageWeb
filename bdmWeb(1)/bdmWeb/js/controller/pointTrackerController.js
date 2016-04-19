var currentSearchFood = "";
var searchTime = true;
var isSearchAllFood = false;
function removeAccents(value) {
    return value
        .replace(/á/g, 'a')
        .replace(/ã/g, 'a')
        .replace(/à/g, 'a')
        .replace(/â/g, 'a')

        .replace(/é/g, 'e')
        .replace(/ê/g, 'e')

        .replace(/í/g, 'i')

        .replace(/ó/g, 'o')
        .replace(/ô/g, 'o')
        .replace(/õ/g, 'o')

        .replace(/ç/g, 'c')

        .replace(/,/g, '')

        .replace(/ü/g, 'u')
        .replace(/ũ/g, 'u')
        .replace(/ú/g, 'u');
}

app.controller('pointTrackerController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $interpolate) {
    $scope.$watch('$viewContentLoaded', function () {
        if (!Modernizr.inputtypes.date) {
            $scope.isShowD = 1;
            $("#dateInput").Zebra_DatePicker({
                onSelect: function(view, elements) {
                    localStorage[trackerDateLocalStorage] = elements;
                    $scope.syncPointTracker(new Date(elements).getTime());
                    if (new Date(elements).getTime() < new Date().getTime() && new Date(elements).toLocaleDateString() != new Date().toLocaleDateString()) {
                        $scope.trackerDateFlag = 1;
                    } else {
                        $scope.trackerDateFlag = 0;
                    }
                },
                format: 'Y-m-d'
            });
        } else {
            if (isATF()) {
                $scope.isShowD = 1;
                $("#dateInput").Zebra_DatePicker({
                    onSelect: function(view, elements) {
                        localStorage[trackerDateLocalStorage] = elements;
                        $scope.syncPointTracker(new Date(elements).getTime());
                        if (new Date(elements).getTime() < new Date().getTime() && new Date(elements).toLocaleDateString() != new Date().toLocaleDateString()) {
                            $scope.trackerDateFlag = 1;
                        } else {
                            $scope.trackerDateFlag = 0;
                        }
                    },
                    format: 'Y-m-d'
                });
            }
        }
        localStorage[foodLocalStorage] = JSON.stringify("");
        localStorage[foodDetailsLocalStorage] = JSON.stringify("");
        var trackerDate = new Date();
        var userInfo = JSON.parse(localStorage[userLocalStorage]);
        $scope.weeklyPointFlag = userInfo.weeklyPoint == 49 ? 0 : 1;
        $scope.dailyPointFlag = userInfo.dptChanged;
        if ("" != localStorage[trackerDateLocalStorage] && undefined != localStorage[trackerDateLocalStorage]) {
            trackerDate = new Date(localStorage[trackerDateLocalStorage]);
            $scope.trackerDateFlag = new Date(localStorage[trackerDateLocalStorage]).format("yyyy-mm-dd") >= new Date().format("yyyy-mm-dd") ? 0 : 1;
        } else {
            localStorage[trackerDateLocalStorage] = new Date(trackerDate);
            $scope.trackerDateFlag = 0;
        }
        if (!Modernizr.inputtypes.date) {
            $scope.trackerDate = new Date(trackerDate).format("yyyy-mm-dd");
        } else {
//            $scope.trackerDate = new Date(trackerDate).format("yyyy-mm-dd").toString();
            if (isATF()) {
                $scope.trackerDate = new Date(trackerDate).format("yyyy-mm-dd").toString();
            } else {
                $scope.trackerDate = new Date(trackerDate);
            }
        }
        trackerDate = new Date(trackerDate).getTime();

        var startDate = new Date().setDate(new Date().getDate() - 60);
        var gettingStartFinishDate = getWeeHoursDay(new Date(userInfo.gettingStartFinishDate));
        startDate = getWeeHoursDay(new Date(startDate));
        $scope.maxTrackDay = new Date().format("yyyy-mm-dd");
        $scope.minTrackDay = gettingStartFinishDate > startDate ? new Date(gettingStartFinishDate).format("yyyy-mm-dd") : new Date(startDate).format("yyyy-mm-dd");

        $scope.syncPointTracker(trackerDate);

        currentSearchFood = "";
        isSearchAllFood = false;

    });

    $scope.showDeleteIcon = function () {
        var div = $(".ul_none_li").parent().parent().parent();

        if ($(".ul_none_li").length > 0 && $scope.deleteModel != 1) {
            $("#editButton").attr("src", "image/done_botton.png");
            $(".ul_none_li").addClass("deleteIcon");
            $(div.firstElementChild).attr("src", "image/unfold.png");
            div.css("display", "block");
            $scope.deleteModel = 1;
        } else {
            $("#editButton").attr("src", "image/edit_botton.png");
            $(div.lastElementChild).css("display", "none");
            $(div.firstElementChild).attr("src", "image/shrink.png");
            $(".ul_none_li").removeClass("deleteIcon");
            div.css("display", "none");
            $scope.deleteModel = 0;
        }
    };

    $scope.showMainBar = function () {
        $("#mainBar").attr("style", "display: block");
        $("#learnMoreBar").attr("style", "display: none");
        $("#simpleBar").attr("style", "display: none");
        $("#barLog").attr("src", "image/nav_logo.png");
        $scope.toggle('mainSidebar');
    };

    $scope.getPoints = function (date) {
        var token = localStorage[tokenLocalStorage];
        if (token) {
            httpRequest.Get("/points/date/" + date, {"token": token}).then(function (result) {
                if (result.status == 1) {
                    var dailyPoint = result.pointTrackerContext.dailyPoint;
                    var pointPriority = result.pointTrackerContext.pointPriority;
                    var weeklyPoint = result.pointTrackerContext.weeklyPoint;
                    var weeklyPointRemain = result.pointTrackerContext.weeklyPointRemain;
                    var weeklyActivityPointEarned = result.pointTrackerContext.weeklyActivityPointEarned;
                    var weeklyActivityPointRemain = result.pointTrackerContext.weeklyActivityPointRemain;
                } else {
                    alertError(result.error, $scope, $interpolate)
                }
            })
        }

    };

    $scope.showDeleteBtnA = function(activity) {
        var token = localStorage[tokenLocalStorage];
        if (1 == $scope.deleteModel) {
            if ("deleteIconEx" != activity.deleteIcon) {
                activity.deleteIcon = "deleteIconEx";
                activity.delete = 1;
            } else {
                activity.deleteIcon = "deleteIcon";
                activity.delete = 0;
            }
        } else {
            if (101 == activity.activityType) {
                activity.mode = "update";
                localStorage[activityLocalStorage] = JSON.stringify(activity);
                $location.path("/activitiesAdd");
            } else {
                alertWarning($scope.$eval($interpolate("{{'message_point_activity'|translate}}")), $scope, $interpolate);

            }
        }

    }

    $scope.deleteActivity = function (activity) {
        var token = localStorage[tokenLocalStorage];
        if (token) {
            httpRequest.DELETE("/activities/trackers/" + activity.id, {"token": token}).then(function (result) {
                if (result.status == 1) {
                    var trackerDate = new Date(localStorage[trackerDateLocalStorage]).getTime();
                    $scope.syncPointTracker(trackerDate);
                } else {
                    alertError(result.error, $scope, $interpolate);
                }
            });
        }
    }

    $scope.showDeleteBtn = function(food) {

        var token = localStorage[tokenLocalStorage];
        var mealTime = food.mealTime;
        if (1 == $scope.deleteModel) {
            if ("deleteIconEx" != food.deleteIcon) {
                food.deleteIcon = "deleteIconEx";
                food.delete = 1;
            } else {
                food.deleteIcon = "deleteIcon";
                food.delete = 0;
            }
        } else {
            if (food.archived == 1 || food.obsolete == 1) {
                return;
            }
            if (token) {
                var requestBody = {"name": food.name};
                var foodType = food.foodType;
                var type;
                if (foodType == 203) {
                    localStorage[foodLocalStorage] = JSON.stringify(food);
                    $location.path("/quickFoodDetails").search("meal", mealTime);
                    return;
                } else if (foodType == 202) {
                    type = 4;
                } else {
                    type = 2;
                }
                httpRequest.PUT("/user/foods/search/type/" + type, requestBody, {"token": token}).then(function (result) {
                    if (result.status == 1) {
                        if (result.foods.length == 0) {
                            return;
                        }
                        var newfood;
                        for (var i = 0; i < result.foods.length; i++) {
                            if (food.foodId == result.foods[i].id) {
                                newfood = {createdDate: result.foods[i].createdDate, favorite: result.foods[i].favorite, foodId: result.foods[i].id,
                                    itemType: result.foods[i].itemType, memberFood: result.foods[i].memberFood, name: result.foods[i].name,
                                    point: food.point, powerFood: result.foods[i].powerFood, recentAdd: result.foods[i].recentAdd,
                                    servingsFractionId: food.servingsFractionId, servingsWhole: food.servingsWhole, trackerId: food.id,
                                    servings: food.servings, mealTime: food.mealTime, portionId: food.portionId};
                                localStorage[foodLocalStorage] = JSON.stringify(newfood);
                                break;
                            }
                        }
                        if (newfood.itemType == 203) {
                            $location.path("/quickFoodDetails").search("meal", mealTime);
                        } else if (foodItemType[newfood.itemType] == "recipes") {
                            $location.path("/recipesDetails").search("meal", mealTime);
                        } else if (foodItemType[newfood.itemType] == "meal") {
                            $location.path("/mealDetails").search("meal", null);
                        } else {
                            $location.path("/foodDetails").search("meal", mealTime);
                        }
                    } else {
                        alertError(result.error, $scope, $interpolate);
                    }
                });
            }
        }
    };

    $scope.deleteFood = function (food) {
        var token = localStorage[tokenLocalStorage];
        var mealTime = food.mealTime;
        if (token) {
            httpRequest.DELETE("/foods/trackers/" + food.id, {"token": token}).then(function (result) {
                if (result.status == 1) {
                    var trackerDate = new Date(localStorage[trackerDateLocalStorage]).getTime();
                    $scope.syncPointTracker(trackerDate);
                } else {
                    alertError(result.error, $scope, $interpolate);
                }
            });
        }
    };

    $scope.changeTrackerDate = function() {

        if ($scope.trackerDate == null || $scope.trackerDate == '') {
            if (localStorage[trackerDateLocalStorage]) {
//                $scope.trackerDate = new Date(localStorage[trackerDateLocalStorage]).format("yyyy-mm-dd").toString();
                $scope.trackerDate = new Date(localStorage[trackerDateLocalStorage]);
            }
            else {
//                $scope.trackerDate = new Date().format("yyyy-mm-dd").toString();
                $scope.trackerDate = new Date();
            }
        }
        if (localStorage[dateSelectFlag] != "1") {

            localStorage[dateSelectFlag] = "1";
            $scope.setTrackerDate();
        }
    };

    $scope.setTrackerDate = function () {
        var userInfo = JSON.parse(localStorage[userLocalStorage]);
        var gettingStartFinishDate = getWeeHoursDay(new Date(userInfo.gettingStartFinishDate));
//        var currentDate = new Date(getWeeHoursDay(new Date($scope.trackerDate))).getTime();
//        var currentDate = new Date(formatDate($scope.trackerDate)).getTime();
        var currentDate = $scope.trackerDate.getTime();
        var startDate = new Date();
        startDate.setDate(startDate.getDate() - 60);
        var arrButton = [$scope.$eval($interpolate("{{'button_ok'|translate}}"))];
        if (gettingStartFinishDate > currentDate) {
            if (localStorage[dateSelectFlag] == "1") {
                openDialog($scope.$eval($interpolate("{{'button_warning'|translate}}")), $scope.$eval($interpolate("{{'message_point_sign_date'|translate}}")), arrButton,
                    function (r) {
                        if (r == 0) {
                            localStorage[dateSelectFlag] = "0";
//                            $scope.trackerDate = new Date(localStorage[trackerDateLocalStorage]).format("yyyy-mm-dd").toString();
                            $scope.trackerDate = new Date(localStorage[trackerDateLocalStorage]);

//                            $("#trackerDateInput").val(new Date(localStorage[trackerDateLocalStorage]).format("yyyy-mm-dd").toString());
                        }
                    });
            }
//            alertWarning($scope.$eval($interpolate("{{'message_point_sign_date'|translate}}")), $scope, $interpolate);
        } else if (startDate.getTime() >= currentDate) {
            if (localStorage[dateSelectFlag] == "1") {
                openDialog($scope.$eval($interpolate("{{'button_warning'|translate}}")), $scope.$eval($interpolate("{{'message_point_cannot_60'|translate}}")), arrButton,
                    function (r) {
                        if (r == 0) {
                            localStorage[dateSelectFlag] = "0";
                            $("#trackerDateInput").val(new Date(localStorage[trackerDateLocalStorage]).format("yyyy-mm-dd").toString());
                        }
                    });
            }
//            $scope.trackerDate = new Date(localStorage[trackerDateLocalStorage]).format("yyyy-mm-dd").toString();
//            alertWarning($scope.$eval($interpolate("{{'message_point_cannot_60'|translate}}")), $scope, $interpolate);
        } else if (currentDate > new Date().getTime()) {
            if (localStorage[dateSelectFlag] == "1") {
                openDialog($scope.$eval($interpolate("{{'button_warning'|translate}}")), $scope.$eval($interpolate("{{'message_point_cannot_future'|translate}}")), arrButton,
                    function (r) {
                        if (r == 0) {
                            localStorage[dateSelectFlag] = "0";
                            $("#trackerDateInput").val(new Date(localStorage[trackerDateLocalStorage]).format("yyyy-mm-dd").toString());
                        }
                    });
            }
//            $scope.trackerDate = new Date(localStorage[trackerDateLocalStorage]).format("yyyy-mm-dd").toString();
//            alertWarning($scope.$eval($interpolate("{{'message_point_cannot_future'|translate}}")), $scope, $interpolate);
        } else {
            localStorage[dateSelectFlag] = "0";
            localStorage[trackerDateLocalStorage] = new Date(currentDate);
//            $scope.trackerDate = new Date( $scope.trackerDate).format("yyyy-mm-dd").toString();
            $scope.syncPointTracker(currentDate);
            if (getWeeHoursDay(new Date(currentDate)) != getWeeHoursDay(new Date())) {
                $scope.trackerDateFlag = 1;
            } else {
                $scope.trackerDateFlag = 0;
            }
        }
    };

    $scope.prevDate = function () {
        var token = localStorage[tokenLocalStorage];
        var userInfo = JSON.parse(localStorage[userLocalStorage]);
        var gettingStartFinishDate = getWeeHoursDay(new Date(userInfo.gettingStartFinishDate));

        var trackerDate = new Date(localStorage[trackerDateLocalStorage]);
        var startDate = new Date();
        startDate.setDate(startDate.getDate() - 60);
        trackerDate.setDate(trackerDate.getDate() - 1);
        $("#editButton").attr("src", "image/edit_botton.png");
        $(".mealDetails").css("display", "none");
        trackerDate = getWeeHoursDay(new Date(trackerDate));
        startDate = getWeeHoursDay(new Date(startDate));
        if (gettingStartFinishDate > trackerDate) {
            alertWarning($scope.$eval($interpolate("{{'message_point_sign_date'|translate}}")), $scope, $interpolate);
        } else if (startDate >= trackerDate) {
            alertWarning($scope.$eval($interpolate("{{'message_point_cannot_60'|translate}}")), $scope, $interpolate);
            $scope.trackerDateFlag = 1;
        } else {
            localStorage[trackerDateLocalStorage] = new Date(trackerDate);
//            $scope.trackerDate = new Date(trackerDate).format("yyyy-mm-dd").toString();
            if (!Modernizr.inputtypes.date) {
                $scope.trackerDate = new Date(trackerDate).format("yyyy-mm-dd");
            } else {
                if (isATF()) {
                    $scope.trackerDate = new Date(trackerDate).format("yyyy-mm-dd");
                } else {
                    $scope.trackerDate = new Date(trackerDate);
                }
            }
            $scope.syncPointTracker(trackerDate);
            $scope.trackerDateFlag = 1;
        }
    };

    $scope.afterDate = function () {
        var trackerDate = new Date(localStorage[trackerDateLocalStorage]);
        var currentDate = new Date(localStorage[trackerDateLocalStorage]);
        trackerDate.setDate(trackerDate.getDate() + 1);
        currentDate = trackerDate;
//        $scope.trackerDate = trackerDate.format("yyyy-mm-dd").toString();
        if (!Modernizr.inputtypes.date) {
            $scope.trackerDate = new Date(trackerDate).format("yyyy-mm-dd");
        } else {
//            $scope.trackerDate = new Date(trackerDate);
            if (isATF()) {
                $scope.trackerDate = new Date(trackerDate).format("yyyy-mm-dd");
            } else {
                $scope.trackerDate = trackerDate;
            }
        }
        localStorage[trackerDateLocalStorage] = trackerDate;
        var trackerTime = new Date(trackerDate).getTime();
        $scope.syncPointTracker(trackerTime);
        $("#editButton").attr("src", "image/edit_botton.png");
        $(".mealDetails").css("display", "none");
        if (currentDate.getTime() < getWeeHoursDay(new Date())) {
            $scope.trackerDateFlag = 1;
        } else {
            $scope.trackerDateFlag = 0;
        }
    };

    $scope.syncPointTracker = function (trackerDate) {
        var token = localStorage[tokenLocalStorage];
        if (token) {
            httpRequest.Get("/points/date/" + trackerDate, {"token": token}).then(function (result) {
                if (result.status == 1) {
                    var dailyPointUsed = result.pointTrackerContext.dailyPointUsed > 0 ? result.pointTrackerContext.dailyPointUsed : 0;
                    var dailyPoint = result.pointTrackerContext.dailyPoint > 0 ? result.pointTrackerContext.dailyPoint : 0;
                    var weeklyPointRemain = result.pointTrackerContext.weeklyPointRemain;
                    var weeklyActivityPointRemain = result.pointTrackerContext.weeklyActivityPointRemain > 0 ? result.pointTrackerContext.weeklyActivityPointRemain : 0;
                    var dailyRemainingPoints = dailyPoint - dailyPointUsed;
                    var dailyProgress = ( dailyPointUsed / dailyPoint ) * 100;
                    dailyProgress = dailyProgress > 100 ? 100 : dailyProgress;
                    dailyProgress = dailyProgress < 0 ? 0 : dailyProgress;

                    $scope.dailyUsedPoints = dailyPointUsed;
                    $scope.dailyPoint = dailyPoint;
                    $scope.dailyUsedPointsPro = dailyRemainingPoints > 0 ? dailyPointUsed : dailyPoint;
                    $scope.dailyRemainingPoints = dailyRemainingPoints > 0 ? dailyRemainingPoints : 0;
                    $scope.weeklyRemainingPoints = weeklyPointRemain;
//                    $scope.weeklyPointFlag = weeklyPointRemain 1= 49 ? 1 : 0;
                    $scope.weeklyActivitiesPoints = weeklyActivityPointRemain;
                    $scope.dailyProgress = dailyProgress + "%";

                    httpRequest.Get("/foods/trackers/date/" + trackerDate, {"token": token}).then(function (result) {
                        if (result.status == 1) {
                            var foodTrackers = result.foodTrackers;
                            $scope.breakfastFoods = [];
                            $scope.lunchFoods = [];
                            $scope.dinnerFoods = [];
                            $scope.snackFoods = [];
                            $scope.breakfastPoint = 0;
                            $scope.lunchPoint = 0;
                            $scope.dinnerPoint = 0;
                            $scope.snackPoint = 0;
                            for (var i = 0; i < foodTrackers.length; i++) {
                                foodTrackers[i].delete = 0;
                                if ($scope.deleteModel == 1) {
                                    foodTrackers[i].deleteIcon = "deleteIcon";
                                }

                                if (foodTrackers[i].mealTime == 0) {

                                    $scope.breakfastFoods.push(foodTrackers[i]);
                                    $scope.breakfastPoint = $scope.breakfastPoint + foodTrackers[i].point;
                                } else if (foodTrackers[i].mealTime == 1) {
                                    $scope.lunchFoods.push(foodTrackers[i]);
                                    $scope.lunchPoint = $scope.lunchPoint + foodTrackers[i].point;
                                } else if (foodTrackers[i].mealTime == 2) {
                                    $scope.dinnerFoods.push(foodTrackers[i]);
                                    $scope.dinnerPoint = $scope.dinnerPoint + foodTrackers[i].point;
                                } else if (foodTrackers[i].mealTime == 3 || foodTrackers[i].mealTime == 4) {
                                    $scope.snackFoods.push(foodTrackers[i]);
                                    $scope.snackPoint = $scope.snackPoint + foodTrackers[i].point;
                                }
                            }
                            $scope.dailyUsedPoints = $scope.breakfastPoint + $scope.lunchPoint + $scope.dinnerPoint + $scope.snackPoint;

                            httpRequest.Get("/activities/user/activity/" + trackerDate, {"token": token}).then(function (result) {
                                if (result.status == 1) {
                                    $scope.activitiesPoint = 0;
                                    for (var i = 0; i < result.activityTrackers.length; i++) {
                                        result.activityTrackers[i].delete = 0;
                                        if ($scope.deleteModel == 1) {
                                            result.activityTrackers[i].deleteIcon = "deleteIcon";
                                        }
                                        $scope.activitiesPoint = $scope.activitiesPoint + result.activityTrackers[i].point;
                                    }
                                    $scope.activities = result.activityTrackers;

                                    $scope.startTrackMode();
                                } else {
                                    alertError(result.error, $scope, $interpolate);
                                }
                            });
                        } else {
                            alertError(result.error, $scope, $interpolate)
                        }
                    });

                } else {
                    alertError(result.error, $scope, $interpolate);
                }
            });

        }
    }

    $scope.startTrackMode = function () {
        var token = localStorage[tokenLocalStorage];
        if (token) {
            httpRequest.PUT('/user/mode', { "mode": Modes.Tracking }, { "token": token }).then(function (result) {
                if (result.status) {
                    var userInfo = JSON.parse(localStorage[userLocalStorage]);
                    userInfo.mode = Modes.Tracking;
                    localStorage[userLocalStorage] = JSON.stringify(userInfo);
                } else if (result.status == 0) {
                    alertWarning(result.error.message, $scope, $interpolate);
                }
            });
        } else {
            $location.path("/login");
        }
    };

    window.onresize = function () {
        if ($("#bodyData").length > 0) {
            var winHeight = getWindowHeight();
            var titleHeight = $("#head").outerHeight() + 65;
            $(".myProgress_body").height(winHeight - titleHeight);
        }
    };
    window.onresize();
});

app.controller('activityTrackerController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $interpolate) {
    $scope.$watch('$viewContentLoaded', function () {
        $scope.recentlySearch();
    });

    $scope.searchAllActivity = function(name) {
        if ($("#recently").hasClass("active") || $("#fav").hasClass("active")) {
            if (name != undefined && name != "") {
                if (name.length >= 3) {
                    if (searchTime) {
                        searchTime = false;
                        $scope.loadImg = 1;
//                        if ($("#recently").hasClass("active")) {
//                            $scope.itemFlag = 0;
//                            $scope.recentActivities = [];
//                        } else {
//                            $scope.favoriteFlag = 0;
//                            $scope.favActivities = []
//                        }
                        var searchName = stripScript(name);
                        $scope.searchActivityApp(searchName);
                    }
                }
            }
        }
    };

    $scope.searchActivityApp = function(name) {
        $scope.loadImg = 1;
        if ($("#recently").hasClass("active")) {
            $scope.itemFlag = 0;
        } else {
            $scope.favoriteFlag = 0;
        }
        var token = localStorage[tokenLocalStorage];
        var requestBody = {"name":name};
        if (token) {
            var url = "/user/activities/search?random=" + Math.random();
            httpRequest.PUT(url, requestBody, {"token": token}).then(function (result) {
                if (result.status == 1) {
                    var activities = [];
                    if ($("#recently").hasClass("active")) {
                        $scope.recentActivities = [];
                        if (result.activities.length == 0) {
                            $scope.itemFlag = 1;
                        }
                    } else {
                        $scope.favActivities = [];
                        if (result.activities.length == 0) {
                            $scope.favoriteFlag = 1;
                        }
                    }
                    for (var i = 0; i < result.activities.length; i++) {
                        if ($("#recently").hasClass("active")) {
                            $scope.recentActivities.push(result.activities[i]);
                        } else {
                            $scope.favActivities.push(result.activities[i]);
                        }
                    }
                    $scope.loadImg = 0;
                    searchTime = true;
                } else {
                    alertError(result.error, $scope, $interpolate)
                }
            });
        }
    };

    $scope.extendSearch = function(keyCode) {
        if (keyCode == 13 && $scope.searchName != undefined && $scope.searchName.length >= 3) {
            $scope.searchAllActivity($scope.searchName);
        }
    };

    $scope.recentlySearch = function () {
        $(".searchDiv").removeClass("no_button");
        $scope.searchName = undefined;
        $scope.loadImg = 1;
        $scope.itemFlag = 0;
        $scope.recentActivities = [];
        var token = localStorage[tokenLocalStorage];
        var searchType = "";
        var requestBody = { "name": $scope.searchName};
        if (token) {
            httpRequest.PUT("/user/activities/recent", requestBody, {"token": token}).then(function (result) {
                if (result.status == 1) {
                    var recentActivities = [];
                    var titleDate = "";
                    if (result.recentActivities.length == 0) {
                        $scope.itemFlag = 1;
                    }
                    for (var i = 0; i < result.recentActivities.length; i++) {
                        var activity = new Activity();
                        activity = result.recentActivities[i];
                        var today = new Date();
                        if (new Date(parseInt(result.recentActivities[i].createdDate)).getDate() == new Date().getDate()) {
                            activity.showCreatedDate = "Hoje";
                        } else if (new Date(parseInt(result.recentActivities[i].createdDate)).getDate() == today.getDate() - 1) {
                            activity.showCreatedDate = "Ontem";
                        } else {
                            activity.showCreatedDate = new Date(parseInt(result.recentActivities[i].createdDate)).format("dd/mm");
                        }
                        if (titleDate != activity.showCreatedDate) {
                            var activityT = new Activity();
                            activityT.titleFlag = 1;
                            activityT.showTitle = activity.showCreatedDate;
                            titleDate = activity.showCreatedDate;
                            recentActivities.push(activityT);
                        } else {
                            activity.titleFlag = 0;
                        }
                        recentActivities.push(activity);
                    }
                    $scope.recentActivities = recentActivities;
                    $scope.loadImg = 0;
                } else {
                    alertError(result.error, $scope, $interpolate)
                }
            });
        }
    };

    $scope.allSearch = function () {
        $(".searchDiv").addClass("no_button");
        $scope.searchName = undefined;
        $scope.loadImg = 1;
        $scope.itemFlag = 0;
        $scope.activities = [];
        var token = localStorage[tokenLocalStorage];
        var requestBody = {};
        if (token) {
            var url = "/user/activities/search?random=" + Math.random();
            httpRequest.PUT(url, requestBody, {"token": token}).then(function (result) {
                if (result.status == 1) {
                    var activities = [];
                    var initial = "";
                    if (result.activities.length == 0) {
                        $scope.allFlag = 1;
                    }
                    for (var i = 0; i < result.activities.length; i++) {
                        var activity = new Activity();
                        activity = result.activities[i];
                        if (initial != result.activities[i].name.substring(0, 1).toUpperCase()) {
                            var activityT = new Activity();

                            activityT.titleFlag = 1;
                            activityT.showTitle = result.activities[i].name.substring(0, 1).toUpperCase();
                            initial = result.activities[i].name.substring(0, 1).toUpperCase();
                            activities.push(activityT);
                        } else {
                            activity.titleFlag = 0;
                        }
                        activities.push(activity);
                    }
                    $scope.activities = activities;
                    $scope.loadImg = 0;
                } else {
                    alertError(result.error, $scope, $interpolate)
                }
            });
        }
    };

    $scope.favSearch = function () {
        $(".searchDiv").removeClass("no_button");
        $scope.searchName = undefined;
        $scope.loadImg = 1;
        $scope.itemFlag = 0;
        $scope.favActivities = [];
        var token = localStorage[tokenLocalStorage];
        var requestBody = {};
        if (token) {
            httpRequest.PUT("/user/activities/favorite", requestBody, {"token": token}).then(function (result) {
                if (result.status == 1) {
                    var favActivities = [];
                    var initial = "";
                    if (result.activities.length == 0) {
                        $scope.favoriteFlag = 1;
                    }
                    for (var i = 0; i < result.activities.length; i++) {
                        var activity = new Activity();
                        activity = result.activities[i];
                        if (initial != result.activities[i].name.substring(0, 1).toUpperCase()) {
                            var activityT = new Activity();
                            activityT.titleFlag = 1;
                            activityT.showTitle = result.activities[i].name.substring(0, 1).toUpperCase();
                            initial = result.activities[i].name.substring(0, 1).toUpperCase();
                            favActivities.push(activityT);
                        } else {
                            activity.titleFlag = 0;
                        }
                        favActivities.push(activity);
                    }
                    $scope.favActivities = favActivities;
                    $scope.loadImg = 0;
                } else {
                    alertError(result.error, $scope, $interpolate);
                }
            });
        }
    };

    $scope.getDetailActivity = function (activity) {
        if ("101" == activity.type) {
            localStorage[activityLocalStorage] = JSON.stringify(activity);
            $location.path("/activitiesAdd");
        } else {
            activity.mode = "update";
            localStorage[activityLocalStorage] = JSON.stringify(activity);
            $location.path("/activitiesQuickAdd");
        }
    };

    $scope.backToIndex = function () {
        $location.path("/pointsIndex").search("meal", null);
    };

    $scope.toQuickAdd = function () {
        localStorage[foodLocalStorage] = "";
        localStorage[activityLocalStorage] = "";
        $location.path("/quickAdd").search("type", "activity");
    };

    $scope.toCal = function () {
        localStorage[foodLocalStorage] = "";
        localStorage[foodDetailsLocalStorage] = "";
        $location.path("/calculator").search("type", "activity");
    };

    $scope.ignoreAccents = function(item) {
        if (!$scope.searchName) {
            return true;
        }
        var text = removeAccents(item.name.toLowerCase());
        var search = removeAccents($scope.searchName.toLowerCase());
        return text.indexOf(search) > -1;
    };

    window.onresize = function () {
        if ($("#bodyData").length > 0) {
            var winHeight = getWindowHeight();
            var titleHeight = $("#head").outerHeight();
            $(".myProgress_body").height(winHeight - titleHeight);
        }
    };
    window.onresize();
});

app.controller('activitiesModifyController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $routeParams, $interpolate) {
    $scope.$watch('$viewContentLoaded', function () {
        var act = JSON.parse(localStorage[activityLocalStorage]);
        var token = localStorage[tokenLocalStorage];
        var trackerDate = localStorage[trackerDateLocalStorage];
        $scope.trackerDate = new Date(trackerDate).format("ddd dd mmm");
        if (token) {
            httpRequest.Get("/user/reminder/settings/", { "token": token }).then(function (result) {
                if (result.status == 1) {
                    if (result.reminder && result.reminder != "") {
                        var userInfo = JSON.parse(localStorage[userLocalStorage]);
                        userInfo.favReminder = result.reminder.favoritePrompt;
                        localStorage[userLocalStorage] = localStorage[userLocalStorage] = JSON.stringify(userInfo);
                    }
                }
            });

            if (act.mode != "update") {
                httpRequest.Get("/user/activities/" + act.id, {"token": token}).then(function (result) {
                    if (result.status == 1) {
                        var activity = new Activity();
                        $scope.name = result.activity.name;
                        $scope.duration = result.activity.duration;
                        $scope.favIconFlag = result.activity.isFavorite;
                        $scope.point = 0;
                        activity = result.activity;
                        localStorage[activityLocalStorage] = JSON.stringify(activity);
                    } else {
                        alertError(result.error, $scope, $interpolate);
                    }
                });
            } else {
                $scope.point = act.point;
                $scope.name = act.activityName;
                $scope.duration = act.duration;
                $scope.favIconFlag = act.isFavorite;
                $scope.buttonGray = 1;
            }
        }
    });

    $scope.addToTracker = function () {
        var activityDetails = JSON.parse(localStorage[activityLocalStorage]);
        var userInfo = JSON.parse(localStorage[userLocalStorage]);

        var favSettingFlag = userInfo.favReminder;
        if (favSettingFlag == 2 && activityDetails.favoriteSetting == 1) {
            var arrButton = [$scope.$eval($interpolate("{{'button_yes'|translate}}")), $scope.$eval($interpolate("{{'button_no'|translate}}")) , $scope.$eval($interpolate("{{'button_always'|translate}}"))];
            openDialog($scope.$eval($interpolate("{{'button_warning'|translate}}")), $scope.$eval($interpolate("{{'message_point_track_1'|translate}}")) + " " + activityDetails.name + " " + $scope.$eval($interpolate("{{'message_point_track_2'|translate}}")),
                arrButton, handleReminderMessage);
            $(".dialog").addClass("mbtn");
        } else if (favSettingFlag == 3 && activityDetails.favoriteSetting == 1) {
            $scope.addFav();
            handleActivity2Tracker();
        } else {
            handleActivity2Tracker();
        }
    };

    function handleReminderMessage(resultStatus) {
        var token = localStorage[tokenLocalStorage];
        if (resultStatus == 0) {
            $scope.addFav();
        } else if (resultStatus == 2) {
            if (token) {
                httpRequest.PUT("/user/reminder/settings/", {"favoritePrompt":3}, {"token": token}).then(function (result) {
                    if (result.status == 1) {
                        var userInfo = JSON.parse(localStorage[userLocalStorage]);
                        userInfo.favReminder = $scope.fav;
                        localStorage[userLocalStorage] = JSON.stringify(userInfo);
                        $scope.addFav();
                    } else {
                        alertError(result.error, $scope, $interpolate);
                    }
                });
            }
        }
        handleActivity2Tracker();
    }

    function handleActivity2Tracker() {
        var token = localStorage[tokenLocalStorage];
        var act = JSON.parse(localStorage[activityLocalStorage]);
        var userInfo = JSON.parse(localStorage[userLocalStorage]);
        var requestBody = {};
        if (token) {
            if (act.mode != "update") {
                requestBody = { "activityId": act.sequence , "activityType": 101,
                    "activityName": act.name, "intensity": act.intensity,
                    "duration": $scope.duration, "point": $scope.point,
                    "weight": userInfo.weight, "createdDate": new Date(localStorage[trackerDateLocalStorage]).getTime()
                };
                httpRequest.POST("/activities/trackers", requestBody, {"token": token}).then(function (result) {
                    if (result.status == 1) {
                        $location.path("/pointsIndex");
                    } else {
                        alertError(result.error, $scope, $interpolate)
                    }
                });
            } else {
                requestBody = {"id": act.id, "activityId": act.activityId, "activityType": act.activityType,
                    "activityName": act.activityName, "intensity": act.intensity,
                    "duration": $scope.duration, "point": $scope.point,
                    "weight": userInfo.weight, "createdDate": new Date(localStorage[trackerDateLocalStorage]).getTime()
                };
                httpRequest.PUT("/activities/trackers", requestBody, {"token": token}).then(function (result) {
                    if (result.status == 1) {
                        $location.path("/pointsIndex");
                    } else {
                        alertError(result.error, $scope, $interpolate)
                    }
                });
            }

        }
    }

    $scope.addFav = function () {
        var act = JSON.parse(localStorage[activityLocalStorage]);
        var token = localStorage[tokenLocalStorage];
//        var id = act.mode == "update" ? act.activityId : act.id;
        var actId = "";
        if (act.sequence != undefined && act.sequence != null && act.sequence != "") {
            actId = act.sequence;
        } else {
            actId = act.activityId;
        }
        var requestBody = { "itemType": 101, "itemId": actId};

        if (token) {
            httpRequest.POST("/user/favorites", requestBody, {"token": token}).then(function (result) {
                if (result.status == 1) {
                    $scope.favIconFlag = true;
                } else {
                    alertError(result.error, $scope, $interpolate)
                }
            });
        }
    };

    $scope.deleteFav = function () {
        var act = JSON.parse(localStorage[activityLocalStorage]);
//        var id = act.mode == "update" ? act.activityId : act.id;
        var token = localStorage[tokenLocalStorage];
        var actId = "";
        if (act.sequence != undefined && act.sequence != null && act.sequence != "") {
            actId = act.sequence;
        } else {
            actId = act.activityId;
        }
        if (token) {
            httpRequest.DELETE("/user/favorites/type/101/" + actId, {"token": token}).then(function (result) {
                if (result.status == 1) {
                    $scope.favIconFlag = false;
                } else {
                    alertError(result.error, $scope, $interpolate)
                }
            });
        }
    };

    $scope.calcActivityPoints = function () {
        $scope.duration = $scope.duration.replace(/[^\d]/g, '');
        if (undefined != $scope.duration && "" != $scope.duration) {
            $scope.buttonGray = 1;
        } else {
            $scope.buttonGray = 0;
        }
        var act = JSON.parse(localStorage[activityLocalStorage]);
        var userInfo = JSON.parse(localStorage[userLocalStorage]);
        $scope.point = calculateActivityPoints(act.intensity, userInfo.weight, $scope.duration);
    }

    $scope.prevBack = function () {
        $location.path("/activitiesList");
    }
});

app.controller('memberFoodController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $routeParams, $interpolate) {

    $scope.$watch('$viewContentLoaded', function () {
//        if ($routeParams.type == undefined) {
//            $("#activity").removeAttr("default");
//            $("#food").attr("default", "active");
//        }else{
//            $("#activity").removeAttr("default");
//            $("#food").attr("default", "active");
//        }

//        $scope.mealModel = [
//            {"id": 0, "name": $scope.$eval($interpolate("{{'label_point_breakfast'|translate}}"))},
//            {"id": 1, "name": $scope.$eval($interpolate("{{'label_point_lunch'|translate}}"))},
//            {"id": 2, "name": $scope.$eval($interpolate("{{'label_point_dinner'|translate}}"))},
//            {"id": 3, "name": $scope.$eval($interpolate("{{'label_point_snack'|translate}}"))}
//        ];

        $scope.mealModel = [
            {"id": 0, "name": "café da manhã"},
            {"id": 1, "name": "Almoço"},
            {"id": 2, "name": "Jantar"},
            {"id": 3, "name": "Hora do lanche"}
        ];

        $scope.meal = parseInt($routeParams.meal);

        $scope.pointCal = 0;
        if (localStorage[foodLocalStorage] != "") {
            var food = JSON.parse(localStorage[foodLocalStorage]);
            if (food != "") {
                $scope.name = food.name;
                $scope.point = food.point;
                $scope.pointCal = food.point;
            }
        }
        if (localStorage[foodDetailsLocalStorage] != "") {
            var food = JSON.parse(localStorage[foodDetailsLocalStorage]);
            if (food != "") {
                $scope.fiber = food.fiber;
                $scope.protein = food.protein;
                $scope.fat = food.fat;
                $scope.carbs = food.carbohydrates;
                $scope.name = food.name;
                $scope.point = food.point;
                $scope.date = new Date(food.id).format("ddd dd mmm");
                $scope.pointCal = food.point;
                var userInfo = JSON.parse(localStorage[userLocalStorage]);
                if (userInfo.language == "pt_BR") {
                    $scope.fiber = $scope.fiber.toString().replace(".", ",");
                    $scope.protein = $scope.protein.toString().replace(".", ",");
                    $scope.fat = $scope.fat.toString().replace(".", ",");
                    $scope.carbs = $scope.carbs.toString().replace(".", ",");
                }
            }
        }


        if ($scope.name != undefined) {
            if ($scope.name.length >= 3 && undefined != $scope.point && "" != $scope.point) {
                $scope.buttonGray = 1;
            } else {
                $scope.buttonGray = 0;
            }
        }

        if ($routeParams.type == "4") {
            $scope.isNameModify = 0;
            $scope.isPointModify = 0;
        } else {
            $scope.isNameModify = 1;
            $scope.isPointModify = 1;
        }

        var trackerDate = localStorage[trackerDateLocalStorage];
        $scope.trackerDate = new Date(trackerDate).format("ddd dd mmm");
    });

//    $scope.back = function() {
//        if ($routeParams.type != undefined && $routeParams.type != "") {
//            $location.path("/pointsIndex");
//            $location.url($location.path());
//        } else {
//            $location.path("/pointsIndex");
//            $location.url($location.path());
//        }
//    };

    $scope.checkName = function () {
        if ($scope.name != undefined) {
            if ($scope.name.length >= 3 && undefined != $scope.point) {
                $scope.buttonGray = 1;
            } else {
                $scope.buttonGray = 0;
            }
        }
    };

    $scope.pointChange = function () {
        $scope.point = $scope.point.replace(/[^\d]/g, '');
        if ($scope.name != undefined) {
            if ($scope.name.length >= 3 && undefined != $scope.point && "" != $scope.point) {
                $scope.buttonGray = 1;
            } else {
                $scope.buttonGray = 0;
            }
        }
        if ($scope.point == "") {
            $scope.pointCal = 0;
        } else {
            $scope.pointCal = $scope.point;
        }
    };

    $scope.calculatePoints = function () {
        if ($scope.fat != undefined) {
            $scope.fat = limitDecimalDigitsByLanguage($scope.fat, 3, 1);
        } else {
            return;
        }
        if ($scope.carbs != undefined) {
            $scope.carbs = limitDecimalDigitsByLanguage($scope.carbs, 3, 1);
        } else {
            return;
        }
        if ($scope.fiber != undefined) {
            $scope.fiber = limitDecimalDigitsByLanguage($scope.fiber, 3, 1);
        } else {
            return;
        }
        if ($scope.protein != undefined) {
            $scope.protein = limitDecimalDigitsByLanguage($scope.protein, 3, 1);
        } else {
            return;
        }
        if ($scope.fat != "" && $scope.carbs != "" && $scope.fiber != "" && $scope.protein != "") {
            var fat = $scope.fat.replace(",", ".");
            var carbs = $scope.carbs.replace(",", ".");
            var fiber = $scope.fiber.replace(",", ".");
            var protein = $scope.protein.replace(",", ".");
            $scope.point = Math.round(calculateFoodPoints(protein, carbs, fat, fiber, "", 1));
            if ($scope.name != undefined && $scope.name.length >= 3) {
                $scope.buttonGray = 1;
            }
        } else {
            $scope.buttonGray = 0;
            $scope.point = 0;
        }
    };

    $scope.addMemberFood = function (isToTracker) {

        var fat = $scope.fat;
        var carbs = $scope.carbs;
        var fiber = $scope.fiber;
        var protein = $scope.protein;
        if (!isToTracker) {
            fat = $scope.fat.replace(",", ".");
            carbs = $scope.carbs.replace(",", ".");
            fiber = $scope.fiber.replace(",", ".");
            protein = $scope.protein.replace(",", ".");
        }
        var requestBody = { "foodName": $scope.name,
            "fat": fat == undefined ? 0 : fat,
            "carbs": carbs == undefined ? 0 : carbs,
            "fiber": fiber == undefined ? 0 : fiber,
            "protein": protein == undefined ? 0 : protein,
            "point": $scope.point,
            "foodType": isToTracker == true ? 203 : 202 };

        var token = localStorage[tokenLocalStorage];
        if (token) {
            httpRequest.POST("/user/foods", requestBody, {"token": token}).then(function (result) {
                if (result.status == 1) {
                    if (isToTracker) {
                        var mealTime = $scope.meal;
                        requestBody = {"foodId": result.food.id, "portionId": -1, "type": isToTracker == true ? 203 : 202,
                            "servings": 0, "servingsWhole": 0, "servingsFractionId": 0, "point": result.food.point,
                            "mealTime": mealTime,"scanned":0,"createdDate": new Date(localStorage[trackerDateLocalStorage]).getTime()};
                        httpRequest.POST("/foods/trackers", requestBody, {"token": token}).then(function (result) {
                            if (result.status == 1) {
                                $location.path("/pointsIndex").search("meal", null);
                            } else {
                                alertError(result.error, $scope, $interpolate)
                            }
                        })
                    } else {
                        requestBody = {"name": result.food.foodName};
                        var foodId = result.food.id;
                        var food;
                        httpRequest.PUT("/user/foods/search/type/" + 4, requestBody, {"token": token}).then(function (result) {
                            if (result.status == 1) {
                                for (var i = 0; i < result.foods.length; i++) {
                                    if (foodId == result.foods[i].id) {
                                        localStorage[foodLocalStorage] = JSON.stringify(result.foods[i]);
                                        food = result.foods[i];
                                        break;
                                    }
                                }
                                $location.path("/foodDetails").search("meal", $scope.meal);
                            } else {
                                alertError(result.error, $scope, $interpolate);
                            }
                        });
                    }
                } else {
                    alertError(result.error, $scope, $interpolate)
                }
            });
        }
    };

    $scope.updateMemberFood = function () {
        var requestBody = {"id": 1934008808, "fat": $scope.fat,
            "foodName": $scope.foodName, "carbs": $scope.carbs,
            "fiber": $scope.fiber, "protein": $scope.protein,
            "point": $scope.point};
        var token = localStorage[tokenLocalStorage];
        if (token) {
            httpRequest.PUT("/activities/trackers", requestBody, {"token": token}).then(function (result) {
                if (result.status == 1) {


                } else {
                    alertError(result.error, $scope, $interpolate)
                }
            });
        }
    };

    $scope.deleteMemberFood = function () {
        var id = "";
        var token = localStorage[tokenLocalStorage];
        if (token) {
            httpRequest.DELETE("/user/foods/" + id, {"token": token}).then(function (result) {
                if (result.status == 1) {


                } else {
                    alertError(result.error, $scope, $interpolate)
                }
            });
        }
    };

    $scope.updateFoodTracker = function () {
        var food = JSON.parse(localStorage[foodLocalStorage]);
        var token = localStorage[tokenLocalStorage];
        if (token) {
            var requestBody = {};
            if ($routeParams.type == 4 || $routeParams.type == 1) {
                requestBody = {"id": food.id, "fat": 0, "foodName": $scope.name, "carbs": 0, "fiber": 0, "protein": 0, "point": $scope.point,"foodType":food.itemType};
                httpRequest.PUT("/user/foods", requestBody, {"token": token}).then(function (result) {
                    if (result.status == 1) {
                        requestBody = {"foodId": food.id, "portionId": -1, "type": food.itemType,
                            "servings": 0, "servingsWhole": 0, "servingsFractionId": 0, "point":$scope.point,
                            "mealTime": $scope.meal,"scanned":0, "createdDate": new Date(localStorage[trackerDateLocalStorage]).getTime()};
                        httpRequest.POST("/foods/trackers", requestBody, {"token": token}).then(function (result) {
                            if (result.status == 1) {
                                $location.search('meal', null)
                                $location.search('type', null)
                                $location.path("/pointsIndex");
                            } else {
                                alertError(result.error, $scope, $interpolate)
                            }
                        })
                    }
                });
            } else {
                requestBody = {"id":food.id,"foodId": food.foodId, "portionId": -1, "type": food.foodType,
                    "servings": 0, "servingsWhole": 0, "servingsFractionId": 0, "point":$scope.point,
                    "mealTime": $scope.meal};
                httpRequest.PUT("/foods/trackers", requestBody, {"token": token}).then(function (result) {
                    if (result.status == 1) {
                        $location.path("/pointsIndex").search("meal", null);
                    } else {
                        alertError(result.error, $scope, $interpolate)
                    }
                });
            }
        }
    };

    $scope.back = function() {
//        currentSearchFood = "";
        $window.history.back();
    };

});

app.controller('foodDetailsController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $routeParams, $interpolate) {
    $scope.$watch('$viewContentLoaded', function () {
        var trackerDate = localStorage[trackerDateLocalStorage];
        $scope.trackerDate = new Date(trackerDate).format("ddd dd mmm");

//        $scope.servingsWholeModel = [];
//        for (var i = 0; i <= 200; i++) {
//            $scope.servingsWholeModel.push({id: i, name: i});
//        }
        $scope.servingsFractionIdModel = [];

//        $scope.servingsWhole = 1;

        var token = localStorage[tokenLocalStorage];
        if (token) {
            httpRequest.Get("/user/reminder/settings/", { "token": token }).then(function (result) {
                if (result.status == 1) {
                    if (result.reminder && result.reminder != "") {
                        var userInfo = JSON.parse(localStorage[userLocalStorage]);
                        userInfo.favReminder = result.reminder.favoritePrompt;
                        localStorage[userLocalStorage] = localStorage[userLocalStorage] = JSON.stringify(userInfo);
                    }
                }
            });

            httpRequest.Get("/foods/fractions", {"token": token}).then(function (result) {
                if (result.status == 1) {
                    if (!localStorage[fractionsLocalStorage]) {
                        localStorage[fractionsLocalStorage] = JSON.stringify(result.fractions);
                    }
                    $scope.servingsFractionIdModel.push({id: -1, name: " "});
                    for (var i = 0; i < result.fractions.length; i++) {
                        $scope.servingsFractionIdModel.push({id: result.fractions[i].id, name: result.fractions[i].fraction});
                    }
//                    $scope.fractionId = -1;
                } else {
                    alertError(result.error, $scope, $interpolate)
                }
            });
        }


        var food = JSON.parse(localStorage[foodLocalStorage]);
        if (food) {
            if (foodItemType[food.itemType] == "recipes") {
                $scope.getRecipeDetail(food);
            } else if (foodItemType[food.itemType] == "meal") {
                $scope.getMealDetails(food);
            } else {
                if (token) {
                    var foodId;
                    if (food.trackerId != undefined) {
                        foodId = food.foodId;
                    } else {
                        foodId = food.id
                    }
                    httpRequest.Get("/user/foods/" + foodId + "/type/" + food.itemType, {"token": token}).then(function (result) {
                        if (result.status == 1) {
                            $scope.servingsWholeModel = [];
                            for (var j = 0; j <= 200; j++) {
                                $scope.servingsWholeModel.push({id: j, name: j});
                            }
                            localStorage[foodDetailsLocalStorage] = JSON.stringify(result.food);
                            $scope.uomsModel = [];
                            if (result.food.uoms != null) {
                                for (var i = 0; i < result.food.uoms.length; i++) {
                                    $scope.uomsModel.push({id: result.food.uoms[i].id, name: result.food.uoms[i].name});
                                }
                                $scope.portionId = result.food.uoms[0].id;
                            } else {
                                $scope.uomsModel.push({id: -1, name: $scope.$eval($interpolate("{{'label_pointTrack_servings'|translate}}"))});
                                $scope.portionId = -1;
                            }
                            if (food.portionId != 0) {
                                $scope.portionId = food.portionId;
                            }
                            $scope.name = result.food.name;

                            if (food.trackerId != undefined) {
                                $scope.servingsWhole = food.servingsWhole;
                                $scope.fractionId = food.servingsFractionId;
                            } else {
                                if (food.servingsWhole != 0) {
                                    $scope.servingsWhole = food.servingsWhole;
                                    $scope.fractionId = food.servingsFractionId;
                                } else {
                                    if (result.food.servingSize != undefined) {
                                        var servingSize = result.food.servingSize.toString();
                                        $scope.servingsWhole = parseInt(servingSize.split(".")[0]);
                                        if (servingSize.split(".")[1] != undefined) {
                                            var fraction = parseFloat("0" + "." + servingSize.split(".")[1]);
                                            $scope.fractionId = findNearestVal(fraction);
                                        } else {
                                            $scope.fractionId = -1;
                                        }
                                    } else {
                                        $scope.servingsWhole = 1;
                                        $scope.fractionId = -1
                                    }
                                }

                            }

                            if (result.food.zeroPoint == 1) {
                                $scope.point = 0;
                            } else {
                                if (food.point == "") {
                                    $scope.point = result.food.point;
                                } else {
                                    $scope.point = food.point;
                                    localStorage[foodLocalStorage] = JSON.stringify(food);
                                }
                            }

                            $scope.protein = result.food.protein;
                            $scope.carbs = result.food.carbohydrates;
                            $scope.fat = result.food.fat;
                            $scope.fiber = result.food.fiber;
                            $scope.favorite = result.food.favorite;
                            $scope.recentAdd = result.food.recentAdd;
                            $scope.memberFood = result.food.memberFood;
                            $scope.powerFood = result.food.powerFood;
                            $scope.favIconFlag = result.food.favorite;
                        } else {
                            alertError(result.error, $scope, $interpolate)
                        }
                    });
                }
            }
        } else {
            $scope.servingsWholeModel = [];
            for (var j = 0; j <= 200; j++) {
                $scope.servingsWholeModel.push({id: j, name: j});
            }
        }
    });

    $scope.servingChanged = function () {
        if (($scope.servingsWhole == 0 && $scope.fractionId == -1) || ($scope.servingsWhole == 0 && $scope.fractionId == undefined)) {
            alertWarning($scope.$eval($interpolate("{{'message_point_service'|translate}}")), $scope, $interpolate);
            $scope.point = 0;
            return;
        }
        var servings = 0;
        if ($scope.fractionId == -1 || $scope.fractionId == undefined) {
            servings = $scope.servingsWhole;
        } else {
            var fractions = JSON.parse(localStorage[fractionsLocalStorage]);
            for (var i = 0; i < fractions.length; i++) {
                if ($scope.fractionId == fractions[i].id) {
                    servings = $scope.servingsWhole + fractions[i].molecular / fractions[i].denominator;
                    break;
                }
            }
        }
        var foodDetails = JSON.parse(localStorage[foodDetailsLocalStorage]);
        var food = JSON.parse(localStorage[foodLocalStorage]);

        if (foodDetails.zeroPoint == 1) {
            $scope.point = 0;
        } else {
            var servingSize = 0;
            if (foodDetails.servingSize == null || foodDetails.servingSize == undefined) {
                servingSize = 1;
            } else {
                servingSize = foodDetails.servingSize;
            }
            if (food.itemType != 204) {
                if (food.itemType == 201) {
                    var portion = "";
                    for (var j = 0; j < foodDetails.portions.length; j++) {
                        if ($scope.portionId == foodDetails.portions[j].id) {
                            portion = foodDetails.portions[j];
                            break;
                        }
                    }
                    $scope.point = Math.round(calculateFoodPoints(portion.protein, portion.totalCarb, portion.totalFat, portion.fiber, "", servings) / portion.servingSize);
                } else {
                    $scope.point = Math.round(calculateFoodPoints(foodDetails.protein, foodDetails.carbohydrates, foodDetails.fat, foodDetails.fiber, "", servings) / servingSize);
                }
            } else if (food.itemType == 204) {
                $scope.point = Math.round(calculateRecipePoints(foodDetails.ingredients, "", servings) / servingSize);
            } else if (food.itemType == 205) {
                var ingredientsPoint = 0;
                for (var j = 0; j < foodDetails.ingredients.length; j++) {
                    ingredientsPoint = ingredientsPoint + foodDetails.ingredients[j].point;
                }
                $scope.point = Math.round(servings * ingredientsPoint);
            }
        }
    };

    $scope.getMealDetails = function (meal) {
        if ($routeParams.meal == undefined) {
            $scope.buttonGray = 0;
        } else {
            $scope.buttonGray = 1;
        }
        var token = localStorage[tokenLocalStorage];
        if (token) {
            var mealId;
            if (meal.trackerId == undefined) {
                mealId = meal.id
            } else {
                mealId = meal.foodId;
            }
            httpRequest.Get("/user/meals/" + mealId, {"token": token}).then(function (result) {
                if (result.status == 1) {
                    $scope.servingsWholeModel = [];
                    for (var i = 0; i <= 200; i++) {
                        $scope.servingsWholeModel.push({id: i, name: i});
                    }
                    if (result.meal.zeroPoint == 1) {
                        $scope.point = 0;
                    } else {
                        $scope.point = result.meal.point;
                    }
                    $scope.title = result.meal.name;
                    $scope.ingredients = result.meal.ingredients;
                    $scope.note = result.meal.note;
                    $scope.favIconFlag = result.meal.favorite;
                    localStorage[foodDetailsLocalStorage] = JSON.stringify(result.meal);
                } else {
                    alertError(result.error, $scope, $interpolate)
                }
            });
        }
    };

    $scope.getRecipeDetail = function (recipe) {
        var token = localStorage[tokenLocalStorage];
        if (token) {
            var recipeId;
            if (recipe.trackerId == undefined) {
                recipeId = recipe.id
            } else {
                recipeId = recipe.foodId;
            }
            httpRequest.Get("/user/recipes/" + recipeId, {"token": token}).then(function (result) {
                if (result.status == 1) {
                    $scope.servingsWholeModel = [];
                    for (var i = 0; i <= 200; i++) {
                        $scope.servingsWholeModel.push({id: i, name: i});
                    }
                    $scope.name = result.recipe.name;
                    if (recipe.trackerId != undefined) {
                        $scope.servingsWhole = recipe.servingsWhole;
                        $scope.fractionId = recipe.servingsFractionId;
                        $scope.point = recipe.point;
                    } else {
                        if (recipe.servingsWhole != 0) {
                            $scope.servingsWhole = recipe.servingsWhole;
                            $scope.fractionId = recipe.servingsFractionId;
                        } else {
                            $scope.servingsWhole = 1;
                            $scope.fractionId = -1;
                        }
//                        var servingSize = result.recipe.servingSize.toString();
//                        $scope.servingsWhole = parseInt(servingSize.split(".")[0]);
//                        if (servingSize.split(".")[1] != undefined) {
//                            var fraction = parseFloat("0" + "." + servingSize.split(".")[1]);
//                            $scope.fractionId = findNearestVal(fraction);
//                        } else {
//                            $scope.fractionId = -1;
//                        }
//                        $scope.point = result.recipe.point;


                    }

//                    $scope.point = 0;
//                    for (var i = 0; i < result.recipe.ingredients.length; i++) {
//                          $scope.point = $scope.point + result.recipe.ingredients[i].point
//                    }
                    $scope.ingredients = result.recipe.ingredients;
                    $scope.prepareTime = result.recipe.prepareTime;
                    $scope.cookTime = result.recipe.cookTime;
                    $scope.difficultyLevel = result.recipe.difficultyLevel;
//                    if (result.recipe.difficultyLevel == 1) {
//                        $scope.difficultyLevel = "fácil";
//                    } else if (result.recipe.difficultyLevel == 2) {
//                        $scope.difficultyLevel = "moderada";
//                    } else {
//                        $scope.difficultyLevel = "difícil";
//                    }
//                    $scope.instruction = result.recipe.instruction;
                    $("#instruction").html(result.recipe.instruction);
                    $scope.note = result.recipe.note;
//                    $scope.favorite = result.recipe.favorite;
                    $scope.recipesImg = result.recipe.image;
                    $scope.favIconFlag = result.recipe.favorite;
//                    $scope.recentAdd = result.recipe.recentAdd;
//                    $scope.memberFood = result.recipe.memberFood;
//                    $scope.powerFood = result.recipe.powerFood;
//                    $scope.favIconFlag = result.recipe.favorite;
                    localStorage[foodDetailsLocalStorage] = JSON.stringify(result.recipe);
                    if (recipe.trackerId == undefined) {
                        $scope.servingChanged();
                    }
                } else {
                    alertError(result.error, $scope, $interpolate);
                }
            });
        }
    };

    $scope.addFoodTracker = function () {
        if ($scope.servingsWhole == 0 && $scope.fractionId == -1) {
            alertWarning($scope.$eval($interpolate("{{'message_point_service'|translate}}")), $scope, $interpolate);
            return;
        }
        var foodDetails = JSON.parse(localStorage[foodDetailsLocalStorage]);
        var userInfo = JSON.parse(localStorage[userLocalStorage]);

        var favSettingFlag = userInfo.favReminder;
        if (favSettingFlag == 2 && foodDetails.favoriteSetting == 1) {
            var arrButton = [$scope.$eval($interpolate("{{'button_yes'|translate}}")), $scope.$eval($interpolate("{{'button_no'|translate}}")) , $scope.$eval($interpolate("{{'button_always'|translate}}"))];
            openDialog($scope.$eval($interpolate("{{'button_warning'|translate}}")), $scope.$eval($interpolate("{{'message_point_track_1'|translate}}")) + foodDetails.name + $scope.$eval($interpolate("{{'message_point_track_2'|translate}}")),
                arrButton, handleReminderMessage);
            $(".dialog").addClass("mbtn");
        } else if (favSettingFlag == 3 && foodDetails.favoriteSetting == 1) {
            $scope.addFav();
            handleInsert2Tracker();
        } else {
            handleInsert2Tracker();
        }
    };

    function handleReminderMessage(resultStatus) {
        var token = localStorage[tokenLocalStorage];
        if (resultStatus == 0) {
            $scope.addFav();
        } else if (resultStatus == 2) {
            if (token) {
                httpRequest.PUT("/user/reminder/settings/", {"favoritePrompt":3}, {"token": token}).then(function (result) {
                    if (result.status == 1) {
                        var userInfo = JSON.parse(localStorage[userLocalStorage]);
                        userInfo.favReminder = $scope.fav;
                        localStorage[userLocalStorage] = JSON.stringify(userInfo);
                        $scope.addFav();
                    } else {
                        alertError(result.error, $scope, $interpolate);
                    }
                });
            }
        }
        handleInsert2Tracker();
    }

    function handleInsert2Tracker() {
        var food = JSON.parse(localStorage[foodLocalStorage]);
        var token = localStorage[tokenLocalStorage];
        var servings;
        if ($scope.fractionId == -1 || $scope.fractionId == undefined) {
            servings = $scope.servingsWhole;
        } else {
            var fractions = JSON.parse(localStorage[fractionsLocalStorage]);
            for (var i = 0; i < fractions.length; i++) {
                if ($scope.fractionId == fractions[i].id) {
                    servings = $scope.servingsWhole + fractions[i].molecular / fractions[i].denominator;
                    break;
                }
            }
        }
        if (food.trackerId != undefined) {
//            var servings;
//            if ($scope.fractionId == -1 || $scope.fractionId == undefined) {
//                servings = $scope.servingsWhole;
//            } else {
//                var fractions = JSON.parse(localStorage[fractionsLocalStorage]);
//                for (var i = 0; i < fractions.length; i++) {
//                    if ($scope.fractionId == fractions[i].id) {
//                        servings = $scope.servingsWhole + fractions[i].molecular / fractions[i].denominator;
//                        break;
//                    }
//                }
//            }
            if (servings.toString().indexOf(".") > 0) {
                var str = servings.toString().substring(0, servings.toString().indexOf(".") + 3);
                servings = parseFloat(str);
            }
            if ($scope.portionId == undefined) {
                $scope.portionId = -1;
            }
            var requestBody = {"id": food.trackerId, "foodId": food.foodId, "portionId": $scope.portionId, "type": food.itemType,
                "servings": servings, "servingsWhole": $scope.servingsWhole, "servingsFractionId": $scope.fractionId,
                "point": $scope.point, "mealTime": food.mealTime};
            if ($scope.point == undefined) {
                return;
            }
            if (token) {
                httpRequest.PUT("/foods/trackers", requestBody, {"token": token}).then(function (result) {
                    if (result.status == 1) {
                        $location.path("/pointsIndex").search("meal", null);
                    } else {
                        alertError(result.error, $scope, $interpolate)
                    }
                });
            }
        } else {
            if (food.itemType == 205) {
                $scope.servingsWhole = 1;
                $scope.fractionId = -1;
            } else {
                if ($scope.fractionId == undefined) $scope.fractionId = -1;
            }
            var mealTime = parseInt($routeParams.meal);
            if ($scope.portionId == undefined) {
                $scope.portionId = -1;
            }
            var foodDetails = JSON.parse(localStorage[foodDetailsLocalStorage]);
            var requestBody = {"foodId": food.id, "portionId":  $scope.portionId,
                "type": JSON.parse(localStorage[foodLocalStorage]).itemType,
                "servings": servings, "servingsWhole": $scope.servingsWhole, "servingsFractionId": $scope.fractionId,
                "point": $scope.point, "mealTime": mealTime, "scanned":0,"createdDate": new Date(localStorage[trackerDateLocalStorage]).getTime()};
            if ($scope.point == undefined) {
                return;
            }
            if (token) {
                httpRequest.POST("/foods/trackers", requestBody, {"token": token}).then(function (result) {
                    if (result.status == 1) {
                        $location.path("/pointsIndex").search("meal", null);
                    } else {
                        alertError(result.error, $scope, $interpolate)
                    }
                })
            }
        }
    }

    $scope.addFav = function () {
//        var food = JSON.parse(localStorage["foodDetailsLocalStorage"]);
        var food = JSON.parse(localStorage[foodLocalStorage]);
        var token = localStorage[tokenLocalStorage];
        var foodId;
        if (food.trackerId != undefined) {
            foodId = food.foodId;
        } else {
            foodId = food.id
        }
        var requestBody = { "itemType": food.itemType, "itemId": foodId};
        if (token) {
            httpRequest.POST("/user/favorites", requestBody, {"token": token}).then(function (result) {
                if (result.status == 1) {
                    $scope.favIconFlag = true;
                } else {
                    alertError(result.error, $scope, $interpolate)
                }
            });
        }
    };

    $scope.deleteFav = function () {
//        var food = JSON.parse(localStorage["foodDetailsLocalStorage"]);
        var food = JSON.parse(localStorage[foodLocalStorage]);
        var foodId = "";
        if (food.id != undefined) {
            foodId = food.id;
        } else {
            foodId = food.foodId
        }
        var token = localStorage[tokenLocalStorage];
        if (token) {
            httpRequest.DELETE("/user/favorites/type/" + food.itemType + "/" + foodId, {"token": token}).then(function (result) {
                if (result.status == 1) {
                    $scope.favIconFlag = false;
                } else {
                    alertError(result.error, $scope, $interpolate)
                }
            });
        }
    };


    $scope.uomsChanged = function() {
        var foodDetails = JSON.parse(localStorage[foodDetailsLocalStorage]);
        var portion = "";
        for (var j = 0; j < foodDetails.portions.length; j++) {
            if ($scope.portionId == foodDetails.portions[j].id) {
                portion = foodDetails.portions[j];
                break;
            }
        }
        if (portion != "") {
            if (portion.servingSize != null && portion.servingSize != undefined) {
                var servingSize = portion.servingSize.toString();
                $scope.servingsWhole = parseInt(servingSize.split(".")[0]);
                if (servingSize.split(".")[1] != undefined) {
                    var fraction = parseFloat("0" + "." + servingSize.split(".")[1]);
                    $scope.fractionId = findNearestVal(fraction);
                } else {
                    $scope.fractionId = -1;
                }
            } else {
                $scope.servingsWhole = 0;
                $scope.fractionId = -1
            }
            $scope.protein = Math.round(portion.protein * Math.pow(10, 1)) / Math.pow(10, 1);
            $scope.carbs = Math.round(portion.totalCarb * Math.pow(10, 1)) / Math.pow(10, 1);
            $scope.fat = Math.round(portion.totalFat * Math.pow(10, 1)) / Math.pow(10, 1);
            $scope.fiber = Math.round(portion.fiber * Math.pow(10, 1)) / Math.pow(10, 1);
            $scope.servingChanged();
        }
    };


});

app.controller('recipesController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $routeParams, $interpolate) {
    $scope.$watch('$viewContentLoaded', function () {
//        $scope.mealModel = [
//            {"id": 0, "name": $scope.$eval($interpolate("{{'label_point_breakfast'|translate}}"))},
//            {"id": 1, "name": $scope.$eval($interpolate("{{'label_point_lunch'|translate}}"))},
//            {"id": 2, "name": $scope.$eval($interpolate("{{'label_point_dinner'|translate}}"))},
//            {"id": 3, "name": $scope.$eval($interpolate("{{'label_point_snack'|translate}}"))}
//        ];
        $scope.mealModel = [
            {"id": 0, "name": "café da manhã"},
            {"id": 1, "name": "Almoço"},
            {"id": 2, "name": "Jantar"},
            {"id": 3, "name": "Hora do lanche"}
        ];
        $scope.meal = parseInt($routeParams.meal);
        $scope.getRecentlyRecipes();
    });

    $scope.getAllRecipes = function() {
        $(".searchDiv").addClass("no_button");
        $scope.searchName = undefined;
        var token = localStorage[tokenLocalStorage];
        if (token) {
            $scope.loadImg = 1;
            $scope.allFlag = 0;
            httpRequest.PUT("/user/foods/search/type/recipe", { "name":""}, {"token": token}).then(function (result) {
                if (result.status == 1) {
                    var initial = "";
                    $scope.allRecipes = [];
                    if (result.recipes.length == 0) {
                        $scope.allFlag = 1;
                    }
                    for (var i = 0; i < result.recipes.length; i++) {
                        var recipe = [];
                        if (initial != result.recipes[i].name.substring(0, 1).toUpperCase()) {
                            recipe.titleFlag = 1;
                            recipe.showTitle = result.recipes[i].name.substring(0, 1).toUpperCase();
                            recipe.name = "";
                            initial = result.recipes[i].name.substring(0, 1).toUpperCase();
                            $scope.allRecipes.push(recipe);
                            $scope.allRecipes.push(result.recipes[i]);
                        } else {
                            $scope.allRecipes.push(result.recipes[i]);
                        }
                    }
                    $scope.loadImg = 0;
                } else {
                    alertError(result.error, $scope, $interpolate);
                }
            })
        }
    };

    $scope.searchAllRecipes = function(name) {
        if ($("#recently").hasClass("active") || $("#fav").hasClass("active")) {
            if (name != undefined && name != "") {
                if (name.length >= 3) {
                    if (searchTime) {
                        searchTime = false;
                        var searchName = stripScript(name);
                        $scope.searchRecipeApp(searchName);
                    }
                }
            }
        }
    };

    $scope.searchRecipeApp = function(name) {
        var token = localStorage[tokenLocalStorage];
        if (token) {
            $scope.loadImg = 1;
            if ($("#recently").hasClass("active")) {
                $scope.recFlag = 0;
            } else {
                $scope.favFlag = 0;
            }
            httpRequest.PUT("/user/foods/search/type/recipe", { "name":name}, {"token": token}).then(function (result) {
                if (result.status == 1) {
                    if ($("#recently").hasClass("active")) {
                        $scope.recentlyRecipes = [];
                        if (result.recipes.length == 0) {
                            $scope.recFlag = 1;
                        }
                    } else {
                        $scope.favRecipes = [];
                        if (result.recipes.length == 0) {
                            $scope.favFlag = 1;
                        }
                    }
                    for (var i = 0; i < result.recipes.length; i++) {
                        if ($("#recently").hasClass("active")) {
                            $scope.recentlyRecipes.push(result.recipes[i]);
                        } else {
                            $scope.favRecipes.push(result.recipes[i]);
                        }
                    }
                    $scope.loadImg = 0;
                    searchTime = true;
                } else {
                    alertError(result.error, $scope, $interpolate);
                }
            })
        }
    };

    $scope.getRecentlyRecipes = function() {
        $(".searchDiv").removeClass("no_button");
        $scope.searchName = undefined;
        var token = localStorage[tokenLocalStorage];
        if (token) {
            $scope.loadImg = 1;
            $scope.recFlag = 0;
            httpRequest.PUT("/user/foods/search/type/recent-recipe/", { "name":""}, {"token": token}).then(function (result) {
                if (result.status == 1) {
                    $scope.recentlyRecipes = [];
                    if (result.recentAddRecipes.length == 0) {
                        $scope.recFlag = 1;
                    }
                    var titleDate = "";
                    var recipeId = "";
                    for (var i = 0; i < result.recentAddRecipes.length; i++) {
                        var today = new Date();
                        if (new Date(parseInt(result.recentAddRecipes[i].createdDate)).getDate() == today.getDate()) {
                            result.recentAddRecipes[i].showCreatedDate = "Hoje";
                        } else if (new Date(parseInt(result.recentAddRecipes[i].createdDate)).getDate() == today.getDate() - 1) {
                            result.recentAddRecipes[i].showCreatedDate = "Ontem";
                        } else {
                            result.recentAddRecipes[i].showCreatedDate = new Date(parseInt(result.recentAddRecipes[i].createdDate)).format("dd/mm");
                        }
                        if (titleDate != result.recentAddRecipes[i].showCreatedDate) {
                            var recipe = [];
                            recipe.titleFlag = 1;
                            recipe.showTitle = result.recentAddRecipes[i].showCreatedDate;
                            recipe.name = "";
                            titleDate = result.recentAddRecipes[i].showCreatedDate
                            $scope.recentlyRecipes.push(recipe);
                            $scope.recentlyRecipes.push(result.recentAddRecipes[i]);
                            recipeId = result.recentAddRecipes[i].id;
                        } else {
                            if (recipeId != result.recentAddRecipes[i].id) {
                                recipeId = result.recentAddRecipes[i].id;
                                $scope.recentlyRecipes.push(result.recentAddRecipes[i]);
                            }
                        }
                    }
                    $scope.loadImg = 0;
                } else {
                    alertError(result.error, $scope, $interpolate);
                }
            })
        }
    };

    $scope.getFavoriteRecipes = function() {
        $(".searchDiv").removeClass("no_button");
        $scope.searchName = undefined;
        var token = localStorage[tokenLocalStorage];
        if (token) {
            $scope.loadImg = 1;
            $scope.favFlag = 0;
            httpRequest.PUT("/user/foods/search/type/favorite-recipe", { "name":""}, {"token": token}).then(function (result) {
                if (result.status == 1) {
                    var initial = "";
                    $scope.favRecipes = [];
                    if (result.favoriteRecipes.length == 0) {
                        $scope.favFlag = 1;
                    }
                    for (var i = 0; i < result.favoriteRecipes.length; i++) {
                        var recipes = [];
                        if (initial != result.favoriteRecipes[i].name.substring(0, 1).toUpperCase()) {
                            recipes.titleFlag = 1;
                            recipes.showTitle = result.favoriteRecipes[i].name.substring(0, 1).toUpperCase();
                            recipes.name = "";
                            initial = result.favoriteRecipes[i].name.substring(0, 1).toUpperCase();
                            $scope.favRecipes.push(recipes);
                            $scope.favRecipes.push(result.favoriteRecipes[i]);
                        } else {
                            $scope.favRecipes.push(result.favoriteRecipes[i]);
                        }
                    }
                    $scope.loadImg = 0;
                } else {
                    alertError(result.error, $scope, $interpolate);
                }
            })
        }
    };

    $scope.go2Details = function(recipe) {
        if (recipe.archived == 1 || recipe.obsolete == 1) {
            return;
        }
        var token = localStorage[tokenLocalStorage];
        localStorage[foodLocalStorage] = JSON.stringify(recipe);
        $location.path("/recipesDetails").search("meal", $scope.meal);
    };

    $scope.back = function() {
//        currentSearchFood = "";

        $window.history.back();
    };

    $scope.ignoreAccents = function(item) {
        if (!$scope.searchName) {
            return true;
        }
        var text = removeAccents(item.name.toLowerCase());
        var search = removeAccents($scope.searchName.toLowerCase());
        return text.indexOf(search) > -1;
    };

    $scope.extendSearch = function(keyCode) {
        if (keyCode == 13 && $scope.searchName != undefined && $scope.searchName.length >= 3) {
            $scope.searchAllRecipes($scope.searchName);
        }
    };

    window.onresize = function () {
        if ($("#bodyData").length > 0) {
            var winHeight = getWindowHeight();
            var titleHeight = $("#head").outerHeight();
            $(".myProgress_body").height(winHeight - titleHeight - 50);
        }
    };
    window.onresize();
});

app.controller('foodTrackerController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $routeParams, $interpolate, $timeout) {

    $scope.$watch('$viewContentLoaded', function () {

//        $scope.mealModel = [
//            {"id": 0, "name": $scope.$eval($interpolate("{{'label_point_breakfast'|translate}}"))},
//            {"id": 1, "name": $scope.$eval($interpolate("{{'label_point_lunch'|translate}}"))},
//            {"id": 2, "name": $scope.$eval($interpolate("{{'label_point_dinner'|translate}}"))},
//            {"id": 3, "name": $scope.$eval($interpolate("{{'label_point_snack'|translate}}"))}
//        ];

        $scope.mealModel = [
            {"id": 0, "name": "café da manhã"},
            {"id": 1, "name": "Almoço"},
            {"id": 2, "name": "Jantar"},
            {"id": 3, "name": "Hora do lanche"}
        ];

        $scope.meal = parseInt($routeParams.meal);

//        clickRecTab = false;
        $scope.searchFoods("0");

//        if ($scope.searchName != undefined && $scope.searchName.length >= 3) {
//            $scope.showSearchBtn = 0;
//        } else {
//            $scope.showSearchBtn = 1;
//        }

    });

//    $rootScope.$on('mobile-angular-ui.toggle.toggled', function (e, id, active) {
//        if (id == "Foods") {
//            if (active) {
//                // ...
//            } else {
//                // ...
//            }
//        }else{
//
//        }
//    });

    $scope.go2Details = function (food, type) {
        if (food.archived == 1 || food.obsolete == 1) {
            return;
        }
        var token = localStorage[tokenLocalStorage];
        localStorage[foodLocalStorage] = JSON.stringify(food);
        if ($scope.deleteModel != 1) {
            if (food.itemType == 203 || food.itemType == 206) {
                localStorage[foodDetailsLocalStorage] = "";
                $location.path("/quickFoodDetails").search({"meal": $scope.meal,"type":type});
            } else if (foodItemType[food.itemType] == "recipes") {
                $location.path("/recipesDetails").search("meal", $scope.meal);
            } else if (foodItemType[food.itemType] == "meal") {
                $location.path("/mealDetails").search("meal", $scope.meal);
            } else {
                $location.path("/foodDetails").search("meal", $scope.meal);
            }
        } else {
            if (1 != food.deleteFlag) {
                food.deleteFlag = 1;
                food.delete = 1;
            } else {
                food.deleteFlag = 0;
                food.delete = 0;
            }
        }
    };

    $scope.searchFoods = function (flag) {
        $scope.deleteModel = 0;
        $("#buttonEdit").html($scope.$eval($interpolate("{{'button_simple_edit'|translate}}")));
        var searchType = 0;
        $scope.searchName = undefined;
        $scope.loadImg = 1;

        if ($("#createdFoods").hasClass("active")) {
            $(".searchDiv").addClass("no_button");
        } else {
            $(".searchDiv").removeClass("no_button");
        }

        if ($("#recently").hasClass("active") || $("#fav").hasClass("active")) {
            if (currentSearchFood != "") {
                if (flag != 0) {
                    $scope.isSearch = 0;
                    if ($("#recently").hasClass("active")) {
                        $scope.recFlag = 0;
                        $scope.recentlyFood = [];
                        searchType = 1;
                    } else {
                        $scope.favFlag = 0;
                        $scope.favFoods = [];
                        searchType = 3;
                    }
                    if ($scope.searchName == undefined || $scope.searchName == "") {
                        $scope.showSearchBtn = 1;
                    }
                } else {
                    $scope.isSearch = 1;
                    $scope.searchName = currentSearchFood;
                    if (isSearchAllFood) {
                        $scope.searchAllFood(currentSearchFood);
                    } else {
                        $scope.searchGenFood(currentSearchFood);
                    }
                    return;
                }
            } else {
                $scope.isSearch = 0;
                if ($("#recently").hasClass("active")) {
                    $scope.recFlag = 0;
                    $scope.recentlyFood = [];
                    searchType = 1;
                } else {
                    $scope.favFlag = 0;
                    $scope.favFoods = [];
                    searchType = 3;
                }
                if ($scope.searchName == undefined || $scope.searchName == "") {
                    $scope.showSearchBtn = 1;
                }
            }

        } else if ($("#foods").hasClass("active")) {
            searchType = 2;
            if (currentSearchFood != "") {
                $scope.searchName = currentSearchFood;
            } else {
                $scope.allFlag = 1;
            }
            return;
        } else if ($("#fav").hasClass("active")) {
//            $scope.favFlag = 0;
//            $scope.favFoods = [];
//            searchType = 3;
//            currentSearchFood = "";
        } else if ($("#createdFoods").hasClass("active")) {
            $scope.itemFlag = 0;
            $scope.createdFoods = [];
            searchType = 4;
            currentSearchFood = "";
        }
        var requestBody = { "name": ""};
        var token = localStorage[tokenLocalStorage];
        if (token) {
            httpRequest.PUT("/user/foods/search/type/" + searchType, requestBody, {"token": token}).then(function (result) {
                if (result.status == 1) {
                    $scope.deleteFlag = 0;
                    if (searchType == 1) {

                        $scope.recentlyFood = [];
                        if (result.foods.length == 0) {
                            $scope.recFlag = 1;
                        }
                        var titleDate = "";
                        var foodId = "";
                        var tempFoods = [];
                        for (var i = 0; i < result.foods.length; i++) {
                            var today = new Date();
                            if (new Date(parseInt(result.foods[i].createdDate)).getDate() == today.getDate()) {
                                result.foods[i].showCreatedDate = "Hoje";
                            } else if (new Date(parseInt(result.foods[i].createdDate)).getDate() == today.getDate() - 1) {
                                result.foods[i].showCreatedDate = "Ontem";
                            } else {
                                result.foods[i].showCreatedDate = new Date(parseInt(result.foods[i].createdDate)).format("dd/mm");
                            }
                            if (titleDate != result.foods[i].showCreatedDate) {
                                var food = [];
                                tempFoods = [];
                                food.titleFlag = 1;
                                food.showTitle = result.foods[i].showCreatedDate;
                                food.name = "";
                                food.portion = result.foods[i].portion;
                                titleDate = result.foods[i].showCreatedDate;
                                result.foods[i].recentAdd = 0;
                                $scope.recentlyFood.push(food);
                                $scope.recentlyFood.push(result.foods[i]);
                                tempFoods.push(result.foods[i]);
                                foodId = result.foods[i].id;
//                                var isContain = false;
//                                if ($scope.recentlyFood.length > 0) {
//                                    for (var j = 0; j < $scope.recentlyFood.length; j++) {
//                                        if ($scope.recentlyFood[j].id == result.foods[i].id) {
//                                            isContain = true;
//                                        }
//                                    }
//                                }
                            } else {
                                var addFlag = 0;
                                for (var a = 0; a < tempFoods.length; a++) {
                                    if (tempFoods[a].id == result.foods[i].id) {
                                        addFlag = 1;
                                        break;
                                    }
                                }
                                if (0 == addFlag) {
                                    foodId = result.foods[i].id;
                                    result.foods[i].recentAdd = 0;
                                    $scope.recentlyFood.push(result.foods[i]);
                                    tempFoods.push(result.foods[i]);
                                }
                            }

                        }
                    } else if (searchType == 2) {

                        if (currentSearchFood != "") {
                            $scope.searchName = currentSearchFood;
                        } else {
                            $scope.allFlag = 1;
                        }
//                        var initial = "";
//                        $scope.allFoods = [];
//                        if (result.foods.length == 0) {
//                            $scope.allFlag = 1;
//                        }
//                        for (var i = 0; i < result.foods.length; i++) {
//                            var food = [];
//                            if (initial != result.foods[i].name.substring(0, 1).toUpperCase()) {
//                                food.titleFlag = 1;
//                                food.showTitle = result.foods[i].name.substring(0, 1).toUpperCase();
//                                initial = result.foods[i].name.substring(0, 1).toUpperCase();
//                                $scope.allFoods.push(food);
//                                $scope.allFoods.push(result.foods[i]);
//                            } else {
//                                $scope.allFoods.push(result.foods[i]);
//                            }
//                        }
//                        $scope.allFoods = result.foods;
                    } else if (searchType == 3) {
                        var initial = "";
                        $scope.favFoods = [];
                        if (result.foods.length == 0) {
                            $scope.favFlag = 1;
                        }
                        for (var i = 0; i < result.foods.length; i++) {
                            var food = [];
                            if (initial != result.foods[i].name.substring(0, 1).toUpperCase()) {
                                food.titleFlag = 1;
                                food.showTitle = result.foods[i].name.substring(0, 1).toUpperCase();
                                food.name = "";
                                food.portion = result.foods[i].portion;
                                initial = result.foods[i].name.substring(0, 1).toUpperCase();
                                $scope.favFoods.push(food);
                                $scope.favFoods.push(result.foods[i]);
                            } else {
                                $scope.favFoods.push(result.foods[i]);
                            }
                        }
                    } else if (searchType == 4) {
                        $scope.createdFoods = [];
                        if (result.foods.length == 0) {
                            $scope.itemFlag = 1;
                        }
                        for (var i = 0; i < result.foods.length; i++) {
                            var food = [];
                            if (initial != result.foods[i].name.substring(0, 1).toUpperCase()) {
                                food.titleFlag = 1;
                                food.showTitle = result.foods[i].name.substring(0, 1).toUpperCase();
                                food.name = "";
                                food.portion = result.foods[i].portion;
                                initial = result.foods[i].name.substring(0, 1).toUpperCase();
                                $scope.createdFoods.push(food);
                                $scope.createdFoods.push(result.foods[i]);
                            } else {
                                $scope.createdFoods.push(result.foods[i]);
                            }
                        }
                    }
                    $scope.loadImg = 0;
                } else {
                    alertError(result.error, $scope, $interpolate)
                }
            });
        }
    };

    $scope.searchAllFood = function (name) {
        if ($("#recently").hasClass("active") || $("#fav").hasClass("active")) {
            if (name != undefined && name != "") {
                if (name.length >= 3) {
                    if (searchTime) {
                        searchTime = false;
                        $scope.loadImg = 1;
                        $scope.recFlag = 0;
                        $scope.recentlyFood = [];
                        $scope.favFlag = 0;
                        $scope.favFoods = []
//                        if ($("#recently").hasClass("active")) {
//                            $scope.recFlag = 0;
//                            $scope.recentlyFood = [];
//                        } else {
//                            $scope.favFlag = 0;
//                            $scope.favFoods = []
//                        }

//                        var searchNames = name.split(",");
//                        var searchName = "";
                        var searchName = stripScript(name);

//                        for (var i = 0; i < searchNames.length; i++) {
//                            if (i == searchNames.length - 1) {
//                                searchName = searchName + searchNames[i];
//                            } else {
//                                searchName = searchName + searchNames[i] + " ";
//                            }
//                        }
//                        $scope.searchFoodApp($scope.searchName, 1);
                        $scope.searchFoodApp(searchName, 1);
                    }
                }
            }
        }

    };

    $scope.extendSearch = function(keyCode) {
        if (keyCode == 13 && $scope.searchName != undefined && $scope.searchName.length >= 3) {
            $scope.searchAllFood($scope.searchName);
        }
    };

    $scope.searchGenFood = function(name) {
//        if ($("#foods").hasClass("active")) {
        if ($("#recently").hasClass("active")) {
            if (name.length >= 3 && name != undefined && name != "") {
                $scope.showSearchBtn = 0;
                if (searchTime) {
                    var search = function () {
                        $scope.recFlag = 0;
                        $scope.recentlyFood = [];
                        var searchName = stripScript(name);
                        searchTime = false;
                        $scope.loadImg = 1;
                        currentSearchFood = name;
                        isSearchAllFood = false;
                        $scope.isSearch = 0;
//                        var requestBody = { "name": $scope.searchName,"searchType":0};
                        var requestBody = { "name": searchName,"searchType":0};
                        var token = localStorage[tokenLocalStorage];
                        if (token) {
                            httpRequest.PUT("/user/foods/search/type/2", requestBody, {"token": token}).then(function (result) {
                                if (result.foods.length > 500) {
                                    searchTime = true;
                                    return;
                                }
                                var initial = "";
                                $scope.recentlyFood = [];
                                if (result.foods.length == 0) {
                                    $scope.recFlag = 1;
                                } else {
                                    $scope.recFlag = 0;
                                }
                                for (var i = 0; i < result.foods.length; i++) {
                                    $scope.recentlyFood.push(result.foods[i]);
                                }
                                searchTime = true;
                                $scope.loadImg = 0;
                            });
                        }
                    };
                    $timeout(search, 0);
                }
            }
            else {
                $scope.showSearchBtn = 1;
            }
        }
    };

    $scope.searchFoodApp = function(name, type) {
        currentSearchFood = $scope.searchName;
        isSearchAllFood = true;
        $scope.isSearch = 1;
        $scope.extendSearchfood1 = 0;
        $scope.extendSearchfood2 = 0;
        var requestBody = { "name": name,"searchType":type};
        var token = localStorage[tokenLocalStorage];
        if (token) {
            httpRequest.PUT("/user/foods/search/type/2", requestBody, {"token": token}).then(function (result) {
                if (result.status == 1) {
                    if (result.foods.length > 500) {
                        searchTime = true;
                        $scope.loadImg = 0;
                        return;
                    }
                    var initial = "";
                    $scope.Foods = [];
                    $scope.brandedFoods = [];
                    if (result.foods.length == 0) {
                        if ($("#recently").hasClass("active")) {
                            $scope.recFlag = 1;
                        } else {
                            $scope.favFlag = 1;
                        }
                    } else {
                        if ($("#recently").hasClass("active")) {
                            $scope.recFlag = 0;
                        } else {
                            $scope.favFlag = 0;
                        }
                    }
                    for (var i = 0; i < result.foods.length; i++) {
//                        var food = [];
//                        food.titleFlag = 1;
                        if (result.foods[i].brandId == 1) {
                            $scope.Foods.push(result.foods[i]);
                        } else {
                            $scope.brandedFoods.push(result.foods[i]);
                        }
//                        if (initial != result.foods[i].name.substring(0, 1).toUpperCase()) {
//                            food.titleFlag = 1;
//                            food.showTitle = result.foods[i].name.substring(0, 1).toUpperCase();
//                            initial = result.foods[i].name.substring(0, 1).toUpperCase();
//                            $scope.recentlyFood.push(food);
//                            $scope.recentlyFood.push(result.foods[i]);
//                        } else {
//                            $scope.recentlyFood.push(result.foods[i]);
//                        }
                    }
                    if ($scope.Foods.length == 0) {
                        $scope.extendSearchfood1 = 0;
                    } else {
                        $scope.extendSearchfood1 = 1;
                    }
                    if ($scope.brandedFoods.length == 0) {
                        $scope.extendSearchfood2 = 0;
                    } else {
                        $scope.extendSearchfood2 = 1;
                    }
                    if ($scope.extendSearchfood1 != 0 || $scope.extendSearchfood2 != 0) {
                        if ($("#recently").hasClass("active")) {
                            $scope.recFlag = 0;
                        } else {
                            $scope.favFlag = 0;
                        }
                    } else {
                        if ($("#recently").hasClass("active")) {
                            $scope.recFlag = 1;
                        } else {
                            $scope.favFlag = 1;
                        }
                    }
                    searchTime = true;
                    $scope.loadImg = 0;

                } else {
                    searchTime = true;
                }
            });
        }
    };

    $scope.toQuickAdd = function () {
        localStorage[foodLocalStorage] = "";
        localStorage[foodDetailsLocalStorage] = "";
        localStorage[activityLocalStorage] = "";
        $location.path("/quickAdd").search("meal", $scope.meal);
    };

    $scope.toCal = function () {
        localStorage[foodLocalStorage] = "";
        localStorage[foodDetailsLocalStorage] = "";
        $location.path("/calculator").search("meal", $scope.meal);
    };

    $scope.toRecipes = function () {
        $location.path("/recipes").search("meal", $scope.meal);
    };

    $scope.showDeleteIcon = function () {
        if (1 != $scope.deleteModel) {
            $scope.deleteModel = 1;
            $("#buttonEdit").html($scope.$eval($interpolate("{{'button_simple_done'|translate}}")));
        } else {
            $scope.deleteModel = 0;
            $("#buttonEdit").html($scope.$eval($interpolate("{{'button_simple_edit'|translate}}")));
        }
    };

    $scope.deleteFood = function (food) {
        var preTitle = $("#food" + food.id).parent().prev().find("div").first().html();
        var nextTitle = $("#food" + food.id).parent().next().find("div").first().html();
        var token = localStorage[tokenLocalStorage];
        localStorage[foodLocalStorage] = JSON.stringify(food);
        httpRequest.DELETE("/user/foods/" + food.id, {"token": token}).then(function (result) {
            if (result.status == 1) {
                if (preTitle != "" && nextTitle != "") {
                    if ($("#food" + food.id).parent().prev().prev().find("div").length == 0 && nextTitle == undefined) {
                        $scope.itemFlag = 1;
                    }
                    $("#food" + food.id).parent().prev().remove();
                    $("#food" + food.id).parent().remove();
                } else {
                    $("#food" + food.id).parent().remove();
                }
            } else {
                alertError(result.error, $scope, $interpolate);
            }
        });
    };

    $scope.back = function() {
//        currentSearchFood = "";
        $location.path("/pointsIndex").search("meal", null);
    };

    $scope.ignoreAccents = function(item) {
        if (!$scope.searchName) {
            return true;
        }
        var text = removeAccents(item.name.toLowerCase());
        var search = removeAccents($scope.searchName.toLowerCase());
        return text.indexOf(search) > -1;
    };

    window.onresize = function () {
        if ($("#bodyData").length > 0) {
            var winHeight = getWindowHeight();
            var titleHeight = $("#head").outerHeight();
//            $(".myProgress_body").height(winHeight - titleHeight);
            $(".myProgress_body").height(winHeight - titleHeight - 50);
        }
    };
    window.onresize();

});

app.controller('memberActivityController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $routeParams, $interpolate) {

    $scope.$watch('$viewContentLoaded', function () {
        if ($routeParams.type == "activity") {
            $("#food").removeClass("active");
            $("#foodLi").removeClass("active");
            $("#activity").addClass("active");
            $("#activityLi").addClass("active");

            $("#foodCalc").removeClass("active");
            $("#foodCalcLi").removeClass("active");
            $("#activityCalc").addClass("active");
            $("#activityCalcLi").addClass("active");
        } else {
            $("#food").addClass("active");
            $("#foodLi").addClass("active");
            $("#activity").removeClass("active");
            $("#activityLi").removeClass("active");

            $("#foodCalc").addClass("active");
            $("#foodCalcLi").addClass("active");
            $("#activityCalc").removeClass("active");
            $("#activityCalcLi").removeClass("active");
        }
        if ($scope.pointCal == undefined) {
            $scope.pointCal = 0;
        }

        $scope.intensityModel = [
//            {"id": 3, "name": "High"},
            {"id": 3, "name": "alta"},
//            {"id": 2, "name": "Moderate"},
            {"id": 2, "name": "moderada"},
//            {"id": 1, "name": "Low"}
            {"id": 1, "name": "baixa"}
        ];

        if ($scope.intensity == undefined) {
            $scope.intensity = 2;
        }

        $scope.weight = JSON.parse(localStorage[userLocalStorage]).currentWeight;
        $scope.pointCal = 0;
        if (localStorage[activityLocalStorage] != "") {
            var act = JSON.parse(localStorage[activityLocalStorage]);
            if (act.mode == "update") {
                $scope.pointCal = act.point;
                $scope.point = act.point;
                $scope.name = act.name;
                $scope.buttonGray = 1;
            }
        }

    });

    $scope.addMemberActivity = function () {
        $scope.duration = $scope.duration == undefined ? -1 : $scope.duration;
        $scope.intensity = $scope.intensity == undefined ? -1 : $scope.intensity;
        var type = $scope.duration == -1 ? 103 : 102;
        var memberActivityBody = { "name": $scope.name, "duration": $scope.duration,
            "intensity": $scope.intensity, "note": "", "point": $scope.pointCal, "type": type};
        var token = localStorage[tokenLocalStorage];
        if (token) {
            httpRequest.POST("/user/activities", memberActivityBody, {"token": token}).then(function (result) {
                if (result.status == 1) {
                    var id = result.memberActivity.id;
                    var name = result.memberActivity.name;
                    var requestBody = { "activityId": result.memberActivity.id, "activityType": type,
                        "activityName": result.memberActivity.name, "intensity": result.memberActivity.intensity,
                        "duration": result.memberActivity.duration, "point": result.memberActivity.point,
                        "weight": $scope.weight, "createdDate": new Date(localStorage[trackerDateLocalStorage]).getTime()
                    };
                    httpRequest.POST("/activities/trackers", requestBody, {"token": token}).then(function (result) {
                        if (result.status == 1) {
                            $location.path("/pointsIndex");
                        } else {
                            alertError(result.error, $scope, $interpolate)
                        }
                    });
                } else {
                    alertError(result.error, $scope, $interpolate)
                }
            });
        }
    };

    $scope.checkName = function () {

        if ($scope.name.length >= 3 && undefined != $scope.pointCal && "" != $scope.pointCal) {
            $scope.buttonGray = 1;
        } else {
            $scope.buttonGray = 0;
        }
    };

    $scope.calculatePoints = function () {
        if ($scope.name != undefined) {
            if ($scope.name.length >= 3 && undefined !== $scope.point && "" !== $scope.point) {
                $scope.buttonGray = 1;
            } else {
                $scope.buttonGray = 0;
            }
        } else {
            $scope.buttonGray = 0;
        }

        if ($scope.duration == "") {
            $scope.pointCal = 0;
        } else if ($scope.duration == undefined) {
            $scope.point = $scope.point.replace(/[^\d]/g, '');
            $scope.pointCal = $scope.point;
        } else {

            var duration = $scope.duration.replace(/[^\d]/g, '');
            if (duration == "") {
                $scope.duration = duration;
                return;
            }
            $scope.duration = max3(duration);
            $scope.pointCal = calculateActivityPoints($scope.intensity, $scope.weight, $scope.duration);
            if ($scope.name != undefined && $scope.name.length >= 3 && undefined != duration && "" != duration) {
                $scope.buttonGray = 1;
            } else {
                $scope.buttonGray = 0;
            }
        }
    };

});