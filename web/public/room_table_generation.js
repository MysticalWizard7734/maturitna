document.addEventListener("DOMContentLoaded", function () {
    generateTable();
});

async function generateTable() {
    const response = await fetch('/room-data')
    const data = await response.json();         //data sa parsne do premennej data
    const dataDiv = document.getElementById('rooms_data');    // Get the HTML element with the ID 'data' to insert the fetched table data into it
    dataDiv.innerHTML = ''; //wipe it

    console.log(data);

    if (data.length > 0) {
        const table = document.createElement('table');  // creatne elementy table, thead, tbody aby sa do nich mohli vkladat data
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        const headerRow = document.createElement('tr'); // tr = table row = hlavicka tabulky
        Object.keys(data[0]).forEach(column => {
            const th = document.createElement('th');
            th.textContent = column;
            headerRow.appendChild(th);
        });
        const th = document.createElement('th');
        th.textContent = 'Actions';
        headerRow.appendChild(th);
        thead.appendChild(headerRow);

        data.forEach(row => {
            const tr = document.createElement('tr');
            Object.entries(row).forEach(([key, value]) => {

                const td = document.createElement('td');

                td.textContent = value;


                td.dataset.key = key;  // Set the data-key attribute
                tr.appendChild(td);
            });

            const actionsCell = document.createElement('td');
            actionsCell.classList.add('actions-Cell');
            actionsCell.dataset.key = 'Actions';

            const edit_button = document.createElement('button');    //edit button
            edit_button.type = 'button';
            edit_button.classList.add('edit-button');
            const editIcon = document.createElement('i');   // Create an icon element for Font Awesome
            editIcon.classList.add('fas', 'fa-edit');
            editIcon.style.fontSize = 'inherit';
            edit_button.appendChild(editIcon);

            const delete_button = document.createElement('button'); //delete button
            delete_button.type = 'button';
            delete_button.classList.add('delete-button'); // Add a class for styling
            const trashIcon = document.createElement('i');   // Create an icon element for Font Awesome
            trashIcon.classList.add('fas', 'fa-trash');
            trashIcon.style.fontSize = 'inherit';
            delete_button.appendChild(trashIcon);

            delete_button.dataset.table = 'rooms';
            delete_button.dataset.room_id = row.room_id;

            // Add event listener to call delete_row function
            delete_button.addEventListener('click', async (event) => {
                const tableName = event.target.closest('button').dataset.table;
                const id = event.target.closest('button').dataset.room_id;

                const confirmed = window.confirm("Skibidi \nAre you sure you want to delete this room? \nThis action can not be reverted.");
    
                if (confirmed) {
                    // If the user clicks "OK", proceed with deletion
                    if(await delete_row(tableName, id)){
                    event.target.closest('tr').remove();    // Remove the table row after deletion
                    }
                    else{
                        generateTable();
                    }
                } else {
                    // If the user clicks "Cancel", do nothing
                    console.log("Deletion cancelled by user.");
                }
            });

            let edit_state = false;
            edit_button.addEventListener('click', (event) => {
                const row = event.target.closest('tr');

                edit_button.classList.toggle('active', !edit_state); // Toggle class based on edit_state
                if (edit_state) edit_rooms_row(row);

                row.querySelectorAll('td').forEach(td => {
                    if (td.dataset.key !== 'room_id' && td.dataset.key !== 'Actions') { // Make all cells editable except for IDs
                        td.contentEditable = (td.contentEditable === "true") ? "false" : "true";
                    }
                });
                edit_state = !edit_state;
            });

            tr.appendChild(actionsCell);
            actionsCell.appendChild(edit_button);
            actionsCell.appendChild(delete_button);

            tbody.appendChild(tr);
        });



        table.appendChild(thead);
        table.appendChild(tbody);
        dataDiv.appendChild(table);
    }
    else {
        dataDiv.textContent = 'No data found';
    }
}