const addButton = document.getElementById('generateRoomButton');
const roomModal = document.getElementById('roomModal');
const closeModal = document.getElementById('closeModal');
const roomForm = document.getElementById('roomForm');

// Show the modal when the button is clicked
addButton.addEventListener('click', () => {
    roomModal.style.display = 'block';
});

// Close the modal when the close (×) button is clicked
closeModal.addEventListener('click', () => {
    roomModal.style.display = 'none';
});

// Close the modal when clicking outside of it
window.addEventListener('click', (event) => {
    if (event.target === roomModal) {
        roomModal.style.display = 'none';
    }
});

// Handle the form submission
roomForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the form from submitting normally

    const roomNumber = document.getElementById('roomNumber').value;
    const roomName = document.getElementById('roomName').value;

    await generateRoom(roomNumber, roomName);

    roomModal.style.display = 'none'; // Close the modal after submission
});

async function generateRoom(roomNumber, roomName) {
    const response = await fetch('/generate-table', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            roomNumber: roomNumber,
            roomName: roomName
        })
    });

    if (response.ok) {
        generateTable(); // Call your function to generate the table after success
    } else {
        console.error('Error generating room');
    }
}