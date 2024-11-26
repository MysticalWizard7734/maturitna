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
    console.log('Colours: ' + r + ' ' + g + ' ' + b);
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

function inputFieldEventListener(inputField, roomObject) {
    inputField.addEventListener('blur', function () {
        if (!isNaN(parseInt(inputField.value, 10))) {
            changeDelayAtServer(inputField.value, roomObject);
        }
    });

}

function changeDelayAtServer(value, roomObject) {
    fetch('/api/changeDelayMethod', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            room_id: roomObject.room_id,
            room_name: roomObject.room_name,
            LED_delay: value,
            LED_method: roomObject.LED_method
        })
    });
}

function buttonMethodEvnetListener(methodButtons, roomObject) {
    methodButtons.forEach(button => {
        button.addEventListener('click', () => {
            methodButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            changeLedMethodAtServer(button.id, roomObject)
        });
    });
}

function changeLedMethodAtServer(button_id, roomObject){
    fetch('/api/changeDelayMethod', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            room_id: roomObject.room_id,
            room_name: roomObject.room_name,
            LED_delay: roomObject.LED_delay,
            LED_method: button_id
        })
    });
}

function releEventListeners(toggleButton){
    toggleButton.addEventListener('click', function () {
        RelChangeToBroker(toggleButton.id);
    });
}

function RelChangeToBroker(esp_id){
    console.log('Sending change state to: ' + esp_id);
    fetch('/api/relChangeState', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            esp_id: esp_id
        })
    });
}