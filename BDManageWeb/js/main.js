window.showLoading = function () {
    $(".loadingDiv").css("display", "block");
};

window.hideLoading = function () {
    $(".loadingDiv").css("display", "none");
};

function checkedSelect(_this) {
    var $parent = $(_this).parent(".selectBar");
    if ($parent != null && $parent.length > 0) {
        var btns = $parent.find(".btn");
        if (btns != null && btns.length > 0) {
            $.each(btns, function (i, item) {
                if (item != _this) {
                    $(item).removeClass("checked");
                }
            });
        }
    }
    $(_this).addClass("checked");
}

function checkedChanged(_this) {
    if (isCheckedCustom($(_this))) {
        $(_this).attr("src", "image/icon/fgt_button_unselect.png");
    }
    else {
        $(_this).attr("src", "image/icon/fgt_button_select.png");
    }
}

function isCheckedCustom($obj) {
    if ($obj.attr("src").indexOf("fgt_button_select.png") >= 0) {
        return true;
    }
    return false;
}

function pagerFactory(idx, slide) {
    return '<li><a href="#"  class="nav_button"><span>' + (idx + 1) + '</span></a></li>';
}

function firstCapitalReg(str) {
    str = str.toLowerCase();
    return str.replace(/\b(\w)|\s(\w)/g, function (m) {
        return m.toUpperCase()
    })
}

var myScroll;

function myScrollloaded() {
    myScroll = new iScroll('wrapper', {
        snap: true,
        momentum: false,
        hScrollbar: false,
        vScrollbar: false,
        onBeforeScrollStart: null,
        use3d: false,
        onScrollEnd: function () {
            document.querySelector('#indicator > li.active').className = '';
            document.querySelector('#indicator > li:nth-child(' + (this.currPageX + 1) + ')').className = 'active';
            if (this.currPageX + 1 != 5) {
                $(".simpleNav").show();
                $("#simpleFoot").show();
                $("#backIcon").hide();
            } else {
                $(".simpleNav").hide();
                $("#simpleFoot").hide();
                $("#backIcon").show();
            }
        }
    });
}

function nextPage(){
    myScroll.scrollToPage('next', 0);
}

function quickMotivation() {
    myScroll.scrollToPage('last', 0);
    $("#backIcon").show();
}

function prevPage() {
    myScroll.scrollToPage('prev', 0);
    $("#backIcon").show();
}

function clientTimeZone() {
    var munites = new Date().getTimezoneOffset();
    var hour = parseInt(munites / 60);
    var munite = munites % 60;
    var prefix = "-";

    if (hour < 0 || munite < 0) {
        prefix = "+";
        hour = -hour;
        if (munite < 0) {
            munite = -munite;
        }
    }

    hour = hour + "";
    munite = munite + "";

    if (hour.length == 1) {
        hour = "0" + hour;
    }

    if (munite.length == 1) {
        munite = "0" + munite;
    }
    return prefix + hour + munite;
}

function controlScrollBodyHeight() {
    if ($(".scroll_body.float_pad").length > 0) {
        if ($(".scroll_body.float_pad").css("float") == "left") {
            var winHeight = getWindowHeight();
            var divHeight = winHeight - $(".scroll_body.float_pad").position().top - 25;
            var headHeight = $(".scroll_head").height();
            if (headHeight != null && headHeight > divHeight) {
                divHeight = headHeight;
            }
            $(".scroll_body.float_pad").css("height", divHeight);
        }
        else {
            $(".scroll_body.float_pad").css("height", "auto");
        }
    }
}

function isFavorite(obj) {
    if ($(obj).attr("src").indexOf("icon_red") >= 0) {
        return true;
    }
    return false;
}

function getMealTime() {
    var dateTime = new Date().format("HH:MM");
    if (dateTime >= '18:00') {
        return MealTime.Dinner;
    }
    else if (dateTime >= '15:00') {
        return MealTime.Snacks;
    }
    else if (dateTime >= '11:31') {
        return MealTime.Lunch;
    }
    else {
        if (dateTime < '02:00') {
            return MealTime.Dinner;
        }
        else if (dateTime < '06:00') {
            return MealTime.Snacks;
        }
    }
    return MealTime.Breakfast;
}