function User() {
    this.id = "";
    this.cpf = "";
    this.firstName = "";
    this.lastName = "";
    this.email = "";
    this.password = "";
    this.birthday = "";
    this.gender = "";
    this.height = "";
    this.weight = "";
    this.stateId = "";
    this.cityId = "";
    this.neighborhoodId = "";
    this.zipCode = "";
    this.address = "";
    this.buildingNumber = "";
    this.apartmentNumber = "";
    this.telephone = "";
    this.cellphone = "";
    this.vehicleCategoryId = "";
    this.vehicleId = "";
    this.receiveNewsletter = "";
    this.activationCode = "";
    this.deviceId = "";
    this.deviceType = "";
    this.deviceOS = "";
    this.rememberEmail = "";
    this.pointPriority = "";
    this.language = "";
    this.nursing = "";
    this.onlyBreastMilk = "";
    this.askedSelectWeightMode= "";
    this.userTrackingInfo = new UserTrackingInfo();
    this.InitUserInfo = function (userInfo) {
        this.userTrackingInfo.mode = userInfo.mode;
        this.userTrackingInfo.maintance = userInfo.maintance;
        this.userTrackingInfo.weekDate = userInfo.weekDate;
        this.userTrackingInfo.trackDay = userInfo.trackDay;
        this.userTrackingInfo.dateOfWeekDate = userInfo.dateOfWeekDate;
        this.userTrackingInfo.firstLoseWeight = userInfo.firstLoseWeight;
        this.userTrackingInfo.dailyPoint = userInfo.dailyPoint;
        this.userTrackingInfo.weeklyPoint = userInfo.weeklyPoint;
        this.userTrackingInfo.expirationDate = userInfo.expirationDate;
        this.userTrackingInfo.goalWeight = userInfo.goalWeight;
        this.userTrackingInfo.pointPriority = userInfo.pointPriority;
        this.userTrackingInfo.expressReason = userInfo.expressReason;
        this.userTrackingInfo.maintance = userInfo.maintance;
        this.cpf = userInfo.cpf;
        this.birthday = userInfo.birthday;
        this.email = userInfo.email;
        this.gender = userInfo.gender;
        this.weight = userInfo.weight;
        this.height = userInfo.height;
        this.firstName = userInfo.firstName;
        this.lastName = userInfo.lastName;
        this.stateId = userInfo.stateId;
        this.cityId = userInfo.cityId;
        this.neighborhoodId = userInfo.neighborhoodId;
        this.zipCode = userInfo.zipCode;
        this.rememberEmail = userInfo.rememberEmail;
        this.language = userInfo.language;
        this.nursing = userInfo.nursing;
        this.onlyBreastMilk = userInfo.onlyBreastMilk;
        this.askedSelectWeightMode = userInfo.askedSelectWeightMode;
    };
}

function UserTrackingInfo() {
    this.mode = "";
    this.maintance = "";
    this.weekDate = "";
    this.trackDay = "";
    this.dateOfWeekDate = "";
    this.firstLoseWeight = "";
    this.dailyPoint = "";
    this.weeklyPoint = "";
    this.expirationDate = "";
    this.goalWeight = "";
    this.height = "";
    this.weight = "";
    this.currentWeight = "";
    this.meetingDayOfWeek = "";
    this.expressReason = "";
    this.maintance = "";
}

function UserInfo() {
    this.userBaseInfo = new RegisterInfo();
    this.userTrackingInfo = new UserTrackingInfo();
    this.InitUserInfo = function (userInfo) {
        if (userInfo.id != "") {
            this.userBaseInfo.id = userInfo.id;
        }
        this.userBaseInfo.cpf = userInfo.cpf;
        this.userBaseInfo.birthday = userInfo.birthday;
        this.userBaseInfo.email = userInfo.email;
        this.userBaseInfo.gender = userInfo.gender;
        this.userBaseInfo.firstName = userInfo.firstName;
        this.userBaseInfo.lastName = userInfo.lastName;
        this.userBaseInfo.stateId = userInfo.stateId;
        this.userBaseInfo.cityId = userInfo.cityId;
        this.userBaseInfo.neighborhoodId = userInfo.neighborhoodId;
        this.userBaseInfo.zipCode = userInfo.zipCode;
        this.userBaseInfo.address = userInfo.address;
        this.userBaseInfo.buildingNumber = userInfo.buildingNumber;
        this.userBaseInfo.apartmentNumber = userInfo.apartmentNumber;
        this.userBaseInfo.telephone = userInfo.telephone;
        this.userBaseInfo.cellphone = userInfo.cellphone;
        this.userBaseInfo.vehicleCategoryId = userInfo.vehicleCategoryId;
        this.userBaseInfo.vehicleId = userInfo.vehicleId;
        this.userBaseInfo.receiveNewsletter = userInfo.receiveNewsletter;
        this.userBaseInfo.language = userInfo.language;
        this.userBaseInfo.firstSimpleStartDate = userInfo.firstSimpleStartDate;
        this.userBaseInfo.gettingStartFinishDate = userInfo.gettingStartFinishDate;
        this.userBaseInfo.nursing = userInfo.nursing;
        this.userBaseInfo.onlyBreastMilk = userInfo.onlyBreastMilk;
        this.userBaseInfo.askedSelectWeightMode = userInfo.askedSelectWeightMode;
        this.userBaseInfo.dptChanged = userInfo.dptChanged;
        this.userTrackingInfo.rememberEmail = userInfo.rememberEmail;

//        this.userBaseInfo.activationCode = userInfo.activationCode;

        this.userTrackingInfo.mode = userInfo.mode;
        this.userTrackingInfo.maintance = userInfo.maintance;
        this.userTrackingInfo.weekDate = userInfo.weekDate;
        this.userTrackingInfo.trackDay = userInfo.trackDay;
        this.userTrackingInfo.dateOfWeekDate = userInfo.dateOfWeekDate;
        this.userTrackingInfo.firstLoseWeight = userInfo.firstLoseWeight;
        this.userTrackingInfo.dailyPoint = userInfo.dailyPoint;
        this.userTrackingInfo.weeklyPoint = userInfo.weeklyPoint;
        this.userTrackingInfo.expirationDate = userInfo.expirationDate;
        this.userTrackingInfo.goalWeight = userInfo.goalWeight;
        this.userTrackingInfo.weight = userInfo.weight;
        this.userTrackingInfo.currentWeight = userInfo.currentWeight;
        this.userTrackingInfo.height = (userInfo.height/100).toFixed(2);
        this.userTrackingInfo.meetingDayOfWeek = userInfo.meetingDayOfWeek;
        this.userTrackingInfo.expressReason = userInfo.expressReason;
        this.userTrackingInfo.maintance = userInfo.maintance;
    }

}

function RegisterInfo() {
    this.id = "";
    this.cpf = "";
    this.firstName = "";
    this.lastName = "";
    this.email = "";
    this.password = "";
    this.birthday = "";
    this.gender = "";
    this.stateId = "";
    this.cityId = "";
    this.neighborhoodId = "";
    this.zipCode = "";
    this.address = "";
    this.buildingNumber = "";
    this.apartmentNumber = "";
    this.telephone = "";
    this.cellphone = "";
    this.vehicleCategoryId = "";
    this.vehicleId = "";
    this.receiveNewsletter = "";
    this.activationCode = "";
    this.deviceId = "";
    this.deviceType = "";
    this.deviceOS = "";
    this.language = "";
    this.onlyBreastMilk = "";
    this.nursing = "";
}

