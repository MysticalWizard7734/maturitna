function ledButtonsSetup(rgbButtons) {
    var idsAndColors = {
        0: { r1: 255, g1: 0, b1: 0, r2: 255, g2: 25, b2: 25 },   // Red
        1: { r1: 0, g1: 255, b1: 0, r2: 25, g2: 255, b2: 25 },   // Green
        2: { r1: 0, g1: 0, b1: 255, r2: 25, g2: 25, b2: 255 },   // Blue
        3: { r1: 0, g1: 255, b1: 255, r2: 25, g2: 255, b2: 255 }, // Cyan
        4: { r1: 255, g1: 0, b1: 255, r2: 255, g2: 25, b2: 255 }, // Magenta
        5: { r1: 255, g1: 255, b1: 0, r2: 255, g2: 255, b2: 25 }, // Yellow
        6: { r1: 255, g1: 255, b1: 255, r2: 255, g2: 255, b2: 255 }, // White
        7: { r1: 0, g1: 0, b1: 0, r2: 25, g2: 25, b2: 25 },        // Black (off)
    };

    for (let i = 0; i < 8; i++){
        rgbButtons[i].style.backgroundColor = `rgba( ${idsAndColors[i].r2}, ${idsAndColors[i].g2}, ${idsAndColors[i].b2})`;
    
        rgbButtons[i].addEventListener("click", function () {
            sendColor(idsAndColors[i].r1, idsAndColors[i].g1, idsAndColors[i].b1);
        });
    }
}

function checkboxSetup(rgbCheckboxes){

    console.log(rgbCheckboxes);


    rgbCheckboxes.forEach(rgbCheckbox => {
        console.log('Current checkbox: ');
        console.log(rgbCheckbox);
        rgbCheckbox.addEventListener("change", function()
        {
            changeCheckboxAtServer(rgbCheckbox);
        })
    });
}

function changeCheckboxAtServer(rgbCheckbox){
    //make a fetch that will send the new checkbox data to the server
    console.log(rgbCheckbox);

    fetch('/api/changeModuleState');
}