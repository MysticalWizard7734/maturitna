//splitne URL-ku
// /room/1 => room + 1 
const roomId = window.location.pathname.split('/').pop();


fetch(`/api/room/${roomId}`)
    .then(response => {
        response.json();
        console.log(response)
    })

/*
.then(room => {
    document.getElementById('room-name').innerText = room.room_name
})
*/