function ledButtonsSetup(rgbButtons, roomObject) {
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

    for (let i = 0; i < 8; i++) {
        rgbButtons[i].style.backgroundColor = `rgba( ${idsAndColors[i].r2}, ${idsAndColors[i].g2}, ${idsAndColors[i].b2})`;

        rgbButtons[i].addEventListener("click", function () {
            sendColor(idsAndColors[i].r1, idsAndColors[i].g1, idsAndColors[i].b1, roomObject);
        });
    }
}

function sendColor(r, g, b, roomObject) {
    console.log('Colours: ');
    console.log(r);
    console.log(g);
    console.log(b);
    console.log('Room: ');
    console.log(roomObject.room_id);
    //fetch to backend
    fetch('/api/RGBbroker', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            room_id: roomObject.room_id,
            r: r,
            g: g,
            b: b
        })
    });
}

function checkboxSetup(rgbCheckboxes) {

    console.log(rgbCheckboxes);


    rgbCheckboxes.forEach(rgbCheckbox => {
        console.log('Current checkbox: ');
        console.log(rgbCheckbox);
        rgbCheckbox.addEventListener("change", function () {
            changeCheckboxAtServer(rgbCheckbox);
        })
    });
}

function changeCheckboxAtServer(rgbCheckbox) {
    //make a fetch that will send the new checkbox data to the server
    console.log(rgbCheckbox.id);

    fetch('/api/changeModuleState', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            changeActiveStateOf: rgbCheckbox.id
        })
    });
}

function inputFieldEventListener(inputField) {
    inputField.addEventListener('blur', function () {
        console.log("Publishing on blur:", inputField.value);
        if (!isNaN(parseInt(inputField.value, 10))) {
            changeDelayAtServer(inputField.value);
        }
    });

}

function changeDelayAtServer(value) {
    //fetch the new delay to server
}

function buttonMethodEvnetListener(methodButtons) {
    methodButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove 'selected' class from all buttons
            methodButtons.forEach(btn => btn.classList.remove('selected'));

            // Add 'selected' class to the clicked button
            button.classList.add('selected');
        });
    });
}