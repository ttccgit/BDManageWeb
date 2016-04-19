var app = angular.module('BDManager', [
    "ngRoute",
    "ngTouch",
    "mobile-angular-ui",
    "pascalprecht.translate",
    'myModule'
]);

app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/login', { templateUrl: "views/signUp/login.html" })
        .when('/main', { templateUrl: "views/mainSidebar.html" })
        .when('/emailForget', { templateUrl: "views/signUp/emailForget.html" })
        .when('/passwordForget', { templateUrl: "views/signUp/passwordForget.html" })
        .when('/passwordCreation', { templateUrl: "views/signUp/passwordCreation.html" })
        .when('/activationCode', { templateUrl: "views/signUp/activationCode.html" })
        .when('/activationCode/:from', { templateUrl: "views/signUp/activationCode.html" })
        .when('/personalBasicInfo', { templateUrl: "views/signUp/personalBasicInfo.html" })
        .when('/personalContactInfo', { templateUrl: "views/signUp/personalContactInfo.html" })
        .when('/personalAgreement', { templateUrl: "views/signUp/personalAgreement.html" })
        .when('/introduceModes', { templateUrl: "views/gettingStarted/introduceModes.html" })
        .when('/introduceWeight', { templateUrl: "views/gettingStarted/introduceHeightWeight.html" })
        .when('/introduceTrackingMode', { templateUrl: "views/gettingStarted/introduceTrackingMode.html" })
        .when('/introduceSimpleMode', { templateUrl: "views/gettingStarted/introduceSimpleMode.html" })
        .when('/visitorTrackingMode', { templateUrl: "views/visitor/visitorTrackingMode.html" })
        .when('/visitorSimpleMode', { templateUrl: "views/visitor/visitorSimpleMode.html" })

        .when('/introduceMotivation  ', { templateUrl: "views/gettingStarted/introduceMotivation.html" })
        .when('/checkCPFAndCode', { templateUrl: "views/signUp/checkCPFAndCode.html" })
        .when('/resetPassword', { templateUrl: "views/signUp/resetPassword.html" })
        .otherwise({
            redirectTo: '/login'
        });

    $routeProvider
        .when('/weightList', { templateUrl: "views/tracking/weightList.html" })
        .when('/tracking', { templateUrl: "views/tracking/tracking.html" })
        .when('/tracking/:mark', { templateUrl: "views/tracking/tracking.html" })
        .when('/trackGoalWeight', { templateUrl: "views/tracking/weightGoal.html" })
        .when('/trackWeightModify', { templateUrl: "views/tracking/weightModify.html" })
        .when('/weightMessage', { templateUrl: "views/tracking/weightMessage.html" });


    $routeProvider
        .when('/login4Members', { templateUrl: "views/signUp/login.html" })
        .when('/featureRecipes/:mark', { templateUrl: "views/visitor/featuredRecipes.html" })
        .when('/successStories/:mark', { templateUrl: "views/visitor/successStories.html" })
        .when('/articles/:mark', { templateUrl: "views/visitor/articles.html" })
        .when('/aboutUs/:mark', { templateUrl: "views/visitor/aboutUs.html" })
        .when('/meetingFinder/:mark', { templateUrl: "views/visitor/meetingFinder.html" })
        .when('/terms/:mark', { templateUrl: "views/visitor/terms.html" })
        .when('/about/:mark', { templateUrl: "views/visitor/about.html" });
//        .when('/about/:mark', { templateUrl: function(){return 'views/visitor/' + urlattr.name + 'about.html';}});


    $routeProvider
        .when('/instruction', { templateUrl: "views/visitor/instruction.html" })
        .when('/learnFullApp', { templateUrl: "views/visitor/learnFullApp.html" });


    $routeProvider
        .when('/simple', { templateUrl: "views/simple/simple.html" })
        .when('/simple/:meal', { templateUrl: "views/simple/simple.html" })
        .when('/simpleDetail/:id', { templateUrl: "views/simple/simpleDetail.html" })
        .when('/myMeals', { templateUrl: "views/simple/myMeals.html" })
        .when('/myMealDetail/:id', { templateUrl: "views/simple/myMealDetail.html" })
        .when('/mealsFavorites', { templateUrl: "views/simple/mealsFavorites.html" })
        .when('/mealExtraDetail/:id', { templateUrl: "views/simple/mealExtraDetail.html" })
        .when('/mealIndulgencesDetail/:id', { templateUrl: "views/simple/mealIndulgencesDetail.html" })
        .when('/buildMeal/:mealTime', { templateUrl: "views/simple/buildMeal.html" })
        .when('/foodSelect/:id/:mealTime', { templateUrl: "views/simple/foodSelect.html" })
        .when('/myProgress', { templateUrl: "views/simple/myProgress.html" })
        .when('/myProgressSelect', { templateUrl: "views/simple/myProgressSelect.html" })
        .when('/howItWorks', { templateUrl: "views/simple/howItWorks.html" })
        .when('/shoppingList', { templateUrl: "views/simple/shoppingList.html" })
        .when('/wantMoreChoices', { templateUrl: "views/simple/wantMoreChoices.html" })
        .when('/FAQS', { templateUrl: "views/simple/FAQS.html" })
        .when('/appResources', { templateUrl: "views/simple/appResources.html" })
        .when('/5easyRules', { templateUrl: "views/simple/5easyRules.html" })
        .when('/agreement', { templateUrl: "views/simple/agreement.html" })
        .when('/aboutApp', { templateUrl: "views/simple/aboutApp.html" })
        .when('/termsAndConditions', { templateUrl: "views/simple/termsAndConditions.html" });

    $routeProvider
        .when('/help/:mark', { templateUrl: "views/help/help.html" })
        .when('/howWorks', { templateUrl: "views/help/howWorks.html" })
        .when('/trackingTool', { templateUrl: "views/help/trackingTool.html" })
        .when('/dailyTarget', { templateUrl: "views/help/dailyProPontosTarget.html" })
        .when('/weeklyAllowance', { templateUrl: "views/help/weeklyProPontosAllowance.html" })
        .when('/activity', { templateUrl: "views/help/activity.html" });

    $routeProvider
        .when('/setting/:mark', { templateUrl: "views/setting/setting.html" });

    $routeProvider
        .when('/reminders/:mark', { templateUrl: "views/reminders/reminders.html" })
        .when('/favReminder', { templateUrl: "views/reminders/favReminder.html" });

    $routeProvider
        .when('/quickAdd', { templateUrl: "views/pointTracking/quickAdd.html" })
        .when('/foodList', { templateUrl: "views/pointTracking/foodList.html" })
        .when('/calculator', { templateUrl: "views/pointTracking/calculator.html" })
        .when('/mealDetails', { templateUrl: "views/pointTracking/mealDetails.html" })
        .when('/foodDetails', { templateUrl: "views/pointTracking/foodDetails.html" })
        .when('/recipesDetails', { templateUrl: "views/pointTracking/recipesDetails.html" })
        .when('/pointsIndex', { templateUrl: "views/pointTracking/pointsIndex.html" })
        .when('/activitiesAdd', { templateUrl: "views/pointTracking/activitiesAdd.html" })
        .when('/activitiesList', { templateUrl: "views/pointTracking/activitiesList.html" })
        .when('/recipesDetails', { templateUrl: "views/pointTracking/recipesDetails.html" })
        .when('/activitiesQuickAdd', { templateUrl: "views/pointTracking/activitiesQuickAdd.html" })
        .when('/quickFoodDetails', { templateUrl: "views/pointTracking/quickFoodDetails.html" })
        .when('/recipes', { templateUrl: "views/pointTracking/recipes.html" })
});


app.service('analytics', [
    '$rootScope', '$window', '$location', function ($rootScope, $window, $location) {
        var send = function (evt, data) {
            ga('send', evt, data);
        }
    }
]);

app.config(function ($translateProvider, $translatePartialLoaderProvider) {
    $translateProvider.useLoader('$translatePartialLoader', {
        urlTemplate: 'js/translation/{lang}/{part}.json'
    });

    $translateProvider.determinePreferredLanguage(function () {
        $translatePartialLoaderProvider.addPart('message');
        if (localStorage[loginLocalStorage] != null) {
            var loginConfig = JSON.parse(localStorage[loginLocalStorage]);
            if (loginConfig != null && "" != loginConfig) {
                if ("" != loginConfig.lang && undefined != loginConfig.lang) {
                    return loginConfig.lang;
                } else {
                    return "pt_BR";
                }
            } else {
                return "pt_BR";
            }
        } else {
            return "pt_BR";
        }

    });
});

app.factory('wwInterceptor', ['$q','$location',function($q, $location) {
    return {
        // optional method
        'request': function(config) {
            var excludeURLs = new Array(
                "views/signUp/login.html",
                "views/signUp/emailForget.html",
                "views/signUp/passwordCreation.html",
                "views/signUp/footer.html",
                "views/visitor/featuredRecipes.html",
                "views/visitor/successStories.html",
                "views/visitor/articles.html",
                "views/visitor/aboutUs.html",
                "views/visitor/meetingFinder.html",
                "views/visitor/terms.html",
                "views/visitor/about.html",
                "views/visitor/instruction.html",
                "views/visitor/learnFullApp.html",
                "views/simple/FAQS.html",
                "views/simple/appResources.html",
                "views/simple/5easyRules.html",
                "views/simple/agreement.html",
                "views/simple/aboutApp.html",
                "views/simple/termsAndConditions.html",
                "views/help/help.html",
                "views/help/howWorks.html",
                "views/help/trackingTool.html",
                "views/mainSidebar.html",
                "views/footer.html"
            );
            var re = new RegExp(/^views\//i);
            var reg = new RegExp(/^views\/visitor\//i);
            var regE = new RegExp(/^views\/pt_BR\//i);
            var regA = new RegExp(/^views\/signUp\//i);
            var regB = new RegExp(/^views\/gettingStarted\//i);
            if (re.test(config.url) && !excludeURLs.contains(config.url) && !reg.test(config.url) && !regE.test(config.url) && !regA.test(config.url) && !regB.test(config.url)) {
                var token = localStorage[tokenLocalStorage];
                if (token == null || token == '' || token == undefined) {
                    return $location.path("/login");
                }
            }
            return config;
        },

        // optional method
        'requestError': function(rejection) {
            var token = localStorage[tokenLocalStorage];
            if (token == null || token == '' || token == undefined) {
                return $location.path("/login");
            }
            return $q.reject(rejection);
        }
    }
}]);

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('wwInterceptor');
}]);

angular.module('myModule', [])
    .filter('floatFormat', function () {
        return function (item, language) {
            return toFloatFormatString(item, language);
        };
    });

app.controller('mainController', function ($rootScope, $scope, analytics) {

    $rootScope.$on("$routeChangeStart", function () {
        $rootScope.loading = true;
    });

    $rootScope.$on("$routeChangeSuccess", function () {
        $rootScope.loading = false;
    });

    $scope.$on("Ctr1LanguageChange", function (event, language) {
        $scope.languageNGIf = language;
    });

    $scope.languageNGIf = "pt_BR";
    if (localStorage[loginLocalStorage] != null) {
        var loginConfig = JSON.parse(localStorage[loginLocalStorage]);
        if (loginConfig != null && "" != loginConfig) {
            $scope.languageNGIf = loginConfig.lang;
        }
    }
});

app.directive('onFinishMealsRender', function() {
    return function(scope, element, attr) {
        if (scope.$last) {
            if(window.innerWidth > 500){
                scope.$emit('ngRepeatFinished');
            }
        }
    };
})