const addButton = document.getElementById('generateRoomButton');
addButton.addEventListener('click', () => {
    generateRoom();
});

async function generateRoom() {
    const response = await fetch('/generate-table', {
        method: 'POST'
    });
    generateTable();
}