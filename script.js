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

// =========================================
// NEW: SAVE MODAL & ZIP EXPORT LOGIC
// =========================================
    const btnSaveDesign = document.querySelector('.btn-save');
    const saveModal = document.getElementById('save-modal');
    const btnEditDesign = document.getElementById('btn-edit-design');
    const btnConfirmSave = document.getElementById('btn-confirm-save');
    const previewFront = document.getElementById('preview-front');
    const previewBack = document.getElementById('preview-back');

    let frontImageData = null;
    let backPrintData = null; // High-res transparent version for ZIP

    // 1. SAVE DESIGN BUTTON (Opens Modal & Generates Previews)
    btnSaveDesign.addEventListener('click', async (e) => {
        e.preventDefault();
        btnSaveDesign.style.opacity = '0.5';
        btnSaveDesign.disabled = true;

        const shirtFrontEl = document.querySelector('.shirt-front');
        const shirtBackEl = document.querySelector('.shirt-back');
        const nameText = document.querySelector('.player-name-display');
        const numText = document.querySelector('.player-number-display');

        try {
            shirtFrontEl.style.transform = 'rotateY(0deg)';

            nameText.style.background = 'none';
            nameText.style.webkitBackgroundClip = 'initial';
            nameText.style.color = '#fcd784';
            nameText.style.filter = 'none';

            numText.style.background = 'none';
            numText.style.webkitBackgroundClip = 'initial';
            numText.style.color = '#fcd784';
            numText.style.filter = 'none';

            const canvasFront = await html2canvas(shirtFrontEl, { backgroundColor: null, scale: 2 });
            frontImageData = canvasFront.toDataURL('image/png');
            previewFront.src = frontImageData;

            const canvasBackUI = await html2canvas(shirtBackEl, { backgroundColor: null, scale: 2 });
            previewBack.src = canvasBackUI.toDataURL('image/png');

            shirtBackEl.style.backgroundImage = 'none'; 
            shirtBackEl.style.backgroundColor = 'transparent'; 
            
            const canvasBackPrint = await html2canvas(shirtBackEl, { backgroundColor: null, scale: 4 }); 
            backPrintData = canvasBackPrint.toDataURL('image/png');
            
            // --- RESTORE ---
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
            alert("Something went wrong generating the design. Ensure you are running this on a local web server.");
        } finally {
            btnSaveDesign.style.opacity = '1';
            btnSaveDesign.disabled = false;
        }
    });

    // 2. EDIT DESIGN BUTTON (Closes Modal)
    btnEditDesign.addEventListener('click', () => {
        saveModal.style.display = 'none';
    });

    // 3. CONFIRM PRINT BUTTON (Downloads ZIP)
    btnConfirmSave.addEventListener('click', () => {
        btnConfirmSave.style.opacity = '0.5';
        btnConfirmSave.disabled = true;

        try {
            const zip = new JSZip();
            
            const frontBase64 = frontImageData.split(',')[1];
            const backBase64 = backPrintData.split(',')[1];

            zip.file("Jersey_Front_Design.png", frontBase64, {base64: true});
            zip.file("Jersey_Back_Print_File_Transparent.png", backBase64, {base64: true});

            // --- NEW: GET PLAYER NAME FOR ZIP FILENAME ---
            const playerName = document.querySelector('.player-name-display').textContent.trim() || 'Custom';
            // Clean the name so weird characters don't break the computer's file saving
            const safeName = playerName.replace(/[^a-zA-Z0-9]/g, '_'); 

            zip.generateAsync({type:"blob"}).then(function(content) {
                // Dynamically inject the name into the ZIP file name!
                saveAs(content, `${safeName}_Jersey.zip`);
                
                btnConfirmSave.style.opacity = '1';
                btnConfirmSave.disabled = false;
                saveModal.style.display = 'none';
            });
        } catch(error) {
            console.error("Error creating ZIP:", error);
            btnConfirmSave.style.opacity = '1';
            btnConfirmSave.disabled = false;
        }
    });
});