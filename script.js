document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Update Player Name ---
    const nameInput = document.querySelector('input[placeholder="Type name here..."]');
    const nameDisplay = document.querySelector('.player-name-display');

    nameInput.addEventListener('input', (e) => {
        // Grab the value, trim whitespace, and force uppercase
        const newName = e.target.value.trim().toUpperCase();
        // Fallback to 'RAHEL' if the input is cleared completely
        nameDisplay.textContent = newName || 'RAHEL'; 
    });


    // --- 2. Update Player Number ---
    const btnMinus = document.querySelectorAll('.btn-step')[0];
    const btnPlus = document.querySelectorAll('.btn-step')[1];
    const numberDisplay = document.querySelector('.player-number-display');
    const formNumberDisplay = document.querySelector('.current-num');

    // Initialize state
    let playerNumber = 7;
    formNumberDisplay.textContent = playerNumber;
    numberDisplay.textContent = playerNumber;

    btnMinus.addEventListener('click', () => {
        if (playerNumber > 0) {
            playerNumber--;
            updateNumbers();
        }
    });

    btnPlus.addEventListener('click', () => {
        if (playerNumber < 99) {
            playerNumber++;
            updateNumbers();
        }
    });

    function updateNumbers() {
        numberDisplay.textContent = playerNumber;
        formNumberDisplay.textContent = playerNumber;
    }


    // --- 3. Change Font Family ---
    const fontButtons = document.querySelectorAll('.font-options .btn-option');
    
    // Map the button text to the CSS font-family values
    const fontMap = {
        'ANTON': "'Anton', sans-serif",
        'BEBAS': "'Bebas Neue', sans-serif",
        'VARSITY': "'Varsity', sans-serif", 
        'MONTSERRAT': "'Montserrat', sans-serif",
        'IMPACT': "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif"
    };

    fontButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedFont = button.textContent.trim();
            
            if (fontMap[selectedFont]) {
                nameDisplay.style.fontFamily = fontMap[selectedFont];
                numberDisplay.style.fontFamily = fontMap[selectedFont];
            }
        });
    });


    // --- 4. 3D Jersey Flip Toggle ---
    const btnFlip = document.getElementById('btn-flip');
    const shirtFlipper = document.getElementById('shirt-flipper');
    
    let isShowingBack = true; 

    btnFlip.addEventListener('click', () => {
        // Toggle the flipped CSS class
        shirtFlipper.classList.toggle('is-flipped');
        
        // Update the state and button text
        isShowingBack = !isShowingBack;
        btnFlip.textContent = isShowingBack ? 'FLIP TO BACK' : 'FLIP TO FRONT';
    });

});