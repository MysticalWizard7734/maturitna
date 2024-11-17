//splitne URL-ku
// /room/1 => room + 1 
const roomId = window.location.pathname.split('/').pop();


fetch(`/api/room/${roomId}`)
    .then(response => response.json())
    .then(data => {
        generateContent(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });

function generateContent(data) {
    roomObject = data.room;
    modulesArray = data.modules;
    console.log(roomObject);
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
        generateRELDiv(relDiv, relModules, roomObject);
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
    inputField.classList.add('input-field');
    inputField.value = roomObject.LED_delay;
    inputFieldEventListener(inputField, roomObject);

    var methodButtons = [];
    for (let i = 0; i < 6; i++) {
        methodButtons[i] = document.createElement('button');
        methodButtons[i].classList.add('method-button');
        methodButtons[i].id = i + 1;
        if (roomObject.LED_method === i + 1) {
            methodButtons[i].classList.add('selected');
        }
    }

    methodButtons[0].innerHTML = ' - ';
    methodButtons[1].innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
    methodButtons[2].innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
    methodButtons[3].innerHTML = '<i class="fa-solid fa-arrow-left"><i class="fa-solid fa-arrow-right"></i>';
    methodButtons[4].innerHTML = '<i class="fa-solid fa-arrow-right"><i class="fa-solid fa-arrow-left"></i>';
    methodButtons[5].innerHTML = `<svg width="1435" height="788" viewBox="0 0 1435 788" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_41_2)"><path d="M738.839 0H696.161C668.547 0 646.161 22.3858 646.161 50V307.349C646.161 334.963 668.547 357.349 696.161 357.349H738.839C766.453 357.349 788.839 334.963 788.839 307.349V50C788.839 22.3858 766.453 0 738.839 0Z" fill="#FAEBD7"/><path d="M1254.24 212.717L1224.07 182.539C1204.54 163.013 1172.88 163.013 1153.35 182.539L971.381 364.513C951.855 384.039 951.855 415.697 971.381 435.223L1001.56 465.401C1021.09 484.927 1052.74 484.927 1072.27 465.401L1254.24 283.428C1273.77 263.902 1273.77 232.243 1254.24 212.717Z" fill="#FAEBD7"/><path d="M212.977 180.651L182.799 210.829C163.273 230.355 163.273 262.013 182.799 281.539L364.773 463.513C384.299 483.039 415.957 483.039 435.483 463.513L465.661 433.335C485.187 413.808 485.187 382.15 465.661 362.624L283.688 180.651C264.162 161.125 232.503 161.125 212.977 180.651Z" fill="#FAEBD7"/><path d="M0.838867 695.322L0.838867 738C0.838867 765.614 23.2246 788 50.8389 788H237.503C265.117 788 287.503 765.614 287.503 738V695.322C287.503 667.708 265.117 645.322 237.503 645.322H50.8389C23.2246 645.322 0.838867 667.708 0.838867 695.322Z" fill="#FAEBD7"/><path d="M1147.5 695.322V738C1147.5 765.614 1169.89 788 1197.5 788H1384.16C1411.78 788 1434.16 765.614 1434.16 738V695.322C1434.16 667.708 1411.78 645.322 1384.16 645.322H1197.5C1169.89 645.322 1147.5 667.708 1147.5 695.322Z" fill="#FAEBD7"/><path d="M431.49 695.322V738C431.49 765.614 453.876 788 481.49 788H954.819C982.433 788 1004.82 765.614 1004.82 738V695.322C1004.82 667.708 982.433 645.322 954.819 645.322H481.49C453.876 645.322 431.49 667.708 431.49 695.322Z" fill="#FAEBD7"/></g><defs><clipPath id="clip0_41_2"><rect width="1435" height="788" fill="white"/></clipPath></defs></svg>`;

    buttonMethodEvnetListener(methodButtons, roomObject);

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

function generateRELDiv(relDiv, relModules, roomObject) {
    console.log(relDiv);
    console.log(relModules);
    console.log(roomObject);


    relModules.forEach((relModule, index) => {
        let button = document.createElement('button');
        button.id = relModule.esp_id;
        button.classList.add('toggle-button');

        releEventListeners(button);

        let label = document.createElement('label');
        label.classList.add('toggle-button-label');
        label.textContent = relModule.esp_name;
        label.htmlFor = button.id; 

        let edit_state = false;
        button.addEventListener('click', (event) => {
            const row = event.target.closest('tr');
            button.classList.toggle('active', !edit_state); // Toggle class based on edit_state
            edit_state = !edit_state;
        });



        relDiv.appendChild(button);
        relDiv.appendChild(label);
    });

}