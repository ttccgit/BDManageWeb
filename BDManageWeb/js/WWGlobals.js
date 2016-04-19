// simple and track mode
var Modes = {
    Simple: 1,
    Tracking: 2
}

var Languages = {
    English: "eng_BR",
    Portuguese: "pt_BR"
}

var FloatFormat = {
    Normal: 0,
    Comma: 1
}

var FloatFormatLanguageMapping = {
    English: FloatFormat.Normal,
    Portuguese: FloatFormat.Comma
}

var defaultWeeklyPoint = 49;

var language = "Global.language";
var foodLocalStorage = "Global.food";
var tokenLocalStorage = "Global.Token";
var loginLocalStorage = "Global.loginConfig";
var userLocalStorage = "Global.UserInfo";
var activityLocalStorage = "Global.Activity";
var foodDetailsLocalStorage = "Global.foodDetails";
var trackerDateLocalStorage = "Global.trackerDate";
var fractionsLocalStorage = "Global.fractions";

var registerLocalStorage = "SignUp.RegisterInfo";

var weightLocalStorage = "GettingStarted.WeightInfo";

var progressDateLocalStorage = "Simple.proDate";
var reminderSettingLocalStorage = "Setting.reminder";
var buildMealFoodsLocalStorage = "Simple.buildMealFoods";
var progressLocalStorage = "Simple.myProgress";

var loginForExpiredLocalStorage = "SignUp.loginForExpired";
var cpfCheckCode = "ResetPwd.cpfCheckCode";
var cpfUser = "ResetPwd.cpfUser";

var trackingLocalStorage = "Global.trackingList";
var currentWeightTrackerLocalStorage = "Global.currentWeightTracker";
var dateSelectFlag = "Global.dateSelectFlag";


var MealTime = {
    Breakfast: 0,
    Lunch: 1,
    Dinner: 2,
    Snacks: 3,
    Indulgences: 4
}

var foodItemType = {
    "201": "food",
    "202": "claFood",
    "203": "quickFood",
    "204": "recipes",
    "205": "meal",
    "207": "meal",
    "206": "cheat sheet"
};

var MealItemType = {
    MealTimeType: 205,
    IndulgencesMealType: 501,
    MemberMealType: 503
}

var MilestonesImgs = [
    {value: "-1", MilestonesImg: ""},
    {value: "1", MilestonesImg: "image/stars/icon_star_first.png"},
    {value: "2", MilestonesImg: "image/stars/icon_star_first_cosecutive.png"},
    {value: "3", MilestonesImg: "image/stars/icon_star_more_2kg_loss.png"},
    {value: "4", MilestonesImg: "image/stars/icon_star_2kg_loss.png"},
    {value: "5", MilestonesImg: "image/stars/icon_star_10kg_lost.png"},
    {value: "6", MilestonesImg: "image/stars/icon_star_20kg_lost.png"},
    {value: "7", MilestonesImg: "image/stars/icon_star_35kg_lost.png"},
    {value: "8", MilestonesImg: "image/stars/icon_star_50kg_lost.png"},
    {value: "9", MilestonesImg: "image/stars/icon_star_70kg_lost.png"},
    {value: "10", MilestonesImg: "image/stars/icon_star_90kg_lost.png"},
    {value: "11", MilestonesImg: "image/stars/icon_star_5percent_loss.png"},
    {value: "12", MilestonesImg: "image/stars/icon_star_10percent_loss.png"},
    {value: "100", MilestonesImg: "image/stars/icon_star_goal.png"}
];

var IntensityConst = {
    "1": 0.051,
    "2": 0.0711,
    "3": 0.1783
};

var girlDPT = {
    10: 32,
    11: 35,
    12: 37,
    13: 39,
    14: 40,
    15: 41,
    16: 41
};

var boyDPT = {
    10: 36,
    11: 39,
    12: 42,
    13: 46,
    14: 51,
    15: 55,
    16: 58
};

var FoodType = {
    Bread: { id: 1, name: "Bead", img: "bread_icon.png", imgc: "bread_red_icon.png", translate: "label_simple_food_bread" },
    Cereal: { id: 2, name: "Cereal", img: "cereal_icon.png", imgc: "cereal_red_icon.png", translate: "label_simple_food_cereal" },
    Protein: { id: 3, name: "Protein", img: "protein_icon.png", imgc: "protein_red_icon.png", translate: "label_simple_food_protein" },
    Fruits: { id: 4, name: "Fruits", img: "fruit_icon.png", imgc: "fruit_red_icon.png", translate: "label_simple_food_fruits" },
    Flavor: { id: 5, name: "Flavor boosts", img: "boosts_icon.png", imgc: "boosts_red_icon.png", translate: "label_simple_food_flavor_boosts" },
    Drink: { id: 6, name: "Drink", img: "drink_icon.png", imgc: "drink_red_icon.png", translate: "label_simple_food_drink" },
    BreadLunch: { id: 7, name: "Bead", img: "bread_icon.png", imgc: "bread_red_icon.png", translate: "label_simple_food_bread_lunch" },
    Starches: { id: 8, name: "Starches/grains", img: "starches_blue_icon.png", imgc: "starches_red_icon.png", translate: "label_simple_food_starches_grains" },
    Toppings: { id: 9, name: "Toppings", img: "toppings_blue_icon.png", imgc: "toppings_red_icon.png", translate: "label_simple_food_toppings" },
    FruitsVegetables: { id: 10, name: "Fruits & veggies", img: "fruit_icon.png", imgc: "fruit_red_icon.png", translate: "label_simple_food_fruits_veggies" },
    Vegetables: { id: 11, name: "Vegetables", img: "fruit_icon.png", imgc: "fruit_red_icon.png", translate: "label_simple_food_vegetables" },
    ProteinDinner: { id: 12, name: "Protein", img: "protein_icon.png", imgc: "protein_red_icon.png", translate: "label_simple_food_protein_dinner" }
}

var BreakfastFoods = [FoodType.Bread, FoodType.Cereal, FoodType.Protein, FoodType.Fruits, FoodType.Flavor, FoodType.Drink];
var LunchFoods = [FoodType.BreadLunch, FoodType.Protein, FoodType.Starches, FoodType.Toppings, FoodType.Flavor, FoodType.FruitsVegetables];
var DinnerFoods = [FoodType.Vegetables, FoodType.ProteinDinner, FoodType.Starches, FoodType.Toppings, FoodType.Flavor];