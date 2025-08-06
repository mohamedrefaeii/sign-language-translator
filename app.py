from flask import Flask, render_template, Response, jsonify
import cv2
import numpy as np
import mediapipe as mp
import threading
import time
from datetime import datetime

app = Flask(__name__)

# Initialize MediaPipe
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=2,
    min_detection_confidence=0.7,
    min_tracking_confidence=0.5
)

# Global variables
camera = None
current_sign = ""
translated_text = ""
confidence = 0.0
lock = threading.Lock()

def get_camera():
    global camera
    if camera is None or not camera.isOpened():
        camera = cv2.VideoCapture(0)
        camera.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    return camera

def recognize_sign(hand_landmarks):
    """Simple sign recognition based on finger positions"""
    global current_sign, confidence
    
    if not hand_landmarks:
        return None
    
    # Get landmarks
    landmarks = []
    for hand_landmark in hand_landmarks:
        for landmark in hand_landmark.landmark:
            landmarks.append([landmark.x, landmark.y, landmark.z])
    
    # Simple sign recognition logic
    # This is a placeholder - in production, use a trained ML model
    
    # Count extended fingers
    extended_fingers = 0
    finger_tips = [8, 12, 16, 20]  # Index, middle, ring, pinky
    finger_pips = [6, 10, 14, 18]  # Second joints
    
    for tip, pip in zip(finger_tips, finger_pips):
        if landmarks[tip][1] < landmarks[pip][1]:  # Tip above pip
            extended_fingers += 1
    
    # Thumb check
    thumb_tip = landmarks[4]
    thumb_ip = landmarks[3]
    if thumb_tip[0] > thumb_ip[0]:  # Thumb extended
        extended_fingers += 1
    
    # Map finger count to signs
    sign_map = {
        0: "FIST",
        1: "ONE",
        2: "TWO", 
        3: "THREE",
        4: "FOUR",
        5: "FIVE",
        6: "THUMBS_UP"
    }
    
    sign = sign_map.get(extended_fingers, "UNKNOWN")
    confidence = 0.8  # Placeholder confidence
    
    return sign

def gen_frames():
    """Generate frames for video feed"""
    global current_sign, translated_text, confidence
    
    while True:
        try:
            camera = get_camera()
            success, frame = camera.read()
            
            if not success:
                continue
            
            # Convert BGR to RGB
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            # Process with MediaPipe
            results = hands.process(rgb_frame)
            
            # Draw hand landmarks
            if results.multi_hand_landmarks:
                for hand_landmarks in results.multi_hand_landmarks:
                    mp_drawing.draw_landmarks(
                        frame, hand_landmarks, mp_hands.HAND_CONNECTIONS,
                        mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=2),
                        mp_drawing.DrawingSpec(color=(0, 0, 255), thickness=2, circle_radius=2)
                    )
                    
                    # Recognize sign
                    sign = recognize_sign([hand_landmarks])
                    if sign:
                        with lock:
                            current_sign = sign
                            if sign not in translated_text.split():
                                translated_text += sign + " "
            
            # Add text overlay
            cv2.putText(frame, f"Sign: {current_sign}", (10, 30), 
                       cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            cv2.putText(frame, f"Confidence: {confidence:.2f}", (10, 70), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
            
            # Encode frame
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
                   
        except Exception as e:
            print(f"Error in gen_frames: {e}")
            time.sleep(0.1)
            continue

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/api/current_sign')
def get_current_sign():
    with lock:
        return jsonify({
            'sign': current_sign,
            'text': translated_text.strip(),
            'confidence': confidence
        })

@app.route('/api/reset')
def reset_translation():
    global current_sign, translated_text, confidence
    with lock:
        current_sign = ""
        translated_text = ""
        confidence = 0.0
    return jsonify({'status': 'reset'})

@app.route('/api/speak', methods=['POST'])
def speak_text():
    from gtts import gTTS
    import os
    
    text = request.json.get('text', '')
    if text:
        try:
            tts = gTTS(text=text, lang='en')
            tts.save("temp_speech.mp3")
            os.system("start temp_speech.mp3")  # Windows
            return jsonify({'status': 'speaking'})
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    return jsonify({'error': 'No text provided'}), 400

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
