//splitne URL-ku
// /room/1 => room + 1 
const roomId = window.location.pathname.split('/').pop();


fetch(`/api/room/${roomId}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        generateContent(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });

function generateContent(data) {
    roomObject = data.room;
    modulesArray = data.modules;
    console.log('Izba:');
    console.log(roomObject);
    console.log('Moduly:');
    console.log(modulesArray);

    const title = document.getElementById('room-name');
    title.innerHTML = roomObject.room_name;

    const hasRgb = modulesArray.some(module => module.module_type_ID === 0);
    const rgbModules = modulesArray.filter(module => module.module_type_ID === 0);

    const hasRel = modulesArray.some(module => module.module_type_ID === 1);
    const relModules = modulesArray.filter(module => module.module_type_ID === 1);

    const controlsDiv = document.getElementById('controls');

    if (hasRgb) {
        //generate controls for RGB
        const rgbDiv = document.createElement('div');
        rgbDiv.classList.add('rgb-div');
        generateRGBDiv(rgbDiv, rgbModules, roomObject);
        controlsDiv.appendChild(rgbDiv);
    }
    if (hasRel) {
        //generate controls for REL
        const relDiv = document.createElement('div');
        relDiv.classList.add('rel-div');

        controlsDiv.appendChild(relDiv);
    }
}

function generateRGBDiv(div, rgbModules, roomObject) {
    //checkboxes//
    const upperDiv = document.createElement('div');
    upperDiv.classList.add('upper-div');

    var rgbCheckboxes = [];
    rgbModules.forEach(rgbModules => {
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('checkbox');

        if (rgbModules.isActive === 1) checkbox.checked = true;

        console.log(rgbModules.esp_id);
        //here put other checkbox parameters
        checkbox.id = rgbModules.esp_id;

        var label = document.createElement('label');
        label.htmlFor = checkbox.id; // Set the 'for' attribute to the checkbox's ID
        label.textContent = rgbModules.esp_name; // Set the label text

        upperDiv.appendChild(label)
        upperDiv.appendChild(checkbox)
        rgbCheckboxes.push(checkbox);
    });
    div.appendChild(upperDiv);
    checkboxSetup(rgbCheckboxes);

    const middleDiv = document.createElement('div');
    middleDiv.classList.add('middle-div');

    var inputField = document.createElement('input');
    inputField.value = roomObject.LED_delay;
    inputFieldEventListener(inputField);

    console.log(roomObject.LED_method);

    var methodButtons = [];
    for(let i = 0; i < 6; i++){
        methodButtons[i] = document.createElement('button');
        methodButtons[i].classList.add('method-button');
        methodButtons[i].id = 'method-button-' + i
    }

    methodButtons[0].innerHTML = ' - ';
    methodButtons[1].innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
    methodButtons[2].innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
    methodButtons[3].innerHTML = '<i class="fa-solid fa-arrow-left"><i class="fa-solid fa-arrow-right"></i>';
    methodButtons[4].innerHTML = '<i class="fa-solid fa-arrow-right"><i class="fa-solid fa-arrow-left"></i>';
    methodButtons[5].innerHTML = `
    <svg width="1435" height="788" viewBox="0 0 1435 788" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="646.161" width="142.678" height="357.349" rx="50" fill="black"/>
        <rect x="1188.71" y="147.184" width="142.678" height="357.349" rx="50" transform="rotate(45 1188.71 147.184)" fill="black"/>
        <rect x="147.444" y="246.184" width="142.678" height="357.349" rx="50" transform="rotate(-45 147.444 246.184)" fill="black"/>
        <rect x="0.838867" y="788" width="142.678" height="286.664" rx="50" transform="rotate(-90 0.838867 788)" fill="black"/>
        <rect x="1147.5" y="788" width="142.678" height="286.664" rx="50" transform="rotate(-90 1147.5 788)" fill="black"/>
        <rect x="431.49" y="788" width="142.678" height="573.329" rx="50" transform="rotate(-90 431.49 788)" fill="black"/>
    </svg>`;

    buttonMethodEvnetListener(methodButtons);

    middleDiv.appendChild(inputField);
    methodButtons.forEach(button => {
        middleDiv.appendChild(button);
    });
    div.appendChild(middleDiv);

    //buttons//
    const lowerDiv = document.createElement('div');
    lowerDiv.classList.add('lower-div');

    var rgbButtons = [];
    for (let i = 0; i < 8; i++) {
        rgbButtons[i] = document.createElement('button')
        rgbButtons[i].classList.add('rgb-button');
        rgbButtons[i].id = 'rgb-button-' + i;
    }
    rgbButtons.forEach(button => {
        lowerDiv.appendChild(button);
    });
    div.appendChild(lowerDiv);

    ledButtonsSetup(rgbButtons, roomObject);

}

function generateRELDiv() {

}

function sendColor(r, g, b){
    //todo 
    //Here is a function that will send data to broker, should also include room number
}
