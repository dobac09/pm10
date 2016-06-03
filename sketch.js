var pm10_now; //realtime pm10 data
var pm10_log = {}; //make empty object
//http://www.me.go.kr/home/web/board/read.do?boardMasterId=1&boardId=185839&menuId=286
var pm10_index = [300, 200, 120, 80, 30]
var color_index = ["red", "orange", "yellow", "green", "blue"]
var AQreal = 'http://openapi.seoul.go.kr:8088/5770436776646f623736786b7a6a62/json/ListAirQualityByDistrictService/1/1/111274/'
var AQlog = 'http://openapi.seoul.go.kr:8088/5770436776646f623736786b7a6a62/json/TimeAverageAirQuality/2/2/'
var now_h;
var logt;
var d = new Date();
var r = 10; //ellipse radius
var ts = 50; //text size
var maxHeight = 300; // maximum height of graph

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  loadJSON(AQreal, gotRealtimedata) //request realtime data
  //visualization form background
  background(0);
  fill(255);
  noStroke();
  textSize(100);
  textAlign(CENTER);
  text("강동구 미세먼지 현황", width / 2, 100);
  for (i = 0; i < 25; i++) {
    noFill();
    stroke(255, 100);
    strokeWeight(3);
    line(i * width / 24, 150, i * width / 24, height);
    textSize(10);
    fill(255);
    strokeWeight(1);
    textAlign(RIGHT);
    text(i, i * width / 24, 150)
  }
}

//visualize realtime data
function gotRealtimedata(data) {

  pm10_now = data.ListAirQualityByDistrictService.row[0].PM10;
  now_h = data.ListAirQualityByDistrictService.row[0].MSRDATE.slice(-4, -2);
  now_h *= 1;
  println(now_h);
  var pm10_now_posY = map(pm10_now, 0, maxHeight, 0, height);
  var pm10_now_posX = map(now_h, 0, 24, 0, width) + width / 48;
  fill(255);
  noStroke();
  textSize(ts);
  textAlign(RIGHT);
  ellipse(pm10_now_posX, height - pm10_now_posY, r, r);
  stroke(0);
  text(pm10_now, pm10_now_posX, height - pm10_now_posY);
  //excute logged data visualization after realtime data visualization
  getlogdata();
}

function getlogdata() {
  for (i = now_h; i >= 0; i--) {
    logt = d.getFullYear() + twodig(d.getMonth() + 1) + twodig(d.getDate()) + twodig(i) + "00";
    println(AQlog + logt);
    loadJSON(AQlog + logt, logLogdata);
  }
}


//log pm10 data to object
function logLogdata(data) {
  var prop = data.TimeAverageAirQuality.row[0].MSRDT.slice(-4, -2);
  prop *= 1;
  pm10_log[prop] = data.TimeAverageAirQuality.row[0].PM10;
  println(pm10_log);
  println(Object.keys(pm10_log).length);
  if (Object.keys(pm10_log).length == now_h + 1) {
    println("loading json finished");

    // visualize now!
    for (var keys in pm10_log) {
      if (!pm10_log.hasOwnProperty(keys)) {
        continue;
      }
      var pm10_log_posY = height - map(pm10_log[keys], 0, maxHeight, 0, height);
      var pm10_log_posX = map(keys, 0, 24, 0, width) + width / 48;
      fill(setcolor(pm10_log[keys]));
      noStroke();
      ellipse(pm10_log_posX, pm10_log_posY, r, r);

      if (pm10_log[keys - 1]) {
        var pm10_log_posY2 = height - map(pm10_log[keys - 1], 0, maxHeight, 0, height);
        var pm10_log_posX2 = map(keys - 1, 0, 24, 0, width) + width / 48;
        stroke(setcolor(pm10_log[keys]));
        strokeWeight(3);
        line(pm10_log_posX, pm10_log_posY, pm10_log_posX2, pm10_log_posY2)
      }
      }
    }
  }

  //convert num two twodigit string ex) 9 -> 09
  function twodig(num) {
    return (("0" + num).slice(-2));
  }

  function setcolor(pm10) {
    var mycol;
    if (pm10 < 31) {
      pm10 = map(pm10, 0, 30, 0, 1);
      mycol = lerpColor(color(0, 203, 231), color(0, 218, 60), pm10);
    } else if (pm10 < 81) {
      pm10 = map(pm10, 31, 80, 0, 1);
      mycol = lerpColor(color(0, 218, 60), color(244, 243, 40), pm10);
    } else if (pm10 < 121) {
      pm10 = map(pm10, 81, 120, 0, 1);
      mycol = lerpColor(color(244, 243, 40), color(253, 134, 3), pm10);
    } else if (pm10 < 201) {
      pm10 = map(pm10, 121, 200, 0, 1);
      mycol = lerpColor(color(253, 134, 3), color(223, 21, 26), pm10);
    } else if (pm10 < 301) {
      pm10 = map(pm10, 201, 300, 0, 1);
      mycol = lerpColor(color(223, 21, 26), color(0, 0, 0), pm10);
    } else
      mycol = color(0, 0, 0);
    return mycol;
  }
