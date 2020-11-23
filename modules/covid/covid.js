Module.register("covid", {
	defaults: {
		location: [],
		date: ""
	},
	LocalNum: [],
	TotalNum: 0,
	start: function () {
		console.log("start covid module");
		this.covid_num();
	},

	getDom: function () {
		var index = [];
		for (i = 0; i < this.config.location.length; i++) {
			index[i] = this.LocalNum.findIndex((obj) => obj.gubun == this.config.location[i]);
		}

		var table = document.createElement("table");
		table.className = "covid-table";
		var tr0 = document.createElement("tr");
		tr0.className = "covid-tr0";
		var tr = document.createElement("tr");
		var tr1 = document.createElement("tr");

		var td0 = document.createElement("td");
		td0.className = "covid-td0";
		var td = document.createElement("td");
		td.className = "covid-td";
		var td1 = document.createElement("td");
		td1.className = "covid-td1";
		var td2 = document.createElement("td");
		td2.className = "covid-td2";
		var td3 = document.createElement("td");
		td3.className = "covid-td3";

		var th_location = document.createElement("th");
		var text_location = document.createTextNode("지역 확진자");

		var th_total = document.createElement("th");
		var text_total = document.createTextNode("일일 확진자");

		// 지역 확진자, 일일 확진자 문구
		table.appendChild(tr0);
		td0.innerText = this.date + " 기준";
		tr0.appendChild(td0);

		table.appendChild(tr);
		th_location.appendChild(text_location);
		td.appendChild(th_location);
		tr.appendChild(td);
		th_total.appendChild(text_total);
		td1.appendChild(th_total);
		tr.appendChild(td1);

		// 지역 확진자 수
		table.appendChild(tr1);
		for (var i = 0; i < this.config.location.length; i++) {
			td2.innerHTML += this.config.location[i] + " : " + this.LocalNum[index[i]].localocccnt + "명<br />";
			tr1.appendChild(td2);
		}

		// 일일 확진자 수
		td3.innerText = this.TotalNum + "명";
		tr1.appendChild(td3);

		return table;
	},

	covid_num: function () {
		this.sendSocketNotification("covid_num", { message: "start connection" });
		console.log("sendSocketNotification to covid_num");
	},

	socketNotificationReceived: function (notification, payload) {
		if (notification === "COVID") {
			this.LocalNum = payload;
			this.updateDom();
			console.log("receivedSocekt");
		}
		if (notification === "TOTAL") {
			this.TotalNum = payload;
			this.updateDom();
		}
		if (notification === "DATE") {
			this.date = payload;
			this.updateDom();
		}
	},

	getStyles: function () {
		return ["covid.css"];
	}
});
