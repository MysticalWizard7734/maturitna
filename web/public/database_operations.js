async function delete_row(table_name, id) {
    try {
        const response = await fetch(`/delete/${table_name}/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Server response:', data);
    } catch (error) {
        console.error('There was a problem with the delete request:', error);
        generateTable();
    }
}

// Function to handle cell update
async function edit_row(row) {
    const columns = row.querySelectorAll('td');  // select all td elements in the row

    // Iterate over the columns and extract their values
    let columnValues = [];
    columns.forEach((column) => {
        columnValues.push(column.textContent.trim());
    });

    console.log(columnValues);  // Debugging the extracted values

    // Here you need to send the updated value to the server
    // This example assumes you have an endpoint `/update` to handle updates
    try {
        const response = await fetch('/updateEspRow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',  // Ensuring correct content type
            },
            body: JSON.stringify({   // Ensure you properly stringify the body
                esp_id: columnValues[0],
                esp_name: columnValues[1],
                number_of_LEDs: columnValues[2],
                module_type_ID: columnValues[3],
                room_id: columnValues[4]
            }),
        });

        const errorResponse = await response.json();

        if (!response.ok) {
            console.log('Response was not ok, status: ' + response.status);
            if (response.status === 400) {
                alert(`Bad request: ${errorResponse.message}`);
            } else if (response.status === 404) {
                alert('Row not found');
            } else {
                alert('Failed to update cell. Server error occurred.');
            }

            throw new Error('Failed to update cell');
        } else {
            console.log('Update successful');
        }
    } catch (error) {
        console.error('Error updating cell:', error);
        generateTable();
    }
}