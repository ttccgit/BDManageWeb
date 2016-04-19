app.controller('settingController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $translate, $translatePartialLoader, $interpolate, $routeParams) {

    $scope.weekDays = [
//        { id: 1, name: $scope.$eval($interpolate("{{'option_monday'|translate}}"))  },
//        { id: 2, name: $scope.$eval($interpolate("{{'option_tuesday'|translate}}")) },
//        { id: 3, name: $scope.$eval($interpolate("{{'option_wednesday'|translate}}")) },
//        { id: 4, name: $scope.$eval($interpolate("{{'option_thursday'|translate}}")) },
//        { id: 5, name: $scope.$eval($interpolate("{{'option_friday'|translate}}")) },
//        { id: 6, name: $scope.$eval($interpolate("{{'option_saturday'|translate}}")) }

        { id: 1, name: "Segunda-feira"  },
        { id: 2, name: "Terça-feira"  },
        { id: 3, name: "Quarta-feira"  },
        { id: 4, name: "Quinta-feira"  },
        { id: 5, name: "Sexta-feira"  },
        { id: 6, name: "Sabado"  }
    ];
//    'Domingo','Segunda-feira','Ter&ccedil;a-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sabado'

    $scope.pointPrioritys = [
        { id: 1, name: 'ProPontos Ativos' },
        { id: 0, name: 'ProPontos Semanais' }
    ];

    $scope.languages = getEnumAttributes(Languages);

    $scope.getWeekDay = function (weekIndex) {
        var weekDay = "";
        for (var k = 0; k < $scope.weekDays.length; k++) {
            if ($scope.weekDays[k].id == weekIndex) {
                weekDay = $scope.weekDays[k].name;
            }
        }
        return weekDay;
    };

    $scope.$watch('$viewContentLoaded', function () {
        var userInfo = JSON.parse(localStorage[userLocalStorage]);
        $scope.dailyPointFlag = userInfo.dptChanged;
        $scope.getSettingInfo(false);
    });

    $scope.getSettingInfo = function (isSaving) {
        $(".settingClass").show();
        $(".settingSelect").addClass("hideClass");
        $("input").removeClass("borerInput").attr("readonly", "readonly");
        var token = localStorage[tokenLocalStorage];
        if (token) {
            httpRequest.Get('/user/info', { "token": token }).then(function (result) {
                if (result.status == 1) {
                    $scope.email = result.userInfo.email;
                    $scope.weight = result.userInfo.weight;
                    $scope.birthday = result.userInfo.birthday
//                    $scope.height = (result.userInfo.height / 100).toFixed(2);
                    $scope.height = result.userInfo.height;
                    $scope.password = result.userInfo.password;
                    $scope.trackDay = result.userInfo.trackDay;
                    $scope.showOnlyPowerFood = result.userInfo.showOnlyPowerFood;
                    $scope.pointPriority = result.userInfo.pointPriority;
                    $scope.rememberEmail = result.userInfo.rememberEmail;
                    $scope.dailyPoint = result.userInfo.dailyPoint;
                    $scope.weeklyPoint = result.userInfo.weeklyPoint;
                    $scope.weeklyPointFlag = result.userInfo.weeklyPoint == 49 ? 0 : 1;
                    $scope.meetingDayOfWeek = result.userInfo.meetingDayOfWeek;
                    $scope.showMeetingDay = $scope.getWeekDay(result.userInfo.meetingDayOfWeek);
                    $scope.showTrackDay = $scope.getWeekDay(result.userInfo.trackDay);
                    $scope.logicDpt = result.userInfo.logicDpt;
//                    $scope.dailyPointFlag = result.userInfo.dptChanged;

                    for (var k = 0; k < $scope.languages.length; k++) {
                        if ($scope.languages[k].value == result.userInfo.language) {
                            $scope.showLanguage = $scope.languages[k].name;
                            $scope.language = $scope.languages[k].value;
                            $scope.languageLast = $scope.language;
                        }
                    }
                    if (!isSaving) {
                        $scope.nursing = result.userInfo.nursing;
                        $scope.onlyBreastMilk = result.userInfo.onlyBreastMilk;
                        if (result.userInfo.gender != null && result.userInfo.gender != undefined) {
                            var btnChecked = $('.selectBar.sexBar .btn[value="' + result.userInfo.gender + '"]');
                            if (btnChecked != null && btnChecked.length > 0) {
                                checkedSelect(btnChecked[0]);
                                $scope.gender = result.userInfo.gender;
                            }
                            if (result.userInfo.nursing == 1) {
                                if (isCheckedCustom($("#chkFullTime"))) {
                                    $scope.changedFullTime();
                                }

                                checkedChanged($("#chkNursing")[0]);
                                if (isCheckedCustom($("#chkNursing"))) {
                                    $scope.isNursing = 1;
                                }
                                else {
                                    $scope.isNursing = 0;
                                }

                                if (result.userInfo.onlyBreastMilk == 1) {
                                    checkedChanged($("#chkFullTime")[0]);
                                    if (isCheckedCustom($("#chkFullTime"))) {
                                        $scope.isFullTime = 1;
                                    }
                                    else {
                                        $scope.isFullTime = 0;
                                    }
                                }
                            }
                        }
                    }

                    $scope.goalWeight = toFloatFormatString(result.userInfo.goalWeight, $scope.language);
                    var userInfo = new UserInfo();
                    userInfo.InitUserInfo(result.userInfo);
                    httpRequest.Get("/user/reminder/settings/", { "token": token }).then(function (result) {
                        if (result.status == 1) {
                            localStorage[userLocalStorage] = JSON.stringify(new loginUserInfo(userInfo, result.reminder));
                            var localRemember = generateLocalRemember();
                            if (localRemember) {
                                localStorage[loginLocalStorage] = JSON.stringify(localRemember);
                            }
                        } else {
                            localStorage[userLocalStorage] = JSON.stringify(new loginUserInfo(userInfo, ""));
                            alertError(result.error, $scope, $interpolate);
                        }
                    });

                } else {
                    alertError(result.error, $scope, $interpolate);
                }
            });
        } else {
        }
    };

    $scope.verifyBirthdayFormat = function() {
        validationBirthdayFormat($scope);
    };

    $scope.showPowerFood = function () {
        if ($scope.showOnlyPowerFood == 0) {
            $scope.showOnlyPowerFood = 1;
        } else {
            $scope.showOnlyPowerFood = 0;
        }
    };

    $scope.rememberEmailAddress = function () {
        if ($scope.rememberEmail == 0) {
            $scope.rememberEmail = 1;
        } else {
            $scope.rememberEmail = 0;
        }
    };

    $scope.resetPassword = function () {
        var userInfo = JSON.parse(localStorage[userLocalStorage]);
        if (userInfo.language == "pt_BR") {
            openDialog("resetPasswordP.html");
        } else if (userInfo.language == "eng_BR") {
            openDialog("resetPassword.html");
        } else {
            openDialog("resetPasswordP.html");
        }
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

    $scope.clearHeightNoNum = function () {
        $scope.height = limitDecimalDigitsByLanguage($scope.height, 3, 0);
    };

    $scope.changeHeight = function() {
        if (($scope.height / 100).toFixed(2) == JSON.parse(localStorage[userLocalStorage]).height) {
            return;
        }
        if ($scope.isFullTime == undefined) {
            $scope.isFullTime = 0;
        }
        if ($scope.isNursing == undefined) {
            $scope.isNursing = 0;
        }
        var dpt = $scope.dailyPoint;
        var newDpt = "";
        var currentWeight = JSON.parse(localStorage[userLocalStorage]).currentWeight;
        var arrButton = [$scope.$eval($interpolate("{{'button_ok'|translate}}")), $scope.$eval($interpolate("{{'button_cancel'|translate}}"))];
        newDpt = calculateDPT($scope, currentWeight, $scope.gender, $scope.isNursing, $scope.isFullTime);
        var height = ($scope.height / 100).toFixed(2);
        var healthWeightMin = Math.round(20 * (height * height));
        var goalWeight = toFloatByLanguage($scope.goalWeight, $scope.language);
        if (goalWeight < healthWeightMin || goalWeight >= toFloatByLanguage($scope.weight)) {
            if (parseInt(dpt) != parseInt(newDpt)) {
                $scope.height = JSON.parse(localStorage[userLocalStorage]).height * 100;
                alertWarning($scope.$eval($interpolate("{{'message_setting_update_point'|translate}}")) + $scope.dailyPoint + ".  " + $scope.$eval($interpolate("{{'message_setting_change_height_3'|translate}}")) + $scope.goalWeight + " kg. " + $scope.$eval($interpolate("{{'message_setting_change_height_4'|translate}}")) + healthWeightMin + " kg.", $scope, $interpolate);
            } else {
                $scope.height = JSON.parse(localStorage[userLocalStorage]).height * 100;
                alertWarning($scope.$eval($interpolate("{{'message_setting_health_weight_1'|translate}}")) + healthWeightMin + $scope.$eval($interpolate("{{'message_setting_health_weight_2'|translate}}")), $scope, $interpolate);
            }
        } else {
            if (parseInt(dpt) != parseInt(newDpt)) {
                openDialog($scope.$eval($interpolate("{{'button_warning'|translate}}")), $scope.$eval($interpolate("{{'message_setting_update_point'|translate}}")) + newDpt,
                    arrButton, function(r) {
                        var token = localStorage[tokenLocalStorage];
                        if (r == "0") {
                            if (token) {
                                var requestBody = {
                                    "height" : $scope.height,
                                    "dailyPoint": newDpt
                                };
                                $scope.updateSetting(token, requestBody);
                            }
                        } else {
                            if (token) {
                                httpRequest.Get('/user/info', { "token": token }).then(function (result) {
                                    $scope.dailyPoint = dpt;
                                    $scope.height = result.userInfo.height;
                                })
                            }
                        }
                    }
                );
            } else {
                var token = localStorage[tokenLocalStorage];
                if (token) {
                    var requestBody = {
                        "height" : $scope.height
                    };
                    $scope.updateSetting(token, requestBody);
                }
            }
        }
    };

    $scope.changeEmail = function() {
        var oldEmail = JSON.parse(localStorage[userLocalStorage]).email;

        if (!$scope.email) {
            if ($("#txtEmail").val().trim() == "") {
                alertWarning($scope.$eval($interpolate("{{'message_person_email_empty'|translate}}")), $scope, $interpolate);
                $scope.email = oldEmail;
                return;
            }
            alertWarning($scope.$eval($interpolate("{{'message_login_email_invalid'|translate}}")), $scope, $interpolate);
            $scope.email = oldEmail;
            return;
        }
        var arrButton = [$scope.$eval($interpolate("{{'button_ok'|translate}}")), $scope.$eval($interpolate("{{'button_cancel'|translate}}"))];
        if (oldEmail != $scope.email) {
            var token = localStorage[tokenLocalStorage];
            openDialog($scope.$eval($interpolate("{{'button_warning'|translate}}")), $scope.$eval($interpolate("{{'message_setting_change_email'|translate}}")) + $scope.email,
                arrButton, function(r) {
                    if (r == "0") {
                        var requestBody = {
                            "email": $scope.email
                        };
                        $scope.updateSetting(token, requestBody);
                    } else {
                        if (token) {
                            httpRequest.Get('/user/info', { "token": token }).then(function (result) {
                                if (result.status == 1) {
                                    $scope.email = result.userInfo.email;
                                }
                            })
                        }
                    }
                }
            );
        }
    };

    $scope.saveSetting = function () {
        var userInfo = JSON.parse(localStorage[userLocalStorage]);
        var email = userInfo.email;
        var height = userInfo.height;
        var birthday = userInfo.birthday;
        var weight = userInfo.weight;
        if (email != $scope.email) {
            return;
        }

        if (height != ($scope.height / 100).toFixed(2)) {
            return;
        }
        if (birthday != $scope.birthday) {
            return;
        }
        if (weight != $scope.weight) {
            return;
        }
        $scope.language = "pt_BR";  // update Amazon
//        if (!$scope.email) {
//            if ($("#txtEmail").val().trim() == "") {
//                alertWarning($scope.$eval($interpolate("{{'message_person_email_empty'|translate}}")), $scope, $interpolate);
//                return;
//            }
//            alertWarning($scope.$eval($interpolate("{{'message_login_email_invalid'|translate}}")), $scope, $interpolate);
//            return;
//        }

        if (!$scope.goalWeight) {
            alertWarning($scope.$eval($interpolate("{{'message_setting_enter_goal_weight'|translate}}")), $scope, $interpolate);
            return;
        }

        var goalWeight = toFloatByLanguage($scope.goalWeight, $scope.language);
        if (goalWeight >= toFloatByLanguage($scope.weight)) {
            alertWarning($scope.$eval($interpolate("{{'message_setting_enter_current_weight'|translate}}")), $scope, $interpolate);
            return;
        }


        height = ($scope.height / 100).toFixed(2);
        var standardWeightGoal = Math.round(20 * (height * height));
        if (goalWeight < standardWeightGoal) {
            alertWarning($scope.$eval($interpolate("{{'message_setting_health_weight_1'|translate}}")) + standardWeightGoal + $scope.$eval($interpolate("{{'message_setting_health_weight_2'|translate}}")), $scope, $interpolate);
            return;
        }


        var token = localStorage[tokenLocalStorage];
        var requestBody = {
            "email" : $scope.email,
            "height" : $scope.height,
            "gender": $scope.gender == "0" ? 0 : 1,
            "nursing": $scope.nursing,
            "onlyBreastMilk": $scope.onlyBreastMilk,
            "birthday": $scope.birthday,
//            "trackDay": $scope.trackDay,
            "weight" : $scope.weight,
            "trackDay": $scope.meetingDayOfWeek,
            "meetingDayOfWeek": $scope.meetingDayOfWeek,
            "goalWeight": goalWeight,
            "showOnlyPowerFood": $scope.showOnlyPowerFood,
            "dailyPoint": $scope.dailyPoint,
            "weeklyPoint": $scope.weeklyPoint,
            "pointPriority": $scope.pointPriority,
            "rememberEmail": $scope.rememberEmail,
            "language": $scope.language
        };
        var currentDPT = userInfo.dailyPoint;
        var currentWeight = userInfo.currentWeight;
        if ($scope.isFullTime == undefined) {
            $scope.isFullTime = 0;
        }
        if ($scope.isNursing == undefined) {
            $scope.isNursing = 0;
        }
        var defaultDPT = calculateDPT($scope, currentWeight, $scope.gender, $scope.isNursing, $scope.isFullTime);

        if (defaultDPT == $scope.dailyPoint) {
            $scope.dailyPointFlag = 0;
        } else {
            $scope.dailyPointFlag = 1;
        }
        $scope.updateSetting(token, requestBody);

    };

    $scope.updateSetting = function(token, requestBody) {
        if (token) {
            httpRequest.PUT("/user/settings", requestBody, { "token": token }).then(function (result) {
                if (result.status == 1) {
                    //localStorage[language] = $scope.language;
                    $translate.use($scope.language);
                    $translatePartialLoader.addPart('message');
                    $translate.refresh();
                    $scope.$emit("Ctr1LanguageChange", $scope.language);
                    $scope.getSettingInfo(true);

                    alertWarning($scope.$eval($interpolate("{{'message_setting_s'|translate}}")), $scope, $interpolate);
                } else if (result.error.code == "100301") {
                    alertWarning($scope.$eval($interpolate("{{'message_person_email_used'|translate}}")), $scope, $interpolate);
                } else {
                    alertError(result.error, $scope, $interpolate);
                }
            });
        }
    };

    $scope.changeBirthday = function() {
        var d = $scope.birthday.split("/")[0];
        var m = $scope.birthday.split("/")[1];
        var y = $scope.birthday.split("/")[2];
        if (parseInt(d) > 31 || parseInt(d) < 0) {
            $scope.birthday = JSON.parse(localStorage[userLocalStorage]).birthday;
            alertWarning($scope.$eval($interpolate("{{'message_register_birthday'|translate}}")), $scope, $interpolate);
            return;
        }
        if (parseInt(m) > 12 || parseInt(m) < 0) {
            $scope.birthday = JSON.parse(localStorage[userLocalStorage]).birthday;
            alertWarning($scope.$eval($interpolate("{{'message_register_birthday'|translate}}")), $scope, $interpolate);
            return;
        }
        if (parseInt(y) < 1900 || parseInt(y) > 9999) {
            $scope.birthday = JSON.parse(localStorage[userLocalStorage]).birthday;
            alertWarning($scope.$eval($interpolate("{{'message_register_birthday'|translate}}")), $scope, $interpolate);
            return;
        }
        var age = getAge($scope.birthday.split("/")[2] + "-" + $scope.birthday.split("/")[1] + "-" + $scope.birthday.split("/")[0]);
        if (age < 10) {
            $scope.birthday = JSON.parse(localStorage[userLocalStorage]).birthday;
            alertWarning($scope.$eval($interpolate("{{'message_setting_change_birthday_1'|translate}}")), $scope, $interpolate);
            return;
        }
        if ($scope.birthday == JSON.parse(localStorage[userLocalStorage]).birthday) {
            return;
        }
        var currentWeight = JSON.parse(localStorage[userLocalStorage]).currentWeight;
        var dpt = $scope.dailyPoint;
        if ($scope.isFullTime == undefined) {
            $scope.isFullTime = 0;
        }
        if ($scope.isNursing == undefined) {
            $scope.isNursing = 0;
        }
        var newDpt = calculateDPT($scope, currentWeight, $scope.gender, $scope.isNursing, $scope.isFullTime);
        if (parseInt(dpt) != parseInt(newDpt)) {
            var arrButton = [$scope.$eval($interpolate("{{'button_ok'|translate}}")), $scope.$eval($interpolate("{{'button_cancel'|translate}}"))];
            openDialog($scope.$eval($interpolate("{{'button_warning'|translate}}")), $scope.$eval($interpolate("{{'message_setting_change_birthday'|translate}}")) + newDpt,
                arrButton, function(r) {
                    var token = localStorage[tokenLocalStorage];
                    if (r == "0") {
                        var requestBody = {
                            "birthday": $scope.birthday,
                            "dailyPoint":newDpt
                        };
                        $scope.updateSetting(token, requestBody);
                    } else {
                        if (token) {
                            httpRequest.Get('/user/info', { "token": token }).then(function (result) {
                                if (result.status == 1) {
                                    $scope.birthday = result.userInfo.birthday;
                                    $scope.dailyPoint = dpt;
                                }
                            })
                        }
                    }
                }
            );
        } else {
            var token = localStorage[tokenLocalStorage];
            var requestBody = {
                "birthday": $scope.birthday
            };
            $scope.updateSetting(token, requestBody);
        }
    };

    $scope.changeWeight = function() {
        var token = localStorage[tokenLocalStorage];
        if ($scope.weight == JSON.parse(localStorage[userLocalStorage]).weight) {
            return;
        }
        httpRequest.Get('/weights/trackers', { "token": token }).then(function (result) {
            if (result.status == 1) {
                var currentWeight = 0;
                for (var i = 1; i < result.weightTrackers.length; i ++) {
                    if (result.weightTrackers[i].weight > 0) {
                        currentWeight = result.weightTrackers[i].weight;
                        break;
                    } else {

                    }
                }
                var requestBody = {};
                if (currentWeight > 0) {
                    token = localStorage[tokenLocalStorage];
                    requestBody = {
                        "weight": $scope.weight
                    };
                    $scope.updateSetting(token, requestBody);
                } else {
                    var dpt = $scope.dailyPoint;
                    var weight = $scope.weight;
                    if ($scope.isFullTime == undefined) {
                        $scope.isFullTime = 0;
                    }
                    if ($scope.isNursing == undefined) {
                        $scope.isNursing = 0;
                    }
                    var newDpt = calculateDPT($scope, weight, $scope.gender, $scope.isNursing, $scope.isFullTime);
                    if (parseInt(dpt) != parseInt(newDpt)) {
                        token = localStorage[tokenLocalStorage];
                        var arrButton = [$scope.$eval($interpolate("{{'button_ok'|translate}}")), $scope.$eval($interpolate("{{'button_cancel'|translate}}"))];
                        openDialog($scope.$eval($interpolate("{{'button_warning'|translate}}")), $scope.$eval($interpolate("{{'message_setting_change_weight'|translate}}")) + newDpt,
                            arrButton, function(r) {
                                if (r == "0") {
                                    var requestBody = {
                                        "weight": $scope.weight,
                                        "dailyPoint":newDpt
                                    };
                                    $scope.updateSetting(token, requestBody);
                                } else {
                                    if (token) {
                                        httpRequest.Get('/user/info', { "token": token }).then(function (result) {
                                            if (result.status == 1) {
                                                $scope.weight = result.userInfo.weight;
                                            }
                                        })
                                    }
                                }
                            }
                        );
                    } else {
                        requestBody = {
                            "weight": $scope.weight,
                            "dailyPoint":newDpt
                        };
                        token = localStorage[tokenLocalStorage];
                        $scope.updateSetting(token, requestBody);
                    }
                }

            }
        })

    };

    $scope.checkedFemale = function () {
        if ($scope.gender == "0") {
            return;
        }
        var dpt = $scope.dailyPoint;
        var currentWeight = JSON.parse(localStorage[userLocalStorage]).currentWeight;
        var newDpt = calculateDPT($scope, currentWeight, 0, 0, 0);
        if (parseInt(dpt) != parseInt(newDpt)) {
            var arrButton = [$scope.$eval($interpolate("{{'button_ok'|translate}}")), $scope.$eval($interpolate("{{'button_cancel'|translate}}"))];
            openDialog($scope.$eval($interpolate("{{'button_warning'|translate}}")), $scope.$eval($interpolate("{{'message_setting_change_gender'|translate}}")) + newDpt,
                arrButton, function(r) {
                    var token = localStorage[tokenLocalStorage];
                    if (r == "0") {
                        checkedSelect($("#chkFemale")[0]);
                        $scope.gender = $("#chkFemale").attr("value");
                        $scope.clearNursing();
                        var requestBody = {
                            "gender": $scope.gender,
                            "nursing": $scope.nursing == undefined ? 0 : $scope.nursing,
                            "onlyBreastMilk": $scope.onlyBreastMilk == undefined ? 0 : $scope.onlyBreastMilk,
                            "dailyPoint":newDpt
                        };
                        $scope.updateSetting(token, requestBody);
                    } else {
                        if (token) {
                            httpRequest.Get('/user/info', { "token": token }).then(function (result) {
                                $scope.dailyPoint = dpt;
                            })
                        }
                    }
                }
            );
        } else {
            checkedSelect($("#chkFemale")[0]);
            $scope.gender = $("#chkFemale").attr("value");
            $scope.clearNursing();
        }
    };

    $scope.checkedMale = function () {
        if ($scope.gender == "1") {
            return;
        }
        var dpt = $scope.dailyPoint;
        var currentWeight = JSON.parse(localStorage[userLocalStorage]).currentWeight;
        var newDpt = calculateDPT($scope, currentWeight, 1, 0, 0);
        if (parseInt(dpt) != parseInt(newDpt)) {
            var arrButton = [$scope.$eval($interpolate("{{'button_ok'|translate}}")), $scope.$eval($interpolate("{{'button_cancel'|translate}}"))];
            openDialog($scope.$eval($interpolate("{{'button_warning'|translate}}")), $scope.$eval($interpolate("{{'message_setting_change_gender'|translate}}")) + newDpt,
                arrButton, function(r) {
                    var token = localStorage[tokenLocalStorage];
                    if (r == "0") {
                        checkedSelect($("#chkMale")[0]);
                        $scope.gender = $("#chkMale").attr("value");
                        $scope.isNursing = 0;
                        $scope.nursing = 0;
                        $scope.isFullTime = 0;
                        $scope.onlyBreastMilk = 0;
                        $scope.clearNursing();
                        var requestBody = {
                            "gender": $scope.gender,
                            "nursing": $scope.nursing,
                            "onlyBreastMilk": $scope.onlyBreastMilk,
                            "dailyPoint":newDpt
                        };
                        $scope.updateSetting(token, requestBody);
                    } else {
                        if (token) {
                            httpRequest.Get('/user/info', { "token": token }).then(function (result) {
                                $scope.dailyPoint = dpt;
                            })
                        }
                    }
                }
            );
        } else {
            checkedSelect($("#chkMale")[0]);
            $scope.gender = $("#chkMale").attr("value");
            $scope.clearNursing();
        }
    };

    $scope.clearNursing = function () {
        if (isCheckedCustom($("#chkFullTime"))) {
            checkedChanged($("#chkFullTime")[0]);
            $scope.changedFullTime(false);
        }
        if (isCheckedCustom($("#chkNursing"))) {
            checkedChanged($("#chkNursing")[0]);
            $scope.changedNursing(false);
        } else {
            $scope.isNursing = 0;
        }
    };

    $scope.changedNursing = function (isAlert) {
        var dpt = $scope.dailyPoint;
        var newDpt = "";
        var currentWeight = JSON.parse(localStorage[userLocalStorage]).currentWeight;
        var arrButton = [$scope.$eval($interpolate("{{'button_ok'|translate}}")), $scope.$eval($interpolate("{{'button_cancel'|translate}}"))];
        if (isCheckedCustom($("#chkNursing"))) {
//            $scope.isNursing = 0;
//            $scope.nursing = 0;
            if (isAlert) {
                newDpt = calculateDPT($scope, currentWeight, 0, 0, 0);
                if (parseInt(dpt) != parseInt(newDpt)) {
                    openDialog($scope.$eval($interpolate("{{'button_warning'|translate}}")), $scope.$eval($interpolate("{{'message_setting_change_nursing'|translate}}")) + newDpt,
                        arrButton, function(r) {
                            var token = localStorage[tokenLocalStorage];
                            if (r == "0") {
                                if (token) {
                                    if (isCheckedCustom($("#chkFullTime"))) {
                                        $scope.isFullTime = 0;
                                        $scope.onlyBreastMilk = 0;
                                        checkedChanged($("#chkFullTime")[0]);
                                    }
                                    checkedChanged($("#chkNursing")[0]);
                                    $scope.isNursing = 0;
                                    $scope.nursing = 0;
                                    var requestBody = {
                                        "gender": $scope.gender,
                                        "nursing": $scope.nursing,
                                        "onlyBreastMilk": $scope.onlyBreastMilk,
                                        "dailyPoint":newDpt
                                    };
                                    $scope.updateSetting(token, requestBody);
                                }
                            } else {
                                if (token) {
                                    httpRequest.Get('/user/info', { "token": token }).then(function (result) {
                                        $scope.dailyPoint = dpt;
                                        $scope.isNursing = 1;
                                        $scope.nursing = 1;
                                    })
                                }
                            }
                        }
                    );
                } else {
                    if (isCheckedCustom($("#chkFullTime"))) {
                        $scope.changedFullTime(true);
                    }
                    checkedChanged($("#chkNursing")[0]);
                    $scope.isNursing = 0;
                    $scope.nursing = 0;
                }
            }
        } else {
            if (isAlert) {
                newDpt = calculateDPT($scope, currentWeight, 0, 1, 0);
                if (parseInt(dpt) != parseInt(newDpt)) {
                    openDialog($scope.$eval($interpolate("{{'button_warning'|translate}}")), $scope.$eval($interpolate("{{'message_setting_change_nursing'|translate}}")) + newDpt,
                        arrButton, function(r) {
                            var token = localStorage[tokenLocalStorage];
                            if (r == "0") {
                                if (token) {
                                    if (isCheckedCustom($("#chkFullTime"))) {
                                        $scope.changedFullTime(false);
                                    }
                                    checkedChanged($("#chkNursing")[0]);
                                    $scope.isNursing = 1;
                                    $scope.nursing = 1;
                                    var requestBody = {
                                        "gender": $scope.gender,
                                        "nursing": $scope.nursing,
                                        "onlyBreastMilk": $scope.onlyBreastMilk,
                                        "dailyPoint":newDpt
                                    };
                                    $scope.updateSetting(token, requestBody);
                                }
                            } else {
                                if (token) {
                                    httpRequest.Get('/user/info', { "token": token }).then(function (result) {
                                        $scope.dailyPoint = dpt;
                                        $scope.isNursing = 0;
                                        $scope.nursing = 0;
                                    })
                                }
                            }
                        }
                    );
                } else {
                    if (isCheckedCustom($("#chkFullTime"))) {
                        $scope.changedFullTime(true);
                    }
                    checkedChanged($("#chkNursing")[0]);
                    $scope.isNursing = 1;
                    $scope.nursing = 1;
                }
            }

        }
    };

    $scope.changedFullTime = function (isAlert) {
        var dpt = $scope.dailyPoint;
        var newDpt = "";
        var currentWeight = JSON.parse(localStorage[userLocalStorage]).currentWeight;
        var arrButton = [$scope.$eval($interpolate("{{'button_ok'|translate}}")), $scope.$eval($interpolate("{{'button_cancel'|translate}}"))];
        if (isCheckedCustom($("#chkFullTime"))) {
            if (isAlert) {
                newDpt = calculateDPT($scope, currentWeight, 0, 1, 0);
                if (parseInt(dpt) != parseInt(newDpt)) {
                    openDialog($scope.$eval($interpolate("{{'button_warning'|translate}}")), $scope.$eval($interpolate("{{'message_setting_change_nursing'|translate}}")) + newDpt,
                        arrButton, function(r) {
                            var token = localStorage[tokenLocalStorage];
                            if (r == "0") {
                                if (token) {
                                    checkedChanged($("#chkFullTime")[0]);
                                    $scope.isFullTime = 0;
                                    $scope.onlyBreastMilk = 0;
                                    var requestBody = {
                                        "gender": $scope.gender,
                                        "nursing": $scope.nursing,
                                        "onlyBreastMilk": $scope.onlyBreastMilk,
                                        "dailyPoint":newDpt
                                    };
                                    $scope.updateSetting(token, requestBody);
                                }
                            } else {
                                if (token) {
                                    httpRequest.Get('/user/info', { "token": token }).then(function (result) {
                                        $scope.dailyPoint = dpt;
                                        $scope.isFullTime = 1;
                                        $scope.onlyBreastMilk = 1;
                                    })
                                }
                            }
                        }
                    );
                } else {
                    checkedChanged($("#chkFullTime")[0]);
                    $scope.isFullTime = 0;
                    $scope.onlyBreastMilk = 0;
                }

            }
        } else {
            if (isAlert) {
                newDpt = calculateDPT($scope, currentWeight, 0, 1, 1);
                if (parseInt(dpt) != parseInt(newDpt)) {
                    openDialog($scope.$eval($interpolate("{{'button_warning'|translate}}")), $scope.$eval($interpolate("{{'message_setting_change_nursing'|translate}}")) + newDpt,
                        arrButton, function(r) {
                            var token = localStorage[tokenLocalStorage];
                            if (r == "0") {
                                if (token) {
                                    checkedChanged($("#chkFullTime")[0]);
                                    $scope.isFullTime = 1;
                                    $scope.onlyBreastMilk = 1;
                                    var requestBody = {
                                        "gender": $scope.gender,
                                        "nursing": $scope.nursing,
                                        "onlyBreastMilk": $scope.onlyBreastMilk,
                                        "dailyPoint":newDpt
                                    };
                                    $scope.updateSetting(token, requestBody);
                                }
                            } else {
                                if (token) {
                                    httpRequest.Get('/user/info', { "token": token }).then(function (result) {
                                        $scope.dailyPoint = dpt;
                                        $scope.isFullTime = 0;
                                        $scope.onlyBreastMilk = 0;
                                    })
                                }
                            }
                        }
                    );
                } else {
                    checkedChanged($("#chkFullTime")[0]);
                    $scope.isFullTime = 1;
                    $scope.onlyBreastMilk = 1;
                }
            }
        }
    };

    $scope.clearGoalNoNum = function () {
        $scope.goalWeight = limitDecimalDigitsByLanguage($scope.goalWeight, 3, 1, $scope.language);
    };

    $scope.checkDailyPoint = function () {
        var userInfo = JSON.parse(localStorage[userLocalStorage]);
        if ($scope.isFullTime == undefined) {
            $scope.isFullTime = 0;
        }
        if ($scope.isNursing == undefined) {
            $scope.isNursing = 0;
        }
        var currentDailyPoint = calculateDPT($scope, userInfo.currentWeight, $scope.gender, $scope.isNursing, $scope.isFullTime);

        $scope.dailyPoint = $scope.dailyPoint.replace(/[^\d]/g, '');
        if ($scope.dailyPoint != null && $scope.dailyPoint != "") {
            $scope.dailyPoint = parseInt($scope.dailyPoint);
        }
        var nurseType = "";
        if ($scope.nursing == 1) {
            nurseType = 'P';
        }
        if ($scope.onlyBreastMilk == 1) {
            nurseType = 'F';
        }
        var DPTArrange = checkWeightLossDPT(currentDailyPoint, nurseType, userInfo.maintance);
        if (currentDailyPoint < DPTArrange[0] || currentDailyPoint > DPTArrange[1]) {
            currentDailyPoint = DPTArrange[0];
        }
        if ($scope.dailyPoint < DPTArrange[0] || $scope.dailyPoint > DPTArrange[1]) {
            $scope.dailyPoint = currentDailyPoint;
        }
        if ($scope.dailyPoint == $scope.logicDpt) {
            $scope.dailyPointFlag = 0;
        } else {
            $scope.dailyPointFlag = 1;
        }


    };

    $scope.checkWeeklyPoint = function () {
        $scope.weeklyPoint = $scope.weeklyPoint.replace(/[^\d]/g, '');
        if ($scope.weeklyPoint != null && $scope.weeklyPoint != "") {
            $scope.weeklyPoint = parseInt($scope.weeklyPoint);
        }
        if ($scope.weeklyPoint >= 50 || $scope.weeklyPoint < 0) $scope.weeklyPoint = 49;
        if ($scope.weeklyPoint == 49) {
            $scope.weeklyPointFlag = 0;
        } else {
            $scope.weeklyPointFlag = 1;
        }
    };

    $scope.languageChange = function () {
        var goalWeight = toFloatByLanguage($scope.goalWeight, $scope.languageLast);
        $scope.goalWeight = toFloatFormatString(goalWeight, $scope.language);
        $scope.languageLast = $scope.language;
    };

    window.onresize = function () {
        if ($("#bodyData").length > 0) {
            var winHeight = getWindowHeight();
            var titleHeight = $("#head").outerHeight();
            $(".myProgress_body").height(winHeight - titleHeight);
//            alert(winHeight - titleHeight);
        }
    };
    window.onresize();
});

app.controller('remindersController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $routeParams, $interpolate) {
    $scope.$watch('$viewContentLoaded', function () {
        $scope.favModel = [
            {id:1,name:"Desativar"},
            {id:2,name:"Perguntar"},
            {id:3,name:"Sempre"}
        ];
        var userInfo = JSON.parse(localStorage[userLocalStorage]);
        var meetingDay = 0;
        if (userInfo.meetingDay - 1 == 0) {
            meetingDay = 7;
        } else {
            meetingDay = userInfo.meetingDay - 1;
        }
        $scope.trackDay = getDay(userInfo.trackDay);
        $scope.meetingDay = getDay(meetingDay);
        $scope.getReminderSetting();

//        if (localStorage[reminderSettingLocalStorage]) {
//            var reminder = JSON.parse(localStorage[reminderSettingLocalStorage]);
//            if (reminder.favoritePrompt == 1) {
//                $scope.title = "Off";
//            } else if (reminder.favoritePrompt == 2) {
//                $scope.title = "Ask";
//            } else {
//                $scope.title = "Always";
//            }
//        } else {
//
//        }

    });

    $scope.favSelected = function() {

    };

    $scope.showMainBar = function () {
        localStorage.removeItem(reminderSettingLocalStorage);
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

    $scope.changedWTReminder = function () {
        if ($scope.wtReminder) {
            $scope.wtReminder = false;
            $scope.wtAccept = null;
        } else {
            $scope.wtReminder = true;
            $scope.wtAccept = true;
        }
    };

    $scope.changedMTReminder = function () {
        if ($scope.mtReminder) {
            $scope.mtReminder = false;
            $scope.mtAccept = null;

        } else {
            $scope.mtReminder = true;
            $scope.mtAccept = true;
        }
    };

    $scope.go2FavReminder = function() {
        $location.path("/favReminder");

    };

    $scope.backToReminders = function () {

        $location.path("/reminders");
    };

    $scope.getReminderSetting = function() {
        $(".settingClass").show();
        $(".settingSelect").addClass("hideClass");
        var token = localStorage[tokenLocalStorage];
        if (token) {
            httpRequest.Get("/user/reminder/settings/", {"token": token}).then(function (result) {
                if (result.status == 1) {
                    var reminder = result.reminder;
                    $scope.fav = reminder.favoritePrompt;
                    for (var k = 0; k < $scope.favModel.length; k++) {
                        if ($scope.favModel[k].id == reminder.favoritePrompt) {
                            $scope.showFavoritesPr = $scope.favModel[k].name;
                        }
                    }
                    if (reminder.weightEnabled == 1) {
                        $scope.wtReminder = true;
                        $scope.wtAccept = true;
                    } else {
                        $scope.wtAccept = false;
                    }
                    if (reminder.meetingEnabled == 1) {
                        $scope.mtReminder = true;
                        $scope.mtAccept = true;
                    } else {
                        $scope.mtAccept = null;
                    }
                    localStorage[reminderSettingLocalStorage] = JSON.stringify(result.reminder);
                } else {
                    alertError(result.error, $scope, $interpolate);
                }
            });
        }
    };

    $scope.updateReminderSetting = function() {
        var token = localStorage[tokenLocalStorage];
        var requestBody = JSON.parse(localStorage[reminderSettingLocalStorage]);
        if ($scope.fav != undefined) {
            requestBody.favoritePrompt = $scope.fav;
        }
        requestBody.weightEnabled = $scope.wtAccept ? 1 : 0;
        requestBody.meetingEnabled = $scope.mtAccept ? 1 : 0;
        if (token) {
            httpRequest.PUT("/user/reminder/settings/", requestBody, {"token": token}).then(function (result) {
                if (result.status == 1) {
                    alertWarning($scope.$eval($interpolate("{{'message_setting_s'|translate}}")), $scope, $interpolate);
                    var userInfo = JSON.parse(localStorage[userLocalStorage]);
                    userInfo.favReminder = $scope.fav;
                    localStorage[userLocalStorage] = JSON.stringify(userInfo);
                    $scope.getReminderSetting();
//                    localStorage.removeItem(reminderSettingLocalStorage);
                } else {
                    alertError(result.error, $scope, $interpolate);
                }
            });
        }
    };

//    window.onresize = function () {
//        if ($("#bodyData").length > 0) {
//            var winHeight = getWindowHeight();
//            var titleHeight = $("#header").outerHeight();
//            $(".myProgress_body").height(winHeight - titleHeight);
//        }
//    };
//    window.onresize();

});