var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;

function refreshDocumentTree(parent){

    var childList = [];
    for(var i = 0; i < parent.childNodes.length; i++){
        childList.push(parent.childNodes[i]);
    }
    //console.log(childList);

    var hasBoxTag = false;
    var i = 0;
    while(i < childList.length){
        if(childList[i].tagName == "BOX"){
            hasBoxTag = true;
            break;
        }
        else{
            i += 1;
        }
    }

    if(!hasBoxTag){
        return;
    }

    var boxList = [];
    var tmpArr = [];
    var nowBoxListIndex = 0;
    for(var i = 0; i < childList.length; i++){
        if(childList[i].tagName == "BOX"){
            tmpArr.push(childList[i]);
        }
        else if(childList[i].tagName == "NEXT"){
            boxList.push(tmpArr);
            tmpArr = [];
            nowBoxListIndex += 1;
        }
    }
    boxList.push(tmpArr);

    for(var j = 0; j<boxList.length; j++){
        var parentWidth = boxList[j][0].parentNode.clientWidth;
        //alert(parentWidth);
        var totalFlex = 0;
        for(var i = 0; i<boxList[j].length; i++){
            boxList[j][i].flex = boxList[j][i].getAttribute("flex");
            if(!boxList[j][i].flex){
                boxList[j][i].flex = 1;
            }
            totalFlex += parseInt(boxList[j][i].flex);
        }
        //alert(totalFlex);
        var everyFlex = parentWidth / totalFlex;
        for(var i = 0; i < boxList[j].length; i++){
            var boxElement = boxList[j][i];
            var boxStyle = style = window.getComputedStyle(boxElement, null);
            var marginLeft = boxStyle.marginLeft;
            var marginRight = boxStyle.marginRight;
            marginLeft = parseFloat(marginLeft.substr(0,marginLeft.length-2));
            marginRight = parseFloat(marginRight.substr(0,marginRight.length-2));
            boxList[j][i].style.width = Math.floor(boxList[j][i].flex * everyFlex - marginLeft - marginRight) + "px";
        }
    }

    for(var j = 0; j < boxList.length; j++){
        for(var i = 0;i<boxList[j].length;i++){
            refreshDocumentTree(boxList[j][i]);
        }
    }

    //console.log(boxList);
}

function OnWindowLoad(){
    refreshDocumentTree(document.getElementsByTagName("body")[0]);
    refreshDocumentTree(document.getElementsByTagName("body")[0]);
}

function OnWindowResize(){
    refreshDocumentTree(document.getElementsByTagName("body")[0]);
}

window.onload   = function(){
    OnWindowLoad();
}
window.onresize = function(){
    OnWindowResize();
}