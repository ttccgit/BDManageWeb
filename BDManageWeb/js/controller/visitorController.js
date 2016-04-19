app.controller('instructionController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $interpolate) {
    $('#slider').cycle({
        fx: 'scrollHorz',
        pager: '#pagination',
        speed: 800,
        timeout: 6000,
        slideExpr: '.item',
        pagerAnchorBuilder: pagerFactory,
        prev: '.arrow_l',
        next: '.arrow_r',
        clearCycleTimeOutBefore: true,
        timeOutIdParameter: 'cycleTimeOut',
        pageTurnEvent: function (i) {
            setTimeout(function () {
                var pro = $(".scroll_head .item .instruction:eq(" + i + ")").attr("pro");
                $(".scroll_head .propontos span").html(pro);
            }, 300);
        }
    });

    $scope.next = function () {
        $location.path("/featureRecipes/2");
    };

    $scope.learnMore = function () {
        $location.path("/successStories/2");
    }

    $scope.showLearnBar = function () {

        $("#learnMoreBar").attr("style", "display: block");
        $("#mainBar").attr("style", "display: none");
        $("#simpleBar").attr("style", "display: none");
        $("#barLog").attr("src", "image/nav_logo.png");
        $scope.toggle('mainSidebar');
    }
});

app.controller('featureRecipesController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $routeParams, $interpolate) {

    $scope.mark = $routeParams.mark;
    $('#slider').cycle({
        fx: 'scrollHorz',
        pager: '#pagination',
        speed: 800,
        timeout: 6000,
        stopAutoPlay: true,
        slideExpr: '.item',
        pagerAnchorBuilder: pagerFactory,
        prev: '.arrow_l',
        next: '.arrow_r',
        clearCycleTimeOutBefore: true,
        pageTurnEvent: function (i) {
            setTimeout(function () {
                var pro = $(".scroll_head .item .instruction:eq(" + i + ")").attr("pro");
                $(".scroll_head .propontos span").html(pro);
            }, 300);
            $(".scroll_body .instruction_body").addClass("hide");
            $(".scroll_body .instruction_body:eq(" + i + ")").removeClass("hide");
            $(".information_head .personal_info").addClass("hide");
            $(".information_head .personal_info:eq(" + i + ")").removeClass("hide");
        }
    });

    $scope.moreUrl = moreFeaturedRecipesUrl;

    window.onresize = function () {
        controlScrollBodyHeight();
    };
    $scope.more = function () {
        $(".read_feature_site").addClass("hide");
        $(".static_title_more").addClass("hide");
        $(".static_title_instruction").removeClass("hide");
        $(".static_title_ingredients").addClass("hide");

        $(".information_head").removeClass("hide");
        $(".scroll_body").removeClass("hide");
        $(".scroll_head").addClass("float_pad");
        $(".scroll_body").addClass("float_pad");
        $(".instruction_content").removeClass("hide");
        window.onresize();
    };

    $scope.ingredients = function () {
        $(".read_feature_site").addClass("hide");
        $(".static_title_more").addClass("hide");
        $(".static_title_instruction").addClass("hide");
        $(".static_title_ingredients").removeClass("hide");

        $(".information_head").removeClass("hide");
        $(".scroll_body .instruction_content").addClass("hide");
        $(".scroll_body .ingredient_content").removeClass("hide");
        $(".scroll_head").addClass("float_pad");
        $(".scroll_body").addClass("float_pad");
        window.onresize();
    };

    $scope.instruction = function () {
        $(".read_feature_site").addClass("hide");
        $(".static_title_more").addClass("hide");
        $(".static_title_instruction").removeClass("hide");
        $(".static_title_ingredients").addClass("hide");

        $(".information_head").removeClass("hide");
        $(".scroll_body .instruction_content").removeClass("hide");
        $(".scroll_body .ingredient_content").addClass("hide");
        $(".scroll_head").addClass("float_pad");
        $(".scroll_body").addClass("float_pad");
        window.onresize();
    };
    $scope.showLearnBar = function () {

        if ($scope.mark != null && $scope.mark == 1) {
            $("#mainBar").attr("style", "display: block");
            $("#learnMoreBar").attr("style", "display: none");
            $("#simpleBar").attr("style", "display: none");
            $("#barLog").attr("src", "image/nav_logo.png");
        } else if ($scope.mark != null && $scope.mark == 3) {
            $("#learnMoreBar").attr("style", "display: none");
            $("#mainBar").attr("style", "display: none");
            $("#simpleBar").attr("style", "display: block");
            $("#barLog").attr("src", "image/logo_vigilantesdopeso_red.png");
        } else {
            $("#learnMoreBar").attr("style", "display: block");
            $("#mainBar").attr("style", "display: none");
            $("#simpleBar").attr("style", "display: none");
            $("#barLog").attr("src", "image/nav_logo.png");
        }
        $scope.toggle('mainSidebar');
    };

    $scope.back = function () {
        $(".read_feature_site").removeClass("hide");
        $(".static_title_more").removeClass("hide");
        $(".read_more_site").removeClass("hide");
        $(".static_title_instruction").addClass("hide");
        $(".static_title_ingredients").addClass("hide");
        $(".information_head").addClass("hide");
        $(".scroll_body").addClass("hide");
        $(".scroll_head").removeClass("float_pad");
        $(".scroll_body").removeClass("float_pad");
        if ($scope.mark != null && $scope.mark == 1) {
            $location.path("/featureRecipes/1");
        } else if ($scope.mark != null && $scope.mark == 2) {
            $location.path("/featureRecipes/2");
        } else {
            $location.path("/featureRecipes/3");
        }
    };
});

app.controller('successStoriesController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $routeParams, $interpolate) {
    $scope.mark = $routeParams.mark;
    $('#slider').cycle({
        fx: 'scrollHorz',
        pager: '#pagination',
        speed: 800,
        timeout: 6000,
        stopAutoPlay: true,
        slideExpr: '.item',
        pagerAnchorBuilder: pagerFactory,
        prev: '.arrow_l',
        next: '.arrow_r',
        clearCycleTimeOutBefore: true,
        pageTurnEvent: function (i) {
            $(".scroll_body .instruction_body").addClass("hide");
            $(".scroll_body .instruction_body:eq(" + i + ")").removeClass("hide");
            $(".information_head .personal_info").addClass("hide");
            $(".information_head .personal_info:eq(" + i + ")").removeClass("hide");
            $(".static_title_more").html($scope.$eval($interpolate("{{'success_stories_read_more_name'|translate}}")) + $(".scroll_slider .item:eq(" + i + ") .instruction").text());
        }
    });

    $scope.moreUrl = moreSuccessStoriesUrl;

    window.onresize = function () {
        controlScrollBodyHeight();
    };

    $scope.more = function () {
        $(".read_more_site").addClass("hide");
        $(".static_title_more").addClass("hide");
        $(".static_title_instruction").removeClass("hide");
        $(".static_title_ingredients").addClass("hide");

        $(".information_head").removeClass("hide");
        $(".scroll_body").removeClass("hide");
        $(".scroll_head").addClass("float_pad");
        $(".scroll_body").addClass("float_pad");
        window.onresize();
    };
    $scope.back = function () {
        $(".read_feature_site").removeClass("hide");
        $(".static_title_more").removeClass("hide");
        $(".read_more_site").removeClass("hide");
        $(".static_title_instruction").addClass("hide");
        $(".static_title_ingredients").addClass("hide");
        $(".information_head").addClass("hide");
        $(".scroll_body").addClass("hide");
        $(".scroll_head").removeClass("float_pad");
        $(".scroll_body").removeClass("float_pad");
        if ($scope.mark != null && $scope.mark == 1) {
            $location.path("/successStories/1");
        } else if ($scope.mark != null && $scope.mark == 2) {
            $location.path("/successStories/2");
        } else {
            $location.path("/successStories/3");
        }
    };
    $scope.showLearnBar = function () {

        if ($scope.mark != null && $scope.mark == 1) {
            $("#mainBar").attr("style", "display: block");
            $("#learnMoreBar").attr("style", "display: none");
            $("#simpleBar").attr("style", "display: none");
            $("#barLog").attr("src", "image/nav_logo.png");
        } else if ($scope.mark != null && $scope.mark == 3) {
            $("#learnMoreBar").attr("style", "display: none");
            $("#mainBar").attr("style", "display: none");
            $("#simpleBar").attr("style", "display: block");
            $("#barLog").attr("src", "image/logo_vigilantesdopeso_red.png");
        } else {
            $("#learnMoreBar").attr("style", "display: block");
            $("#mainBar").attr("style", "display: none");
            $("#simpleBar").attr("style", "display: none");
            $("#barLog").attr("src", "image/nav_logo.png");
        }
        $scope.toggle('mainSidebar');
    }

});

app.controller('articlesController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $routeParams, $interpolate) {
    $scope.mark = $routeParams.mark;
    $('#slider').cycle({
        fx: 'scrollHorz',
        pager: '#pagination',
        speed: 800,
        timeout: 6000,
        stopAutoPlay: true,
        slideExpr: '.item',
        pagerAnchorBuilder: pagerFactory,
        prev: '.arrow_l',
        next: '.arrow_r',
        clearCycleTimeOutBefore: true,
        pageTurnEvent: function (i) {
            $(".scroll_body .instruction_body").addClass("hide");
            $(".scroll_body .instruction_body:eq(" + i + ")").removeClass("hide");
        }
    });

    $scope.moreUrl = moreArticlesUrl;

    window.onresize = function () {
        controlScrollBodyHeight();
    };

    $scope.more = function () {
        $(".read_more_site").addClass("hide");
        $(".static_title_more").addClass("hide");
        $(".static_title_instruction").removeClass("hide");
        $(".static_title_ingredients").addClass("hide");

        $(".scroll_body").removeClass("hide");
        $(".scroll_head").addClass("float_pad");
        $(".scroll_body").addClass("float_pad");
        window.onresize();
    };
    $scope.back = function () {
        $(".read_feature_site").removeClass("hide");
        $(".static_title_more").removeClass("hide");
        $(".read_more_site").removeClass("hide");
        $(".static_title_instruction").addClass("hide");
        $(".static_title_ingredients").addClass("hide");
        $(".information_head").addClass("hide");
        $(".scroll_body").addClass("hide");
        $(".scroll_head").removeClass("float_pad");
        $(".scroll_body").removeClass("float_pad");
        if ($scope.mark != null && $scope.mark == 1) {
            $location.path("/articles/1");
        } else if ($scope.mark != null && $scope.mark == 2) {
            $location.path("/articles/2");
        } else {
            $location.path("/articles/3");
        }
    };
    $scope.showLearnBar = function () {

        if ($scope.mark != null && $scope.mark == 1) {
            $("#mainBar").attr("style", "display: block");
            $("#learnMoreBar").attr("style", "display: none");
            $("#simpleBar").attr("style", "display: none");
            $("#barLog").attr("src", "image/nav_logo.png");
        } else if ($scope.mark != null && $scope.mark == 3) {
            $("#learnMoreBar").attr("style", "display: none");
            $("#mainBar").attr("style", "display: none");
            $("#simpleBar").attr("style", "display: block");
            $("#barLog").attr("src", "image/logo_vigilantesdopeso_red.png");
        } else {
            $("#learnMoreBar").attr("style", "display: block");
            $("#mainBar").attr("style", "display: none");
            $("#simpleBar").attr("style", "display: none");
            $("#barLog").attr("src", "image/nav_logo.png");
        }
        $scope.toggle('mainSidebar');
    };

});

app.controller('learnFullAppController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $routeParams, $interpolate) {
    $scope.mark = $routeParams.mark;
    $scope.showLearnBar = function () {
        $("#learnMoreBar").attr("style", "display: block");
        $("#mainBar").attr("style", "display: none");
        $("#simpleBar").attr("style", "display: none");
        $("#barLog").attr("src", "image/nav_logo.png");
        $scope.toggle('mainSidebar');
    };

    $scope.goToSimpleIntroduce = function (type) {
        if (undefined != $routeParams.mark) {
            type = type + "/" + $routeParams.mark;
        }
        $location.path("/visitorSimpleMode").search("type", type);
    };

    $scope.goToTrackIntroduce = function (type) {
        if (undefined != $routeParams.mark) {
            type = type + "/" + $routeParams.mark;
        }
        $location.path("/visitorTrackingMode").search("type", type);
    };
});

app.controller('aboutUsController', function ($rootScope, $scope, httpRequest, analytics, $location, $window, $routeParams, $interpolate) {
    $scope.mark = $routeParams.mark;
    $scope.showLearnBar = function () {

        if ($scope.mark != null && $scope.mark == 2) {
            $("#learnMoreBar").attr("style", "display: block");
            $("#mainBar").attr("style", "display: none");
            $("#simpleBar").attr("style", "display: none");
            $("#barLog").attr("src", "image/nav_logo.png");
        } else if ($scope.mark != null && $scope.mark == 3) {
            $("#learnMoreBar").attr("style", "display: none");
            $("#mainBar").attr("style", "display: none");
            $("#simpleBar").attr("style", "display: block");
            $("#barLog").attr("src", "image/logo_vigilantesdopeso_red.png");
        } else if ($scope.mark != null && $scope.mark == 1) {
            $("#mainBar").attr("style", "display: block");
            $("#learnMoreBar").attr("style", "display: none");
            $("#simpleBar").attr("style", "display: none");
            $("#barLog").attr("src", "image/nav_logo.png");
        }
        $scope.toggle('mainSidebar');
    };

    $scope.goToSimpleIntroduce = function (type) {
        if (undefined != $routeParams.mark) {
            type = type + "/" + $routeParams.mark;
        }
        $location.path("/visitorSimpleMode").search("type", type);
    };

    $scope.goToTrackIntroduce = function (type) {
        if (undefined != $routeParams.mark) {
            type = type + "/" + $routeParams.mark;
        }
        $location.path("/visitorTrackingMode").search("type", type);
    };

    window.onresize = function () {
        if ($("#bodyData").length > 0) {
            var winHeight = getWindowHeight();
            var titleHeight = $("#header").outerHeight();
            var footerHeight = $("#footer").outerHeight();
            $(".myProgress_body").height(winHeight - titleHeight - footerHeight - 45);
        }


        var winHeight = getWindowHeight();
        var logoTitleHeight = $(".logo_position").outerHeight();
        var frameFooterHeight = $(".introduce-frame-footer").outerHeight();
        $(".hwLearnBody").height(winHeight - logoTitleHeight - frameFooterHeight - 45);

    };
    window.onresize();
});


app.controller('visitorTrackingModeController', function ($rootScope, $scope, httpRequest, analytics, $location, $routeParams) {
    myScrollloaded();

    $scope.$watch('$viewContentLoaded', function () {
        var userInfo = JSON.parse(localStorage[userLocalStorage]);
        $scope.name = userInfo.firstName;
        $scope.gender = parseInt(userInfo.gender);
    });

    $scope.goToSimpleMode = function () {
        $location.path("/visitorSimpleMode").search("type", $routeParams.type);
    };

    $scope.prevPage = function () {
        $location.path($routeParams.type);
    };

});

app.controller('visitorSimpleModeController', function ($rootScope, $scope, httpRequest, analytics, $location, $routeParams) {
    myScrollloaded();

    $scope.$watch('$viewContentLoaded', function () {
        var userInfo = JSON.parse(localStorage[userLocalStorage]);
        $scope.gender = parseInt(userInfo.gender);
    });

    $scope.goToTrackMode = function () {
        $location.path("/visitorTrackingMode").search("type", $routeParams.type);

    };

    $scope.prevPage = function () {
        $location.path($routeParams.type);
    };
});


app.controller('testController', function ($rootScope, $scope, httpRequest, analytics, $location, $routeParams) {
    $scope.slides = [
        {image: 'images/visitor/4fitness.png', description: 'Image 00'},
        {image: 'images/visitor/7simple.png', description: 'Image 01'},
        {image: 'images/visitor/9_ways.png', description: 'Image 02'},
        {image: 'images/visitor/9tip.png', description: 'Image 03'},
        {image: 'images/visitor/10way.png', description: 'Image 04'}
    ];

    $scope.direction = 'left';
    $scope.currentIndex = 0;

    $scope.setCurrentSlideIndex = function (index) {
        $scope.direction = (index > $scope.currentIndex) ? 'left' : 'right';
        $scope.currentIndex = index;
    };

    $scope.isCurrentSlideIndex = function (index) {
        return $scope.currentIndex === index;
    };

    $scope.prevSlide = function () {
        $scope.direction = 'left';
        $scope.currentIndex = ($scope.currentIndex < $scope.slides.length - 1) ? ++$scope.currentIndex : 0;
    };

    $scope.nextSlide = function () {
        $scope.direction = 'right';
        $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.slides.length - 1;
    };
});
