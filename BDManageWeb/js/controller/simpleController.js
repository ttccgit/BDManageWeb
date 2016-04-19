app.controller('simpleController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $routeParams, $interpolate) {
    $scope.meal = $routeParams.meal;
    $scope.mealTime = MealTime;
    $scope.$watch('$viewContentLoaded', function () {

        var userInfo = JSON.parse(localStorage[userLocalStorage]);
        if (userInfo.firstSimpleStartDate == -1) {
            var token = localStorage[tokenLocalStorage];
            var requestBody = {
                "firstSimpleStartDate":new Date().getTime()
            };
            if (token) {
                httpRequest.PUT("/user/settings", requestBody, {"token": token}).then(function (result) {
                    if (result.status == 1) {
                        userInfo.firstSimpleStartDate = result.userInfo.firstSimpleStartDate;
                        localStorage[userLocalStorage] = JSON.stringify(userInfo);
                        $scope.startSimpleMode();
                    } else {
                        alertError(result.error, $scope, $interpolate);
                    }
                });
            }
        } else {
            $scope.startSimpleMode();
        }

        if (!$scope.meal) {
            localStorage.removeItem("simplePageIndex");
            $location.path("/simple/" + getMealTime());
            return;
        }

        var meals = getEnumAttributes(MealTime);
        if (meals != null && meals.length > 0) {
            var isContainMeal = false;
            for (var i = 0; i < meals.length; i++) {
                if ($scope.meal != null && $scope.meal == meals[i].value) {
                    isContainMeal = true;
                }
                var $liMeal = $("<li></li>");

                if (i == 0) {
                    $liMeal.html("café da manhã");
                } else if (i == 1) {
                    $liMeal.html("almoço");
                } else if (i == 2) {
                    $liMeal.html("jantar");
                } else if (i == 3) {
                    $liMeal.html("lanches");
                } else if (i == 4) {
                    $liMeal.html("tentações");
                }
//                $liMeal.html($scope.$eval($interpolate("{{'label_simple_meal_time_" + meals[i].name + "'|translate}}")));
                $liMeal.attr("value", meals[i].value);
                $(".selectMenu").append($liMeal);
            }
            $scope.meal = isContainMeal ? $scope.meal : meals[0].value;
            if ($scope.meal == "0") {
                $(".selectOption").html("café da manhã");
            } else if ($scope.meal == "1") {
                $(".selectOption").html("almoço");
            } else if ($scope.meal == "2") {
                $(".selectOption").html("jantar");
            } else if ($scope.meal == "3") {
                $(".selectOption").html("lanches");
            } else if ($scope.meal == "4") {
                $(".selectOption").html("tentações");
            }
//            $(".selectOption").html($scope.$eval($interpolate("{{'label_simple_meal_time_" + getObjAttributeNameByValue(MealTime, $scope.meal) + "'|translate}}")));
        }

        $scope.pageIndex = 0;
        if (localStorage["simplePageIndex"] != null) {
            var pages = localStorage["simplePageIndex"].split('_');
            if (pages.length >= 2 && pages[1] == $scope.meal) {
                $scope.pageIndex = parseInt(pages[0]);
            }
        }

        $(".selectContainer").select(null, ".selectBody", function (text, value) {
            localStorage.removeItem("simplePageIndex");
            $window.location.href = "#/simple/" + value;
        });
    });

    $scope.startSimpleMode = function () {
        var token = localStorage[tokenLocalStorage];
        if (token) {
            httpRequest.PUT('/user/mode', { "mode": Modes.Simple }, { "token": token }).then(function (result) {
                if (result.status) {
                    var userInfo = JSON.parse(localStorage[userLocalStorage]);
                    userInfo.mode = Modes.Simple;
                    localStorage[userLocalStorage] = JSON.stringify(userInfo);
                } else if (result.status == 0) {
                    alertError(result.error, $scope, $interpolate);
                }
            });
        } else {
            $location.path("/login");
        }
    };
});

app.controller('simpleMenuController', function ($rootScope, $scope, analytics, $location, $window, $interpolate) {
    $scope.showSimpleBar = function () {
        $("#learnMoreBar").attr("style", "display: none");
        $("#mainBar").attr("style", "display: none");
        $("#simpleBar").attr("style", "display: block");
        $(".sidebar-scrollable").addClass("orange_theme");
        $("#barLog").attr("src", "image/logo_vigilantesdopeso_red.png");
        $scope.toggle('mainSidebar');
    }
});

app.controller('simpleProgressController', function ($rootScope, $scope, analytics, $location, $window, httpRequest, $interpolate) {

    $scope.$watch('$viewContentLoaded', function () {
        $scope.breakfastSel = 1;
        $scope.lunchSel = 1;
        $scope.dinnerSel = 1;
        $scope.snackSel = 1;
        $scope.indulgenceSel = 1;
        $scope.reason = JSON.parse(localStorage[userLocalStorage]).expressReason;

        if (localStorage[progressDateLocalStorage] == "" || localStorage[progressDateLocalStorage] == undefined) {
            localStorage[progressDateLocalStorage] = new Date().getTime();
            $scope.progressDateFlag = 0;
        } else {
            var proDate = new Date(parseInt(localStorage[progressDateLocalStorage]));
            $scope.progressDateFlag = proDate.format("yyyy-mm-dd") >= new Date().format("yyyy-mm-dd") ? 0 : 1;
        }

        var userInfo = JSON.parse(localStorage[userLocalStorage]);
        var firstSimpleStartDate = getWeeHoursDay(new Date(userInfo.firstSimpleStartDate));
        if (Date.parse(new Date(firstSimpleStartDate)) == Date.parse(new Date(getWeeHoursDay(new Date()))) && new Date().getHours() >= 18) {
            localStorage[progressDateLocalStorage] = new Date().setDate(new Date().getDate() + 1);
            $scope.progressDateFlag = 0;
        }

//        $scope.progressDate = new Date(parseInt(localStorage[progressDateLocalStorage])).format("yyyy-mm-dd").toString();
        $scope.progressDate = new Date(parseInt(localStorage[progressDateLocalStorage]));

        $scope.getProgress();
//        $scope.minDate = new Date((new Date().getTime() - (new Date().getDate() - 15) * 24 * 60 * 60 * 1000)).format("yyyy-mm-dd");
//        $scope.maxDate = new Date().format("yyyy-mm-dd");

    });

    $scope.getProgress = function() {
        var token = localStorage[tokenLocalStorage];
        if (token) {
            $scope.breakfastDetails = "";
            $scope.lunchDetails = "";
            $scope.dinnerDetails = "";
            $scope.snackDetails = "";
            $scope.indulgenceDetails = "";
            httpRequest.Get("/user/meal-progresses/" + getWeeHoursDay(new Date(parseInt(localStorage[progressDateLocalStorage]))), {"token": token}).then(function (result) {
                if (result.status == 1) {
                    $scope.breakfastDetailsArr = [];
                    $scope.lunchDetailsArr = [];
                    $scope.dinnerDetailsArr = [];
                    $scope.snackDetailsArr = [];
                    $scope.indulgenceDetailsArr = [];
                    for (var i = 0; i < result.userTrackers.length; i++) {
                        if (result.userTrackers[i].mealTime == 0) {
                            $scope.breakfastDetailsArr.push(result.userTrackers[i].name);
                        } else if (result.userTrackers[i].mealTime == 1) {
                            $scope.lunchDetailsArr.push(result.userTrackers[i].name)
                        } else if (result.userTrackers[i].mealTime == 2) {
                            $scope.dinnerDetailsArr.push(result.userTrackers[i].name)
                        } else if (result.userTrackers[i].mealTime == 3) {
                            if (result.userTrackers[i].type == 501) {
                                $scope.indulgenceDetailsArr.push(result.userTrackers[i].name)
                            } else {
                                $scope.snackDetailsArr.push(result.userTrackers[i].name)
                            }
                        }
                    }

                    $scope.breakfastDetails = $scope.breakfastDetailsArr.join(",");
                    $scope.lunchDetails = $scope.lunchDetailsArr.join(",");
                    $scope.dinnerDetails = $scope.dinnerDetailsArr.join(",");
                    $scope.snackDetails = $scope.snackDetailsArr.join(",");
                    $scope.indulgenceDetails = $scope.indulgenceDetailsArr.join(",");

                    if ($scope.breakfastDetails != "") {
                        $scope.breakfastSel = 0;
                    } else {
                        $scope.breakfastSel = 1;
                    }
                    if ($scope.lunchDetails != "") {
                        $scope.lunchSel = 0;
                    } else {
                        $scope.lunchSel = 1;
                    }
                    if ($scope.dinnerDetails != "") {
                        $scope.dinnerSel = 0;
                    } else {
                        $scope.dinnerSel = 1;
                    }
                    if ($scope.snackDetails != "") {
                        $scope.snackSel = 0;
                    } else {
                        $scope.snackSel = 1;
                    }
                    if ($scope.indulgenceDetails != "") {
                        $scope.indulgenceSel = 0;
                    } else {
                        $scope.indulgenceSel = 1;
                    }
                } else {
                    alertError(result.error, $scope, $interpolate);
                }
            });
        }
    };

    $scope.go2SelectedFoods = function (meal) {
        $location.path("/myProgressSelect").search("meal", meal);
    };

    $scope.back = function () {
        $location.path("/myProgress");
    };

    $scope.prevDate = function () {
        var proDate = new Date(parseInt(localStorage[progressDateLocalStorage]));
        var userInfo = JSON.parse(localStorage[userLocalStorage]);
//        var firstSimpleStartDate = getWeeHoursDay(new Date(userInfo.firstSimpleStartDate));
        var firstSimpleStartDate = new Date(userInfo.firstSimpleStartDate);
        var startDate = new Date();
        startDate.setDate(startDate.getDate() - 15);
        proDate.setDate(proDate.getDate() - 1);
        startDate = getWeeHoursDay(new Date(startDate));
        proDate = getWeeHoursDay(new Date(proDate));

        if (firstSimpleStartDate.getHours() >= 18) {
            firstSimpleStartDate.setDate(firstSimpleStartDate.getDate() + 1);
        }

        if (firstSimpleStartDate.getDate() == new Date().getDate()) {
            alertWarning($scope.$eval($interpolate("{{'message_point_simple_date'|translate}}")), $scope, $interpolate);
        } else if (getWeeHoursDay(firstSimpleStartDate) > proDate) {
            alertWarning($scope.$eval($interpolate("{{'message_point_simple_date'|translate}}")), $scope, $interpolate);
        } else if (startDate >= proDate) {
            alertWarning($scope.$eval($interpolate("{{'message_point_cannot_15'|translate}}")), $scope, $interpolate);
            $scope.progressDateFlag = 1;
        } else {
            localStorage[progressDateLocalStorage] = proDate;
//            $scope.progressDate = new Date(proDate).format("yyyy-mm-dd").toString();
            $scope.progressDate = new Date(proDate);
            $scope.getProgress(localStorage[progressDateLocalStorage]);
            $scope.progressDateFlag = 1;
        }


//        if (Date.parse(new Date(firstSimpleStartDate)) == Date.parse(new Date(getWeeHoursDay(new Date()))) && new Date().getHours() >= 18) {
//            alertWarning($scope.$eval($interpolate("{{'message_point_simple_date'|translate}}")), $scope, $interpolate);
//        } else if (firstSimpleStartDate > proDate) {
//            alertWarning($scope.$eval($interpolate("{{'message_point_simple_date'|translate}}")), $scope, $interpolate);
//        } else if (startDate >= proDate) {
//            alertWarning($scope.$eval($interpolate("{{'message_point_cannot_15'|translate}}")), $scope, $interpolate);
//            $scope.progressDateFlag = 1;
//        } else {
//            localStorage[progressDateLocalStorage] = proDate;
//            $scope.progressDate = new Date(proDate).format("yyyy-mm-dd").toString();
//            $scope.getProgress(localStorage[progressDateLocalStorage]);
//            $scope.progressDateFlag = 1;
//        }

    };

    $scope.afterDate = function () {
        var proDate = new Date(parseInt(localStorage[progressDateLocalStorage]));
        var currentDate = new Date(parseInt(localStorage[progressDateLocalStorage]));
        proDate.setDate(proDate.getDate() + 1);
        currentDate = proDate;
//        $scope.progressDate = proDate.format("yyyy-mm-dd").toString();
        $scope.progressDate = proDate;
        localStorage[progressDateLocalStorage] = proDate.getTime();
        $scope.getProgress(new Date(proDate).getTime());
        var todayDate = new Date().toLocaleDateString();
        if (currentDate.getTime() < new Date().getTime() && currentDate.toLocaleDateString() != new Date().toLocaleDateString()) {
            $scope.progressDateFlag = 1;
        } else {
            $scope.progressDateFlag = 0;
        }
    };

    $scope.saveReason = function() {
        var token = localStorage[tokenLocalStorage];
        var requestBody = {
            "expressReason":$scope.reason
        };
        if (token) {
            httpRequest.PUT("/user/settings", requestBody, {"token": token}).then(function (result) {
                if (result.status == 1) {
                    var userInfo = JSON.parse(localStorage[userLocalStorage]);
                    userInfo.expressReason = $scope.reason;
                    localStorage[userLocalStorage] = JSON.stringify(userInfo);
                    $("#reason").hide();
                    $("#showReason").show();


                    $("#icon_write").show();
                } else {
                    alertError(result.error, $scope, $interpolate);
                }
            });
        }

    };

    window.onresize = function () {
        if ($("#myProgressBox").length > 0) {
            var winHeight = getWindowHeight();
            var titleHeight = $(".simple_header").outerHeight();
            var footerHeight = $(".mealFooter").outerHeight();
            $(".myProgress_body").height(winHeight - titleHeight - footerHeight);
        }
    };
    window.onresize();
});

app.controller('simpleProgressSelectController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $routeParams, $interpolate) {
    $scope.meals = [
        {"id": 0, "name": $scope.$eval($interpolate("{{'label_point_breakfast'|translate}}"))},
        {"id": 1, "name": $scope.$eval($interpolate("{{'label_point_lunch'|translate}}"))},
        {"id": 2, "name": $scope.$eval($interpolate("{{'label_point_dinner'|translate}}"))},
        {"id": 3, "name": $scope.$eval($interpolate("{{'label_point_snack'|translate}}"))},
        { meal: 4, name: $scope.$eval($interpolate("{{'label_simple_meal_time_Indulgences'|translate}}")) }
    ];

    $scope.$watch('$viewContentLoaded', function () {
        var token = localStorage[tokenLocalStorage];
        var progressDate = getWeeHoursDay(new Date(parseInt(localStorage[progressDateLocalStorage])));
        var mealTime = parseInt($routeParams.meal);
        $scope.mealsName = $scope.meals[mealTime].name;
        $scope.mealList = [];
        var requestBody = { "date": progressDate, "mealTime": mealTime };
        if (token) {
            httpRequest.POST("/user/meal-progresses", requestBody, { "token": token }).then(function (result) {
                if (result.status) {
                    var meals = [];
                    var trackers = [];
                    meals = result.mealAndTrackers.meals;
                    trackers = result.mealAndTrackers.trackers;
                    for (var i = 0; i < meals.length; i++) {
                        var tempMeals = new Meal();
                        tempMeals.name = meals[i].name;
                        tempMeals.mealTime = mealTime;
                        tempMeals.foodId = meals[i].mealId;
                        tempMeals.type = meals[i].type;
                        tempMeals.selectClass = "unSelectIcon";
                        tempMeals.id = null;
                        tempMeals.createdDate = progressDate;
                        tempMeals.point = meals[i].point;
                        tempMeals.scanned = 0;
                        $scope.mealList.push(tempMeals);
                    }
                    for (var j = 0; j < trackers.length; j++) {
                        for (var i = 0; i < $scope.mealList.length; i++) {
                            if ($scope.mealList[i].foodId == trackers[j].foodId && $scope.mealList[i].type == trackers[j].type) {
                                $scope.mealList[i].selectClass = "selectIcon";
                                $scope.mealList[i].id = trackers[j].id;
                                $scope.mealList[i].portionId = trackers[j].portionId;
                                $scope.mealList[i].servings = trackers[j].servings;
                                $scope.mealList[i].servingsWhole = trackers[j].servingsWhole;
                                $scope.mealList[i].servingsFractionId = trackers[j].servingsFractionId;
                            }
                        }

                    }
                } else {
                    alertError(result.error, $scope, $interpolate);
                }
            });
        }
    });

    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
        $(".meal_name").removeAttr("style");
    });

    $scope.back = function () {
        $location.path("/myProgress").search("meal", null);
    };

    $scope.changeMeal = function (meal) {
        $("#myProgress_saveDiv").show();
        if (meal.selectClass == "unSelectIcon") {
            meal.selectClass = "selectIcon";
        } else {
            meal.selectClass = "unSelectIcon";
        }
    };

    $scope.saveMeals = function () {
        var token = localStorage[tokenLocalStorage];
        var requestBody = [];
        if ($scope.mealList && token) {
            var totalPoint = 0;
            for (var a = 0; a < $scope.mealList.length; a++) {

                if ($scope.mealList[a].selectClass == "selectIcon") {
                    totalPoint += $scope.mealList[a].point;
                }

                if ($scope.mealList[a].selectClass == "selectIcon" && null == $scope.mealList[a].id) {
                    delete $scope.mealList[a].selectClass;
                    delete $scope.mealList[a].$$hashKey;
                    requestBody.push($scope.mealList[a]);
                } else if ($scope.mealList[a].selectClass == "unSelectIcon" && null != $scope.mealList[a].id) {
                    delete $scope.mealList[a].selectClass;
                    delete $scope.mealList[a].$$hashKey;
                    requestBody.push($scope.mealList[a]);
                }
            }
            if (requestBody.length > 0) {
                httpRequest.PUT('/user/meal-progresses', JSON.stringify(requestBody), { "token": token }).then(function (result) {
                    if (result.status) {
                        if (totalPoint > 7 && $routeParams.meal == 4) {
                            var arrButton = [$scope.$eval($interpolate("{{'button_got'|translate}}"))];
                            openDialog($scope.$eval($interpolate("{{'button_warning'|translate}}")), $scope.$eval($interpolate("{{'message_alert_indulgence_point'|translate}}")), arrButton, function (r) {
                                $window.location.href = "#/myProgress";
                            });
                        }
                        else {
                            $location.path("/myProgress").search("meal", null);
                        }
                    } else {
                        alertError(result.error, $scope, $interpolate);
                    }
                });
            } else {
                $location.path("/myProgress").search("meal", null);
            }
        }

    };

    window.onresize = function () {

        if (window.innerWidth > 500) {
            $(".meal_name").removeAttr("style");
        } else {
            // $(".meal_name").attr("style", "max-width:200px");
        }
    };
    window.onresize();


});

app.controller('simpleMealsController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $interpolate) {
    $scope.$watch('$viewContentLoaded', function () {
        if ($scope.meal != null) {
            var token = localStorage[tokenLocalStorage];
            httpRequest.Get('/meals/user/simple-start/meals/meal-time/' + $scope.meal, { "token": token }).then(function (result) {
                if (result.status) {
                    var meals = result.meals;
                    if (meals.length > 0) {
                        for (var i = 0; i < meals.length; i++) {
                            var curMeal = meals[i];
                            var $img = $('<img />');
                            $img.attr("src", curMeal.image);
                            var $name = $('<div class="item_name">' + curMeal.name + '</div>');
                            var $a = $('<a href="#/simpleDetail/' + curMeal.mealId + '"></a>');
                            $a.append($img);
                            $a.append($name);
                            if (curMeal.vFlag) {
                                var $imgV = $('<img class="imgV" src="image/icon/v_icon.png" />');
                                $a.append($imgV);
                            }
                            var $item = $('<div class="item"></div>').append($a);
                            $('#slider .pic_group').append($item);
                            window.onresize();
                        }

                        $(".pager_control").removeClass("hide");
                        $('#spanTotalCount').html($("#slider .pic_group .item").length);

                        $('#slider').cycle({
                            fx: 'scrollHorz',
                            pager: '#pagination',
                            speed: 800,
                            timeout: 6000,
                            stopAutoPlay: true,
                            slideExpr: '.item',
                            pagerAnchorBuilder: null,
                            prev: '.arrow_l',
                            next: '.arrow_r',
                            clearCycleTimeOutBefore: true,
                            startingSlide: $scope.pageIndex,
                            pageTurnEvent: function (i) {
                                localStorage["simplePageIndex"] = i + "_" + $scope.meal;
                                $("#spanCurPage").html(i + 1);
                            }
                        });
                    }
                } else if (result.status == 0) {
                    if (result.error && result.error.message) {
                        alertError(result.error, $scope, $interpolate);
                    }
                    else {
                        alertWarning($scope.$eval($interpolate("{{'message_simple_get_meals_error'|translate}}")), $scope, $interpolate);
                    }
                }
            });
        }
    });

    window.onresize = function () {
        if ($(".simple_slider_box").length > 0) {
            var winHeight = getWindowHeight();
            var headerHeight = $("header").outerHeight();
            var footerHeight = $(".simple_box .mealBottom").outerHeight();
            var divHeight = winHeight - headerHeight - footerHeight;
            if (divHeight > 0) {

                $(".simple_slider_box").css("height", divHeight);

                $(".pic_group .item a img").css("max-height", divHeight);

            }
        }
    }
    window.onresize();
});

app.controller('simpleMealsExtraController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $interpolate) {
    $scope.$watch('$viewContentLoaded', function () {
        if ($scope.meal != null) {
            var token = localStorage[tokenLocalStorage];
            httpRequest.Get('/meals/user/simple-start/meals/meal-time/' + $scope.meal, { "token": token }).then(function (result) {
                if (result.status) {
                    var meals = result.meals;
                    if (meals.length > 0) {
                        for (var i = 0; i < meals.length; i++) {
                            var curMeal = meals[i];
                            var $title = $('<h3 class="meal_title font_red font_w_b">' + curMeal.name + '</h3>');
                            var $favorite = $('<img class="imgFavorite" mealid="' + curMeal.mealId + '" />');
                            if (curMeal.isFavorite) {
                                $favorite.attr("src", "image/star_icon_red.png");
                            }
                            else {
                                $favorite.attr("src", "image/star_icon_gray.png");
                            }
                            $favorite.unbind().bind("click", function () {
                                updateFavorite(this);
                            });
                            var $pIns = $('<p></p>').html(curMeal.instruction);
                            var $mealHead = $('<div class="meal_head"></div>').append($title).append($favorite).append('<div class="clear"></div>').append($pIns);

                            var $img = $('<img />');
                            $img.attr("src", curMeal.image);
                            var $a = $('<a></a>');
                            $a.append($img);
                            var $item = $('<div class="item"></div>').append($mealHead).append($a);
                            $('#slider .pic_group').append($item);
                        }

                        $(".pager_control_fix").removeClass("hide");
                        $('#spanTotalCount').html($("#slider .pic_group .item").length);

                        $('#slider').cycle({
                            fx: 'scrollHorz',
                            pager: '#pagination',
                            speed: 800,
                            timeout: 6000,
                            stopAutoPlay: true,
                            slideExpr: '.item',
                            pagerAnchorBuilder: null,
                            prev: '.arrow_l',
                            next: '.arrow_r',
                            clearCycleTimeOutBefore: true,
                            startingSlide: $scope.pageIndex,
                            pageTurnEvent: function (i) {
                                localStorage["simplePageIndex"] = i + "_" + $scope.meal;
                                $("#spanCurPage").html(i + 1);
                            }
                        });
                    }
                } else if (result.status == 0) {
                    if (result.error && result.error.message) {
                        alertError(result.error, $scope, $interpolate);
                    }
                    else {
                        alertWarning($scope.$eval($interpolate("{{'message_simple_get_meals_error'|translate}}")), $scope, $interpolate);
                    }
                }
            });
        }
    });

    window.onresize = function () {
        if ($(".simple_slider_box").length > 0) {
            var winHeight = getWindowHeight();
            var headerHeight = $("header").outerHeight();
            var footerHeight = $(".simple_box .mealBottom").outerHeight();
            var pagerControlHeight = $(".simple_box .pager_control_fix").outerHeight();
            var divHeight = winHeight - headerHeight - footerHeight - pagerControlHeight;
            if (divHeight > 0) {
                $(".simple_slider_box").css("height", divHeight);
                $(".pic_group .item a img").css("max-height", divHeight);
            }
        }
    }
    window.onresize();

    function updateFavorite(_this) {
        var id = $(_this).attr("mealid");
        updateMealFavorite(httpRequest, _this, id, $scope, $interpolate);
    }
});

app.controller('simpleMealsIndulgencesController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $interpolate) {
    $scope.$watch('$viewContentLoaded', function () {
        if ($scope.meal != null) {
            var token = localStorage[tokenLocalStorage];
            httpRequest.Get('/meals/user/simple-start/indulgence', { "token": token }).then(function (result) {
                if (result.status) {
                    var meals = result.meals;
                    if (meals.length > 0) {
                        for (var i = 0; i < meals.length; i++) {
                            var curMeal = meals[i];
                            var $title = $('<h3 class="meal_title font_red font_w_b">' + curMeal.name + '</h3>');
                            var $favorite = $('<img class="imgFavorite" mealid="' + curMeal.id + '" />');
                            if (curMeal.isFavorite) {
                                $favorite.attr("src", "image/star_icon_red.png");
                            }
                            else {
                                $favorite.attr("src", "image/star_icon_gray.png");
                            }
                            $favorite.unbind().bind("click", function () {
                                updateFavorite(this);
                            });
                            var $mealHead = $('<div class="meal_head"></div>').append($title).append($favorite).append('<div class="clear"></div>');

                            var $img = $('<img />');
                            $img.attr("src", curMeal.image);
                            var $a = $('<a></a>');
                            $a.append($img);
                            var $item = $('<div class="item"></div>').append($mealHead).append($a);
                            var $instruction = $('<div class="indulgences_instruction"> ' + curMeal.servingsWhole + " " + curMeal.uomName +
                                '<br/><p>' + curMeal.point + ' ' +
                                '<strong><span style="font-style: italic;">' + $scope.$eval($interpolate("{{'label_point_proPontos'|translate}}")) + '®</span></strong></p>' +
                                '<p>' + $scope.$eval($interpolate("{{'label_simple_indulgence_you_can_have'|translate}}")) +
                                ' ' +
                                ' <strong><span style="font-style: italic;">' + $scope.$eval($interpolate("{{'label_point_proPontos'|translate}}")) + '®</span></strong> ' +
                                $scope.$eval($interpolate("{{'label_simple_indulgence_values_per_day'|translate}}")) + '</p>' + '</div>');
                            $item.append($instruction);
                            $('#slider .pic_group').append($item);
                        }

                        $(".pager_control_fix").removeClass("hide");
                        $('#spanTotalCount').html($("#slider .pic_group .item").length);

                        $('#slider').cycle({
                            fx: 'scrollHorz',
                            pager: '#pagination',
                            speed: 800,
                            timeout: 6000,
                            stopAutoPlay: true,
                            slideExpr: '.item',
                            pagerAnchorBuilder: null,
                            prev: '.arrow_l',
                            next: '.arrow_r',
                            clearCycleTimeOutBefore: true,
                            startingSlide: $scope.pageIndex,
                            pageTurnEvent: function (i) {
                                localStorage["simplePageIndex"] = i + "_" + $scope.meal;
                                $("#spanCurPage").html(i + 1);
                            }
                        });
                    }
                } else if (result.status == 0) {
                    if (result.error && result.error.message) {
                        alertError(result.error, $scope, $interpolate);
                    }
                    else {
                        alertWarning($scope.$eval($interpolate("{{'message_simple_get_meals_error'|translate}}")), $scope, $interpolate);
                    }
                }
            });
        }
    });

    window.onresize = function () {
        if ($(".simple_slider_box").length > 0) {
            var winHeight = getWindowHeight();
            var headerHeight = $("header").outerHeight();
            var footerHeight = $(".simple_box .mealBottom").outerHeight();
            var pagerControlHeight = $(".simple_box .pager_control_fix").outerHeight();
            var divHeight = winHeight - headerHeight - footerHeight - pagerControlHeight;
            if (divHeight > 0) {
                $(".simple_slider_box").css("height", divHeight);
                $(".pic_group .item a img").css("max-height", divHeight);
            }
        }
    }
    window.onresize();

    function updateFavorite(_this) {
        var id = $(_this).attr("mealid");
        updateKindsMealFavorite(httpRequest, _this, id, MealItemType.IndulgencesMealType, $scope, $interpolate);
    }
});

app.controller('simpleDetailController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $routeParams, $interpolate) {
    $scope.id = $routeParams.id;

    $scope.back = function () {
        history.back();
    }

    var token = localStorage[tokenLocalStorage];
    httpRequest.Get('/meals/user/simple-start/meals/' + $scope.id, { "token": token }).then(function (result) {
        if (result.status) {
            $scope.meal = result.meal;
            if ($scope.meal && $scope.meal.isFavorite) {
                $("#imgFavorite").attr("src", "image/star_icon_red.png");
            }
            else {
                $("#imgFavorite").attr("src", "image/star_icon_gray.png");
            }
        } else if (result.status == 0) {
            if (result.error && result.error.message) {
                alertError(result.error, $scope, $interpolate);
            }
            else {
                alertWarning($scope.$eval($interpolate("{{'message_simple_get_meal_detail_error'|translate}}")), $scope, $interpolate);
            }
        }
    });

    $scope.modifyFavorite = function () {
        if ($scope.meal) {
            updateMealFavorite(httpRequest, $("#imgFavorite")[0], $scope.meal.mealId, $scope, $interpolate);
        }
    }
});

app.controller('mealExtraDetailController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $routeParams, $interpolate) {
    $scope.id = $routeParams.id;

    $scope.back = function () {
        history.back();
    }

    var token = localStorage[tokenLocalStorage];
    httpRequest.Get('/meals/user/simple-start/meals/' + $scope.id, { "token": token }).then(function (result) {
        if (result.status) {
            $scope.meal = result.meal;
            if ($scope.meal && $scope.meal.isFavorite) {
                $("#imgFavorite").attr("src", "image/star_icon_red.png");
            }
            else {
                $("#imgFavorite").attr("src", "image/star_icon_gray.png");
            }
        } else if (result.status == 0) {
            if (result.error && result.error.message) {
                alertError(result.error, $scope, $interpolate);
            }
            else {
                alertWarning($scope.$eval($interpolate("{{'message_simple_get_meal_detail_error'|translate}}")), $scope, $interpolate);
            }
        }
    });

    $scope.modifyFavorite = function () {
        if ($scope.meal) {
            updateMealFavorite(httpRequest, $("#imgFavorite")[0], $scope.meal.mealId, $scope, $interpolate);
        }
    }
});

app.controller('mealIndulgencesDetailController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $routeParams, $interpolate) {
    $scope.id = $routeParams.id;

    $scope.back = function () {
        history.back();
    }

    var token = localStorage[tokenLocalStorage];
    httpRequest.Get('/meals/user/simple-start/indulgence/' + $scope.id, { "token": token }).then(function (result) {
        if (result.status) {
            $scope.meal = result.meal;
            if ($scope.meal && $scope.meal.isFavorite) {
                $("#imgFavorite").attr("src", "image/star_icon_red.png");
            }
            else {
                $("#imgFavorite").attr("src", "image/star_icon_gray.png");
            }
        } else if (result.status == 0) {
            if (result.error && result.error.message) {
                alertError(result.error, $scope, $interpolate);
            }
            else {
                alertWarning($scope.$eval($interpolate("{{'message_simple_get_meal_detail_error'|translate}}")), $scope, $interpolate);
            }
        }
    });

    $scope.modifyFavorite = function () {
        if ($scope.meal) {
            updateKindsMealFavorite(httpRequest, $("#imgFavorite")[0], $scope.meal.id, MealItemType.IndulgencesMealType, $scope, $interpolate);
        }
    }
});

app.controller('myMealsController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $routeParams, $interpolate) {
    localStorage.removeItem(buildMealFoodsLocalStorage);
    window.onresize = function () {
        if ($(".my_meals_box").length > 0) {
            var winHeight = getWindowHeight();
            var headerHeight = $("header").outerHeight();
            var selectHeight = $(".my-meals-select").outerHeight();
            var footerHeight = $(".mealBottom").height();
            var divHeight = winHeight - headerHeight - selectHeight - footerHeight - 1;
            if (divHeight > 0) {
                $(".my_meals_box").css("height", divHeight);
            }
        }
    }
    window.onresize();

    $scope.mealTime = MealTime;

    $scope.mealTimeList = getEnumAttributes(MealTime);

    var token = localStorage[tokenLocalStorage];
    if (token) {
        httpRequest.Get('/meals/user/simple-start/meamber-meals/', { "token": token }).then(function (result) {
            if (result.status) {
                $scope.meals = result.memberMeals;
            }
        });

        httpRequest.Get('/meals/user/favorites', { "token": token }).then(function (result) {
            if (result.status) {
                $scope.favorites = result.favorites;
            }
        });
    }

    $scope.goToDetail = function (id) {
        $location.path("/myMealDetail/" + id)
    }

    $scope.showDelete = function (item) {
        if ($("#meal_edit_" + item.id).hasClass("meal_rotate_del")) {
            $("#meal_edit_" + item.id).removeClass("meal_rotate_del");
        }
        else {
            $("#meal_edit_" + item.id).addClass("meal_rotate_del");
        }
    }

    $scope.deleteMeal = function (id) {
        if (token) {
            httpRequest.DELETE('/meals/user/simple-start/meamber-meals/' + id, { "token": token }).then(function (result) {
                if (result.status) {
                    if ($scope.meals) {
                        for (var i = 0; i < $scope.meals.length; i++) {
                            if ($scope.meals[i].id == id) {
                                $scope.meals.splice(i, 1);
                                return;
                            }
                        }
                    }
                }
                else {
                    alertWarning($scope.$eval($interpolate("{{'message_simple_delete_my_meal_error'|translate}}")), $scope, $interpolate);
                }
            });
        }
    }

    $scope.edit = function () {
        $scope.editMode = true;
    }

    $scope.done = function () {
        $scope.editMode = false;
        $(".edit_meal").removeClass("meal_rotate_del");
    }
});

app.controller('myMealDetailController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $routeParams, $interpolate) {
    $scope.id = $routeParams.id;

    $scope.back = function () {
        history.back();
    }

    var token = localStorage[tokenLocalStorage];
    if (token) {
        httpRequest.Get('/meals/user/simple-start/meamber-meals/' + $scope.id, { "token": token }).then(function (result) {
            if (result.status) {
                $scope.meal = result.memberMeal;

                if ($scope.meal && $scope.meal.favorite) {
                    $("#imgFavorite").attr("src", "image/star_icon_red.png");
                }
                else {
                    $("#imgFavorite").attr("src", "image/star_icon_gray.png");
                }
            }
        });
    }

    $scope.modifyFavorite = function () {
        updateKindsMealFavorite(httpRequest, $("#imgFavorite")[0], $scope.id, MealItemType.MemberMealType, $scope, $interpolate);
    }
});

app.controller('mealsFavoritesController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $routeParams, $interpolate) {
    window.onresize = function () {
        if ($(".my_meals_box").length > 0) {
            var winHeight = getWindowHeight();
            var headerHeight = $("header").outerHeight();
            var selectHeight = $(".my-meals-select").outerHeight();
            var footerHeight = $(".mealBottom").height();
            var divHeight = winHeight - headerHeight - selectHeight - footerHeight - 1;
            if (divHeight > 0) {
                $(".my_meals_box").css("height", divHeight);
            }
        }
    }
    window.onresize();

    $scope.mealTime = MealTime;
    $scope.mealTimeList = getEnumAttributes(MealTime);
    $scope.mealItemType = MealItemType;

    var token = localStorage[tokenLocalStorage];
    if (token) {
        httpRequest.Get('/meals/user/simple-start/meamber-meals/', { "token": token }).then(function (result) {
            if (result.status) {
                $scope.meals = result.memberMeals;
            }
        });

        httpRequest.Get('/meals/user/favorites', { "token": token }).then(function (result) {
            if (result.status) {
                $scope.favorites = result.favorites;
            }
        });
    }

    $scope.removeFavorite = function (id, type) {
        httpRequest.DELETE('/user/favorites/type/' + type + '/' + id, { "token": token }).then(function (result) {
            if (result.status) {
                if ($scope.favorites) {
                    for (var i = 0; i < $scope.favorites.length; i++) {
                        if ($scope.favorites[i].id == id) {
                            $scope.favorites.splice(i, 1);
                            return;
                        }
                    }
                }
            } else if (result.status == 0) {
                if (result.error && result.error.message) {
                    alertError(result.error, $scope, $interpolate);
                }
                else {
                    alertWarning($scope.$eval($interpolate("{{'message_simple_remove_favorite_error'|translate}}")), $scope, $interpolate);
                }
            }
        });
    }

    $scope.customMealTimeFilter = function (mealTime) {
        return function (item) {
            if (mealTime == MealTime.Indulgences) {
                return item.type == MealItemType.IndulgencesMealType;
            }
            else {
                if (item.type == MealItemType.IndulgencesMealType) {
                    return false;
                }
                return item.mealTime == mealTime;
            }
        };
    };
});

app.controller('buildMealController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $routeParams, $interpolate) {
    $scope.mealTime = $routeParams.mealTime;

    $scope.$watch('$viewContentLoaded', function () {

        if (localStorage[buildMealFoodsLocalStorage]) {
            $scope.foods = JSON.parse(localStorage[buildMealFoodsLocalStorage]);
        }

        $scope.type = getObjAttributeNameByValue(MealTime, $scope.mealTime);
        if (!$scope.type) {
            $scope.mealTime = MealTime.Breakfast;
            $scope.type = getObjAttributeNameByValue(MealTime, $scope.mealTime);
        }

        if ($scope.mealTime == MealTime.Lunch) {
            $scope.foodsType = LunchFoods;
        }
        else if ($scope.mealTime == MealTime.Dinner) {
            $scope.foodsType = DinnerFoods;
        }
        else {
            $scope.foodsType = BreakfastFoods;
        }

        setFoodsTypeChecked($scope);
    });

    $scope.back = function () {
        if (!localStorage[buildMealFoodsLocalStorage] || (JSON.parse(localStorage[buildMealFoodsLocalStorage])).length == 0) {
            history.back();
        } else {
            var arrButton = [$scope.$eval($interpolate("{{'button_simple_build_meal_donot'|translate}}")), $scope.$eval($interpolate("{{'button_simple_build_meal_ok'|translate}}"))];
            openDialog($scope.$eval($interpolate("{{'button_warning'|translate}}")), $scope.$eval($interpolate("{{'title_simple_build_meal_alert'|translate}}")),
                arrButton, $scope.handleReminderMessage);
        }
    }

    $scope.handleReminderMessage = function(result) {
        if (result == 0) {
            history.back();
        } else {
            $scope.save();
        }
    };

    $scope.showDelete = function (item) {
        if ($("#food_edit_" + item.id).hasClass("meal_rotate_del")) {
            $("#food_edit_" + item.id).removeClass("meal_rotate_del");
        }
        else {
            $("#food_edit_" + item.id).addClass("meal_rotate_del");
        }
    }

    $scope.edit = function () {
        $scope.editMode = true;
    }

    $scope.done = function () {
        $scope.editMode = false;
        $(".edit_meal").removeClass("meal_rotate_del");
    }

    $scope.deleteMeal = function (id) {
        if ($scope.foods) {
            for (var i = 0; i < $scope.foods.length; i++) {
                if ($scope.foods[i].id == id) {
                    $scope.foods.splice(i, 1);
                    break;
                }
            }

            localStorage[buildMealFoodsLocalStorage] = JSON.stringify($scope.foods);
            setFoodsTypeChecked($scope);
        }
    }

    $scope.save = function () {
        if (!localStorage[buildMealFoodsLocalStorage] || (JSON.parse(localStorage[buildMealFoodsLocalStorage])).length == 0) {
            alertWarning($scope.$eval($interpolate("{{'message_simple_add_ingredient'|translate}}")), $scope, $interpolate);
            return;
        }
        var userInfo = JSON.parse(localStorage[userLocalStorage]);
        if (userInfo.language == "pt_BR") {
            openDialog("simple/mealNameSettingP.html");
        } else if (userInfo.language == "eng_BR") {
            openDialog("simple/mealNameSetting.html");
        } else {
            openDialog("simple/mealNameSettingP.html");
        }

    }

    function setFoodsTypeChecked($scope) {
        if ($scope.foodsType) {
            for (var i = 0; i < $scope.foodsType.length; i++) {
                var foodType = $scope.foodsType[i];
                foodType.checked = false;
                if (localStorage[buildMealFoodsLocalStorage]) {
                    var foodList = JSON.parse(localStorage[buildMealFoodsLocalStorage]);
                    for (var j = 0; j < foodList.length; j++) {
                        if (foodList[j].categoryId == foodType.id) {
                            foodType.checked = true;
                            break;
                        }
                    }
                }
            }
        }
    }
});

app.controller('foodSelectController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $routeParams, $interpolate) {
    $scope.id = $routeParams.id;
    $scope.mealTime = $routeParams.mealTime;

    $scope.$watch('$viewContentLoaded', function () {
        $scope.type = getObjAttributeNameByValue(MealTime, $scope.mealTime);
        if (!$scope.type) {
            $scope.mealTime = MealTime.Breakfast;
            $scope.type = getObjAttributeNameByValue(MealTime, $scope.mealTime);
        }

        var foodAttributes = getObjAttributeNames(FoodType);
        for (var i = 0; i < foodAttributes.length; i++) {
            if (eval("FoodType." + foodAttributes[i] + ".id") == $scope.id) {
                $scope.foodTypeTranslate = eval("FoodType." + foodAttributes[i] + ".translate");
                break;
            }
        }

        var token = localStorage[tokenLocalStorage];
        if (token) {
            httpRequest.Get('/meals/user/simple-start/meamber-meals/ingredient/' + $scope.id + '/' + $scope.mealTime, { "token": token}).then(function (result) {
                if (result.status) {
                    $scope.foods = result.ingredients;
                    if ($scope.foods) {
                        if (localStorage[buildMealFoodsLocalStorage] && $scope.foods && $scope.foods.length > 0) {
                            var foodList = JSON.parse(localStorage[buildMealFoodsLocalStorage]);
                            if (foodList.length > 0) {
                                for (var i = 0; i < $scope.foods.length; i++) {
                                    for (var j = 0; j < foodList.length; j++) {
                                        if (foodList[j].categoryId == $scope.id && foodList[j].id == $scope.foods[i].id) {
                                            $scope.foods[i].select = true;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
        }
    });

    $scope.back = function () {
        history.back();
    }

    $scope.selectFood = function (item) {
        item.select = true;
    }

    $scope.unSelectFood = function (item) {
        item.select = false;
    }

    $scope.save = function () {
        var foodList = null;
        if (localStorage[buildMealFoodsLocalStorage]) {
            foodList = JSON.parse(localStorage[buildMealFoodsLocalStorage]);
            for (var i = foodList.length - 1; i >= 0; i--) {
                if (foodList[i].categoryId == $scope.id) {
                    foodList.splice(i, 1);
                }
            }
        }
        if ($scope.foods) {
            for (var j = 0; j < $scope.foods.length; j++) {
                if ($scope.foods[j].select) {
                    if (!foodList)
                        foodList = new Array();

                    var food = { id: $scope.foods[j].id, name: $scope.foods[j].name, categoryId: $scope.id, type: $scope.foods[j].type };
                    foodList.push(food);
                }
            }
        }
        if (foodList) {
            localStorage[buildMealFoodsLocalStorage] = JSON.stringify(foodList);
        }
        history.back();
    }
});

app.controller('howItWorksController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $routeParams, $interpolate) {
    $scope.back = function () {
        history.back();
    }

    $scope.logOut = function () {
        logout();
    }
});
