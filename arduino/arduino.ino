#include <CapacitiveSensor.h>
String times;
// 10 megohm resistor between pins 4 & 2, pin 2 is sensor pin, add wire, foil
const int SENSOR_POWER = 2;
const int SENSOR_DELAY = 10;
CapacitiveSensor sensor0 = CapacitiveSensor(SENSOR_POWER, 7);
CapacitiveSensor sensor1 = CapacitiveSensor(SENSOR_POWER, 3);
CapacitiveSensor sensor2 = CapacitiveSensor(SENSOR_POWER, 4);
CapacitiveSensor sensor3 = CapacitiveSensor(SENSOR_POWER, 5);
CapacitiveSensor sensor4 = CapacitiveSensor(SENSOR_POWER, 6);

void setup() {
  // open the serial port at 9600 bps:
  Serial.begin(9600);
  Serial.println("READY");
}

void loop(){
  times = String(micros());
  float analog[5];
  // Calculate slider value
  analog[0] = sensor0.capacitiveSensor(SENSOR_DELAY);
  analog[1] = sensor1.capacitiveSensor(SENSOR_DELAY);
  analog[2] = sensor2.capacitiveSensor(SENSOR_DELAY);
  analog[3] = sensor3.capacitiveSensor(SENSOR_DELAY);
  analog[4] = sensor4.capacitiveSensor(SENSOR_DELAY);
  //float sum = analog[0] + analog[1] + analog[2] ;
  //Serial.println("result");

    for (int i=0; i < 5; i = i+1){
      if (analog[i]>100) {
          Serial.println(String(i));
      }
    }
  delay(5);
}
