app.controller('introduceModesController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $interpolate) {

    $scope.$watch('$viewContentLoaded', function () {
        var userInfo = JSON.parse(localStorage[userLocalStorage]);
        $scope.name = userInfo.firstName;
        $scope.gender = userInfo.gender;
    });

    $scope.goToSimpleIntroduce = function () {
        var weightTargetInfo = new Object();
        weightTargetInfo.weeklyPoint = defaultWeeklyPoint;
        weightTargetInfo.mode = Modes.Simple;
        localStorage[weightLocalStorage] = JSON.stringify(weightTargetInfo);
        $location.path("/introduceWeight");
    }

    $scope.goToTrackIntroduce = function () {
        var weightTargetInfo = new Object();
        weightTargetInfo.weeklyPoint = defaultWeeklyPoint;
        weightTargetInfo.mode = Modes.Tracking;
        localStorage[weightLocalStorage] = JSON.stringify(weightTargetInfo);
        $location.path("/introduceWeight");
    }

});

app.controller('introduceWeightController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $interpolate) {
    if (localStorage[weightLocalStorage] == null) {
        $location.path("/introduceModes");
        return;
    }
    var weightTargetInfo = JSON.parse(localStorage[weightLocalStorage]);
    $scope.$watch('$viewContentLoaded', function () {
        //remove the date input,so remove these below
//        if (!Modernizr.inputtypes.date) {
//            $scope.isShowB = 1;
//            $("#birthday").Zebra_DatePicker({
//                format: 'm/d/Y',
//                onSelect: function(view, elements) {
//                    $scope.birthday = new Date(elements).format("mm/dd/yyyy");
//                }
//            });
//        } else {
//            if (isATF()) {
//                $scope.isShowB = 1;
//                $("#birthday").Zebra_DatePicker({
//                    format: 'm/d/Y',
//                    onSelect: function(view, elements) {
//                        $scope.birthday = new Date(elements).format("mm/dd/yyyy");
//                    }
//                });
//            }
//        }

        var birthday = null;
        if (weightTargetInfo.birthday) {
            birthday = weightTargetInfo.birthday;
        } else {
            var userInfo = JSON.parse(localStorage[userLocalStorage]);
            if (userInfo && userInfo.birthday) {
                birthday = userInfo.birthday;
            }
        }
        if (birthday) {
            //remove the date input,so remove these below
//            if (birthday.indexOf("/") > 0) {
//                if (!Modernizr.inputtypes.date) {
//                    $scope.birthday = birthday.split("/")[1] + "/" + birthday.split("/")[0] + "/" + birthday.split("/")[2];
//                } else {
//                    if (isATF()) {
//                        $scope.birthday = birthday.split("/")[1] + "/" + birthday.split("/")[0] + "/" + birthday.split("/")[2];
//                    } else {
//                        $scope.birthday = birthday.split("/")[2] + "-" + birthday.split("/")[1] + "-" + birthday.split("/")[0];
//                    }
//                }
//            } else {
//                $scope.birthday = birthday;
//            }
            $scope.birthday = birthday;
        }
        $scope.weight = toFloatFormatString(weightTargetInfo.weight);
        $scope.height = weightTargetInfo.height * 100;
        $scope.weightGoal = toFloatFormatString(weightTargetInfo.goalWeight);
        var gender = null;
        if (weightTargetInfo.gender != null) {
            gender = weightTargetInfo.gender;
        }
        else if (userInfo.gender != null) {
            gender = userInfo.gender;
        }
        if (gender != null) {
            var btnChecked = $('.selectBar.sexBar .btn[value="' + gender + '"]');
            if (btnChecked != null && btnChecked.length > 0) {
                checkedSelect(btnChecked[0]);
                $scope.gender = gender;
            }
            if (weightTargetInfo.nursing == 1) {
                $scope.changedNursing(false);

                if (weightTargetInfo.onlyBreastMilk == 1) {
                    $scope.changedFullTime(false);
                }
            }
        }
        $scope.meetingDays = [
            {
                id: -1,
                name: ""
            },
            {
                id: 1,
                name: $scope.$eval($interpolate("{{'option_monday'|translate}}"))
            },
            {
                id: 2,
                name: $scope.$eval($interpolate("{{'option_tuesday'|translate}}"))
            },
            {
                id: 3,
                name:  $scope.$eval($interpolate("{{'option_wednesday'|translate}}"))
            },
            {
                id: 4,
                name:  $scope.$eval($interpolate("{{'option_thursday'|translate}}"))
            },
            {
                id: 5,
                name: $scope.$eval($interpolate("{{'option_friday'|translate}}"))
            },
            {
                id: 6,
                name: $scope.$eval($interpolate("{{'option_saturday'|translate}}"))
            }
        ];
        if (weightTargetInfo.meetingDayOfWeek == undefined) {
            $scope.meetingDayOfWeek = -1;
            $scope.isShowMeetingDay = 1;
        } else {
            $scope.meetingDayOfWeek = weightTargetInfo.meetingDayOfWeek;
            $scope.isShowMeetingDay = 0;
        }
    });

    $scope.verifyBirthdayFormat = function() {
        validationBirthdayFormat($scope);
    };

    $scope.showMeetingDaySelect = function() {
        if ($scope.isShowMeetingDay == 1) {
            $scope.isShowMeetingDay = 0;
        }
    };

    $scope.calculateSuggestWeight = function () {
//        var height = toFloatByLanguage($scope.height);
        var height = ($scope.height / 100).toFixed(2);
        if (height != null) {
            $scope.weightGoal = Math.round(23 * (height * height));
        }
        else {
            $scope.weightGoal = null;
        }
    };


    $scope.checkedMale = function () {
        checkedSelect($("#chkMale")[0]);
        $scope.gender = $("#chkMale").attr("value");
        $scope.clearNursing();
    };

    $scope.checkedFemale = function () {
        checkedSelect($("#chkFemale")[0]);
        $scope.gender = $("#chkFemale").attr("value");
        $scope.clearNursing();
    };

    $scope.changedNursing = function (isAlert) {

        if (isCheckedCustom($("#chkFullTime"))) {
            $scope.changedFullTime();
        }

        checkedChanged($("#chkNursing")[0]);
        if (isCheckedCustom($("#chkNursing"))) {
            $scope.isNursing = 1;
            if (isAlert) {
                alertWarning($scope.$eval($interpolate("{{'message_introduce_nursing'|translate}}")), $scope, $interpolate);
            }
        }
        else {
            $scope.isNursing = 0;
        }
    };

    $scope.changedFullTime = function (isAlert) {
        checkedChanged($("#chkFullTime")[0]);
        if (isCheckedCustom($("#chkFullTime"))) {
            $scope.isFullTime = 1;
            if (isAlert) {
                alertWarning($scope.$eval($interpolate("{{'message_introduce_nursing_full_time'|translate}}")), $scope, $interpolate);
            }
        }
        else {
            $scope.isFullTime = 0;
        }
    }

    $scope.clearNursing = function () {
        if (isCheckedCustom($("#chkFullTime"))) {
            $scope.changedFullTime();
        }
        if (isCheckedCustom($("#chkNursing"))) {
            $scope.changedNursing();
        }
    };

    $scope.clearHeightNoNum = function () {
        $scope.height = limitDecimalDigitsByLanguage($scope.height, 3, 0);
//        $scope.calculateSuggestWeight();
    };

    $scope.clearWeightNoNum = function () {
        $scope.weight = limitDecimalDigitsByLanguage($scope.weight, 3, 1);
    };

    $scope.clearGoalNoNum = function () {
        $scope.weightGoal = limitDecimalDigitsByLanguage($scope.weightGoal, 3, 1);
    };

    $scope.calculateDPT = function () {
        var gender = $scope.gender;
        var TEE = 0;
        var additionPoint = 0;

        var age = getAge($scope.birthday.split("/")[2] + "-" + $scope.birthday.split("/")[1] + "-" + $scope.birthday.split("/")[0]);
        var weight = toFloatByLanguage($scope.weight);
        var height = (toFloatByLanguage($scope.height) / 100).toFixed(2);
        if (gender == 0) { //female
            if (age < 17) {
                return girlDPT[age];
            }
            if (age == 17) {
                var now = new Date();
                var month = now.getMonth() + 1;
                var day = now.getDate();
                if (parseInt($scope.birthday.split("/")[1]) == month && parseInt($scope.birthday.split("/")[0]) == day) {
                    return girlDPT[age - 1];
                }
            }
            TEE = 387 - (7.31 * age) + 1.14 * (10.9 * weight + 660.7 * height);
            if ($scope.isNursing == 1) {
                if ($scope.isFullTime == 1) {
                    additionPoint = 14;
                } else {
                    additionPoint = 7;
                }
            }
        } else {
            if (age < 17) {
                return boyDPT[age];
            }
            if (age == 17) {
                var now = new Date();
                var month = now.getMonth() + 1;
                var day = now.getDate();
                if (parseInt($scope.birthday.split("/")[1]) == month && parseInt($scope.birthday.split("/")[0]) == day) {
                    return boyDPT[age - 1];
                }
            }
            TEE = 864 - (9.72 * age) + 1.12 * (14.2 * weight + 503 * height);
        }
        return calculateTarget(TEE, additionPoint);
    };

    function calculateTarget(teeData, additionPoint) {
        var resultVal = Math.round((teeData - (teeData * 0.10) - 1200) / 35);
        resultVal = resultVal < 26 ? 26 : resultVal;
        resultVal = resultVal > 71 ? 71 : resultVal;
        return resultVal + additionPoint;
    }

    $scope.next = function () {
//        if (!$scope.birthday) {
//            alertWarning($scope.$eval($interpolate("{{'message_introduce_select_birthday'|translate}}")), $scope, $interpolate);
//            return;
//        }
        if ($scope.birthday == undefined || $scope.birthday == "") {
            alertWarning($scope.$eval($interpolate("{{'message_introduce_select_birthday'|translate}}")), $scope, $interpolate);
            return;
        }
        //remove the date input,so add these below
        var d = $scope.birthday.split("/")[0];
        var m = $scope.birthday.split("/")[1];
        var y = $scope.birthday.split("/")[2];
        if (parseInt(d) > 31 || parseInt(d) < 0) {
            alertWarning($scope.$eval($interpolate("{{'message_register_birthday'|translate}}")), $scope, $interpolate);
            return;
        }
        if (parseInt(m) > 12 || parseInt(m) < 0) {
            alertWarning($scope.$eval($interpolate("{{'message_register_birthday'|translate}}")), $scope, $interpolate);
            return;
        }
        if (parseInt(y) < 1900 || parseInt(y) > 9999) {
            alertWarning($scope.$eval($interpolate("{{'message_register_birthday'|translate}}")), $scope, $interpolate);
            return;
        }
        var age = getAge(y + "-" + m + "-" + d);
//        var age = getAge($scope.birthday);
        if (age < 10) {
            alertWarning($scope.$eval($interpolate("{{'message_introduce_years'|translate}}")), $scope, $interpolate);
            return;
        }

        if (!$scope.height) {
            alertWarning($scope.$eval($interpolate("{{'message_introduce_numeric'|translate}}")), $scope, $interpolate);
            return;
        }
        var height = ($scope.height / 100).toFixed(2);
        if (height < 1.48 || height > 2) {
            alertWarning($scope.$eval($interpolate("{{'message_introduce_height_between'|translate}}")), $scope, $interpolate);
            return;
        }
        if (!$scope.weight) {
            alertWarning($scope.$eval($interpolate("{{'message_introduce_weight_required'|translate}}")), $scope, $interpolate);
            return;
        }
        var weight = toFloatByLanguage($scope.weight);
        if (weight < 44 || weight > 200) {
            alertWarning($scope.$eval($interpolate("{{'message_introduce_weight_between'|translate}}")), $scope, $interpolate);
            return;
        }
        if ($scope.gender == null) {
            alertWarning($scope.$eval($interpolate("{{'message_introduce_gender_required'|translate}}")), $scope, $interpolate);
            return;
        }

        if ($scope.meetingDayOfWeek == null || $scope.meetingDayOfWeek == undefined || $scope.meetingDayOfWeek == -1) {
            alertWarning($scope.$eval($interpolate("{{'message_introduce_meeting_day_required'|translate}}")), $scope, $interpolate);
            return;
        }

        if (!$scope.weightGoal) {
            alertWarning($scope.$eval($interpolate("{{'message_introduce_goal_required'|translate}}")), $scope, $interpolate);
            return;
        }

        var weightGoal = toFloatByLanguage($scope.weightGoal);
        var weight = toFloatByLanguage($scope.weight);
        if (weightGoal >= weight) {
            alertWarning($scope.$eval($interpolate("{{'message_setting_enter_current_weight'|translate}}")), $scope, $interpolate);
            return;
        }

        if (age >= 18) {
            if ((weight - (20 * height * height)) < 2) {
//                alertWarning($scope.$eval($interpolate("{{'message_introduce_at_this'|translate}}")), $scope, $interpolate);

                var arrButton = [$scope.$eval($interpolate("{{'button_sign_cont'|translate}}")), $scope.$eval($interpolate("{{'button_sign_href'|translate}}"))];
                openDialog($scope.$eval($interpolate("{{'button_warning'|translate}}")), $scope.$eval($interpolate("{{'message_introduce_at_this'|translate}}")), arrButton,
                    function (r) {
                        if (r == 1) {
                            window.open("http://www.vigilantesdopeso.com.br/comofunciona/emagrecer/pesosaudavel/");
                        }
                    });

                return;
            } else {
                var standardWeightGoal = Math.round(20 * (height * height));
                if (weightGoal < standardWeightGoal) {
                    alertWarning($scope.$eval($interpolate("{{'message_setting_health_weight_1'|translate}}")) + standardWeightGoal + $scope.$eval($interpolate("{{'message_setting_health_weight_2'|translate}}")), $scope, $interpolate);
                    return;
                }
            }

            if ((height < 1.48) || (height > 2)) {
                alertWarning($scope.$eval($interpolate("{{'message_introduce_members'|translate}}")), $scope, $interpolate);
            }
        }

        if (age >= 10 && age < 18) {
            var arrButton = [$scope.$eval($interpolate("{{'button_refuse'|translate}}")), $scope.$eval($interpolate("{{'button_got'|translate}}"))];
            openDialog($scope.$eval($interpolate("{{'button_warning'|translate}}")), $scope.$eval($interpolate("{{'message_introduce_attending'|translate}}")), arrButton,
                function (r) {
                    if (r == 1) {
                        $scope.goToNext();
                    }
                });
        }
        else {
            $scope.goToNext();
        }
    }

    $scope.goToNext = function () {
        $scope.target = $scope.calculateDPT();
        weightTargetInfo.dailyPoint = $scope.target;
        weightTargetInfo.birthday = $scope.birthday;
        //remove date input, so add this below
//        weightTargetInfo.birthday = $scope.birthday.split("/")[2] + "-" + $scope.birthday.split("/")[1] + "-" + $scope.birthday.split("/")[0];
        weightTargetInfo.weight = toFloatByLanguage($scope.weight);
        weightTargetInfo.height = $scope.height;
        weightTargetInfo.gender = $scope.gender;
        weightTargetInfo.goalWeight = toFloatByLanguage($scope.weightGoal);
        weightTargetInfo.nursing = $scope.isNursing == null ? 0 : $scope.isNursing;
        weightTargetInfo.meetingDayOfWeek = $scope.meetingDayOfWeek;
        weightTargetInfo.onlyBreastMilk = $scope.isFullTime == null ? 0 : $scope.isFullTime;
        var token = localStorage[tokenLocalStorage];
        if (token) {
//            weightTargetInfo.timeZoneId = "GMT" + clientTimeZone();
            weightTargetInfo.timeZoneId = jstz.determine().name();
            //remove date input, so remove this below
//            weightTargetInfo.birthday = new Date(weightTargetInfo.birthday).format("dd/mm/yyyy");
            var requestData = JSON.stringify(weightTargetInfo);
            httpRequest.PUT('/user/info', requestData, { "token": token }).then(function (result) {
                if (result.status) {
                    var userInfo = JSON.parse(localStorage[userLocalStorage]);
                    userInfo.goalWeight = $scope.weightGoal;
                    userInfo.weight = $scope.weight;
                    userInfo.dailyPoint = $scope.target;
                    userInfo.birthday = weightTargetInfo.birthday;
                    userInfo.height = ($scope.height / 100).toFixed(2);
                    userInfo.gender = $scope.gender;
                    userInfo.meetingDay = $scope.meetingDayOfWeek;
                    userInfo.trackDay = result.setting.trackDay;
                    userInfo.gettingStartFinishDate = result.setting.gettingStartFinishDate;
                    userInfo.maintance = result.setting.maintance;
                    localStorage[userLocalStorage] = JSON.stringify(userInfo);
                    weightTargetInfo.height = userInfo.height;
                    localStorage[weightLocalStorage] = JSON.stringify(weightTargetInfo);

                    if (weightTargetInfo.mode == Modes.Tracking) {
                        $window.location.href = "#/introduceTrackingMode";
                    }
                    else {
                        $window.location.href = "#/introduceSimpleMode";
                    }
                } else if (result.status == 0) {
                    alertWarning($scope.$eval($interpolate("{{'message_introduce_weight_error'|translate}}")), $scope, $interpolate);
                }
            });
        }
        else {
            $location.path("/login");
        }
    }
});

app.controller('introduceTrackingModeController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $interpolate) {
    myScrollloaded();
    $scope.$watch('$viewContentLoaded', function () {
        var userInfo = JSON.parse(localStorage[userLocalStorage]);
        $scope.name = userInfo.firstName;
        $scope.gender = parseInt(userInfo.gender);
        if (localStorage[weightLocalStorage] != null) {
            var weightTargetInfo = JSON.parse(localStorage[weightLocalStorage]);
            $scope.weightTEE = weightTargetInfo.dailyPoint;

            $scope.isSeventeen = 0;
            var birthday = userInfo.birthday.split("/")[1] + "-" + userInfo.birthday.split("/")[0] + "-" + userInfo.birthday.split("/")[2];
            if (getAge(birthday) == 17) {
                $scope.isSeventeen = 1;
            }
        }
    });

    $scope.goToSimpleMode = function () {
        if (localStorage[weightLocalStorage] != null) {
            var weightTargetInfo = JSON.parse(localStorage[weightLocalStorage]);
            weightTargetInfo.mode = Modes.Simple;
            localStorage[weightLocalStorage] = JSON.stringify(weightTargetInfo);
        }
        $location.path("/introduceSimpleMode");
    };

    $scope.startTrackMode = function () {
        var token = localStorage[tokenLocalStorage];
        if (token) {
            httpRequest.PUT('/user/mode', { "mode": Modes.Tracking }, { "token": token }).then(function (result) {
                if (result.status) {
                    var userInfo = JSON.parse(localStorage[userLocalStorage]);
                    userInfo.mode = Modes.Tracking;
                    localStorage[userLocalStorage] = JSON.stringify(userInfo);
                    $window.location.href = "#/pointsIndex";
                } else if (result.status == 0) {
                    alertWarning($scope.$eval($interpolate("{{'message_introduce_weight_error'|translate}}")), $scope, $interpolate);
                }
            });
        } else {
            $location.path("/login");
        }
    };

});

app.controller('introduceSimpleModeController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $interpolate) {
    myScrollloaded();
    $scope.$watch('$viewContentLoaded', function () {
        var userInfo = JSON.parse(localStorage[userLocalStorage]);
        $scope.gender = parseInt(userInfo.gender);
        if (null != localStorage[weightLocalStorage]) {
            var weightTargetInfo = JSON.parse(localStorage[weightLocalStorage]);
            $scope.weightTEE = weightTargetInfo.dailyPoint;
        }

    });

    $scope.goToTrackMode = function () {
        if (null != localStorage[weightLocalStorage]) {
            var weightTargetInfo = JSON.parse(localStorage[weightLocalStorage]);
            weightTargetInfo.mode = Modes.Tracking;
            localStorage[weightLocalStorage] = JSON.stringify(weightTargetInfo);
        }
        $location.path("/introduceTrackingMode");
    };

    $scope.startSimpleMode = function () {
        var token = localStorage[tokenLocalStorage];
        if (token) {
            httpRequest.PUT('/user/mode', { "mode": Modes.Simple }, { "token": token }).then(function (result) {
                if (result.status) {
                    var userInfo = JSON.parse(localStorage[userLocalStorage]);
                    userInfo.mode = Modes.Simple;
                    localStorage[userLocalStorage] = JSON.stringify(userInfo);
                    $window.location.href = "#/simple";
                } else if (result.status == 0) {
                    alertWarning($scope.$eval($interpolate("{{'message_introduce_weight_error'|translate}}")), $scope, $interpolate);
                }
            });
        } else {
            $location.path("/login");
        }
    };

    $scope.saveMotivation = function () {
        var token = localStorage[tokenLocalStorage];
        var requestBody = {
            "expressReason":$scope.reason
        };
        if (token) {
            if ("" != $scope.reason && undefined != $scope.reason) {
                httpRequest.PUT("/user/settings", requestBody, {"token": token}).then(function (result) {
                    if (result.status == 1) {
                        var userInfo = JSON.parse(localStorage[userLocalStorage]);
                        userInfo.expressReason = $scope.reason;
                        localStorage[userLocalStorage] = JSON.stringify(userInfo);
                        $scope.startSimpleMode();
                    } else {
                        alertError(result.error, $scope, $interpolate);
                    }
                });
            } else {
                $scope.startSimpleMode();
            }
        }
    }
});

