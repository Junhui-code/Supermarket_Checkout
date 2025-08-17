import time
from threading import Thread
import queue

from hal import hal_led as led
from hal import hal_lcd as LCD
from hal import hal_adc as adc
from hal import hal_buzzer as buzzer
from hal import hal_keypad as keypad
from hal import hal_moisture_sensor as moisture_sensor
from hal import hal_input_switch as input_switch
from hal import hal_ir_sensor as ir_sensor
from hal import hal_rfid_reader as rfid_reader
from hal import hal_servo as servo
from hal import hal_temp_humidity_sensor as temp_humid_sensor
from hal import hal_usonic as usonic
from hal import hal_dc_motor as dc_motor
from hal import hal_accelerometer as accel

# Queue for keypad input
shared_keypad_queue = queue.Queue()

# Valid PIN (for REQ_05)
valid_pin = "1234"

# Callback for keypad
def key_pressed(key):
    shared_keypad_queue.put(key)

# Read n-digit pin input from keypad
def read_pin_input(digits=4):
    pin = ""
    while len(pin) < digits:
        key = shared_keypad_queue.get()
        if isinstance(key, int):  # only accept 0-9
            pin += str(key)
    return pin

def main():
    # Initialize HAL modules
    led.init()
    adc.init()
    buzzer.init()
    moisture_sensor.init()
    input_switch.init()
    ir_sensor.init()
    reader = rfid_reader.init()
    servo.init()
    temp_humid_sensor.init()
    usonic.init()
    dc_motor.init()
    accelerometer = accel.init()
    keypad.init(key_pressed)

    keypad_thread = Thread(target=keypad.get_key)
    keypad_thread.start()

    lcd = LCD.lcd()
    lcd.lcd_clear()
    lcd.lcd_display_string("Mini-Project", 1)
    lcd.lcd_display_string("Diagnostic Tests", 2)
    time.sleep(3)

    # Simulated total amount scanned
    total_amount = 10  # Change to 0 to simulate empty cart

    while True:
        lcd.lcd_clear()
        lcd.lcd_display_string("Press any key!", 1)

        print("Waiting for key...")
        keyvalue = shared_keypad_queue.get()
        print("Key pressed:", keyvalue)

        if keyvalue == 9:  # REQ_04 - Choose payment
            lcd.lcd_clear()
            if total_amount == 0:
                lcd.lcd_display_string("No items scanned", 1)
                time.sleep(2)
                continue  # Restart session
            else:
                lcd.lcd_display_string("1. ATM payment", 1)
                lcd.lcd_display_string("2. PayWave", 2)
                time.sleep(2)

        elif keyvalue == 1:  # REQ_05 - ATM Payment with PIN
            lcd.lcd_clear()
            lcd.lcd_display_string("Enter PIN", 1)
            pin = read_pin_input()
            print("PIN entered:", pin)

            if pin == valid_pin:
                lcd.lcd_clear()
                lcd.lcd_display_string("Payment Approved", 1)
            else:
                lcd.lcd_clear()
                lcd.lcd_display_string("Invalid PIN", 1)
                led.set_output(1, 1)
                time.sleep(1)
                led.set_output(1, 0)

            time.sleep(2)

        elif keyvalue == 2:  # REQ_06 - PayWave using RFID
            lcd.lcd_clear()
            lcd.lcd_display_string("Scan RFID...", 1)
            id = reader.read_id()
            print("RFID read:", id)

            if id is not None:
                lcd.lcd_clear()
                lcd.lcd_display_string("Payment Approved", 1)
            else:
                lcd.lcd_clear()
                lcd.lcd_display_string("Payment Declined", 1)
                led.set_output(1, 1)
                time.sleep(1)
                led.set_output(1, 0)

            time.sleep(2)

        elif keyvalue == 5:  # Proximity-triggered conveyor belt
            lcd.lcd_clear()
            lcd.lcd_display_string("Conveyor Mode", 1)
            lcd.lcd_display_string("Press * to exit", 2)
            time.sleep(2)

            lcd.lcd_clear()
            lcd.lcd_display_string("Waiting object...", 1)

            while True:
                # Exit loop if * is pressed
                if not shared_keypad_queue.empty():
                    exit_key = shared_keypad_queue.get()
                    if exit_key == "*":
                        lcd.lcd_clear()
                        lcd.lcd_display_string("Exiting...", 1)
                        dc_motor.set_motor_speed(0)
                        time.sleep(2)
                        break

                distance = usonic.get_distance()
                print("Distance:", distance)

                if distance is not None and distance < 20:
                    lcd.lcd_display_string("Obj Detected <20cm", 1)
                    lcd.lcd_display_string("Conveyor ON", 2)
                    dc_motor.set_motor_speed(50)
                else:
                    lcd.lcd_display_string("No Object Nearby", 1)
                    lcd.lcd_display_string("Conveyor OFF", 2)
                    dc_motor.set_motor_speed(0)

                time.sleep(0.3)

        # Add more diagnostic tests for other sensors here if needed

        time.sleep(1)

if __name__ == '__main__':
    main()
