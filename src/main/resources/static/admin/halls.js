document.addEventListener('DOMContentLoaded', () => {
    // --- Authentication Check ---
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = '/admin-login.html';
        return;
    }
    const authHeaders = {
        'Authorization': `Bearer ${token}`
        // Add other headers like CSRF if needed
    };

    // --- DOM Elements ---
    const hallTableBody = document.getElementById('hall-table-body');
    const addHallButton = document.getElementById('add-hall-button');
    const hallModal = document.getElementById('hall-modal');
    const modalCloseButton = document.getElementById('modal-close-button');
    const modalTitle = document.getElementById('modal-title');
    const hallForm = document.getElementById('hall-form');
    const hallIdInput = document.getElementById('hall-id'); // Hidden input for editing ID
    const blockInput = document.getElementById('block');
    const hallNameInput = document.getElementById('hallName');
    const capacityInput = document.getElementById('capacity');
    const columnsInput = document.getElementById('columns'); // Hidden input for columns value
    const columnButtons = document.querySelectorAll('.column-button');
    const noHallsMessage = document.getElementById('no-halls-message');
    const benchTooltip = document.getElementById('bench-tooltip');

    let allHalls = []; // Cache for hall data to support tooltip

    // --- Modal Handling ---
    const openModal = (hall = null) => {
        hallForm.reset(); // Clear previous form data
        columnsInput.value = '4'; // Reset columns hidden input to default
        updateColumnButtonsUI(4); // Reset column button visuals to default

        if (hall) {
            // Editing existing hall
            modalTitle.textContent = 'Edit Hall';
            hallIdInput.value = hall.id; // Set hidden ID
            blockInput.value = hall.block;
            hallNameInput.value = hall.name;
            capacityInput.value = hall.capacity;
            columnsInput.value = hall.columns; // Set hidden input value
            updateColumnButtonsUI(hall.columns); // Update button visuals
        } else {
            // Adding new hall
            modalTitle.textContent = 'Add New Hall';
            hallIdInput.value = ''; // Ensure ID is empty
        }
        hallModal.classList.remove('hidden'); // Show the modal
    };

    const closeModal = () => {
        hallModal.classList.add('hidden'); // Hide the modal
        hallForm.reset(); // Clear form fields
        hallIdInput.value = ''; // Ensure ID is cleared
        columnsInput.value = '4'; // Reset hidden columns input
        updateColumnButtonsUI(4); // Reset button visuals
    };

    addHallButton.addEventListener('click', () => openModal()); // Open modal for adding
    modalCloseButton.addEventListener('click', closeModal); // Close modal using X button
    hallModal.addEventListener('click', (event) => { // Close modal by clicking backdrop
        if (event.target === hallModal) {
            closeModal();
        }
    });

    // --- Column Selector Logic ---
    function updateColumnButtonsUI(selectedColumns) {
        columnButtons.forEach(button => {
            const buttonCols = parseInt(button.getAttribute('data-columns'), 10);
            const isActive = (buttonCols === selectedColumns);
            // Apply active styles
            button.classList.toggle('bg-white', isActive);
            button.classList.toggle('dark:bg-gray-700', isActive);
            button.classList.toggle('text-indigo-600', isActive);
            button.classList.toggle('dark:text-indigo-300', isActive);
            button.classList.toggle('shadow-sm', isActive);
            // Apply inactive styles
            button.classList.toggle('text-gray-600', !isActive);
            button.classList.toggle('dark:text-gray-400', !isActive);
            button.classList.toggle('hover:bg-gray-300', !isActive);
            button.classList.toggle('dark:hover:bg-gray-800', !isActive);
        });
    }

    columnButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedCols = parseInt(button.getAttribute('data-columns'), 10);
            columnsInput.value = selectedCols; // Update the hidden input's value
            updateColumnButtonsUI(selectedCols); // Update the visual appearance of buttons
        });
    });

    // --- Data Fetching & Rendering ---
    async function fetchHalls() {
        try {
            hallTableBody.innerHTML = '<tr><td colspan="5" class="text-center py-10 text-gray-500 dark:text-gray-400">Loading halls...</td></tr>';
            noHallsMessage.classList.add('hidden');

            const response = await fetch('/api/admin/halls', { headers: authHeaders });
             if (!response.ok) {
                 if (response.status === 401 || response.status === 403) { // Unauthorized or Forbidden
                     window.location.href = '/admin-login.html'; return; // Redirect
                 }
                throw new Error(`HTTP error ${response.status}`); // Throw error for other issues
            }
            allHalls = await response.json();
             // Sort halls by block name, then by hall name (numerically if possible)
            allHalls.sort((a, b) => {
                const blockCompare = a.block.localeCompare(b.block);
                if (blockCompare !== 0) return blockCompare;
                // Attempt numeric sort for hall names like '101', '102', '201'
                return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
            });
            renderHalls(allHalls); // Render the fetched and sorted halls
        } catch (error) {
            console.error('Error fetching halls:', error);
            hallTableBody.innerHTML = `<tr><td colspan="5" class="text-center py-10 text-red-500 dark:text-red-400">Error loading halls: ${error.message}</td></tr>`;
        }
    }

    function renderHalls(hallsToRender) {
        if (!hallsToRender || hallsToRender.length === 0) {
            hallTableBody.innerHTML = ''; // Clear loading message
             noHallsMessage.classList.remove('hidden'); // Show "No halls" message
            return;
        }

        noHallsMessage.classList.add('hidden'); // Hide "No halls" message
        // Generate table rows from hall data
        hallTableBody.innerHTML = hallsToRender.map(hall => `
            <tr class="hover:bg-gray-100 dark:hover:bg-gray-700/50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">${hall.block}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">${hall.name}</td>
                <td class="capacity-cell px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 cursor-pointer"
                    data-hall-id="${hall.id}" title="Hover to see layout"> ${hall.capacity}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">${hall.columns} Columns</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                    <button data-hall-id="${hall.id}" class="edit-button text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-transform transform hover:scale-110" title="Edit Hall">
                         <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button data-hall-id="${hall.id}" class="delete-button text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-transform transform hover:scale-110" title="Delete Hall">
                         <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                </td>
            </tr>
        `).join('');

        // Re-attach event listeners for edit/delete/tooltip after rendering new rows
        attachTableActionListeners();
    }

    // --- Tooltip Logic ---
    function showTooltip(event, hall) {
        const capacity = hall.capacity;
        const columns = hall.columns;
        if (!capacity || !columns) return; // Exit if data is invalid

        const rows = Math.ceil(capacity / columns);
        // Create an array representing the grid, true for bench, false for empty slot
        const grid = Array.from({ length: rows * columns }, (_, i) => i < capacity);

        // Determine Tailwind class for grid columns
        let gridColsClass = '';
        switch (columns) {
            case 2: gridColsClass = 'grid-cols-2'; break;
            case 3: gridColsClass = 'grid-cols-3'; break;
            case 4: gridColsClass = 'grid-cols-4'; break;
            default: gridColsClass = 'grid-cols-4'; // Default to 4
        }

        // Generate HTML for the grid cells
        const gridHTML = grid.map(isBench => `
            <div class="w-3 h-3 rounded-sm ${isBench ? 'bg-indigo-400 dark:bg-indigo-500' : 'bg-gray-400 dark:bg-gray-700'}"></div>
        `).join('');

        // Set the tooltip content
        benchTooltip.innerHTML = `<div class="grid ${gridColsClass} gap-1">${gridHTML}</div>`; // Removed extra padding from inner div

        // Position the tooltip dynamically above the triggering cell
        const rect = event.currentTarget.getBoundingClientRect();
        // Calculate position - center horizontally above the cell
        const leftPos = rect.left + window.scrollX + rect.width / 2;
        const topPos = rect.top + window.scrollY - 10; // 10px gap above
        
        benchTooltip.style.left = `${leftPos}px`;
        benchTooltip.style.top = `${topPos}px`;
        // Use transform to center it properly after setting left/top
        benchTooltip.style.transform = 'translate(-50%, -100%)'; 

        benchTooltip.classList.remove('hidden'); // Make tooltip visible
    }

    function hideTooltip() {
        benchTooltip.classList.add('hidden'); // Hide tooltip
        // Reset transform to avoid interfering with next positioning calculation
        benchTooltip.style.transform = ''; 
    }

    // --- Event Listener Attachment ---
    function attachTableActionListeners() {
        // Edit Buttons
        document.querySelectorAll('.edit-button').forEach(button => {
             // Remove old listener to prevent duplicates if re-rendering
             button.replaceWith(button.cloneNode(true)); 
             const newButton = hallTableBody.querySelector(`button.edit-button[data-hall-id="${button.getAttribute('data-hall-id')}"]`);
             newButton.addEventListener('click', (e) => {
                const hallId = e.currentTarget.getAttribute('data-hall-id');
                const hall = allHalls.find(h => String(h.id) === hallId);
                if (hall) {
                    openModal(hall); // Open modal pre-filled with this hall's data
                } else {
                     console.error("Could not find hall data for ID:", hallId);
                     alert("Error: Could not find hall data to edit.");
                 }
            });
        });

        // Delete Buttons
        document.querySelectorAll('.delete-button').forEach(button => {
            button.replaceWith(button.cloneNode(true));
            const newButton = hallTableBody.querySelector(`button.delete-button[data-hall-id="${button.getAttribute('data-hall-id')}"]`);
            newButton.addEventListener('click', async (e) => {
                 const hallId = e.currentTarget.getAttribute('data-hall-id');
                 const hall = allHalls.find(h => String(h.id) === hallId);
                 if (hall && confirm(`Are you sure you want to delete hall ${hall.name} in ${hall.block}? This cannot be undone.`)) {
                     await deleteHall(hallId);
                 }
            });
        });

        // Tooltip listeners on capacity cells
        document.querySelectorAll('.capacity-cell').forEach(cell => {
             cell.replaceWith(cell.cloneNode(true)); // Replace to remove old listeners
             const newCell = hallTableBody.querySelector(`td.capacity-cell[data-hall-id="${cell.getAttribute('data-hall-id')}"]`);
             newCell.addEventListener('mouseenter', (e) => {
                 const hallId = e.currentTarget.getAttribute('data-hall-id');
                 const hall = allHalls.find(h => String(h.id) === hallId);
                 if (hall) {
                     showTooltip(e, hall);
                 }
             });
             newCell.addEventListener('mouseleave', hideTooltip);
        });
    }

    // --- Form Submission (Add/Edit Hall) ---
    hallForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const hallId = hallIdInput.value;
        const isEditing = !!hallId;

        const hallData = {
            // Include ID only when editing, otherwise backend generates it
            id: isEditing ? parseInt(hallId, 10) : undefined,
            block: blockInput.value.trim(),
            name: hallNameInput.value.trim(),
            capacity: parseInt(capacityInput.value, 10),
            columns: parseInt(columnsInput.value, 10)
        };

        // Basic frontend validation
        if (!hallData.block || !hallData.name || isNaN(hallData.capacity) || hallData.capacity <= 0 || isNaN(hallData.columns) || ![2, 3, 4].includes(hallData.columns)) {
            alert('Please provide a valid Block Name, Hall Name, a positive number for Benches, and select 2, 3, or 4 Columns.');
            return;
        }

        try {
            // Backend endpoint POST /api/admin/halls handles both create and update based on ID presence
            const url = '/api/admin/halls';
            const method = 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeaders // Include authentication token
                },
                body: JSON.stringify(hallData),
            });

            if (!response.ok) {
                // Handle errors from the backend
                let errorMsg = `Failed to ${isEditing ? 'update' : 'add'} hall. Status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.message || errorData.error || errorMsg;
                } catch (jsonError) { /* Ignore if body isn't JSON */ }
                throw new Error(errorMsg);
            }

            closeModal(); // Close modal on success
            await fetchHalls(); // Refresh the list of halls from backend

        } catch (error) {
            console.error(`Error ${isEditing ? 'updating' : 'adding'} hall:`, error);
            alert(`Error: ${error.message}`); // Display error to the user
        }
    });

    // --- Delete Hall Action ---
    async function deleteHall(hallId) {
        try {
            const response = await fetch(`/api/admin/halls/${hallId}`, {
                method: 'DELETE',
                headers: authHeaders // Include authentication token
            });

            if (!response.ok) {
                 let errorMsg = `Failed to delete hall. Status: ${response.status}`;
                 try {
                     const errorData = await response.json();
                     errorMsg = errorData.message || errorData.error || errorMsg;
                 } catch (jsonError) { /* Ignore */ }
                 throw new Error(errorMsg);
            }

            // Refresh list from backend after successful deletion
            await fetchHalls();

        } catch (error) {
            console.error('Error deleting hall:', error);
            alert(`Error deleting hall: ${error.message}`);
        }
    }

    // --- Initial Load ---
    fetchHalls(); // Fetch and render halls when the page loads
});