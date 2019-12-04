module.exports.validateEmailId = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
module.exports.validateWebsite = (website) => {
    var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);
    return regex.test(website);
}
module.exports.validateUsername = (username) => {
    var re = /^[A-Za-z._-][A-Za-z0-9._-]*$/;
    return re.test(username);
}
module.exports.validateFullName = (fullName) => {
    var re = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
    return re.test(fullName);
}
module.exports.validatePhoneNumber = (phoneNumber) => {
    var re = /^(?!0{5})\d{5}$/;
    return re.test(phoneNumber);
}
module.exports.isNumber = (digits) => {
    var isnum = /^\d+$/;
    return isnum.test(digits);
}

module.exports.AmexCardnumber = (inputtxt) => {
    var cardno = /^(?:3[47][0-9]{13})$/;
    return cardno.test(inputtxt);
}
module.exports.VisaCardnumber = (inputtxt) => {
    var cardno = /^4[0-9]{12}(?:[0-9]{3})?$/;
    return cardno.test(inputtxt);
}
module.exports.MasterCardnumber = (inputtxt) => {
    var cardno = /^5[1-5][0-9]{0,14}|^(222[1-9]|2[3-6]\\d{2}|27[0-1]\\d|2720)[0-9]{0,12}/;
    return cardno.test(inputtxt);
}
module.exports.DiscoverCardnumber = (inputtxt) => {
    var cardno = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
    return cardno.test(inputtxt);
}
module.exports.DinerClubCardnumber = (inputtxt) => {
    var cardno = /^(?:3(?:0[0-5]|[68][0-9])[0-9]{11})$/;
    return cardno.test(inputtxt);
}
module.exports.JCBCardnumber = (inputtxt) => {
    var cardno = /^(?:(?:2131|1800|35\d{3})\d{11})$/;
    return cardno.test(inputtxt);
}