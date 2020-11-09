const { config } = require("chai");

Module.register("covid", {
    defaults:{},
    LocalNum:[],
    TotalNum:0,
    start: function () {
        console.log('start covid module');
        this.covid_num();
    },
    getDom: function () {
        var element = document.createElement("div");
        element.className = "myContent";
        element.innerHTML = this.LocalNum
        var subElement = document.createElement("p")
        subElement.innerHTML = "일일 확진자 : " + this.TotalNum
        element.appendChild(subElement);
        
        return element
    },
    covid_num:function(){
        //this.LocalNum=['서울:50', '부산: 25'];
        //this.TotalNum=150;
        this.sendSocketNotification("covid_num",{message: 'start connection'});
        console.log('sendSocketNotification to covid_num')
    },
    
    socketNotificationReceived: function (notification, payload) {
        if (notification === "LOCAL") {
            this.LocalNum=payload
            this.updateDom()
            console.log("receivedSocekt");
        }
        if (notification === "TOTAL") {
            this.TotalNum=payload
            this.updateDom()
        }
    }
});