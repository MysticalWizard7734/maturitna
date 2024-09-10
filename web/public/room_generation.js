const addButton = document.getElementById('generateRoomButton');
addButton.addEventListener('click', () => {

});

async function generateRoom() {
    const response = await fetch('/generate-table', {
        method: 'POST'
    });
}