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
        nameDisplay.textContent = newName || 'Koie'; 
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
            numberMargin: '-10px',
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
        
        // CHANGED: Swapped the text order so it says "FLIP TO BACK" when the front is showing
        btnFlip.textContent = isShowingBack ? 'FLIP TO FRONT' : 'FLIP TO BACK';
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

// =========================================
// NEW: SAVE MODAL & PHP EXPORT LOGIC
// =========================================
    const btnSaveDesign = document.querySelector('.btn-save');
    const saveModal = document.getElementById('save-modal');
    const btnEditDesign = document.getElementById('btn-edit-design');
    const btnConfirmSave = document.getElementById('btn-confirm-save');
    const previewFront = document.getElementById('preview-front');
    const previewBack = document.getElementById('preview-back');

    let frontImageData = null;
    let frontPrintData = null; // High-res transparent version for front
    let backPrintData = null;  // High-res transparent version for back

    // 1. SAVE DESIGN BUTTON (Opens Modal & Generates Previews)
    btnSaveDesign.addEventListener('click', async (e) => {
        e.preventDefault();
        btnSaveDesign.style.opacity = '0.5';
        btnSaveDesign.disabled = true;
        btnSaveDesign.textContent = "GENERATING..."; // Optional feedback

        const shirtFrontEl = document.querySelector('.shirt-front');
        const shirtBackEl = document.querySelector('.shirt-back');
        const nameText = document.querySelector('.player-name-display');
        const numText = document.querySelector('.player-number-display');

        try {
            // --- 1. PREPARE FRONT CAPTURE ---
            shirtBackEl.style.visibility = 'hidden'; 
            shirtFrontEl.style.transform = 'rotateY(0deg)'; 

            nameText.style.background = 'none';
            nameText.style.webkitBackgroundClip = 'initial';
            nameText.style.color = '#fcd784';
            nameText.style.filter = 'none';

            numText.style.background = 'none';
            numText.style.webkitBackgroundClip = 'initial';
            numText.style.color = '#fcd784';
            numText.style.filter = 'none';

            // Generate Front Preview 
            const canvasFront = await html2canvas(shirtFrontEl, { backgroundColor: null, scale: 2 });
            frontImageData = canvasFront.toDataURL('image/png');
            previewFront.src = frontImageData;

            // Generate Front Print 
            shirtFrontEl.style.backgroundImage = 'none';
            shirtFrontEl.style.backgroundColor = 'transparent';
            const canvasFrontPrint = await html2canvas(shirtFrontEl, { backgroundColor: null, scale: 4 });
            frontPrintData = canvasFrontPrint.toDataURL('image/png');

            // --- 2. PREPARE BACK CAPTURE ---
            shirtFrontEl.style.visibility = 'hidden'; 
            shirtBackEl.style.visibility = 'visible'; 
            
            // Generate Back Preview 
            const canvasBackUI = await html2canvas(shirtBackEl, { backgroundColor: null, scale: 2 });
            previewBack.src = canvasBackUI.toDataURL('image/png');

            // Generate Back Print 
            shirtBackEl.style.backgroundImage = 'none'; 
            shirtBackEl.style.backgroundColor = 'transparent'; 
            const canvasBackPrint = await html2canvas(shirtBackEl, { backgroundColor: null, scale: 4 }); 
            backPrintData = canvasBackPrint.toDataURL('image/png');
            
            // --- 3. RESTORE EVERYTHING ---
            shirtFrontEl.style.visibility = ''; 
            shirtBackEl.style.visibility = '';  
            
            shirtFrontEl.style.backgroundImage = ''; 
            shirtBackEl.style.backgroundImage = ''; 
            shirtFrontEl.style.transform = ''; 

            nameText.style.background = '';
            nameText.style.webkitBackgroundClip = '';
            nameText.style.color = '';
            nameText.style.filter = '';

            numText.style.background = '';
            numText.style.webkitBackgroundClip = '';
            numText.style.color = '';
            numText.style.filter = '';

            saveModal.style.display = 'flex';
        } catch (error) {
            console.error("Error generating design previews:", error);
            alert("Something went wrong generating the design.");
        } finally {
            btnSaveDesign.style.opacity = '1';
            btnSaveDesign.disabled = false;
            btnSaveDesign.textContent = "SAVE DESIGN";
        }
    });

    // 2. EDIT DESIGN BUTTON (Closes Modal)
    btnEditDesign.addEventListener('click', () => {
        saveModal.style.display = 'none';
    });

    // 3. CONFIRM PRINT BUTTON (Sends to PHP)
    btnConfirmSave.addEventListener('click', async () => {
        btnConfirmSave.style.opacity = '0.5';
        btnConfirmSave.disabled = true;
        btnConfirmSave.textContent = "SAVING..."; // Visual feedback for user

        const playerName = document.querySelector('.player-name-display').textContent.trim() || 'Custom';

        try {
            // Send the Base64 data to our PHP script using Fetch API
            const response = await fetch('save_design.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    frontImage: frontPrintData,
                    backImage: backPrintData,
                    playerName: playerName
                })
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message); // Show success message
                saveModal.style.display = 'none'; // Close modal
            } else {
                alert("Error: " + result.message);
            }

        } catch (error) {
            console.error("Error sending data to server:", error);
            alert("Network error. Make sure you are running this on a PHP server.");
        } finally {
            btnConfirmSave.style.opacity = '1';
            btnConfirmSave.disabled = false;
            btnConfirmSave.textContent = "CONFIRM PRINT >";
        }
    });
});