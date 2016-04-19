function loginUserInfo(userInfo,reminder) {
    this.birthday = userInfo.userBaseInfo.birthday;
    this.gender = userInfo.userBaseInfo.gender;
    this.firstName = userInfo.userBaseInfo.firstName;
    this.lastName = userInfo.userBaseInfo.lastName;
    this.email = userInfo.userBaseInfo.email;
    this.language = userInfo.userBaseInfo.language;
    this.firstSimpleStartDate = userInfo.userBaseInfo.firstSimpleStartDate;
    this.cpf = userInfo.userBaseInfo.cpf;
    this.gettingStartFinishDate = userInfo.userBaseInfo.gettingStartFinishDate;
    this.nursing = userInfo.userBaseInfo.nursing;
    this.onlyBreastMilk = userInfo.userBaseInfo.onlyBreastMilk;
    this.askedSelectWeightMode = userInfo.userBaseInfo.askedSelectWeightMode;
    this.dptChanged = userInfo.userBaseInfo.dptChanged;
    this.logicDpt = userInfo.userBaseInfo.logicDpt;

    this.mode = userInfo.userTrackingInfo.mode;
    this.weekDate = userInfo.userTrackingInfo.weekDate;
    this.trackDay = userInfo.userTrackingInfo.trackDay;
    this.firstLoseWeight = userInfo.userTrackingInfo.firstLoseWeight;
    this.dailyPoint = userInfo.userTrackingInfo.dailyPoint;
    this.weeklyPoint = userInfo.userTrackingInfo.weeklyPoint;
    this.expirationDate = userInfo.userTrackingInfo.expirationDate;
    this.goalWeight = userInfo.userTrackingInfo.goalWeight;
    this.weight = userInfo.userTrackingInfo.weight;
    this.height = userInfo.userTrackingInfo.height;
    this.currentWeight = userInfo.userTrackingInfo.currentWeight;

    this.pointPriority = userInfo.userTrackingInfo.pointPriority;
    this.meetingDay = userInfo.userTrackingInfo.meetingDayOfWeek;
    this.rememberEmail = userInfo.userTrackingInfo.rememberEmail;

    this.expressReason = userInfo.userTrackingInfo.expressReason;
    this.maintance = userInfo.userTrackingInfo.maintance;

    this.favReminder = "";
    if (reminder && reminder != "") {
        this.favReminder = reminder.favoritePrompt;
    }

}

function logout() {
    sessionStorage.clear();
    var localRemember = generateLocalRemember();
    localStorage.clear();
    if (localRemember) {
        localStorage[loginLocalStorage] = JSON.stringify(localRemember);
    }
    location.replace(location.protocol + "//" + location.host + location.pathname);
}

function generateLocalRemember() {
    if (localStorage[userLocalStorage]) {
        var email = "";
        var userInfo = JSON.parse(localStorage[userLocalStorage]);
        if (1 == userInfo.rememberEmail) {
            email = userInfo.email;
        }
        var language = userInfo.language;
        return { "lang": language, "email": email };
    }
    return null;
}

function login(email, password, httpRequest, $scope, $location, $window, $translate, $translatePartialLoader, $interpolate,$route,$timeout) {
    var requestData = JSON.stringify({"data":{ "email": email, "password": password, "deviceId": "", "deviceType": "", "deviceOS": "" }});
    httpRequest.POST('/authenticate', requestData).then(function (result) {
        if(result.errcode == 0){
            $window.location.href = "#/main";
        }else{

        }
    });
}

function gotoAcode($window){
    $window.location.href = "#/activationCode/1";
}

function reminderMsg(token,showDialog,httpRequest, $scope, $window, $interpolate,$route,$location) {
    var token = localStorage[tokenLocalStorage];
    httpRequest.Get('/user/reminder', { "token": token }).then(function (result) {
        if (result.status) {
            if (null != result.reminders && result.reminders.weight.isFire == 1) {
                showDialog = 1 ;
                var arrButton = [$scope.$eval($interpolate("{{'button_ok'|translate}}"))];
                openDialog($scope.$eval($interpolate("{{'button_warning'|translate}}")), $scope.$eval($interpolate("{{'message_register_today'|translate}}")),
                    arrButton, function (r) {
                        if (r == 0) {
                            $window.location.href = "#/tracking";
//                                            $location.path("/tracking");
                            if (null != result.reminders && result.reminders.meeting.isFire == 1) {
                                showDialog = 1 ;
                                var arrButton = [$scope.$eval($interpolate("{{'button_ok'|translate}}"))];
                                openDialog($scope.$eval($interpolate("{{'button_warning'|translate}}")), $scope.$eval($interpolate("{{'message_register_tomorrow'|translate}}")),
                                    arrButton, function (r) {
                                        if (r == 0) {
                                            changeMaintain(httpRequest, $scope, $window, $interpolate,$route);
                                        }
                                    });
                            } else {
                                changeMaintain(httpRequest, $scope, $window, $interpolate,$route);
                            }
                        }
                    });
            }
            if (null != result.reminders && result.reminders.meeting.isFire == 1 && result.reminders.weight.isFire != 1) {
                showDialog = 1 ;
                var arrButton = [$scope.$eval($interpolate("{{'button_ok'|translate}}"))];
                openDialog($scope.$eval($interpolate("{{'button_warning'|translate}}")), $scope.$eval($interpolate("{{'message_register_tomorrow'|translate}}")),
                    arrButton, function (r) {
                        if (r == 0) {
                            changeMaintain(httpRequest, $scope, $window, $interpolate,$route);
                        }
                    });
            }
        } else if (result.status == 0) {
            if (result.error.code == "100") {
                alertWarning($scope.$eval($interpolate("{{'button_warning'|translate}}")), $scope, $interpolate);
            } else if (result.error.code == "600") {
                alertWarning($scope.$eval($interpolate("{{'button_warning'|translate}}")), $scope, $interpolate);
            }
        }
    });
}

function changeMaintain( httpRequest, $scope, $window, $interpolate,$route) {
    var userInfo = JSON.parse(localStorage[userLocalStorage]);
    var token = localStorage[tokenLocalStorage];
    if (0 == userInfo.askedSelectWeightMode && 0 == userInfo.maintance) {
        var arrButton = [$scope.$eval($interpolate("{{'button_tracker_maintain'|translate}}")),
            $scope.$eval($interpolate("{{'button_tracker_reset_goal'|translate}}"))];
        openDialog(
            $scope.$eval($interpolate("{{'button_warning'|translate}}")),
            $scope.$eval($interpolate("{{'message_weight_details_15_1'|translate}}")),
            arrButton, function (r) {
                if (r == 1) {
                    $window.location.href = "#/trackGoalWeight";
                } else {
                    var requestBody = {
                        "maintance":1,
                        "askedSelectWeightMode" : 1
                    };
                    httpRequest.PUT('/user/settings', requestBody, { "token": token }).then(function (result) {
                        if (result.status) {
                            var userInfo = JSON.parse(localStorage[userLocalStorage]);
                            userInfo.maintance = 1;
                            userInfo.askedSelectWeightMode = 1;
                            localStorage[userLocalStorage] = JSON.stringify(userInfo);
                            if (Modes.Tracking == userInfo.mode) {
//                                window.location.reload();
//                                $window.location.href = "#/pointsIndex";
                                $route.reload();
                            }
                        }
                    });
                }
            });
    }
}