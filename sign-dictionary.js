// Sign Language Dictionary - American Sign Language (ASL)
// This contains common ASL signs and their corresponding meanings

const SignDictionary = {
    // Alphabet - Fingerspelling
    alphabet: {
        'A': { 
            name: 'A', 
            description: 'Make a fist with your thumb pointing up',
            landmarks: [[0.2, 0.3], [0.3, 0.4], [0.4, 0.5], [0.5, 0.6], [0.6, 0.7]],
            confidence: 0.85
        },
        'B': { 
            name: 'B', 
            description: 'Hold up your hand with fingers together and thumb across palm',
            landmarks: [[0.1, 0.2], [0.2, 0.3], [0.3, 0.4], [0.4, 0.5], [0.5, 0.6]],
            confidence: 0.90
        },
        'C': { 
            name: 'C', 
            description: 'Curve your hand like the letter C',
            landmarks: [[0.3, 0.4], [0.4, 0.5], [0.5, 0.6], [0.6, 0.7], [0.7, 0.8]],
            confidence: 0.88
        },
        'D': { 
            name: 'D', 
            description: 'Touch thumb to middle finger, extend other fingers',
            landmarks: [[0.2, 0.3], [0.3, 0.4], [0.4, 0.5], [0.5, 0.6], [0.6, 0.7]],
            confidence: 0.87
        },
        'E': { 
            name: 'E', 
            description: 'Curl fingers into palm, thumb across front',
            landmarks: [[0.1, 0.2], [0.2, 0.3], [0.3, 0.4], [0.4, 0.5], [0.5, 0.6]],
            confidence: 0.86
        },
        'F': { 
            name: 'F', 
            description: 'Touch thumb and index finger, extend other fingers',
            landmarks: [[0.2, 0.3], [0.3, 0.4], [0.4, 0.5], [0.5, 0.6], [0.6, 0.7]],
            confidence: 0.89
        },
        'G': { 
            name: 'G', 
            description: 'Point index finger, thumb perpendicular',
            landmarks: [[0.3, 0.4], [0.4, 0.5], [0.5, 0.6], [0.6, 0.7], [0.7, 0.8]],
            confidence: 0.85
        },
        'H': { 
            name: 'H', 
            description: 'Two fingers extended together',
            landmarks: [[0.2, 0.3], [0.3, 0.4], [0.4, 0.5], [0.5, 0.6], [0.6, 0.7]],
            confidence: 0.88
        },
        'I': { 
            name: 'I', 
            description: 'Pinky finger extended, others curled',
            landmarks: [[0.1, 0.2], [0.2, 0.3], [0.3, 0.4], [0.4, 0.5], [0.5, 0.6]],
            confidence: 0.90
        },
        'J': { 
            name: 'J', 
            description: 'Draw J shape with pinky finger',
            landmarks: [[0.2, 0.3], [0.3, 0.4], [0.4, 0.5], [0.5, 0.6], [0.6, 0.7]],
            confidence: 0.87
        },
        'K': { 
            name: 'K', 
            description: 'Index and middle fingers up, thumb between',
            landmarks: [[0.3, 0.4], [0.4, 0.5], [0.5, 0.6], [0.6, 0.7], [0.7, 0.8]],
            confidence: 0.86
        },
        'L': { 
            name: 'L', 
            description: 'L shape with thumb and index finger',
            landmarks: [[0.2, 0.3], [0.3, 0.4], [0.4, 0.5], [0.5, 0.6], [0.6, 0.7]],
            confidence: 0.89
        },
        'M': { 
            name: 'M', 
            description: 'Three fingers over thumb',
            landmarks: [[0.1, 0.2], [0.2, 0.3], [0.3, 0.4], [0.4, 0.5], [0.5, 0.6]],
            confidence: 0.85
        },
        'N': { 
            name: 'N', 
            description: 'Two fingers over thumb',
            landmarks: [[0.2, 0.3], [0.3, 0.4], [0.4, 0.5], [0.5, 0.6], [0.6, 0.7]],
            confidence: 0.88
        },
        'O': { 
            name: 'O', 
            description: 'Circle with thumb and fingers',
            landmarks: [[0.3, 0.4], [0.4, 0.5], [0.5, 0.6], [0.6, 0.7], [0.7, 0.8]],
            confidence: 0.90
        }
    },
    
    // Common words and phrases
    words: {
        'HELLO': {
            name: 'Hello',
            description: 'Wave hand from side to side',
            landmarks: [[0.4, 0.5], [0.5, 0.6], [0.6, 0.7], [0.7, 0.8], [0.8, 0.9]],
            confidence: 0.92
        },
        'THANK_YOU': {
            name: 'Thank You',
            description: 'Touch chin and move hand forward',
            landmarks: [[0.3, 0.4], [0.4, 0.5], [0.5, 0.6], [0.6, 0.7], [0.7, 0.8]],
            confidence: 0.93
        },
        'YES': {
            name: 'Yes',
            description: 'Nod head or make affirmative gesture',
            landmarks: [[0.2, 0.3], [0.3, 0.4], [0.4, 0.5], [0.5, 0.6], [0.6, 0.7]],
            confidence: 0.91
        },
        'NO': {
            name: 'No',
            description: 'Shake head or make negative gesture',
            landmarks: [[0.1, 0.2], [0.2, 0.3], [0.3, 0.4], [0.4, 0.5], [0.5, 0.6]],
            confidence: 0.90
        },
        'PLEASE': {
            name: 'Please',
            description: 'Circular motion on chest',
            landmarks: [[0.3, 0.4], [0.4, 0.5], [0.5, 0.6], [0.6, 0.7], [0.7, 0.8]],
            confidence: 0.89
        },
        'SORRY': {
            name: 'Sorry',
            description: 'Fist circle on chest',
            landmarks: [[0.2, 0.3], [0.3, 0.4], [0.4, 0.5], [0.5, 0.6], [0.6, 0.7]],
            confidence: 0.88
        },
        'GOOD': {
            name: 'Good',
            description: 'Thumb up gesture',
            landmarks: [[0.4, 0.5], [0.5, 0.6], [0.6, 0.7], [0.7, 0.8], [0.8, 0.9]],
            confidence: 0.94
        },
        'BAD': {
            name: 'Bad',
            description: 'Thumb down gesture',
            landmarks: [[0.3, 0.4], [0.4, 0.5], [0.5, 0.6], [0.6, 0.7], [0.7, 0.8]],
            confidence: 0.93
        },
        'LOVE': {
            name: 'Love',
            description: 'Cross arms over chest',
            landmarks: [[0.2, 0.3], [0.3, 0.4], [0.4, 0.5], [0.5, 0.6], [0.6, 0.7]],
            confidence: 0.95
        },
        'FRIEND': {
            name: 'Friend',
            description: 'Interlocked index fingers',
            landmarks: [[0.3, 0.4], [0.4, 0.5], [0.5, 0.6], [0.6, 0.7], [0.7, 0.8]],
            confidence: 0.87
        },
        'FAMILY': {
            name: 'Family',
            description: 'Circle with both hands',
            landmarks: [[0.4, 0.5], [0.5, 0.6], [0.6, 0.7], [0.7, 0.8], [0.8, 0.9]],
            confidence: 0.89
        },
        'WATER': {
            name: 'Water',
            description: 'W shape with three fingers, tap chin',
            landmarks: [[0.2, 0.3], [0.3, 0.4], [0.4, 0.5], [0.5, 0.6], [0.6, 0.7]],
            confidence: 0.91
        },
        'FOOD': {
            name: 'Food',
            description: 'Pinch fingers together and bring to mouth',
            landmarks: [[0.3, 0.4], [0.4, 0.5], [0.5, 0.6], [0.6, 0.7], [0.7, 0.8]],
            confidence: 0.92
        },
        'HELP': {
            name: 'Help',
            description: 'Fist with thumb up, move forward',
            landmarks: [[0.1, 0.2], [0.2, 0.3], [0.3, 0.4], [0.4, 0.5], [0.5, 0.6]],
            confidence: 0.90
        },
        'MORE': {
            name: 'More',
            description: 'Bring fingertips together repeatedly',
            landmarks: [[0.4, 0.5], [0.5, 0.6], [0.6, 0.7], [0.7, 0.8], [0.8, 0.9]],
            confidence: 0.88
        },
        'STOP': {
            name: 'Stop',
            description: 'Flat hand palm facing outward',
            landmarks: [[0.5, 0.6], [0.6, 0.7], [0.7, 0.8], [0.8, 0.9], [0.9, 1.0]],
            confidence: 0.93
        }
    },
    
    // Numbers
    numbers: {
        '1': { name: 'One', description: 'Index finger up', confidence: 0.95 },
        '2': { name: 'Two', description: 'Index and middle fingers up', confidence: 0.94 },
        '3': { name: 'Three', description: 'Three fingers up', confidence: 0.93 },
        '4': { name: 'Four', description: 'Four fingers up', confidence: 0.92 },
        '5': { name: 'Five', description: 'All fingers extended', confidence: 0.96 },
        '6': { name: 'Six', description: 'Touch pinky to thumb', confidence: 0.89 },
        '7': { name: 'Seven', description: 'Touch ring finger to thumb', confidence: 0.88 },
        '8': { name: 'Eight', description: 'Touch middle finger to thumb', confidence: 0.87 },
        '9': { name: 'Nine', description: 'Touch index finger to thumb', confidence: 0.90 },
        '10': { name: 'Ten', description: 'Thumb up, other fingers closed', confidence: 0.91 }
    }
};

// Helper function to get sign by name
function getSignByName(signName) {
    const allSigns = { ...SignDictionary.alphabet, ...SignDictionary.words, ...SignDictionary.numbers };
    return allSigns[signName] || null;
}

// Helper function to search signs by description
function searchSignsByDescription(query) {
    const allSigns = { ...SignDictionary.alphabet, ...SignDictionary.words, ...SignDictionary.numbers };
    const results = [];
    
    for (const [key, sign] of Object.entries(allSigns)) {
        if (sign.description.toLowerCase().includes(query.toLowerCase())) {
            results.push({ key, ...sign });
        }
    }
    
    return results;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SignDictionary, getSignByName, searchSignsByDescription };
} else {
    window.SignDictionary = SignDictionary;
    window.getSignByName = getSignByName;
    window.searchSignsByDescription = searchSignsByDescription;
}
