app.controller('createPasswordController', function ($rootScope, $scope, httpRequest, analytics, $location, $interpolate) {

    $scope.$watch('$viewContentLoaded', function () {
        if (localStorage[registerLocalStorage] == null) {
            $location.path("/login");
            return;
        }
        var registerInfo = JSON.parse(localStorage[registerLocalStorage]);
        $scope.cpf = registerInfo.cpf;
    });

    $scope.goToPersonal = function () {
        var registerInfo = JSON.parse(localStorage[registerLocalStorage]);
        if (!$scope.password || !$scope.rePassword) {
            alertWarning($scope.$eval($interpolate("{{'message_person_password_null'|translate}}")), $scope, $interpolate);
            return;
        }
        if ($scope.password.length < 8) {
            alertWarning($scope.$eval($interpolate("{{'message_person_password'|translate}}")), $scope, $interpolate);
            return;
        }
        if ($scope.password.length > 20) {
            alertWarning($scope.$eval($interpolate("{{'message_person_password_maximum'|translate}}")), $scope, $interpolate);
            return;
        }
        if (!isPassword($scope.password)) {
            alertWarning($scope.$eval($interpolate("{{'message_person_letter'|translate}}")), $scope, $interpolate);
            return;
        }
        if ($scope.password != $scope.rePassword) {
            alertWarning($scope.$eval($interpolate("{{'message_person_password_same'|translate}}")), $scope, $interpolate);
        } else {
            httpRequest.Request('POST', '/check-cpf', {"cpf":registerInfo.cpf}).then(function (result) {
                if (result.status != 0) {
                    if (isContainStr($scope.password, result.user.firstName)
                        || isContainStr($scope.password, result.user.lastName)) {
                        alertWarning($scope.$eval($interpolate("{{'message_person_password_contain'|translate}}")), $scope, $interpolate);
                        return;
                    } else if (isContainStr($scope.password, result.user.email)) {
                        alertWarning($scope.$eval($interpolate("{{'message_person_password_email'|translate}}")), $scope, $interpolate);
                        return;
                    }
                    registerInfo.password = $scope.password;
                    localStorage[registerLocalStorage] = JSON.stringify(registerInfo);
                    $location.path("/personalBasicInfo");
                }
            });

        }

    }
});

app.controller('activationCodeController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $routeParams, $translate, $translatePartialLoader, $interpolate) {
    $scope.from = $routeParams.from;
    $scope.$watch('$viewContentLoaded', function () {
        if ((!$scope.from && localStorage[registerLocalStorage] == null) || ($scope.from && sessionStorage[loginForExpiredLocalStorage] == null)) {
            $location.path("/login");
            return;
        }

        var registerInfo = localStorage[registerLocalStorage] ? JSON.parse(localStorage[registerLocalStorage]) : {};
        if (registerInfo.firstName && registerInfo.firstName != "") {
            $scope.ifShowName = 1;
            $scope.name = registerInfo.firstName;
        } else {
            $scope.ifShowName = 0;
//            $scope.name = "Obrigado por fazer…";
        }

        if (registerInfo.activationCode && registerInfo.activationCode != "" && !$scope.from) {
            $scope.actCode = registerInfo.activationCode;
        }
    });

    $scope.checkActCode = function (actCode) {
        if (!actCode) {
            alertWarning($scope.$eval($interpolate("{{'message_person_activation'|translate}}")), $scope, $interpolate);
            return;
        }
        if (isInvalidActCode(actCode)) {
            if ($scope.from && sessionStorage[loginForExpiredLocalStorage]) {
                var loginForExpired = JSON.parse(sessionStorage[loginForExpiredLocalStorage]);
                loginForExpired.password = base64decode(loginForExpired.password);
                var requestData = JSON.stringify({ "email": loginForExpired.email, "activationCode": actCode, "deviceId": "", "deviceType": "", "deviceOS": "" });
                httpRequest.POST('/bind-activation-code', requestData).then(function (result) {
                    if (result.status) {
                        login(loginForExpired.email, loginForExpired.password, httpRequest, $scope, $location, $window, $translate, $translatePartialLoader, $interpolate);
                    }
                    else {
                        if (result.error.code == "100203") {
                            alertWarning($scope.$eval($interpolate("{{'message_person_new_activation'|translate}}")), $scope, $interpolate);
                            return;
                        } else if (result.error.code == "100201") {
                            alertWarning($scope.$eval($interpolate("{{'message_person_activation_exist'|translate}}")), $scope, $interpolate);
                            return;
                        } else if (result.error.code == "100202") {
                            alertWarning($scope.$eval($interpolate("{{'message_person_activation_expired'|translate}}")), $scope, $interpolate);
                            return;
                        } else if (result.error.code == "100204") {
                            alertWarning($scope.$eval($interpolate("{{'message_person_activation_invalid_you'|translate}}")), $scope, $interpolate);
                            return;
                        }
                    }
                });
            }
            else {
                var registerInfo = JSON.parse(localStorage[registerLocalStorage]);
                var requestBody = { "cpf": registerInfo.cpf, "activationCode": actCode };
                httpRequest.Request('POST', '/check-activation-code', requestBody).then(function (result) {
                    if (result.status == 0) {
                        if (result.error.code == "100203") {
                            alertWarning($scope.$eval($interpolate("{{'message_person_new_activation'|translate}}")), $scope, $interpolate);
                            return;
                        } else if (result.error.code == "100201") {
                            alertWarning($scope.$eval($interpolate("{{'message_person_activation_exist'|translate}}")), $scope, $interpolate);
                            return;
                        } else if (result.error.code == "100202") {
                            alertWarning($scope.$eval($interpolate("{{'message_person_activation_expired'|translate}}")), $scope, $interpolate);
                            return;
                        } else if (result.error.code == "100204") {
                            alertWarning($scope.$eval($interpolate("{{'message_person_activation_invalid_you'|translate}}")), $scope, $interpolate);
                            return;
                        }
                    }

                    registerInfo.activationCode = actCode;
                    localStorage[registerLocalStorage] = JSON.stringify(registerInfo);


                    if (flag == 1) {
                        var arrButton = [$scope.$eval($interpolate("{{'button_ok'|translate}}"))];
                        openDialog($scope.$eval($interpolate("{{'title_dialog_success'|translate}}")), $scope.$eval($interpolate("{{'message_person_activation_congratulations'|translate}}")), arrButton, function () {
                            $window.location.href = "#/introduceModes";
                        });
                    } else {
                        $location.path("/passwordCreation");
                    }
                });
            }
        } else {
            alertWarning($scope.$eval($interpolate("{{'message_person_activation_insert'|translate}}")), $scope, $interpolate);
        }

    };

    $scope.verifyActCodeFormat = function (actCode, $event) {
        if (actCode) {
            $scope.actCode = actCode.replace(/[\W]/g, '');
        }
    };

    $scope.howGetActCode = function () {
        alertWarning($scope.$eval($interpolate("{{'message_person_activation_code'|translate}}")), $scope, $interpolate);
    };

});

app.controller('personalController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $interpolate) {

    $scope.$watch('$viewContentLoaded', function () {

        if (localStorage[registerLocalStorage] == null) {
            $location.path("/login");
            return;
        }
        //remove the date input,so remove these below
//        if (!Modernizr.inputtypes.date) {
//            $scope.isShowB = 1;
//            $("#birthday").Zebra_DatePicker({
//                format: 'm/d/Y',
//                onSelect: function(view, elements) {
//                    $scope.birthday = new Date(elements).format("mm/dd/yyyy");
//                    var registerInfo = JSON.parse(localStorage[registerLocalStorage]);
//                    registerInfo.birthday = elements;
//                    localStorage[registerLocalStorage] = JSON.stringify(registerInfo);
//                }
//            });
//        } else {
//            if (isATF()) {
//                $scope.isShowB = 1;
//                $("#birthday").Zebra_DatePicker({
//                    format: 'm/d/Y',
//                    onSelect: function(view, elements) {
//                        $scope.birthday = new Date(elements).format("mm/dd/yyyy");
//                        var registerInfo = JSON.parse(localStorage[registerLocalStorage]);
//                        registerInfo.birthday = elements;
//                        localStorage[registerLocalStorage] = JSON.stringify(registerInfo);
//                    }
//                });
//            }
//        }

        var registerInfo = JSON.parse(localStorage[registerLocalStorage]);
        if (registerInfo.firstName != "") {
            $scope.firstName = registerInfo.firstName;
            $scope.lastName = registerInfo.lastName;
            $scope.email = registerInfo.email;
            if (registerInfo.birthday != null) {
                $scope.birthday = registerInfo.birthday;
                //remove the date input,so remove these below
//                if (registerInfo.birthday.indexOf("/") > 0) {
//                    if (!Modernizr.inputtypes.date) {
//                        $scope.birthday = new Date(registerInfo.birthday).format("mm/dd/yyyy");
//                    } else {
//                        if (isATF()) {
//                            $scope.birthday = new Date(registerInfo.birthday).format("mm/dd/yyyy");
//                        } else {
//                            $scope.birthday = registerInfo.birthday.split("/")[2] + "-" + registerInfo.birthday.split("/")[1] + "-" + registerInfo.birthday.split("/")[0];
//                        }
//                    }
//                } else {
//                    if (!Modernizr.inputtypes.date) {
//                        $scope.birthday = new Date(registerInfo.birthday).format("mm/dd/yyyy");
//                    } else {
//                        if (isATF()) {
//                            $scope.birthday = new Date(registerInfo.birthday).format("mm/dd/yyyy");
//                        } else {
//                            $scope.birthday = registerInfo.birthday;
//                        }
//                    }
//                }
            }
            if (registerInfo.zipCode != null) {
                $scope.zipCode = registerInfo.zipCode;
            }
            if (registerInfo.gender != null) {
                var btnChecked = $('.selectBar.sexBar .btn[value="' + registerInfo.gender + '"]');
                if (btnChecked != null && btnChecked.length > 0) {
                    checkedSelect(btnChecked[0]);
                }
            }
        }

    });

    $scope.verifyBirthdayFormat = function() {
        validationBirthdayFormat($scope);
    };

    $scope.verifyZipCodeFormat = function (zipCode, $event) {
        zipCode = zipCode.replace(/[^\d]/g, '');
        if (zipCode.length > 5) {
            var d1 = zipCode.substring(0, 5);
            var d2 = zipCode.substring(5);
            zipCode = d1 + "-" + d2;
        }
        if (zipCode == "") {
            $scope.zipCode = "";
        } else {
            $scope.zipCode = zipCode;
        }
    };

    $scope.verifyFirstName = function () {
        if ($scope.firstName) {
            $scope.firstName = firstCapitalReg($scope.firstName);
        }
    };

    $scope.verifyLastName = function () {
        if ($scope.lastName) {
            $scope.lastName = firstCapitalReg($scope.lastName);
        }
    };

    $rootScope.next = function () {
        if (!$scope.firstName) {
            alertWarning($scope.$eval($interpolate("{{'message_person_first_empty'|translate}}")), $scope, $interpolate);
            return;
        }
        if (!$scope.lastName) {
            alertWarning($scope.$eval($interpolate("{{'message_person_last_empty'|translate}}")), $scope, $interpolate);
            return;
        }

        if ($scope.email == undefined) {
            alertWarning($scope.$eval($interpolate("{{'message_login_email_invalid'|translate}}")), $scope, $interpolate);
            return;
        } else {
            if (!isEmail($("#txtEmail").val().trim())) {
                alertWarning($scope.$eval($interpolate("{{'message_login_email_invalid'|translate}}")), $scope, $interpolate);
                return;
            }
        }

        var isAllow = 0;
        var registerInfo = JSON.parse(localStorage[registerLocalStorage]);
        var requestBody = { "email": $scope.email,"cpf":registerInfo.cpf };
        httpRequest.POST('/check-email', JSON.stringify(requestBody)).then(function (result) {
            if (result.status == 1) {
                if ($(".sexBar .btn.checked").length == 0) {
                    alertWarning($scope.$eval($interpolate("{{'message_introduce_gender_required'|translate}}")), $scope, $interpolate);
                    return;
                }

                var age = 0;

                if ($scope.birthday == undefined || $scope.birthday == "") {
                    alertWarning($scope.$eval($interpolate("{{'message_person_birthday_required'|translate}}")), $scope, $interpolate);
                    return;
                } else {
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
                    age = getAge(y + "-" + m + "-" + d);
                }
//                if (!Modernizr.inputtypes.date) {
//                    if ($("#birthday").val() == "") {
//                        alertWarning($scope.$eval($interpolate("{{'message_person_birthday_required'|translate}}")), $scope, $interpolate);
//                        return;
//                    }
//                    age = getAge($("#birthday").val());
//                } else {
//                    if (isATF()) {
//                        if ($("#birthday").val() == "") {
//                            alertWarning($scope.$eval($interpolate("{{'message_person_birthday_required'|translate}}")), $scope, $interpolate);
//                            return;
//                        }
//                        age = getAge($("#birthday").val());
//                    } else {
//                        if (!$scope.birthday) {
//                            alertWarning($scope.$eval($interpolate("{{'message_person_birthday_required'|translate}}")), $scope, $interpolate);
//                            return;
//                        }
//                        age = getAge($scope.birthday);
//                    }
//                }

                if (age < 10) {
                    alertWarning($scope.$eval($interpolate("{{'message_introduce_years'|translate}}")), $scope, $interpolate);
                    return;
                }
                if ($scope.zipCode) {
                    if (!isValidZipCode($scope.zipCode)) {
                        alertWarning($scope.$eval($interpolate("{{'message_person_Zip_required'|translate}}")), $scope, $interpolate);
                        return;
                    }
                }

                if (age >= 10 && age < 18) {
                    var arrButton = [$scope.$eval($interpolate("{{'button_refuse'|translate}}")), $scope.$eval($interpolate("{{'button_got'|translate}}"))];
                    openDialog($scope.$eval($interpolate("{{'button_warning'|translate}}")), $scope.$eval($interpolate("{{'message_introduce_attending'|translate}}")), arrButton, function (r) {
                        if (r == 1) {
                            goToNext($scope);
                        }
                    });
                }
                else {
                    goToNext($scope);
                }
            } else if (result.status == 0) {
                if (result.error.code == "100301") {
                    alertWarning($scope.$eval($interpolate("{{'message_person_email_used'|translate}}")), $scope, $interpolate);
                } else {
                    alertWarning($scope.$eval($interpolate("{{'message_person_email_invalid'|translate}}")), $scope, $interpolate);
                }
            }
        });
    };

    function goToNext($scope) {
        var registerInfo = JSON.parse(localStorage[registerLocalStorage]);
        registerInfo.firstName = $scope.firstName;
        registerInfo.lastName = $scope.lastName;
        registerInfo.email = $scope.email;
        registerInfo.gender = $(".sexBar .btn.checked").attr("value");

        registerInfo.cellphone = "";
        registerInfo.address = "";
        registerInfo.telephone = "";
        registerInfo.apartmentNumber = "";
        registerInfo.buildingNumber = "";
        registerInfo.stateId = "";
        registerInfo.cityId = "";
        registerInfo.neighborhoodId = "";


//        if (!Modernizr.inputtypes.date) {
//        } else {
//            if (isATF()) {
//            } else {
//                registerInfo.birthday = $scope.birthday;
//            }
//        }

        registerInfo.birthday = $scope.birthday
        registerInfo.zipCode = $scope.zipCode;

        localStorage[registerLocalStorage] = JSON.stringify(registerInfo);

        $window.location.href = "#/personalContactInfo";
    }

    window.onresize = function () {
        var iDWidth = $(".inputDiv").outerWidth();
        $("#limitedWidth").outerWidth(iDWidth - 60);
    };
    window.onresize();
});

app.controller('contactInfoController', function ($rootScope, $scope, analytics, $location, httpRequest, $window, $interpolate) {

    if (localStorage[registerLocalStorage] == null) {
        $location.path("/login");
        return;
    }

    $scope.stateSelected = function () {

        if ($scope.state != null) {
            var registerInfo = JSON.parse(localStorage[registerLocalStorage]);
            registerInfo.stateId = $scope.state;
            registerInfo.cityId = "";
            registerInfo.neighborhoodId = "";
            localStorage[registerLocalStorage] = JSON.stringify(registerInfo);
            $scope.cityModel = "";
            $scope.city = "";
            $scope.nbhModel = "";
            var url = "/states/" + $scope.state + "/cities";
            httpRequest.Request('get', url, "").then(function (result) {
                if (result.status == 1) {
                    $scope.cityModel = result.cities;
                }
            });
        }

    };

    $scope.citySelected = function () {
        if ($scope.city != null) {
            var registerInfo = JSON.parse(localStorage[registerLocalStorage]);
            registerInfo.cityId = $scope.city;
            localStorage[registerLocalStorage] = JSON.stringify(registerInfo);
            var url = "/cities/" + $scope.city + "/neighborhoods";
            httpRequest.Request('get', url, "").then(function (result) {
                if (result.status == 1) {
                    $scope.nbhModel = result.neighborhoods;
                }
            });
        }

    };

    $scope.nbhSelected = function () {
        if ($scope.neighbourhood != null) {
            var registerInfo = JSON.parse(localStorage[registerLocalStorage]);
            registerInfo.neighborhoodId = $scope.neighbourhood.id;
            localStorage[registerLocalStorage] = JSON.stringify(registerInfo);
        } else {
        }
    };

    $scope.$watch('$viewContentLoaded', function () {
        //get states
        httpRequest.Request('get', "/states", "").then(function (result) {
            if (result.status == 1) {
                $scope.stateModel = result.states;
            }
        });
        var registerInfo = JSON.parse(localStorage[registerLocalStorage]);
        if (registerInfo.cellphone != "") {
            $scope.cellphone = registerInfo.cellphone;
            $scope.address = registerInfo.address;
            $scope.telephone = registerInfo.telephone;
            $scope.apartmentNumber = registerInfo.apartmentNumber;
            $scope.buildingNumber = registerInfo.buildingNumber;
        }
        if (registerInfo.zipCode != null && registerInfo.zipCode != "") {
            var url = "/check-zip-code/" + registerInfo.zipCode.toString().replace(/-/g, "");
            httpRequest.Request('get', url, "").then(function (result) {
                if (result.status == 1) {
                    $scope.state = result.stateId;
                    registerInfo.stateId = result.stateId;
                    registerInfo.cityId = result.cityId;
                    registerInfo.neighborhoodId = result.neighborhoodId;
                    $scope.address = result.address;
                    if (registerInfo.cityId != "") {
                        var url = "/states/" + registerInfo.stateId + "/cities";
                        httpRequest.Request('get', url, "").then(function (result) {
                            if (result.status == 1) {
                                $scope.cityModel = result.cities;
                                $scope.city = registerInfo.cityId;
                            }
                            if (registerInfo.neighborhoodId != "") {
                                var url = "/cities/" + registerInfo.cityId + "/neighborhoods";
                                httpRequest.Request('get', url, "").then(function (result) {
                                    if (result.status == 1) {
                                        $scope.nbhModel = result.neighborhoods;
                                        $scope.neighbourhood = registerInfo.neighborhoodId;
                                        localStorage[registerLocalStorage] = JSON.stringify(registerInfo);
                                    }
                                });
                            }
                        });
                    }
                }
            });
        } else {
            if (registerInfo.stateId != "") {
                $scope.state = registerInfo.stateId;
                $scope.isShowState = 0;

            }
            else {
                $scope.isShowState = 1;
            }
            if (registerInfo.cityId != "") {
                var url = "/states/" + $scope.state + "/cities";
                httpRequest.Request('get', url, "").then(function (result) {
                    if (result.status == 1) {
                        $scope.cityModel = result.cities;
                        $scope.city = registerInfo.cityId;
                        $scope.isShowCity = 0;
                    }
                });
            } else {
                $scope.isShowCity = 1;
            }
            if (registerInfo.neighborhoodId != "") {
                var url = "/cities/" + registerInfo.cityId + "/neighborhoods";
                httpRequest.Request('get', url, "").then(function (result) {
                    if (result.status == 1) {
                        $scope.nbhModel = result.neighborhoods;
                        $scope.neighbourhood = registerInfo.neighborhoodId;
                        $scope.isShowNbh = 0;

                    }
                });
            } else {
                $scope.isShowNbh = 1;
            }
        }


    });

    $scope.showSateSelect = function() {
        $scope.isShowState = 0;
    };

    $scope.showCitySelect = function() {
        $scope.isShowCity = 0;
    };

    $scope.showNbhSelect = function() {
        $scope.isShowNbh = 0;
    };

    $scope.next = function () {
        if ($scope.state == undefined || $scope.state == "") {
            alertWarning($scope.$eval($interpolate("{{'message_person_state_required'|translate}}")), $scope, $interpolate);
            return;
        }
        if ($scope.city == undefined || $scope.city == "") {
            alertWarning($scope.$eval($interpolate("{{'message_person_city_required'|translate}}")), $scope, $interpolate);
            return;
        }
//        if ($scope.neighbourhood == undefined || $scope.neighbourhood == "") {
//            alertWarning($scope.$eval($interpolate("{{'message_person_neighbourhood_required'|translate}}")), $scope, $interpolate);
//            return;
//        }
        if ($scope.address == undefined || $scope.address == "") {
            alertWarning($scope.$eval($interpolate("{{'message_person_address_required'|translate}}")), $scope, $interpolate);
            return;
        }
        if ($scope.buildingNumber == undefined || $scope.buildingNumber == "") {
            alertWarning($scope.$eval($interpolate("{{'message_person_number_required'|translate}}")), $scope, $interpolate);
            return;
        }
        if ($scope.cellphone != "" && $scope.cellphone != undefined) {
            if (!isInvalidMPhone($scope.cellphone)) {
                alertWarning($scope.$eval($interpolate("{{'message_person_mobile_invalid'|translate}}")), $scope, $interpolate);
                return;
            }
        } else {
            if ($scope.telephone == undefined || $scope.telephone == "") {
                alertWarning($scope.$eval($interpolate("{{'message_person_remember'|translate}}")), $scope, $interpolate);
                return;
            }
        }
        if ($scope.telephone != "" && $scope.telephone != undefined) {
            if (!isPhone($scope.telephone)) {
                alertWarning($scope.$eval($interpolate("{{'message_person_phone_invalid'|translate}}")), $scope, $interpolate);
                return;
            }
        } else {
            if ($scope.cellphone == undefined || $scope.cellphone == "") {
                alertWarning($scope.$eval($interpolate("{{'message_person_remember'|translate}}")), $scope, $interpolate);
                return;
            }
        }

        var registerInfo = JSON.parse(localStorage[registerLocalStorage]);
        registerInfo.stateId = $scope.state;
        registerInfo.cityId = $scope.city;
        if ($scope.neighbourhood != undefined && $scope.neighbourhood != null) {
            registerInfo.neighborhoodId = $scope.neighbourhood;
        } else {
            registerInfo.neighborhoodId = -1;
        }

        registerInfo.cellphone = $scope.cellphone;
        registerInfo.address = $scope.address;
        registerInfo.telephone = $scope.telephone;
        registerInfo.apartmentNumber = $scope.apartmentNumber;
        registerInfo.buildingNumber = $scope.buildingNumber;

        localStorage[registerLocalStorage] = JSON.stringify(registerInfo);
        $location.path("/personalAgreement");
    };

    $scope.verifyNumberFieldFormat = function (num, $event) {
        var k = $window.event ? $event.keyCode : $event.which;
        if (((k >= 48) && (k <= 57)) || k == 8) {
            if ($event.target.id == "buildingNumber") {
                $scope.buildingNumber = num;
            } else {
                $scope.apartmentNumber = num;
            }
        } else {
            if (window.event) {
                window.event.returnValue = false;
            }
            else {
                $event.preventDefault(); //for firefox
            }
        }
    };

    $scope.verifyApartmentFormat = function(num, $event) {
        num = num.replace(/[^\w\s]/g, '');
        $scope.apartmentNumber = num;
    };

    $scope.verifyPhoneFormat = function (phone, $event) {
        if (phone == undefined) {
            return;
        }
        var ph = "";
        if ($event.target.id == "cellphone") {
            ph = $scope.cellphone;
        } else {
            ph = $scope.telephone;
        }
        ph = ph.replace(/[^\d]/g, '');
        if (ph.length > 2) {
            var d1 = ph.substring(0, 2);
            var d2 = ph.substring(2);
            ph = d1 + "-" + d2;
        }
        if ($event.target.id == "cellphone") {
            $scope.cellphone = ph;
        } else {
            $scope.telephone = ph;
        }
    };
});

app.controller("personalAgreementController", function ($rootScope, $scope, analytics, $location, httpRequest, $interpolate) {
    $scope.$watch('$viewContentLoaded', function () {
        if (localStorage[registerLocalStorage] == null) {
            $location.path("/login");
            return;
        }

        //get vehicleCategories
        httpRequest.Request('get', "/vehicle-categories", "").then(function (result) {
            if (result.status == 1) {
                $scope.vehicleCategories = result.vehicleCategories;
                $scope.vehicleCategory = 1;
                var url = "/vehicle-categories/" + $scope.vehicleCategory + "/vehicles";
                httpRequest.Request('get', url, "").then(function (result) {
                    if (result.status == 1) {
                        $scope.vehicles = result.vehicles;
                        $scope.vehicle = 1;
                    }
                });

            }
        });
    });

    $scope.vehicleCategorySelected = function () {
        if ($scope.vehicleCategory != null) {
            var registerInfo = JSON.parse(localStorage[registerLocalStorage]);
            registerInfo.vehicleCategoryId = $scope.vehicleCategory;
            registerInfo.vehicleId = "";
            $scope.vehicles = "";
            $scope.vehicle = "";
            var url = "/vehicle-categories/" + $scope.vehicleCategory + "/vehicles";
            httpRequest.Request('get', url, "").then(function (result) {
                if (result.status == 1) {
                    $scope.vehicles = [
                        {id:-1,name:" "}
                    ];
                    for (var i = 0; i < result.vehicles.length; i++) {
                        $scope.vehicles.push({id: result.vehicles[i].id,name: result.vehicles[i].name})
                    }
                    $scope.vehicle = -1;
                }
            });
        }
    };

    $scope.vehicleCategorySelected();

    $scope.acceptTerms = function () {
        openDialog("agreement.html")
    };

    $scope.receiveNewsletter = true;
    $scope.changedReceiveNews = function () {
        checkedChanged($("#chkReceiveNews")[0]);
        if (isCheckedCustom($("#chkReceiveNews"))) {
            $scope.receiveNewsletter = true;
        }
        else {
            $scope.receiveNewsletter = false;

        }
    }

    $scope.changedAcceptTerms = function () {
        checkedChanged($("#chkAcceptTerms")[0]);
        if (isCheckedCustom($("#chkAcceptTerms"))) {
            $scope.accept = true;
        }
        else {
            $scope.accept = null;
        }
    }

    $scope.save = function () {
        var registerInfo = JSON.parse(localStorage[registerLocalStorage]);
        if ($scope.vehicleCategory == undefined || $scope.vehicleCategory == -1) {
            registerInfo.vehicleCategoryId = 0
        } else {
            registerInfo.vehicleCategoryId = $scope.vehicleCategory;
        }
        if ($scope.vehicle == undefined || $scope.vehicle == -1) {
            registerInfo.vehicleId = 0;
        } else {
            registerInfo.vehicleId = $scope.vehicle;
        }
        if ($scope.receiveNewsletter) {
            registerInfo.receiveNewsletter = 1;
        } else {
            registerInfo.receiveNewsletter = 0;
        }
        //remove the date input,so remove these below
//        var birthdayArr = registerInfo.birthday.split("-");
//        registerInfo.birthday = birthdayArr[2] + "/" + birthdayArr[1] + "/" + birthdayArr[0];
        var requestBody = {"cpf": registerInfo.cpf, "firstName": registerInfo.firstName,
            "lastName": registerInfo.lastName, "email": registerInfo.email,
            "password": registerInfo.password, "birthday": registerInfo.birthday,
            "gender": registerInfo.gender, "stateId": registerInfo.stateId,
            "cityId": registerInfo.cityId, "neighborhoodId": registerInfo.neighborhoodId,
            "zipCode": (registerInfo.zipCode == null ? '' : registerInfo.zipCode.toString().replace(/-/g, "")), "address": registerInfo.address,
            "buildingNumber": registerInfo.buildingNumber, "apartmentNumber": registerInfo.apartmentNumber,
            "telephone": registerInfo.telephone, "cellphone": registerInfo.cellphone, "vehicleCategoryId": registerInfo.vehicleCategoryId,
            "vehicleId": registerInfo.vehicleId, "receiveNewsletter": registerInfo.receiveNewsletter,
            "activationCode": registerInfo.activationCode, "deviceId": registerInfo.deviceId,
            "deviceType": registerInfo.deviceType, "deviceOS": registerInfo.deviceOS
        };
        httpRequest.Request('POST', '/sign-up', requestBody).then(function (result) {
                if (result.status == 0) {
                    if (result.error.code == "100401") {
                        alertWarning($scope.$eval($interpolate("{{'message_person_cpf_email'|translate}}")), $scope, $interpolate);
                    } else if (result.error.code == "100402") {
                        alertWarning($scope.$eval($interpolate("{{'message_person_activation_invalid'|translate}}")), $scope, $interpolate);
                    }
                } else {
                    localStorage[tokenLocalStorage] = result.token;
                    var token = localStorage[tokenLocalStorage];

                    httpRequest.Get('/user/info', { "token": token }).then(function (result) {
                        if (result.status) {
                            localStorage.removeItem(registerLocalStorage);
                            var userInfo = new UserInfo();
                            userInfo.InitUserInfo(result.userInfo);
                            var gender = userInfo.userBaseInfo.gender;
                            var genderImg = document.getElementById("gender");
                            var genderImg1 = document.getElementById("gender1");
                            if (gender == 0) {
                                genderImg.src = "image/icon/icon_hello_female.png";
                                genderImg1.src = "image/icon/icon_hello_female.png";
                                var name = userInfo.userBaseInfo.firstName;
                                $("#txtMenuName").html(name);
                                $("#txtMenuName1").html(name);
                            } else {
                                genderImg.src = "image/icon/icon_hello_male.png";
                                genderImg1.src = "image/icon/icon_hello_male.png";
                                var name = userInfo.userBaseInfo.firstName;
                                $("#txtMenuName").html(name);
                                $("#txtMenuName1").html(name);
                            }
                            httpRequest.Get("/user/reminder/settings/", {"token": token}).then(function (result) {
                                if (result.status == 1) {
                                    localStorage[userLocalStorage] = JSON.stringify(new loginUserInfo(userInfo, result.reminder));
                                    $location.path("/introduceModes");
                                } else {
                                    localStorage[userLocalStorage] = JSON.stringify(new loginUserInfo(userInfo, ""));
                                    alertError(result.error, $scope, $interpolate);
                                }
                            });
                        }
                    });
                }
            }
        );
    }
});
