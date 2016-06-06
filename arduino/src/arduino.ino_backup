#include <CapacitiveSensor.h>

// Button
const int buttonPin = 8; 
int buttonState = LOW;         // variable for reading the pushbutton status
int keyTouch = 0;      // the current state of the output pin
int previous = LOW;    // the previous reading from the input pin

// Capteurs : 10 megohm resistor between pins 2 & (3,4,5,6,7), pins (3,4,5,6,7) are sensor pins
String times;
const int SENSOR_POWER = 2;
const int SENSOR_DELAY = 10;
CapacitiveSensor sensor0 = CapacitiveSensor(SENSOR_POWER, 3);
CapacitiveSensor sensor1 = CapacitiveSensor(SENSOR_POWER, 4);
CapacitiveSensor sensor2 = CapacitiveSensor(SENSOR_POWER, 5);
CapacitiveSensor sensor3 = CapacitiveSensor(SENSOR_POWER, 6);
CapacitiveSensor sensor4 = CapacitiveSensor(SENSOR_POWER, 7);


void setup() {
  pinMode(8, INPUT);
  // open the serial port at 9600 bps:
  Serial.begin(9600);
  Serial.println("READY");
}

void loop(){
  buttonState = digitalRead(8);
  Serial.print(buttonState); 
  // KeyBoard
  float analog[5];
  int key[5] = {35, 126, 42, 37, 60};
  
  // Capteurs :Calculate slider value
  times = String(micros());
  analog[0] = sensor0.capacitiveSensor(SENSOR_DELAY);
  analog[1] = sensor1.capacitiveSensor(SENSOR_DELAY);
  analog[2] = sensor2.capacitiveSensor(SENSOR_DELAY);
  analog[3] = sensor3.capacitiveSensor(SENSOR_DELAY);
  analog[4] = sensor4.capacitiveSensor(SENSOR_DELAY);

  if (buttonState == LOW && previous == HIGH) {
      if(keyTouch == 1) {
         keyTouch = 0;
         // Serial.print(" c'est moi " + keyTouch);
      } else  if (keyTouch == 0) {
        keyTouch = 1; 
        //Serial.print(" " + keyTouch); 
      }
  }
  
  if (keyTouch == 0) {
    Keyboard.end();
  } else if (keyTouch == 1){
    Serial.print("je suis HIGH");
    Keyboard.begin();
    for (int i=0; i < 5; i = i+1){
     if (analog[i]>100) {
        Keyboard.write(key[i]);
      }
    delay(5);
    delay(10);
    }
  }
  delay(5);
  delay(10);
  
  previous = buttonState;
  Serial.print(String(buttonState) + " " + String(previous) + "    ");
  
}
