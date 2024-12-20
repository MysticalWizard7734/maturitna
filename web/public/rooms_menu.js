//fetch for rooms and their numbers, than generate 
fetch('/room-data')
    .then(response => response.json())
    .then(data => {
        generateButtons(data);
    })
    .catch(error => {
        console.error('Error: ', error);
    });

function generateButtons(data) {
    console.log(data);

    const buttonDiv = document.getElementById('rooms_buttons');

    data.forEach(roomObject => {
        var button = document.createElement('button');

        button.innerHTML = roomObject.room_name;

        var link = document.createElement('a');
        link.href = `/room/${roomObject.room_id}`;  // Set the link destination

        link.appendChild(button);
        buttonDiv.appendChild(link);
    });
}