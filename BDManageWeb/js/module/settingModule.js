function resetPwd() {
    var userInfo = JSON.parse(localStorage[userLocalStorage]);
    var oldPwd = $('#password').val();
    var newPwd1 = $('#rePassword1').val();
    var newPwd2 = $('#rePassword2').val();
    if (oldPwd.length < 8 || newPwd1.length < 8) {
        if (userInfo.language == "eng_BR") {
            jAlert("Your password must be at least  8 characters.","Aviso");
        } else {
            jAlert("Sua senha precisa ter no mínimo 8 caracteres.","Aviso");
        }
        return;
    }

    if (newPwd1 != newPwd2) {
        if (userInfo.language == "eng_BR") {
            jAlert("Your two passwords should be same.","Aviso");
        } else {
            jAlert("Suas duas senhas devem ser iguais.","Aviso");
        }
        return;
    }
    if (!isPassword(newPwd1)) {
        if (userInfo.language == "eng_BR") {
            jAlert("Please use at least one number and at least one letter.","Aviso");
        } else {
            jAlert("Sua senha deve ter pelo menos uma letra ou um número.","Aviso");
        }
        return;
    }
    if (isContainStr(newPwd1, userInfo.firstName) || isContainStr(newPwd1, userInfo.lastName)) {
        if (userInfo.language == "eng_BR") {
            jAlert("Please don´t use your first name or last name.","Aviso");
        } else {
            jAlert("Não use seu nome ou sobrenome na sua senha.","Aviso");
        }
        return;
    }
    if (isContainStr(newPwd1, userInfo.email)) {
        if (userInfo.language == "eng_BR") {
            jAlert("Your password can´t be the same of your email.","Aviso");
        } else {
            jAlert("Sua senha não pode ser igual ao seu email.","Aviso");
        }
        return;
    }
    var token = localStorage[tokenLocalStorage];
    $.ajax({
        type: "PUT",
        contentType: "application/json;charset=UTF-8",
        url : serviceUrl + "/user/reset-password",
        dataType: "json",
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("token", token);
        },
        data: JSON.stringify({"oldPassword":oldPwd, "newPassword":newPwd1}),
        success: function (result) {
            if (result.status == 1) {
                $('.mask,.dialog').remove();
                if (userInfo.language == "eng_BR") {
                    jAlert("Success","Aviso");
                }else{
                    jAlert("Success","Aviso");
                }
            } else {
                jAlert("Senha está incorreto","Aviso");
            }
        }
    });
}