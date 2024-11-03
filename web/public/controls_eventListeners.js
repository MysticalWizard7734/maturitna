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
    console.log('Colours: ' + r + g + b);
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
    rgbCheckboxes.forEach(rgbCheckbox => {
        rgbCheckbox.addEventListener("change", function () {
            changeCheckboxAtServer(rgbCheckbox);
        })
    });
}

function changeCheckboxAtServer(rgbCheckbox) {
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

function inputFieldEventListener(inputField, room_id) {
    inputField.addEventListener('blur', function () {
        if (!isNaN(parseInt(inputField.value, 10))) {
            changeDelayAtServer(inputField.value, room_id);
        }
    });

}

function changeDelayAtServer(value, room_id) {

    fetch('/api/changeDelay', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            room_id: room_id,
            LED_delay: value
        })
    });
}

function buttonMethodEvnetListener(methodButtons, room_id) {
    methodButtons.forEach(button => {
        button.addEventListener('click', () => {
            methodButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            changeLedMethodAtServer(button.id, room_id)
        });
    });
}

function changeLedMethodAtServer(LED_method, room_id){

    fetch('/api/changeMethod', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            room_id: room_id,
            LED_method: LED_method
        })
    });
}