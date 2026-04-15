document.addEventListener('DOMContentLoaded', () => {

    // 2. Helper function to auto-scale text to fit within boundary
    function autoScaleText(el, baseSizeRem) {
        el.style.fontSize = baseSizeRem + 'rem'; // Reset to base size
        const parentWidth = el.parentElement.offsetWidth;
        const maxAllowedWidth = parentWidth * 0.8; // Limit to 80% boundary
        let currentSize = baseSizeRem;
        
        // Loop and shrink font size if it is too wide
        while (el.scrollWidth > maxAllowedWidth && currentSize > 0.5) {
            currentSize -= 0.1;
            el.style.fontSize = currentSize + 'rem';
        }
    }

    const isDesktop = () => window.innerWidth >= 768;

    // --- 1. Update Player Name ---
    const nameInput = document.querySelector('input[placeholder="Type name here..."]');
    const nameDisplay = document.querySelector('.player-name-display');

    nameInput.addEventListener('input', (e) => {
        // Grab the value, trim whitespace, and force uppercase
        const newName = e.target.value.trim().toUpperCase();
        // Fallback to 'RAHEL' if the input is cleared completely
        nameDisplay.textContent = newName || 'RAHEL'; 
        autoScaleText(nameDisplay, isDesktop() ? 3 : 2); // Auto-scale after update
    });


    // --- 2. Update Player Number ---
    const btnMinus = document.querySelectorAll('.btn-step')[0];
    const btnPlus = document.querySelectorAll('.btn-step')[1];
    const numberDisplay = document.querySelector('.player-number-display');
    const formNumberInput = document.querySelector('.current-num'); // 4. Now an input field

    // Initialize state
    let playerNumber = 7;
    formNumberInput.value = playerNumber;
    numberDisplay.textContent = playerNumber;

    function updateNumbers() {
        numberDisplay.textContent = playerNumber;
        formNumberInput.value = playerNumber;
        autoScaleText(numberDisplay, isDesktop() ? 8 : 5); // Auto-scale after update
    }

    btnMinus.addEventListener('click', () => {
        if (playerNumber > 0) {
            playerNumber--;
            updateNumbers();
        }
    });

    btnPlus.addEventListener('click', () => {
        if (playerNumber < 999) { // 4. Expanded to 999
            playerNumber++;
            updateNumbers();
        }
    });

    // 4. Listen for typing directly into the number input box
    formNumberInput.addEventListener('input', (e) => {
        let val = e.target.value.trim();
        playerNumber = val === '' ? '' : parseInt(val, 10);
        updateNumbers();
    });


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
                
                // Recalculate size since new font might be wider
                autoScaleText(nameDisplay, isDesktop() ? 3 : 2);
                autoScaleText(numberDisplay, isDesktop() ? 8 : 5);
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

    // Initial scale on load and window resize
    window.addEventListener('load', () => {
        autoScaleText(nameDisplay, isDesktop() ? 3 : 2);
        autoScaleText(numberDisplay, isDesktop() ? 8 : 5);
    });
    window.addEventListener('resize', () => {
        autoScaleText(nameDisplay, isDesktop() ? 3 : 2);
        autoScaleText(numberDisplay, isDesktop() ? 8 : 5);
    });

});