// Sign Translator Module
// Main application logic for real-time sign language translation

import { SignDictionary } from './sign-dictionary.js';
import { HandTracker } from './hand-tracker.js';

class SignTranslator {
    constructor() {
        this.handTracker = null;
        this.isTranslating = false;
        this.translatedText = '';
        this.currentSign = '';
        this.confidenceThreshold = 0.75;
        this.signBuffer = [];
        this.bufferSize = 5;
        this.lastSignTime = 0;
        this.signCooldown = 1000; // 1 second between signs
    }

    async initialize() {
        // Get DOM elements
        const videoElement = document.getElementById('webcam');
        const canvasElement = document.getElementById('output-canvas');
        const startBtn = document.getElementById('start-btn');
        const stopBtn = document.getElementById('stop-btn');
        const resetBtn = document.getElementById('reset-btn');
        const speakBtn = document.getElementById('speak-btn');
        const voiceSelect = document.getElementById('voice-select');

        // Initialize hand tracker
        this.handTracker = new HandTracker();
        await this.handTracker.initialize(
            videoElement,
            canvasElement,
            this.onHandResults.bind(this)
        );

        // Set up event listeners
        startBtn.addEventListener('click', () => this.start());
        stopBtn.addEventListener('click', () => this.stop());
        resetBtn.addEventListener('click', () => this.reset());
        speakBtn.addEventListener('click', () => this.speakTranslation());
        
        // Populate voice select
        this.populateVoiceSelect(voiceSelect);

        console.log('Sign translator initialized');
    }

    async start() {
        if (!this.isTranslating) {
            try {
                await this.handTracker.start();
                this.isTranslating = true;
                this.updateUI('start');
                console.log('Sign translation started');
            } catch (error) {
                console.error('Error starting translation:', error);
                this.updateUI('error', error.message);
            }
        }
    }

    stop() {
        if (this.isTranslating) {
            this.handTracker.stop();
            this.isTranslating = false;
            this.updateUI('stop');
            console.log('Sign translation stopped');
        }
    }

    reset() {
        this.translatedText = '';
        this.currentSign = '';
        this.signBuffer = [];
        this.updateUI('reset');
        console.log('Sign translator reset');
    }

    onHandResults(results) {
        if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
            this.updateUI('no_sign');
            return;
        }

        const now = Date.now();
        if (now - this.lastSignTime < this.signCooldown) {
            return;
        }

        const features = this.handTracker.extractFeatures(results.multiHandLandmarks);
        if (!features) {
            this.updateUI('no_sign');
            return;
        }

        const normalizedFeatures = this.handTracker.normalizeFeatures(features);
        const detectedSign = this.recognizeSign(normalizedFeatures);
        
        if (detectedSign) {
            this.signBuffer.push(detectedSign);
            
            if (this.signBuffer.length >= this.bufferSize) {
                const mostCommonSign = this.getMostCommonSign(this.signBuffer);
                if (mostCommonSign.confidence > this.confidenceThreshold) {
                    this.addSignToTranslation(mostCommonSign);
                    this.signBuffer = [];
                    this.lastSignTime = now;
                }
            }
        }
    }

    recognizeSign(features) {
        // Simple sign recognition based on feature matching
        // In a real implementation, this would use a trained ML model
        
        const allSigns = { ...SignDictionary.alphabet, ...SignDictionary.words, ...SignDictionary.numbers };
        
        let bestMatch = null;
        let bestScore = 0;
        
        for (const [signName, sign] of Object.entries(allSigns)) {
            // Simple distance-based matching (placeholder)
            const score = this.calculateSimilarity(features, sign.landmarks);
            
            if (score > bestScore) {
                bestScore = score;
                bestMatch = {
                    name: sign.name,
                    description: sign.description,
                    confidence: score
                };
            }
        }
        
        return bestMatch && bestMatch.confidence > this.confidenceThreshold ? bestMatch : null;
    }

    calculateSimilarity(features, landmarks) {
        // Simple similarity calculation (placeholder)
        // In a real implementation, this would use a proper ML model
        
        if (!landmarks || landmarks.length === 0) return 0;
        
        // Normalize landmarks
        const normalizedLandmarks = landmarks.map(point => [point[0], point[1]]);
        
        // Simple distance-based similarity
        let similarity = 0;
        for (let i = 0; i < Math.min(features.length, normalizedLandmarks.length); i++) {
            const distance = Math.sqrt(
                Math.pow(features[i] - normalizedLandmarks[i][0], 2) +
                Math.pow(features[i + 1] - normalizedLandmarks[i][1], 2)
            );
            similarity += 1 / (1 + distance);
        }
        
        return similarity / Math.min(features.length, normalizedLandmarks.length);
    }

    getMostCommonSign(signs) {
        const counts = {};
        signs.forEach(sign => {
            counts[sign.name] = (counts[sign.name] || 0) + 1;
        });
        
        let mostCommon = null;
        let maxCount = 0;
        
        for (const [name, count] of Object.entries(counts)) {
            if (count > maxCount) {
                maxCount = count;
                mostCommon = signs.find(s => s.name === name);
            }
        }
        
        return mostCommon;
    }

    addSignToTranslation(sign) {
        if (sign.name !== this.currentSign) {
            this.currentSign = sign.name;
            this.translatedText += sign.name + ' ';
            this.updateUI('sign_detected', sign);
        }
    }

    speakTranslation() {
        if (this.translatedText.trim()) {
            const utterance = new SpeechSynthesisUtterance(this.translatedText.trim());
            const voices = speechSynthesis.getVoices();
            const selectedVoice = document.getElementById('voice-select').value;
            
            if (selectedVoice) {
                utterance.voice = voices.find(v => v.name === selectedVoice);
            }
            
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.volume = 1;
            
            speechSynthesis.speak(utterance);
            this.updateUI('speaking');
        }
    }

    populateVoiceSelect(selectElement) {
        const voices = speechSynthesis.getVoices();
        voices.forEach(voice => {
            const option = document.createElement('option');
            option.value = voice.name;
            option.textContent = `${voice.name} (${voice.lang})`;
            selectElement.appendChild(option);
        });
    }

    updateUI(action, data = null) {
        const signDisplay = document.getElementById('sign-display');
        const textOutput = document.getElementById('text-output');
        const speakBtn = document.getElementById('speak-btn');
        const startBtn = document.getElementById('start-btn');
        const stopBtn = document.getElementById('stop-btn');

        switch (action) {
            case 'start':
                startBtn.disabled = true;
                stopBtn.disabled = false;
                speakBtn.disabled = false;
                textOutput.textContent = 'Ready to translate...';
                break;
                
            case 'stop':
                startBtn.disabled = false;
                stopBtn.disabled = true;
                break;
                
            case 'reset':
                textOutput.textContent = 'Ready to translate...';
                signDisplay.textContent = 'No signs detected';
                break;
                
            case 'sign_detected':
                signDisplay.textContent = data.name;
                textOutput.textContent = this.translatedText.trim();
                break;
                
            case 'no_sign':
                signDisplay.textContent = 'No signs detected';
                break;
                
            case 'speaking':
                textOutput.textContent = this.translatedText.trim();
                break;
                
            case 'error':
                textOutput.textContent = `Error: ${data}`;
                break;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    const translator = new SignTranslator();
    await translator.initialize();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SignTranslator;
