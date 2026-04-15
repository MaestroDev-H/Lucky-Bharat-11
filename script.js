document.addEventListener('DOMContentLoaded', () => {

    // Helper function to auto-scale text to fit within boundary
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
    
    // NEW: We use this to track if a specific font needs to be smaller
    let currentFontScale = 1.0; 

    // --- 1. Update Player Name ---
    const nameInput = document.querySelector('input[placeholder="Type name here..."]');
    const nameDisplay = document.querySelector('.player-name-display');

    nameInput.addEventListener('input', (e) => {
        const newName = e.target.value.trim().toUpperCase();
        nameDisplay.textContent = newName || 'RAHEL'; 
        // Apply the scale modifier to the base size
        autoScaleText(nameDisplay, (isDesktop() ? 3 : 2) * currentFontScale); 
    });

    


    // --- 2. Update Player Number ---
    const btnMinus = document.querySelectorAll('.btn-step')[0];
    const btnPlus = document.querySelectorAll('.btn-step')[1];
    const numberDisplay = document.querySelector('.player-number-display');
    const formNumberInput = document.querySelector('.current-num'); 

    let playerNumber = 7;
    formNumberInput.value = playerNumber;
    numberDisplay.textContent = playerNumber;

    function updateNumbers() {
        numberDisplay.textContent = playerNumber;
        formNumberInput.value = playerNumber;
        // Apply the scale modifier to the base size
        autoScaleText(numberDisplay, (isDesktop() ? 8 : 5) * currentFontScale); 
    }

    btnMinus.addEventListener('click', () => {
        if (playerNumber > 0) {
            playerNumber--;
            updateNumbers();
        }
    });

    btnPlus.addEventListener('click', () => {
        if (playerNumber < 999) { 
            playerNumber++;
            updateNumbers();
        }
    });

    formNumberInput.addEventListener('input', (e) => {
        let val = e.target.value.trim();
        playerNumber = val === '' ? '' : parseInt(val, 10);
        updateNumbers();
    });


    // --- 3. Change Font Family ---
    const fontButtons = document.querySelectorAll('.font-options .btn-option');
    
    // Map the button text to specific configurations
    const fontConfig = {
        'ANTON': {
            family: "'Anton', sans-serif",
            letterSpacing: '1px',
            numberMargin: '0px',
            sizeMultiplier: 0.9 // <--- CHANGE THIS: 0.9 makes Anton 10% smaller!
        },
        'BEBAS': {
            family: "'Bebas Neue', sans-serif",
            letterSpacing: '2px',
            numberMargin: '-10px',
            sizeMultiplier: 1.0 // 1.0 means 100% normal size
        },
        'VARSITY': {
            family: "'Varsity', sans-serif",
            letterSpacing: '1px',
            numberMargin: '-10px',
            sizeMultiplier: 1.0
        },
        'MONTSERRAT': {
            family: "'Montserrat', sans-serif",
            letterSpacing: '0px',
            numberMargin: '-20px',
            sizeMultiplier: 1.0
        },
        'IMPACT': {
            family: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
            letterSpacing: '0px',
            numberMargin: '-10px',
            sizeMultiplier: 1.0
        }
    };

    fontButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedFont = button.textContent.trim();
            const config = fontConfig[selectedFont];
            
            if (config) {
                // Update global font scale based on the selected font
                currentFontScale = config.sizeMultiplier || 1.0;

                // Apply styles
                nameDisplay.style.fontFamily = config.family;
                numberDisplay.style.fontFamily = config.family;
                nameDisplay.style.letterSpacing = config.letterSpacing;
                numberDisplay.style.marginTop = config.numberMargin;
                nameDisplay.style.lineHeight = "1";
                numberDisplay.style.lineHeight = "1";
                
                // Recalculate sizes with the new font scale multiplier
                autoScaleText(nameDisplay, (isDesktop() ? 3 : 2) * currentFontScale);
                autoScaleText(numberDisplay, (isDesktop() ? 8 : 5) * currentFontScale);
            }
        });
    });


    // --- 4. 3D Jersey Flip Toggle ---
    const btnFlip = document.getElementById('btn-flip');
    const shirtFlipper = document.getElementById('shirt-flipper');
    
    let isShowingBack = true; 

    btnFlip.addEventListener('click', () => {
        shirtFlipper.classList.toggle('is-flipped');
        isShowingBack = !isShowingBack;
        btnFlip.textContent = isShowingBack ? 'FLIP TO BACK' : 'FLIP TO FRONT';
    });

    // Initial scale on load and window resize
    window.addEventListener('load', () => {
        autoScaleText(nameDisplay, (isDesktop() ? 3 : 2) * currentFontScale);
        autoScaleText(numberDisplay, (isDesktop() ? 8 : 5) * currentFontScale);
    });
    window.addEventListener('resize', () => {
        autoScaleText(nameDisplay, (isDesktop() ? 3 : 2) * currentFontScale);
        autoScaleText(numberDisplay, (isDesktop() ? 8 : 5) * currentFontScale);
    });

});