/**
 * Created by Tiffany.Zhou on 6/9/14.
 */
// validate the email is valid
function isEmail(aEmail) {
    var bValidate = RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/).test(aEmail);
    if (bValidate) {
        return true;
    } else {
        return false;
    }
}
// at least one number and at least one letter
function isPassword(aPassword) {
//    var bValidate = RegExp(/^(?![0-9]+$)(?![a-zA-Z]+$){8,20}$/).test(aPassword);
    var bValidate = RegExp(/^(?=.*\d.*)(?=.*[a-zA-Z].*).{8,20}$/).test(aPassword);
    if (bValidate) {
        return true;
    } else {
        return false;
    }
}

function isContainStr(aPassword, str) {
    if ("" != str && undefined != str) {
        if (aPassword.toLowerCase().indexOf(str.toLowerCase()) > -1) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }

}

// validate the phone is valid
function isPhone(aPhone) {
    return aPhone.match("^[0-9]{0,2}[-]{0,1}[0-9]{0,9}$");
}


function isInvalidMPhone(MPhone) {
    return MPhone.match("^[0-9]{0,2}[-]{0,1}[0-9]{0,9}$");
}

// validate the string is integer
function isInteger(s) {
    var isInteger = RegExp(/^[0-9]+$/);
    return (isInteger.test(s));
}


// press the enter key,focus the next control
function handleEnter(field, event) {
    var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
    if (keyCode == 13) {
        var i;
        for (i = 0; i < field.form.elements.length; i++)
            if (field == field.form.elements[i])
                break;
        i = (i + 1) % field.form.elements.length;
        field.form.elements[i].focus();
        return false;
    }
    else {
        return true;
    }
}

function validationCPF(CPF, $scope, $interpolate) {
    CPF = CPF.replace(/\D/g, "");

    if (CPF != "") {
        var c = CPF.substr(0, 9);
        var dv = CPF.substr(9, 2);
        var d1 = 0;

        for (var i = 0; i < 9; i++) {
            d1 = d1 + parseInt(c.charAt(i)) * (10 - i);
        }

        if (d1 == 0) {
            alertWarning($scope.$eval($interpolate("{{'message_login_cpf'|translate}}")), $scope, $interpolate);
            return false;
        }

        d1 = 11 - (d1 % 11);

        if (d1 > 9) d1 = 0;

        if (dv.charAt(0) != d1) {
            alertWarning($scope.$eval($interpolate("{{'message_login_cpf'|translate}}")), $scope, $interpolate);
            return false;
        }

        d1 *= 2;

        for (i = 0; i < 9; i++) {
            d1 += parseInt(c.charAt(i)) * (11 - i);
        }

        d1 = 11 - (d1 % 11);

        if (d1 > 9) d1 = 0;

        if (dv.charAt(1) != d1) {
            alertWarning($scope.$eval($interpolate("{{'message_login_cpf'|translate}}")), $scope, $interpolate);
            return false;
        }
        return true;
    }
}

function validationCPFFormat(cpf, scope, evt, win) {
    cpf = cpf.replace(/[^\d]/g, '');
    if (cpf.length > 3) {
        var d1 = cpf.substring(0, 3);
        var d2 = cpf.substring(3);
        cpf = d1 + "." + d2;
    }
    if (cpf.length > 7) {
        var d1 = cpf.substring(0, 7);
        var d2 = cpf.substring(7);
        cpf = d1 + "." + d2;
    }
    if (cpf.length > 11) {
        var d1 = cpf.substring(0, 11);
        var d2 = cpf.substring(11);
        cpf = d1 + "-" + d2;
    }
    if (cpf == "") {
        scope.cpf = "";
    } else {
        scope.cpf = cpf;
    }
}

function validationBirthdayFormat(scope) {
    var birthday = scope.birthday.replace(/[^\d]/g, '');

    if (birthday.length > 2 && birthday.length < 4) {
        scope.birthday = birthday.substring(0, 2) + "/" + birthday.substring(2);
    }
    if (birthday.length > 4) {
        scope.birthday = birthday.substring(0, 2) + "/" + birthday.substring(2, 4) + "/" + birthday.substring(4);
    }
    if (birthday.length > 8) {
        birthday = birthday.substring(0, 8);
    }
    if (birthday == "") {
        scope.birthday = birthday;
    }
}


function isInvalidCPF(cpf) {

    return cpf.match("^[0-9]{9}-[0-9]{2}$");
}

function isInvalidActCode(actCode) {
    return actCode.match("^[A-Za-z0-9]{8}$");
}

function isValidZipCode(cpf) {
    return cpf.match("^[0-9]{5}-[0-9]{3}$");
}

function diffMonths(startDate, endDate) {
    var number = 0;
    if (startDate != null && endDate != null) {
        var yearToMonth = (endDate.getFullYear() - startDate.getFullYear()) * 12;
        number += yearToMonth;
        var monthToMonth = endDate.getMonth() - startDate.getMonth();
        number += monthToMonth;
        var endDay = endDate.getDate();
        var startDay = startDate.getDate();
        var dayStep = endDay - startDay;

        if (dayStep >= 1) {
            if (number >= 0) {
                number += 1;
            }
        }
        else if (dayStep <= -1) {
            number -= 1;
        }
    }
    return number;
}

function diffYears(startDate, endDate) {
    var year = diffMonths(startDate, endDate) / 12;
    if (year < 0 && year > -1) {
        return year;
    }
    return Math.floor(year);
}

function getAge(strStartDate) {
    var startDate = new Date(Date.parse(strStartDate.replace(/-/g, "/")));
    var age = diffYears(startDate, new Date());
    return age;
}

function updateChart(weightTrackers, innerWidth, type) {
    if (weightTrackers == null || weightTrackers.length == 0)
        return;

    var lines = [];
    var linesGoal = [];

    var linesBasic = [];
    var linesLarge = [];
    var linesSmall = [];
    var linesWeight = [];

    var maxTrackWeight = 0;
    for (var p = 0; p < weightTrackers.length; p ++) {
        if (weightTrackers[p].weight != "") {
            if (weightTrackers[p].weight > maxTrackWeight) {
                maxTrackWeight = weightTrackers[p].weight;
            }
        }
    }
//    var baseValue = weightTrackers[weightTrackers.length - 1].weight;
//    var goalWeight = weightTrackers[weightTrackers.length - 1].weightGoal;
//    var interval = Math.round((baseValue - goalWeight) / 1.3);
    var baseValue = maxTrackWeight * 1.5;
    var interval = parseInt(baseValue / 4);

    var xaxis = {
        renderer: $.jqplot.DateAxisRenderer,
        tickOptions: {
            formatString: '%d/%m',
            mark: 'inside',
            showMark: true,
            showGridLine: false,
            show: true,
            fontSize: '10px',
            angle: -40,
            fontWeight: 'lighter',
            fontStretch: 1
        }
    };

    var line = [];
    var lineGoal = [];

    var lineBasic = [];
    var lineLarge = [];
    var lineSmall = [];
    var lineWeight = [];

    var weight = "";
    var tempLines = [];
    var tempDate = "";
    if (innerWidth < 500) {
        weight = weightTrackers[0].weight;
        for (var j = weightTrackers.length - 1; j >= 0; j--) {
            line = null;
            lineGoal = null;

            lineBasic = null;
            lineLarge = null;
            lineSmall = null;
            lineWeight = null;

            line = [];
            lineGoal = [];

            lineBasic = [];
            lineLarge = [];
            lineSmall = [];
            lineWeight = [];

            if (linesGoal.length == 4) {
                break;
            }

            line.push(weightTrackers[j].pageWeekDate);
            line.push(weightTrackers[j].weight);
            lineWeight.push(weightTrackers[j].pageWeekDate);
            lineWeight.push(parseFloat(weightTrackers[j].weight) + 10);

//            if (weightTrackers[j].weight != "") {
//                weight = weightTrackers[j].weight;
//                line.push(weightTrackers[j].weight);
//            } else {
//                line.push(weight);
//            }
//            if (weightTrackers[j].weight != "") {
//                line.push(weightTrackers[j].weight);
//            } else {
//                continue;
//            }
            if (weightTrackers[j].showMileston == "") {
                tempDate = weightTrackers[j].pageWeekDate;
                if (weightTrackers[j].weight != "") {
                    line.push('<img class="position_star" src="image/stars/noStar.png"/>');
                    lineWeight.push(weightTrackers[j].weight + " kg");
                } else {
                    line.push("");
                    lineWeight.push("");
                }
            } else {
                line.push('<img ng-click="updateWeight()" class="position_star" src="' + weightTrackers[j].showMileston + '"/>');
//                lineWeight.push('<img ng-click="updateWeight()" class="position_star" src="' + weightTrackers[j].showMileston + '"/>');
            }
            lines.push(line);
            linesWeight.push(lineWeight);
            if (j == weightTrackers.length - 2) {
                lineGoal.push(weightTrackers[j].pageWeekDate, weightTrackers[j].weightGoal, "Meta de peso");
                lineSmall.push(weightTrackers[j].pageWeekDate, interval, interval + " kg");
                lineBasic.push(weightTrackers[j].pageWeekDate, 2 * interval, 2 * interval + " kg");
                lineLarge.push(weightTrackers[j].pageWeekDate, 3 * interval, 3 * interval + " kg");
            } else {
                lineGoal.push(weightTrackers[j].pageWeekDate, weightTrackers[j].weightGoal, "");
                lineSmall.push(weightTrackers[j].pageWeekDate, interval, "");
                lineBasic.push(weightTrackers[j].pageWeekDate, 2 * interval, "");
                lineLarge.push(weightTrackers[j].pageWeekDate, 3 * interval, "");
            }
            linesGoal.push(lineGoal);
            linesSmall.push(lineSmall);
            linesBasic.push(lineBasic);
            linesLarge.push(lineLarge);
        }


        $(".weekBar").addClass("hide");
        $("#plotChart").css("width", "100%");

        if (linesGoal.length > 1) {
            if (new Date(linesGoal[linesGoal.length - 1][0]) >= new Date(Date.parse(new Date(linesGoal[0][0])) - (86400000 * 7) * 4)) {
                xaxis.tickInterval = '1 week';
            }
        } else {
            xaxis.tickInterval = '1 week';
        }
        lines.reverse();
        var displayLines = [];
        for (var k = 0; k < lines.length; k++) {
            if (lines[k][1] != "") {
                weight = lines[k][1];
                if (tempLines.length > 0) {
                    for (var p = 0; p < tempLines.length; p++) {
                        displayLines.push(tempLines[p]);
                    }
                }
                displayLines.push(lines[k]);
            } else {
                lines[k][1] = weight;
                tempLines.push(lines[k]);
            }
        }
        lines.length = 0;
        lines = displayLines;
        linesWeight.reverse();
        linesGoal.reverse();
    } else {
        var now = null;
        if (type && type != 0) {
            now = new Date(new Date().toDateString());
            if (type == 1) {
                //12 weeks
                now = new Date(Date.parse(now) - (86400000 * 7) * 12);
            }
            else if (type == 2) {
                //24 weeks
                now = new Date(Date.parse(now) - (86400000 * 7) * 24);
            }
            else {
                //12 months
                now = new Date((now.getFullYear() - 1), now.getMonth(), now.getDate());
            }
            now = new Date(Date.parse(now) - (86400000 * now.getDay()));
        }
        for (var i = 0; i < weightTrackers.length; i++) {
            line = null;
            lineGoal = null;

            lineBasic = null;
            lineLarge = null;
            lineSmall = null;
            lineWeight = null;

            line = [];
            lineGoal = [];

            lineBasic = [];
            lineLarge = [];
            lineSmall = [];
            lineWeight = [];

            if (now) {
                if (weightTrackers[i].pageWeekDate && weightTrackers[i].pageWeekDate != "") {
                    if (new Date(parseInt(weightTrackers[i].weekDate)) < now) {
                        continue;
                    }
                }
                else
                    continue;
            }

            var hasWeight = true;
            line.push(weightTrackers[i].pageWeekDate);
            lineWeight.push(weightTrackers[i].pageWeekDate);

            if (weightTrackers[i].weight != "") {
                hasWeight = true;
                weight = weightTrackers[i].weight;
                line.push(weightTrackers[i].weight);
                lineWeight.push(parseFloat(weightTrackers[i].weight) + 10);
            } else {
                hasWeight = false;
                line.push(weight);
                lineWeight.push(weight);
            }

            if (weightTrackers[i].showMileston == "") {
                if (weightTrackers[i].weight != "") {
                    line.push('<img class="position_star" src="image/stars/noStar.png" />');
                    lineWeight.push(weightTrackers[i].weight + " kg");
                } else {
                    line.push("");
                    lineWeight.push("");
                }
            } else {
                line.push('<img ng-click="updateWeight()" onclick="chartPointClick(' + i + ');" class="position_star" src="' + weightTrackers[i].showMileston + '"/>');
//                lineWeight.push('<img ng-click="updateWeight()" onclick="chartPointClick(' + i + ');" class="position_star" src="' + weightTrackers[i].showMileston + '"/>');
            }

            if (hasWeight) {
                if (tempLines.length > 0) {
                    for (var m = 0; m < tempLines.length; m ++) {
                        lines.push(tempLines[m]);
                        linesWeight.push(tempLines[m]);
                    }
                }
                lines.push(line);
                linesWeight.push(lineWeight);
                tempLines.length = 0;
            } else {
                tempLines.push(line);
            }

            if (weightTrackers[i].weightGoal != "") {
                weightGoal = weightTrackers[i].weightGoal;
            }
            if (i == weightTrackers.length - 2) {
                lineGoal.push(weightTrackers[i].pageWeekDate, weightTrackers[i].weightGoal, "Meta de peso");
                lineSmall.push(weightTrackers[i].pageWeekDate, interval, interval + " kg");
                lineBasic.push(weightTrackers[i].pageWeekDate, 2 * interval, 2 * interval + " kg");
                lineLarge.push(weightTrackers[i].pageWeekDate, 3 * interval, 3 * interval + " kg");
            } else {
                lineGoal.push(weightTrackers[i].pageWeekDate, weightTrackers[i].weightGoal, "");
                lineSmall.push(weightTrackers[i].pageWeekDate, interval, "");
                lineBasic.push(weightTrackers[i].pageWeekDate, 2 * interval, "");
                lineLarge.push(weightTrackers[i].pageWeekDate, 3 * interval, "");
            }
            linesGoal.push(lineGoal);
            linesSmall.push(lineSmall);
            linesBasic.push(lineBasic);
            linesLarge.push(lineLarge);
        }

        $(".weekBar").removeClass("hide");
        if (50 * lines.length > $(".chartArea").width()) {
            $("#plotChart").css("width", 50 * lines.length + "px");
            $(".chartArea")[0].scrollLeft = 50 * lines.length;
        }
        else {
            $("#plotChart").css("width", "100%");
        }
        xaxis.tickInterval = '1 week';
    }


    if (lines.length < 1) {
        xaxis.min = tempDate;
        line.push(tempDate);
        line.push(weightTrackers[0].weight);
        line.push("");
        lines.length = 0;
        lines.push(line);
    } else {
        xaxis.min = lines[0][0] + " 01:00:00";
        xaxis.max = linesGoal[linesGoal.length - 1][0];
    }
    var weightPlot = $.jqplot('plotChart', [lines, linesGoal,linesSmall,linesBasic,linesLarge,linesWeight], {
        axes: {
            xaxis: xaxis,
            yaxis: {
                tickOptions: {
                    mark: 'inside',
                    showMark: false,
                    showGridLine: false,
                    show: false,
                    fontSize:'10px',
                    angle:80,
                    fontWeight:'lighter',
                    fontStretch:1
                },
//                min: linesGoal[0][1] * 0.5,
                tickInterval: '5'
            }
        },
        seriesDefaults: {
            showMarker: false
        },
        seriesColors: ["#679C34", "#FFDB00", "#000000", "#000000", "#000000","#FF0000"],
        series:[
            {
                lineWidth:1,
                fill:true,
                fillColor:'#d5efa9',
                fillAlpha:'0.6',
                fillAndStroke: true,
                pointLabels: {
                    show: true,
                    escapeHTML: false,
                    location: 'w',
                    ypadding: -10,
                    xpadding: -5
                }
            },
            {
                lineWidth:2,
                fill:false,
                pointLabels: {
                    show: true,
                    escapeHTML: false,
                    location: 'sw',
                    ypadding: 1,
                    xpadding: 30
                }
            },
            {
                lineWidth:0.3,
                fill:false,
                pointLabels: {
                    show: true,
                    escapeHTML: false,
                    ypadding: 1,
                    xpadding: -5
                }
            },
            {
                lineWidth:0.3,
                fill:false,
                pointLabels: {
                    show: true,
                    escapeHTML: false,
                    ypadding: 1,
                    xpadding: -5
                }
            },
            {
                lineWidth:0.3,
                fill:false,
                pointLabels: {
                    show: true,
                    escapeHTML: false,
                    ypadding: 1,
                    xpadding: -5
                }
            },
            {
            showLine:false,
            pointLabels: {
                show: true,
                escapeHTML: false,
                location: 'w',
                ypadding: -10,
                xpadding: -5
            }
          }
        ]
    });
}

function chartPointClick(i) {
    var e = window.event || arguments.callee.caller.arguments[0];
    var wt = JSON.parse(sessionStorage[trackingLocalStorage])[i];
    $("#trackerDate").html(wt.pageWeekDate);
    $("#trackWeight").html(wt.weight);
    $(".container-box").removeClass("hide");

    var width = $(".container-box").width();

    $(".container-box").css({
        "left": e.clientX - 20 + "px",
        "top": e.clientY + $(".app").scrollTop() - 60 + "px",
        "width": (width + 10) + "px"
    }).removeClass("hide");
}

function getFloatFormatByLanguage(language) {
    var languageName = null;
    if (language != null) {
        languageName = getLanguageNameContainInEnum(language);
    }
    if (languageName == null) {
        language = "pt_BR";
        if (localStorage[loginLocalStorage] != null) {
            var loginConfig = JSON.parse(localStorage[loginLocalStorage]);
            if (loginConfig != null && loginConfig != '') {
                language = loginConfig.lang;
            }
        }
        languageName = getLanguageNameContainInEnum(language);
    }
    if (languageName != null) {
        var format = eval("FloatFormatLanguageMapping." + languageName);
        if (format != null) {
            return format;
        }
    }

    return FloatFormat.Normal;
}

function getLanguageNameContainInEnum(language) {
    var langs = getEnumAttributes(Languages);
    for (var i = 0; i < langs.length; i++) {
        if (langs[i].value == language) {
            return langs[i].name;
        }
    }
    return null;
}

function limitDecimalDigitsByLanguage(value, interNum, decimalNum, language) {
    if (value != null) {
        var format = getFloatFormatByLanguage(language);
        if (format == FloatFormat.Comma) {
            return limitCommaDecimalDigits(value, interNum, decimalNum);
        }
        return limitDecimalDigits(value, interNum, decimalNum);
    }
    return null;
}

function limitDecimalDigits(value, interNum, decimalNum) {
    if (value != null) {
        value = value.toString();
        value = value.replace(/[^\d.]/g, ""); //clear except number and point
        value = value.replace(/^\./g, ""); //first letter must be number
        value = value.replace(/\.{2,}/g, "."); //only keep one point
        value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        value = value.replace(/^(-?\\d+)(\\.\\d+)?$/, '');

        value = validateDecimalDigits(value, interNum, decimalNum, '.');
    }

    if (value && !isNaN(parseFloat(value)))
        return value;

    return null;
}

function validateDecimalDigits(value, interNum, decimalNum, point) {
    if (value != null && value.length > 0) {
        var index = value.indexOf(point);
        var intPart = "";
        var decimalPart = "";
        var hasPoint = false;
        if (index < 0) {
            intPart = value;
        }
        else {
            intPart = value.substring(0, index);
            decimalPart = value.substring(index + 1, value.length);
            hasPoint = true;
        }

        if (interNum > 0) {
            if (intPart.length > interNum) {
                if (!hasPoint) {
                    decimalPart = intPart.substring(interNum, intPart.length);
                }
                intPart = intPart.substring(0, interNum);
            }
        }

        if (decimalNum >= 0 && decimalPart.length > decimalNum) {
            decimalPart = decimalPart.substring(0, decimalNum);
        }

        if (decimalPart.length > 0) {
            decimalPart = point + decimalPart;
        }
        else if (hasPoint) {
            decimalPart = point;
        }

        value = intPart + decimalPart;
    }
    return value;
}

function toFloatByValue(strValue) {
    if (strValue != null) {
        strValue = strValue.toString();
        var value = parseFloat(strValue);
        if (!isNaN(value)) {
            return value;
        }
    }
    return null;
}

function limitCommaDecimalDigits(value, interNum, decimalNum) {
    //use "," instead of "." for point
    if (value != null) {
        value = value.toString();
        value = value.replace(/\./g, ","); //replace "." to ","
        value = value.replace(/[^\d,]/g, ""); //clear except number and point
        value = value.replace(/\,{2,}/g, ","); //only keep one point
        value = value.replace(/^\,/g, ""); //first letter must be number
        value = value.replace(",", "$#$").replace(/\,/g, "").replace("$#$", ",");
        value = value.replace(/^(-?\\d+)(\\,\\d+)?$/, '');

        value = validateDecimalDigits(value, interNum, decimalNum, ',');
    }
    if (isCommaFloat(value))
        return value;

    return null;
}

function isCommaFloat(value) {
    var fValue = toFloatByComma(value);
    if (fValue != null)
        return true;

    return false;
}

function toFloatByComma(value) {
    if (value != null) {
        value = value.toString();
        value = value.replace(/\,/g, '.');
        var fValue = parseFloat(value);
        if (!isNaN(fValue))
            return fValue;
    }
    return null;
}

function toFloatByLanguage(value, language) {
    if (value != null) {
        var format = getFloatFormatByLanguage(language);
        if (format == FloatFormat.Comma) {
            return toFloatByComma(value);
        }
        return toFloatByValue(value);
    }
    return null;
}

function toFloatFormatString(value, language) {
    if (value != null) {
        var format = getFloatFormatByLanguage(language);
        if (format == FloatFormat.Comma) {
            return toCommaString(value);
        }
        return value.toString();
    }
    return null;
}

function toCommaString(value) {
    if (value != null) {
        value = value.toString();
        value = value.replace('.', ',');
        return value;
    }
    return null;
}

String.prototype.toFloatFormatString = function () {
    return toFloatFormatString(this.toString());
}

Number.prototype.toFloatFormatString = function () {
    return toFloatFormatString(this.toString());
}

function getWeekDay(date) {
    var milliseconds = (date.getHours() * 60 * 60 + date.getMinutes() * 60 + date.getSeconds()) * 1000 + date.getMilliseconds();
    var weekDate = (date.getTime()) - ((date.getDay()) * 86400000) - milliseconds;
    return weekDate;
}

function getWeeHoursDay(date) {
    var milliseconds = (date.getHours() * 60 * 60 + date.getMinutes() * 60 + date.getSeconds()) * 1000 + date.getMilliseconds();
    return (date.getTime() - milliseconds);
}

function getWindowHeight() {
    var winHeight = 0;
    //get window's height
    if (window.innerHeight) {
        winHeight = window.innerHeight;
    }
    else if ((document.body) && (document.body.clientHeight)) {
        winHeight = document.body.clientHeight;
    }
    //get the window size deep through document on the body
    if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
        winHeight = document.documentElement.clientHeight;
    }
    return winHeight;
}

function expandDiv(div) {
    if (false == $(".ul_none_li").hasClass("deleteIcon") && false == $(".ul_none_li").hasClass("deleteIconEx")) {
        if ($(div.lastElementChild).css("display") == "block") {
            $(div.lastElementChild).css("display", "none");
            $(div.firstElementChild).attr("src", "image/shrink.png");
        } else {
            $(div.lastElementChild).css("display", "block");
            $(div.firstElementChild).attr("src", "image/unfold.png");
        }
    }
}

function faq(obj) {
    if ($(obj).next("p").is(":hidden")) {
        $(obj).addClass("arrow_change").removeClass("border_bottom_gray");
        $(obj).next("p").show().addClass("border_bottom_gray");
    } else {
        $(obj).removeClass("arrow_change").addClass("border_bottom_gray");
        $(obj).next("p").hide().removeClass("border_bottom_gray");
    }
}

function showQuickMenu() {
    $("#quickMenu").slideToggle("fast");
    $(".border_top_devide").click(function () {
        $("#quickMenu").hide();
    });
    $(".searchDiv").click(function () {
        $("#quickMenu").hide();
    });

}

function getObjAttributeNames(obj) {
    var methods = new Array();
    for (key in obj) {
        methods.push(key);
    }
    return methods;
}

function getObjAttributeNameByValue(obj, value) {
    for (key in obj) {
        if (eval('obj.' + key) == value) {
            return key;
        }
    }
    return null;
}

function getEnumAttributes(obj) {
    var methods = new Array();
    for (key in obj) {
        var element = new Object();
        element.name = key;
        element.value = eval('obj.' + key);
        methods.push(element);
    }
    return methods;
}

function calculateFoodPoints(Protein, Carbs, Fat, Fiber, alcohol, service) {
    if (alcohol == null || alcohol == "") {
        alcohol = 0;
    }
    if (service == null || service == "") {
//        return Math.round(((Protein * 0.8 * 4) + (Carbs * 0.95 * 4) + (Fat * 9 * 1) + (Fiber * 0.25 * 4) + (alcohol * 1 * 9)) / 35.0);
        return ((Protein * 0.8 * 4) + (Carbs * 0.95 * 4) + (Fat * 9 * 1) + (Fiber * 0.25 * 4) + (alcohol * 1 * 9)) / 35.0;
    }
//    return Math.round(service * (((Protein * 0.8 * 4) + (Carbs * 0.95 * 4) + (Fat * 9 * 1) + (Fiber * 0.25 * 4) + (alcohol * 1 * 9)) / 35.0));
    return service * (((Protein * 0.8 * 4) + (Carbs * 0.95 * 4) + (Fat * 9 * 1) + (Fiber * 0.25 * 4) + (alcohol * 1 * 9)) / 35.0);
}

function calculateRecipePoints(ingredients, alcohol, service) {
    if (alcohol == null || alcohol == "") {
        alcohol = 0;
    }
    var point = 0;
    for (var j = 0; j < ingredients.length; j++) {
        point = point + ((ingredients[j].protein * service * 0.8 * 4) + (ingredients[j].carbohydrates * service * 0.95 * 4) + (ingredients[j].fat * service * 9 * 1) + (ingredients[j].fiber * service * 0.25 * 4) + (alcohol * service * 1 * 9)) / 35.0;
    }
//    return Math.round(point);
    return point;
}

function calculateActivityPoints(Intensity, weight, Duration) {
    return Math.round((IntensityConst[Intensity] * weight * Duration) / 70.0);
}

function max3(num) {
    var arr = num.split("");
    var max;
    if (arr.length > 3) {
        max = arr[0] + arr[1] + arr[3];
    } else {
        max = num;
    }
    return max;
}

function showEditBorder(obj) {
    $(obj).prev().addClass("borerInput");
    $(obj).prev().removeAttr("readonly");
    $(obj).prev().focus();
}

function showEditHeight(obj) {
//    alertWarning($scope.$eval($interpolate("{{'message_setting_enter_goal_weight'|translate}}")), $scope, $interpolate);
    $(obj).prev().prev().addClass("borerInput");
    $(obj).prev().prev().removeAttr("readonly");
    $(obj).prev().prev().focus();
}

function showEditReason(obj) {
    $("#reason").show();
    $("#showReason").hide();
    $("#icon_write").hide();
    $("#reason").focus();
}

function supersedeSelect(obj) {
    $(obj).prev().prev().hide();
    $(obj).prev().removeClass("hideClass");
    $(obj).prev().focus();
}


function getDay(val) {
    var day = "";
    switch (val) {
        case 2:
            day = "Terça-feira";
            break;
        case 3:
            day = "Quarta-feira";
            break;
        case 4:
            day = "Quinta-feira";
            break;
        case 5:
            day = "Sexta-feira";
            break;
        case 6:
            day = "Sábado";
            break;
        case 7:
            day = "Domingo";
            break;
        case 1:
            day = "Segunda-feira";
            break;
    }
    return day;
}

function checkWeightLossDPT(currentDPT, nurseType, mode) {
    var currentDPTNumber = parseInt(currentDPT);
    var standardMin = "";
    var standardMax = "";
    var DPTArrange = [];
    if (mode == 0) {
        standardMin = currentDPTNumber - 3;
        standardMax = currentDPTNumber + 3;
        if ('F' == nurseType) {
            standardMin = standardMin > 40 ? standardMin : 40;
            standardMax = standardMax < 85 ? standardMax : 85;
        } else if ('P' == nurseType) {
            standardMin = standardMin > 33 ? standardMin : 33;
            standardMax = standardMax < 78 ? standardMax : 78;
        } else {
            standardMin = standardMin > 26 ? standardMin : 26;
            standardMax = standardMax < 71 ? standardMax : 71;
        }
    } else {
        standardMin = currentDPTNumber - 6;
        standardMax = currentDPTNumber + 6;
        if ('F' == nurseType) {
            standardMin = standardMin > 40 ? standardMin : 40;
            standardMax = standardMax < 91 ? standardMax : 91;
        } else if ('P' == nurseType) {
            standardMin = standardMin > 33 ? standardMin : 33;
            standardMax = standardMax < 84 ? standardMax : 84;
        } else {
            standardMin = standardMin > 26 ? standardMin : 26;
            standardMax = standardMax < 77 ? standardMax : 77;
        }
    }
    DPTArrange.push(standardMin);
    DPTArrange.push(standardMax);
    return DPTArrange;
}

function isATF() {
    if (isContainStr(navigator.userAgent, "Android") && isContainStr(navigator.userAgent, "Tablet") && isContainStr(navigator.userAgent, "Firefox")) {
        return true;
    } else {
        return false;
    }
}

function formatDate(str) {
    if (!Modernizr.inputtypes.date) {
        return  str;
    }
    var d = str.split("-");
    return d[0] + "/" + d[1] + "/" + d[2];
}

function stripScript(s) {
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\\\[\\].<>/?~！@#￥……&*（）;_—|{}【】‘；：”“'。，、？-]")
    var rs = "";
    for (var i = 0; i < s.length; i++) {
        rs = rs + s.substr(i, 1).replace(pattern, " ");
    }
    return rs;
}

function calculateDPT(scope,currentWeight,gender,isNursing,isFullTime) {
//    var gender = scope.gender;
    var gender = gender;
    var TEE = 0;
    var additionPoint = 0;

    var age = getAge(scope.birthday.split("/")[2] + "-" + scope.birthday.split("/")[1] + "-" + scope.birthday.split("/")[0]);
    var weight = toFloatByLanguage(currentWeight);
    var height = (toFloatByLanguage(scope.height) / 100).toFixed(2);
    if (gender == 0) { //female
        if (age < 17) {
            return girlDPT[age];
        }
        if (age == 17) {
            var now = new Date();
            var month = now.getMonth() + 1;
            var day = now.getDate();
            if (parseInt(scope.birthday.split("/")[1]) == month && parseInt(scope.birthday.split("/")[0]) == day) {
                return girlDPT[age - 1];
            }
        }
        TEE = 387 - (7.31 * age) + 1.14 * (10.9 * weight + 660.7 * height);
        if (isNursing == 1) {
            if (isFullTime == 1) {
                additionPoint = 14;
            } else {
                additionPoint = 7;
            }
        }
//        if (scope.isNursing == 1) {
//            if (scope.isFullTime == 1) {
//                additionPoint = 14;
//            } else {
//                additionPoint = 7;
//            }
//        }
    } else {
        if (age < 17) {
            return boyDPT[age];
        }
        if (age == 17) {
            var now = new Date();
            var month = now.getMonth() + 1;
            var day = now.getDate();
            if (parseInt(scope.birthday.split("/")[1]) == month && parseInt(scope.birthday.split("/")[0]) == day) {
                return boyDPT[age - 1];
            }
        }
        TEE = 864 - (9.72 * age) + 1.12 * (14.2 * weight + 503 * height);
    }
    return calculateTarget(TEE, additionPoint);
}

function calculateTarget(teeData, additionPoint) {
    var resultVal = Math.round((teeData - (teeData * 0.10) - 1200) / 35);
    resultVal = resultVal < 26 ? 26 : resultVal;
    resultVal = resultVal > 71 ? 71 : resultVal;
    return resultVal + additionPoint;
}



