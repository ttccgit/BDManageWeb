var flag = 0;
var isFromLogin = 1;
app.controller('loginController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $translate, $translatePartialLoader, $interpolate, $route,$timeout) {
    $scope.$watch('$viewContentLoaded', function () {
        if (localStorage[loginLocalStorage] != null) {
            var loginConfig = JSON.parse(localStorage[loginLocalStorage]);
            $scope.email = loginConfig.email;
        }
        if (localStorage[registerLocalStorage] != null) {
            var registerInfo = JSON.parse(localStorage[registerLocalStorage]);
            if (registerInfo.cpf != "" || registerInfo.email != "") {
                $scope.cpf = registerInfo.cpf;
                $scope.email = registerInfo.email;
            }
        }

        if (localStorage[registerLocalStorage] == null) {
            var registerInfo = new RegisterInfo();
            localStorage[registerLocalStorage] = JSON.stringify(registerInfo);
        }
    });

    $scope.checkCPF = function (cpf) {
        if (!cpf) {
            alertWarning($scope.$eval($interpolate("{{'message_register_cpf'|translate}}")), $scope, $interpolate);
            return;
        }
        if (validationCPF(cpf, $scope, $interpolate)) {

            var requestBody = JSON.stringify({ "cpf": cpf });
            httpRequest.POST('/check-cpf', requestBody).then(function (result) {
                if (result.status == 1) {
                    var registerInfo = new RegisterInfo();
                    if (result.user.id > 0) {
                        var userInfo = new UserInfo();
                        userInfo.InitUserInfo(result.user);
                        localStorage[registerLocalStorage] = JSON.stringify(userInfo.userBaseInfo);
                        alertWarning("Olá " + result.user.firstName + ", " + $scope.$eval($interpolate("{{'message_restPassword_registe'|translate}}")), $scope, $interpolate);
                    } else {
                        registerInfo.cpf = cpf;
                        localStorage[registerLocalStorage] = JSON.stringify(registerInfo);
                    }
                    $location.path("/activationCode");
                } else if (result.status == 0) {
                    if (result.error.code == "100101") {
                        alertWarning($scope.$eval($interpolate("{{'message_login_register'|translate}}")), $scope, $interpolate);
                    } else {
                        alertWarning($scope.$eval($interpolate("{{'message_login_cpf'|translate}}")), $scope, $interpolate);
                    }
                }
            });
        }

    };

    $scope.verifyCPFFormat = function (cpf, $event) {
        if ("" != cpf && undefined != cpf) {
            validationCPFFormat(cpf, $scope, $event, $window);
        }
    };

    $scope.login = function () {

        login($scope.email, $scope.password, httpRequest, $scope, $location, $window, $translate, $translatePartialLoader, $interpolate, $route,$timeout);

    };

    $scope.checkCPFAndCode = function() {
        if (!$scope.cpf) {
            alertWarning($scope.$eval($interpolate("{{'message_register_cpf'|translate}}")), $scope, $interpolate);
            return;
        }
        if (validationCPF($scope.cpf, $scope, $interpolate)) {
            var requestBody = JSON.stringify({"cpf": $scope.cpf, "checkCode": $scope.emailCode, "newPassword": "" });
            httpRequest.POST('/cpf-user', requestBody).then(function (result) {
                if (result.status == 1) {
                    var cpfAndCheckCode = {"cpf": $scope.cpf, "checkCode": $scope.emailCode};
                    localStorage[cpfCheckCode] = JSON.stringify(cpfAndCheckCode);
                    localStorage[cpfUser] = JSON.stringify(result.user);
                    $location.path("/resetPassword");
                } else {
                    alertWarning($scope.$eval($interpolate("{{'label_restPWD_cpf_auth'|translate}}")), $scope, $interpolate);
                }
            });
        }
    };

    $scope.resetPassword = function () {
        var cpfAndCheckCode = JSON.parse(localStorage[cpfCheckCode]);
        var user = JSON.parse(localStorage[cpfUser]);
        if (!user) {
            return;
        }
        if (cpfAndCheckCode) {
            if (!cpfAndCheckCode.cpf) {
                alertWarning($scope.$eval($interpolate("{{'message_register_cpf'|translate}}")), $scope, $interpolate);
                return;
            }
            if (validationCPF(cpfAndCheckCode.cpf, $scope, $interpolate)) {
                if (!$scope.password || !$scope.rePassword) {
                    alertWarning($scope.$eval($interpolate("{{'message_person_password_null'|translate}}")), $scope, $interpolate);
                    return;
                } else if ($scope.password.length < 8) {
                    alertWarning($scope.$eval($interpolate("{{'message_person_password'|translate}}")), $scope, $interpolate);
                    return;
                } else if ($scope.password.length > 20) {
                    alertWarning($scope.$eval($interpolate("{{'message_person_password_maximum'|translate}}")), $scope, $interpolate);
                    return;
                } else if (!isPassword($scope.password)) {
                    alertWarning($scope.$eval($interpolate("{{'message_person_letter'|translate}}")), $scope, $interpolate);
                    return;
                } else if ($scope.password != $scope.rePassword) {
                    alertWarning($scope.$eval($interpolate("{{'message_person_password_same'|translate}}")), $scope, $interpolate);
                    return;
                } else if (isContainStr($scope.password, user.firstName) || isContainStr($scope.password, user.lastName)) {
                    alertWarning($scope.$eval($interpolate("{{'message_person_password_contain'|translate}}")), $scope, $interpolate);
                    return;
                } else if (isContainStr($scope.password, user.email)) {
                    alertWarning($scope.$eval($interpolate("{{'message_person_password_email'|translate}}")), $scope, $interpolate);
                    return;
                } else {
                    var requestBody = JSON.stringify({"cpf": cpfAndCheckCode.cpf, "checkCode": cpfAndCheckCode.checkCode, "newPassword": $scope.password  });
                    httpRequest.POST('/reset-forgotPassword', requestBody).then(function (result) {
                        if (result.status == 1) {
                            var arrButton = [$scope.$eval($interpolate("{{'button_ok'|translate}}"))];
                            openDialog($scope.$eval($interpolate("{{'button_warning'|translate}}")), $scope.$eval($interpolate("{{'message_setting_s'|translate}}")), arrButton,
                                function (r) {
                                    if (r == "0") {
                                        localStorage.removeItem(cpfCheckCode);
                                        localStorage.removeItem(cpfUser);
                                        $window.location.href = "#/login";
                                    }
                                });
                        } else {
                            if (result.error.code == "100601") {
                                alertWarning($scope.$eval($interpolate("{{'message_login_cpf'|translate}}")), $scope, $interpolate);
                            } else if (result.error.code == "100602") {
                                alertWarning($scope.$eval($interpolate("{{'message_restPassword_related'|translate}}")), $scope, $interpolate);
                            } else if (result.error.code == "100603") {
                                alertWarning($scope.$eval($interpolate("{{'message_restPassword_used'|translate}}")), $scope, $interpolate);
                            } else if (result.error.code == "100604") {
                                alertWarning($scope.$eval($interpolate("{{'message_restPassword_url'|translate}}")), $scope, $interpolate);
                            }
                            else {
                                alertWarning($scope.$eval($interpolate("{{'message_person_cpf_email_not'|translate}}")), $scope, $interpolate);
                            }
                        }
                    });
                }
            }
        }


    }
});

app.controller('mainBarController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $interpolate) {
    if (localStorage[userLocalStorage] != null) {
        var userInfo = JSON.parse(localStorage[userLocalStorage]);
        var gender = userInfo.gender;
        var genderImg = document.getElementById("gender");
        var genderImg1 = document.getElementById("gender1");
        if (gender == 0) {
            genderImg.src = "image/icon/icon_hello_female.png";
            genderImg1.src = "image/icon/icon_hello_female.png";
            var name = userInfo.firstName;
            $("#txtMenuName").html(name);
            $("#txtMenuName1").html(name);
        } else {
            genderImg.src = "image/icon/icon_hello_male.png";
            genderImg1.src = "image/icon/icon_hello_male.png";
            var name = userInfo.firstName;
            $("#txtMenuName").html(name);
            $("#txtMenuName1").html(name);

        }
    }
    $scope.logOut = function () {
        logout();
    }
});

app.controller('retrieveEmailController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $interpolate) {
    $scope.retrieveEmail = function (cpf) {
        if (!cpf) {
            alertWarning($scope.$eval($interpolate("{{'message_register_cpf'|translate}}")), $scope, $interpolate);
            return;
        }
        if (validationCPF(cpf, $scope, $interpolate)) {
            var requestData = JSON.stringify({ "cpf": $scope.cpf });
            httpRequest.POST('/retrieve-email', requestData).then(function (result) {
                if (result.status == 0) {
                    if (result.error.code == "100701") {
                        alertWarning($scope.$eval($interpolate("{{'message_login_cpf'|translate}}")), $scope, $interpolate);
                    } else {
                        alertWarning($scope.$eval($interpolate("{{'message_register_email_not_exist'|translate}}")), $scope, $interpolate);
                    }
                } else {
//                    var userInfo = new RegisterInfo();
                    if (localStorage[loginLocalStorage] == undefined) {
                        localStorage[loginLocalStorage] = JSON.stringify({ "lang": "", "email": result.email });
                    } else {
                        var loginConfig = JSON.parse(localStorage[loginLocalStorage]);
                    }
                    loginConfig.email = result.email;
                    localStorage.clear();
                    localStorage[loginLocalStorage] = JSON.stringify(loginConfig);
                    $location.path("/login");
                }
            });
        }
    }

    $scope.verifyCPFFormat = function (cpf, $event) {
        validationCPFFormat(cpf, $scope, $event, $window);
    };

});

app.controller('retrievePasswordController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $interpolate) {

    $scope.retrievePassword = function (cpf) {
        if (!cpf) {
            alertWarning($scope.$eval($interpolate("{{'message_register_cpf'|translate}}")), $scope, $interpolate);
            return;
        }
        if (validationCPF(cpf, $scope, $interpolate)) {
            var requestData = JSON.stringify({ "cpf": $scope.cpf });
            httpRequest.POST('/retrieve-password', requestData).then(function (result) {
                if (!result.status) {
                    if (result.error.code == "100605") {
                        alertWarning("Olá " + result.name + ", " + $scope.$eval($interpolate("{{'message_restPassword_registe'|translate}}")), $scope, $interpolate);
                    } else {
                        alertWarning($scope.$eval($interpolate("{{'message_login_cpf'|translate}}")), $scope, $interpolate);
                    }
                } else {
//                    alertWarning("mail sended!", $scope, $interpolate);
                    alertWarning($scope.$eval($interpolate("{{'forgot_pwd_send_mail'|translate}}")), $scope, $interpolate);
                }
            });
        }
    };

    $scope.verifyCPFFormat = function (cpf, $event) {
        validationCPFFormat(cpf, $scope, $event, $window);
    };
});

