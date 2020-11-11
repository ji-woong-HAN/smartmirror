var NodeHelper = require("node_helper");
var request = require("request");
var xml2json = require("node-xml2json");

var today = new Date();
var dd = today.getDate() - 2;
if (dd < 10) {
	dd = "0" + dd;
}
var mm = today.getMonth() + 1;
if (mm < 10) {
	mm = "0" + mm;
}
var yyyy = today.getFullYear();
var date_str = yyyy.toString() + mm.toString() + dd.toString();

var url = "http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson";
var queryParams = "?" + encodeURIComponent("serviceKey") + "=zibWgn%2BFZ%2FhLskaHRVvUX4N7eH4ol6fK%2FSuc4HDMnuG%2BKvMjAAHfybyLAzrF0ldqI8wsGY58Oanj%2BkSgCjkDdQ%3D%3D"; /* Service Key*/
queryParams += "&" + encodeURIComponent("pageNo") + "=" + encodeURIComponent("1"); /* */
queryParams += "&" + encodeURIComponent("numOfRows") + "=" + encodeURIComponent("10"); /* */
queryParams += "&" + encodeURIComponent("startCreateDt") + "=" + encodeURIComponent(date_str); /* */
queryParams += "&" + encodeURIComponent("endCreateDt") + "=" + encodeURIComponent(date_str); /* */

module.exports = NodeHelper.create({
	start: function () {
		console.log("Starting node helper for:" + this.name);
	},
	covid_num: function () {
		var self = this;
		request(
			{
				url: url + queryParams,
				method: "GET"
			},
			function (error, response, body) {
				var xml = `<xml>${body}</xml>`; //가져온 body부분의 xml을 xml변수에 저장
				var json = xml2json.parser(xml); //xml형식을 json형식으로 변환
				let COVID = [];
				COVID = json.xml.response.body.items.item;

				var localcnt = []; //지역별 일일 확진자
				var totalcnt = 0; //국내 일일 확진자
				/*for (var i = 1; i < 18; i++) {      //지역별 일일 확진자
                localcnt[i - 1] = `${COVID[i].gubun} : ${COVID[i].localocccnt}`;
            }*/
				for (var i = 1; i < 18; i++) {
					//국내 일일 확진자
					totalcnt += COVID[i].localocccnt;
				}

				self.sendSocketNotification("LOCAL", COVID);
				self.sendSocketNotification("TOTAL", totalcnt);
				console.log("send to totalcnt");
			}
		);
	},

	socketNotificationReceived: function (notification, payload) {
		if (notification === "covid_num") {
			console.log("received covid_num");
			this.covid_num();
		}
	}
});
