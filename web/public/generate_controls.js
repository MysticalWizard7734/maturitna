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
        generateRGBDiv(rgbDiv, rgbModules);
        controlsDiv.appendChild(rgbDiv);
    }
    if (hasRel) {
        //generate controls for REL
        const relDiv = document.createElement('div');
        relDiv.classList.add('rel-div');

        controlsDiv.appendChild(relDiv);
    }
}

function generateRGBDiv(div, rgbModules) {
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

    //buttons//
    const lowerDiv = document.createElement('div');
    lowerDiv.classList.add('lower-div');

    var rgbButtons = [];
    for (let i = 0; i < 8; i++) {
        rgbButtons[i] = document.createElement('button')
        rgbButtons[i].classList.add('rgb-button');
        rgbButtons[i].id = 'rgb-button-' + i
    }
    rgbButtons.forEach(button => {
        lowerDiv.appendChild(button);
    });
    div.appendChild(lowerDiv);

    ledButtonsSetup(rgbButtons);

}

function generateRELDiv() {

}

function sendColor(r, g, b){
    //todo 
    //Here is a function that will send data to broker, should also include room number
}
