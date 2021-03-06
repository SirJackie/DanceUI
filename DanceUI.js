if(!window.getComputedStyle){
    window.getPixelValue = function(element, value){
        var PIXEL = /^\d+(px)?$/i;
        if (PIXEL.test(value)){
            //If the value's unit is pixel,return the value.
            return parseInt(value);
        }
        else{
            //Get pixel value using IE's runtimeStyle.
            var style = element.style.left;
            var runtimeStyle = element.runtimeStyle.left;
            element.runtimeStyle.left = element.currentStyle.left;
            element.style.left = value || 0;
            value = element.style.pixelLeft;
            element.style.left = style;
            element.runtimeStyle.left = runtimeStyle;
            return value;
        }
    };
    window.getComputedStyle = function(element, pseudoElt){
        var width = element.currentStyle.width;
        var height = element.currentStyle.height;
        
        var marginTop = element.currentStyle.marginTop;
        var marginBottom = element.currentStyle.marginBottom;
        var marginLeft = element.currentStyle.marginLeft;
        var marginRight = element.currentStyle.marginRight;

        var paddingTop = element.currentStyle.paddingTop;
        var paddingBottom = element.currentStyle.paddingBottom;
        var paddingLeft = element.currentStyle.paddingLeft;
        var paddingRight = element.currentStyle.paddingRight;

        return({
            width : window.getPixelValue(element, width),
            height : window.getPixelValue(element, height),

            marginTop : window.getPixelValue(element, marginTop),
            marginBottom : window.getPixelValue(element, marginBottom),
            marginLeft : window.getPixelValue(element, marginLeft),
            marginRight : window.getPixelValue(element, marginRight),

            paddingTop : window.getPixelValue(element, paddingTop),
            paddingBottom : window.getPixelValue(element, paddingBottom),
            paddingLeft : window.getPixelValue(element, paddingLeft),
            paddingRight : window.getPixelValue(element, paddingRight)
        });
    }
}

var DanceUI = {
    StandardUnits : {
        Height   : null,
        Margin   : null,
        FontSize : null
    },
    
    CalculateStandardUnits : function(){
        DanceUI.StandardUnits.Height   = document.documentElement.clientHeight / 10;
        DanceUI.StandardUnits.Margin   = DanceUI.StandardUnits.Height * 0.2;
        DanceUI.StandardUnits.FontSize = DanceUI.StandardUnits.Height * 0.6;
    },

    SetStandardUnits : function(){
        var style = document.createElement("style");
        style.type = "text/css";
        try{
            style.appendChild(document.createTextNode("body{font-size:" + DanceUI.StandardUnits.FontSize + "px;}"));
            style.appendChild(document.createTextNode("dance{margin:" + DanceUI.StandardUnits.Margin + "px;}"));
            style.appendChild(document.createTextNode("dance{box-shadow:0 0 " + DanceUI.StandardUnits.Margin + "px #777777;"));
        }catch(ex){
            //针对IE
            style.styleSheet.cssText = "body{font-size:" + DanceUI.StandardUnits.FontSize + "px;}dance{margin:" + DanceUI.StandardUnits.Margin + "px;}dance{box-shadow:0 0 " + DanceUI.StandardUnits.Margin + "px #777777;";
        }
        var head = document.getElementsByTagName("head")[0];
        head.appendChild(style);
    },

    DecodeStringUnit : function(str){
        var resultStr = str.match(/[0123456789.]+f/);
        if(resultStr == null){
            resultStr = str.match(/[0123456789.]+h/);
            if(resultStr == null){
                //出错
                console.log("DanceUI Error:Cannot get string's unit");
                console.log("Error String:");
                console.log(str);
                return null;
            }
            //单位是h
            return ({
                num : parseFloat(resultStr[0].substr(0,resultStr[0].length-1)),
                unit : "h"
            });
        }
        //单位是f
        return ({
            num : parseFloat(resultStr[0].substr(0,resultStr[0].length-1)),
            unit : "f"
        });
    },

    DecodeComputedStyle : function(str){
        var resultStr = str.match(/[0123456789.]+px/);
        return parseFloat(resultStr[0].substr(0,resultStr[0].length-2));
    },

    GetDanceArea : function(dance){
        /* 定义areaObj */
        var areaObj = {
            width  : null,
            height : null
        }

        /* 获取<dance>标签的宽高属性值 */
        var danceWidthStr  = dance.getAttribute("width");
        var danceHeightStr = dance.getAttribute("height");

        /* 如果<dance>有宽,就获取,否则宽等于1f */
        if(danceWidthStr == null){
            areaObj.width = {
                num  : 1,
                unit : "f"
            };
        }
        else{
            areaObj.width = DanceUI.DecodeStringUnit(danceWidthStr);
        }

        /* 如果<dance>有高,就获取,否则高等于1h */
        if(danceHeightStr == null){
            areaObj.height = {
                num  : 1.2,
                unit : "h"
            };
        }
        else{
            areaObj.height = DanceUI.DecodeStringUnit(danceHeightStr);
        }

        /* 返回areaObj */
        return areaObj;
    },

    refresh : function(parent, everyFlexPixel){
        if(parent.tagName == "LINE"){
            var totalWidth = parent.clientWidth;

            var totalHPixel = 0;;
            var totalF = 0;
            for(var i = 0; i < parent.childNodes.length; i++){
                if(parent.childNodes[i].tagName == "DANCE"){
                    var areaResult = DanceUI.GetDanceArea(parent.childNodes[i]);
                    if(areaResult.width.unit == "h"){
                        totalHPixel += areaResult.width.num * DanceUI.StandardUnits.Height;
                    }
                    else if(areaResult.width.unit == "f"){
                        totalF += areaResult.width.num;
                    }
                }
            }

            for(var i = 0; i < parent.childNodes.length; i++){
                DanceUI.refresh(parent.childNodes[i], ((totalWidth - totalHPixel) / totalF - 1));//-1 to prevent overflow
            }
            return;
        }
        else if(parent.tagName == "DANCE"){
            var computedStyle = getComputedStyle(parent, null);
            var areaResult = DanceUI.GetDanceArea(parent);
            var wannawidth;
            var wannaheight;
            if(areaResult.width.unit == "h"){
                wannawidth = (areaResult.width.num * DanceUI.StandardUnits.Height) - (DanceUI.DecodeComputedStyle(computedStyle.marginLeft) + DanceUI.DecodeComputedStyle(computedStyle.marginRight) + DanceUI.DecodeComputedStyle(computedStyle.paddingLeft) + DanceUI.DecodeComputedStyle(computedStyle.paddingRight) + DanceUI.DecodeComputedStyle(computedStyle.borderLeft) + DanceUI.DecodeComputedStyle(computedStyle.borderRight));
            }
            else if(areaResult.width.unit == "f"){
                wannawidth = (areaResult.width.num * everyFlexPixel) - (DanceUI.DecodeComputedStyle(computedStyle.marginLeft) + DanceUI.DecodeComputedStyle(computedStyle.marginRight) + DanceUI.DecodeComputedStyle(computedStyle.paddingLeft) + DanceUI.DecodeComputedStyle(computedStyle.paddingRight) + DanceUI.DecodeComputedStyle(computedStyle.borderLeft) + DanceUI.DecodeComputedStyle(computedStyle.borderRight));
            }
            if(areaResult.height.unit == "h"){
                wannaheight = (areaResult.height.num * DanceUI.StandardUnits.Height) - (DanceUI.DecodeComputedStyle(computedStyle.marginTop) + DanceUI.DecodeComputedStyle(computedStyle.marginBottom) + DanceUI.DecodeComputedStyle(computedStyle.paddingTop) + DanceUI.DecodeComputedStyle(computedStyle.paddingBottom) + DanceUI.DecodeComputedStyle(computedStyle.borderTop) + DanceUI.DecodeComputedStyle(computedStyle.borderBottom));
            }
            else if(areaResult.height.unit == "f"){
                wannaheight = (areaResult.height.num * everyFlexPixel) - (DanceUI.DecodeComputedStyle(computedStyle.marginTop) + DanceUI.DecodeComputedStyle(computedStyle.marginBottom) + DanceUI.DecodeComputedStyle(computedStyle.paddingTop) + DanceUI.DecodeComputedStyle(computedStyle.paddingBottom) + DanceUI.DecodeComputedStyle(computedStyle.borderTop) + DanceUI.DecodeComputedStyle(computedStyle.borderBottom));
            }
            parent.style.width = wannawidth + "px";
            parent.style.height = (wannaheight - 1) + "px";
            // console.log(areaResult.width.num * everyFlexPixel);
            // console.log(wannawidth);
            console.log((DanceUI.DecodeComputedStyle(computedStyle.marginTop) + DanceUI.DecodeComputedStyle(computedStyle.marginBottom)));
            // console.log(computedStyle.marginLeft + computedStyle.marginRight + computedStyle.paddingLeft + computedStyle.paddingRight + computedStyle.borderLeft + computedStyle.borderRight);
            
            for(var i = 0; i < parent.childNodes.length; i++){
                DanceUI.refresh(parent.childNodes[i], null);
            }
            return;
        }
        for(var i = 0; i < parent.childNodes.length; i++){
            DanceUI.refresh(parent.childNodes[i], null);
        }
    },

    UserWindowOnload : function(){
        ;
    },

    UserWindowOnresize : function(){
        ;
    },

    WindowOnload : function(){
        DanceUI.CalculateStandardUnits();
        DanceUI.SetStandardUnits();
        DanceUI.refresh(document.getElementsByTagName("body")[0], null);
        DanceUI.UserWindowOnload();
    },

    WindowOnresize : function(){
        DanceUI.refresh(document.getElementsByTagName("body")[0], null);
        DanceUI.UserWindowOnresize();
    }
}


window.onload = function(){
    DanceUI.WindowOnload();
}
window.onresize = function(){
    DanceUI.WindowOnresize();
}