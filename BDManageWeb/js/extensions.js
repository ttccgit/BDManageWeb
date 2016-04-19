var buttonValue = false;


function openDialog(title, content, buttonArray, fn) {
    var dialogWrap = $("<div class='dialog'></div>");
    var mask = $("<div class='mask'></div>");
    mask.appendTo("body");
    dialogWrap.appendTo("body");

    var matchWord = /html/i;
    if (arguments.length == 1 && matchWord.test(arguments[0])) {
        $(".dialog").addClass("html_text");
        $(".dialog").load('views/' + title);

    } else {
        var dialogName = $("<h1></h1>");
        var dialogText = $("<p></p>");
        var dialogFooter = $("<div class='dialog_footer'></div>");
        dialogName.appendTo(dialogWrap);
        dialogText.appendTo(dialogWrap);
        dialogFooter.appendTo(dialogWrap);

        dialogName.text(title);
        dialogText.text(content);
//        var btnTotalWidth = 0;
         for(var i = 0 ; i < buttonArray.length ; i++ ) {
             var dialogButton = $("<button promo=button" + i + "></button>");
             dialogButton.text(buttonArray[i]);
             dialogButton.appendTo(dialogFooter);
//             btnWith = dialogButton.width();
//             btnTotalWidth+= btnWith;
         }


//            var dialogWith = $(".dialog").width();
//            var dialogFW = btnTotalWidth + 20*(buttonArray.length) + 2;

//            if(dialogFW < dialogWith){
////                $(".dialog_footer").css("width",dialogFW);
//            }else{
//                $(".dialog_footer").css("width","auto");
//                $(".dialog button").css("float","none");
//            }

    }

    $(".dialog button").click(function () {
        $(".mask,.dialog").remove();
        var flag = $(this).attr("promo").replace("button","");
        if (fn) {
            fn(flag);
        }
    })
}

function alertWarning(content , scope, interpolate) {
    var arrButton = [scope.$eval(interpolate("{{'button_ok'|translate}}"))];

    if ("There is no token" == content) {
        openDialog(scope.$eval(interpolate("{{'button_warning'|translate}}")), content, arrButton,function (r) {
            if (r == 0) {
                window.location.href = "#/login";
            }
        });
    } else {
        openDialog(scope.$eval(interpolate("{{'button_warning'|translate}}")), content, arrButton,'');
    }
}

function alertError(error , scope, interpolate){
    var arrButton = [scope.$eval(interpolate("{{'button_ok'|translate}}"))];

    if (100001 == error.code) {
        openDialog(scope.$eval(interpolate("{{'button_warning'|translate}}")), scope.$eval(interpolate("{{'error_message_100001'|translate}}")), arrButton,function (r) {
            if (r == 0) {
                window.location.href = "#/login";
            }
        });
    } else {
        openDialog(scope.$eval(interpolate("{{'button_warning'|translate}}")), error.message, arrButton,'');
    }
}

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}
