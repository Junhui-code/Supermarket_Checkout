from picamera2 import Picamera2, Picamera2Error
import time
import os

print("[TEST] Starting camera test...")

try:
    picam2 = Picamera2()
    print("[TEST] Picamera2 initialized.")
    
    config = picam2.create_still_configuration(main={"size": (640, 480)})
    picam2.configure(config)
    picam2.start()
    time.sleep(2)
    
    save_path = "/app/test_image.jpg"
    picam2.capture_file(save_path)
    picam2.stop()
    picam2.close()

    if os.path.exists(save_path):
        print(f"[TEST ✅] Image saved to: {save_path}")
    else:
        print("[TEST ❌] Image file not found.")

except Picamera2Error as e:
    print(f"[TEST ❌] Picamera2Error: {e}")
except Exception as e:
    print(f"[TEST ❌] General Exception: {e}")
