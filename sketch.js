var weather;
var myP;
var pm10;
var pm10_2;
var mySec = [300, 200, 120, 80, 30]
var myCol = ["red", "orange", "yellow", "green", "blue"]

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  myP = createP();
  //24시 에러 전일 2400을 다음날 0100에 불러오지 못함 js time데이터를 이용하여 수정
  loadJSON('http://openapi.seoul.go.kr:8088/5770436776646f623736786b7a6a62/json/TimeAverageAirQuality/2/2/' + '' + year() + pad2(month()) + pad2(day()) + pad2(hour() - 1) + "00", gotdata)
  loadJSON('http://openapi.seoul.go.kr:8088/5770436776646f623736786b7a6a62/json/TimeAverageAirQuality/2/2/' + '' + year() + pad2(month()) + pad2(day()) + pad2(hour() - 2) + "00", gotdata2)
}

function gotdata(data) {
  pm10 = data.TimeAverageAirQuality.row[0].PM10;
  println(pm10);
}

function gotdata2(data) {
  pm10_2 = data.TimeAverageAirQuality.row[0].PM10;
  println(pm10_2);
}

function pad2(n) { // always returns a string
  return (n < 10 ? '0' : '') + n;
}

function draw() {
  background(0);
  var tocolor = map(pm10, 0, 301, 0, 100);

  noStroke();
  for (i = 0; i < mySec.length; i++) {
    fill(myCol[i]);
    ellipse(width/2, height/2, mySec[i], mySec[i]);
  }

  background(255, 255, 255, 200);

  if (pm10) {
    noFill();
    stroke(200, 0, 0);
    ellipse(width/2, height/2, pm10_2, pm10_2);
    stroke(0);
    strokeWeight(1);
    ellipse(width/2, height/2, pm10, pm10);

    strokeWeight(1);
    textSize(12);
    text(pm10, width/2+ 10 + pm10 / 2, height/2);
    myP.html("강동구 미세먼지 PM10 =" + pm10);
  }
}
