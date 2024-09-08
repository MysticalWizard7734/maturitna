document.addEventListener("DOMContentLoaded", function () {
    generateRoomTable();
});

async function generateRoomTable(){
    const response = await fetch('/room-data')
}