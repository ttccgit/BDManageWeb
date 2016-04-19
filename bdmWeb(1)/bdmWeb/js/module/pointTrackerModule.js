function Activity() {
    this.id = "";
    this.name = "";
    this.point = "";
    this.type = "";
    this.contextId = "";
    this.activityId = "";
    this.intensity = "";
    this.isFavorite = "";
    this.createdDate = "";
    this.favIconFlag = "";
    this.description = "";
    this.lastModifiedDate = "";
    this.titleFlag = "";
    this.showTitle = "";
    this.mode = "";

}

function findNearestVal(targetNum){
    var array = new Array(0.25,0.333,0.5,0.666,0.75,0.125);
    var minObj = {};
    for(var i=0;i<array.length;i++)
    {
        var diffVal = Math.abs(targetNum - array[i]);
        if(targetNum==array[i]){
            return i+1;
        }else{
            if(i==0){
                minObj.value = diffVal;
                minObj.index = i;
            }else{
                if(diffVal < minObj.value){
                    minObj.value = diffVal;
                    minObj.index = i;
                }
            }
        }
    }
    return minObj.index+1;
}

var fractionType = {
    1: 0.25,
    2: 0.333,
    3: 0.5,
    4: 0.666,
    5: 0.75,
    6: 0.125
};