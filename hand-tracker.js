// Hand Tracker Module
// Uses MediaPipe Hands for real-time hand tracking and gesture recognition

class HandTracker {
    constructor() {
        this.hands = null;
        this.camera = null;
        this.canvas = null;
        this.ctx = null;
        this.isRunning = false;
        this.onResultsCallback = null;
        this.videoElement = null;
    }

    async initialize(videoElement, canvasElement, onResultsCallback) {
        this.videoElement = videoElement;
        this.canvas = canvasElement;
        this.ctx = canvasElement.getContext('2d');
        this.onResultsCallback = onResultsCallback;

        // Initialize MediaPipe Hands
        this.hands = new Hands({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${file}`;
            }
        });

        this.hands.setOptions({
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.5
        });

        this.hands.onResults(this.handleResults.bind(this));

        // Initialize camera
        this.camera = new Camera(videoElement, {
            onFrame: async () => {
                if (this.isRunning) {
                    await this.hands.send({ image: videoElement });
                }
            },
            width: 640,
            height: 480
        });

        return this;
    }

    handleResults(results) {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw video frame
        this.ctx.drawImage(this.videoElement, 0, 0, this.canvas.width, this.canvas.height);

        // Draw hand landmarks
        if (results.multiHandLandmarks) {
            for (const landmarks of results.multiHandLandmarks) {
                this.drawHand(landmarks);
            }
        }

        // Process hand landmarks for sign recognition
        if (this.onResultsCallback) {
            this.onResultsCallback(results);
        }
    }

    drawHand(landmarks) {
        // Draw hand connections
        const connections = [
            [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
            [0, 5], [5, 6], [6, 7], [7, 8], // Index finger
            [0, 9], [9, 10], [10, 11], [11, 12], // Middle finger
            [0, 13], [13, 14], [14, 15], [15, 16], // Ring finger
            [0, 17], [17, 18], [18, 19], [19, 20] // Pinky
        ];

        // Draw connections
        this.ctx.strokeStyle = '#00FF00';
        this.ctx.lineWidth = 2;
        
        for (const [start, end] of connections) {
            const startPoint = landmarks[start];
            const endPoint = landmarks[end];
            
            this.ctx.beginPath();
            this.ctx.moveTo(startPoint.x * this.canvas.width, startPoint.y * this.canvas.height);
            this.ctx.lineTo(endPoint.x * this.canvas.width, endPoint.y * this.canvas.height);
            this.ctx.stroke();
        }

        // Draw landmarks
        this.ctx.fillStyle = '#FF0000';
        for (const landmark of landmarks) {
            this.ctx.beginPath();
            this.ctx.arc(
                landmark.x * this.canvas.width,
                landmark.y * this.canvas.height,
                5,
                0,
                2 * Math.PI
            );
            this.ctx.fill();
        }
    }

    async start() {
        if (!this.isRunning) {
            try {
                await this.camera.start();
                this.isRunning = true;
                console.log('Hand tracker started');
            } catch (error) {
                console.error('Error starting hand tracker:', error);
                throw error;
            }
        }
    }

    stop() {
        if (this.isRunning) {
            this.isRunning = false;
            console.log('Hand tracker stopped');
        }
    }

    // Extract hand features for sign recognition
    extractFeatures(landmarks) {
        if (!landmarks || landmarks.length === 0) return null;

        const features = [];
        const hand = landmarks[0]; // Use first hand detected

        // Calculate distances between key points
        const distances = this.calculateDistances(hand);
        
        // Calculate angles between fingers
        const angles = this.calculateAngles(hand);
        
        // Calculate finger curl states
        const curls = this.calculateFingerCurls(hand);
        
        // Combine all features
        features.push(...distances, ...angles, ...curls);
        
        return features;
    }

    calculateDistances(landmarks) {
        const distances = [];
        
        // Key points for distance calculation
        const keyPoints = [0, 4, 8, 12, 16, 20]; // Wrist and fingertips
        
        for (let i = 0; i < keyPoints.length; i++) {
            for (let j = i + 1; j < keyPoints.length; j++) {
                const p1 = landmarks[keyPoints[i]];
                const p2 = landmarks[keyPoints[j]];
                const distance = Math.sqrt(
                    Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)
                );
                distances.push(distance);
            }
        }
        
        return distances;
    }

    calculateAngles(landmarks) {
        const angles = [];
        
        // Calculate angles between fingers
        const fingerTips = [4, 8, 12, 16, 20];
        const fingerBases = [2, 6, 10, 14, 18];
        
        for (let i = 0; i < fingerTips.length; i++) {
            const tip = landmarks[fingerTips[i]];
            const base = landmarks[fingerBases[i]];
            const wrist = landmarks[0];
            
            const angle = Math.atan2(
                tip.y - wrist.y,
                tip.x - wrist.x
            );
            angles.push(angle);
        }
        
        return angles;
    }

    calculateFingerCurls(landmarks) {
        const curls = [];
        
        // Calculate curl for each finger
        const fingers = [
            [2, 3, 4],      // Thumb
            [6, 7, 8],      // Index
            [10, 11, 12],   // Middle
            [14, 15, 16],   // Ring
            [18, 19, 20]    // Pinky
        ];
        
        for (const finger of fingers) {
            const [base, middle, tip] = finger;
            const basePoint = landmarks[base];
            const middlePoint = landmarks[middle];
            const tipPoint = landmarks[tip];
            
            // Calculate curl based on angle
            const curl = Math.atan2(
                tipPoint.y - basePoint.y,
                tipPoint.x - basePoint.x
            );
            curls.push(curl);
        }
        
        return curls;
    }

    // Normalize features for consistent comparison
    normalizeFeatures(features) {
        if (!features) return null;
        
        // Simple min-max normalization
        const max = Math.max(...features);
        const min = Math.min(...features);
        const range = max - min;
        
        if (range === 0) return features.map(() => 0);
        
        return features.map(f => (f - min) / range);
    }

    // Get hand bounding box
    getHandBoundingBox(landmarks) {
        if (!landmarks || landmarks.length === 0) return null;
        
        const hand = landmarks[0];
        const xCoords = hand.map(p => p.x);
        const yCoords = hand.map(p => p.y);
        
        return {
            x: Math.min(...xCoords),
            y: Math.min(...yCoords),
            width: Math.max(...xCoords) - Math.min(...xCoords),
            height: Math.max(...yCoords) - Math.min(...yCoords)
        };
    }

    // Check if hand is in frame
    isHandInFrame(landmarks) {
        if (!landmarks || landmarks.length === 0) return false;
        
        const hand = landmarks[0];
        return hand.every(point => 
            point.x >= 0 && point.x <= 1 && 
            point.y >= 0 && point.y <= 1
        );
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HandTracker;
} else {
    window.HandTracker = HandTracker;
}
