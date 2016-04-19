function updateMealFavorite(httpRequest, _this, id, $scope, $interpolate) {
    updateKindsMealFavorite(httpRequest, _this, id, MealItemType.MealTimeType, $scope, $interpolate);
}

function updateKindsMealFavorite(httpRequest, _this, id, type, $scope, $interpolate) {
    var token = localStorage[tokenLocalStorage];
    if (isFavorite(_this)) {
        httpRequest.DELETE('/user/favorites/type/' + type + '/' + id, { "token": token }).then(function (result) {
            if (result.status) {
                $(_this).attr("src", "image/star_icon_gray.png");
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
    else {
        httpRequest.POST('/user/favorites', '{"itemType":' + type + ',"itemId":' + id + '}', { "token": token }).then(function (result) {
            if (result.status) {
                $(_this).attr("src", "image/star_icon_red.png");
            } else if (result.status == 0) {
                if (result.error && result.error.message) {
                    alertError(result.error, $scope, $interpolate);
                }
                else {
                    alertWarning($scope.$eval($interpolate("{{'message_simple_add_favorite_error'|translate}}")), $scope, $interpolate);
                }
            }
        });
    }
}

function saveMyMeal() {
    var mealTime = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
    var mealTimeName = getObjAttributeNameByValue(MealTime, mealTime);
    if (!mealTimeName) {
        mealTime = MealTime.Breakfast;
    }
    var token = localStorage[tokenLocalStorage];
    if (token && localStorage[buildMealFoodsLocalStorage]) {
        var foods = JSON.parse(localStorage[buildMealFoodsLocalStorage]);
        var requestData = new Object();
        requestData.type = MealItemType.MemberMealType;
        requestData.name = $("#txtMealName").val().trim();
        requestData.mealTime = mealTime;
        requestData.createdDate = new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000;
        requestData.ingredient = new Array();
        for (var i = 0; i < foods.length; i++) {
            var ingre = { "type": foods[i].type, "ingredientId": foods[i].id, "serveringWhole": 1, "serveringFractionId": 1 };
            requestData.ingredient.push(ingre);
        }

        $.ajax({
            type: "POST",
            url: serviceUrl + "/meals/user/simple-start/meamber-meals",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(requestData),
            dataType: "json",

            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("token", token);
            },
            success: function (result) {
                if (result.status) {
                    localStorage.removeItem(buildMealFoodsLocalStorage);
                    $('.mask,.dialog').remove();
                    window.location.href = "#/myMeals";
                }
                else {
                    if (result.error && result.error.message) {
                        jAlert(result.error.message,"Aviso");
                    }
                    else {
                        jAlert("Save meal error.","Aviso");
                    }
                }
            },
            error: function (error) {
                jAlert("Save meal error.","Aviso");
                $('.mask,.dialog').remove();
            }
        });
    }
}

function Meal() {
    this.id = "";
    this.mealTime = "";
    this.foodId = "";
    this.type = "";
    this.createdDate = "";
    this.selectClass = "";
    this.portionId = 1;
    this.servings = 1;
    this.servingsWhole =  1;
    this.servingsFractionId = 1;
    this.point = 1;
}