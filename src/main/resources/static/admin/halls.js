document.addEventListener('DOMContentLoaded', () => {
    // --- Authentication Check ---
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = '/admin-login.html';
        return;
    }
    const authHeaders = { /* Add Authorization header if needed */ };

    // --- DOM Elements ---
    const hallTableBody = document.getElementById('hall-table-body');
    const addHallButton = document.getElementById('add-hall-button');
    const hallModal = document.getElementById('hall-modal');
    const modalCloseButton = document.getElementById('modal-close-button');
    const modalTitle = document.getElementById('modal-title');
    const hallForm = document.getElementById('hall-form');
    const hallIdInput = document.getElementById('hall-id'); // Hidden input for editing
    const blockInput = document.getElementById('block');
    const hallNameInput = document.getElementById('hallName');
    const capacityInput = document.getElementById('capacity');
    const columnsInput = document.getElementById('columns'); // Hidden input for columns
    const columnButtons = document.querySelectorAll('.column-button');
    const noHallsMessage = document.getElementById('no-halls-message');
    const benchTooltip = document.getElementById('bench-tooltip');

    let allHalls = []; // Cache for hall data

    // --- Modal Handling ---
    const openModal = (hall = null) => {
        hallForm.reset(); // Clear form
        columnsInput.value = '4'; // Reset columns hidden input to default
        updateColumnButtons(4); // Reset column button visuals to default

        if (hall) {
            // Editing existing hall
            modalTitle.textContent = 'Edit Hall';
            hallIdInput.value = hall.id;
            blockInput.value = hall.block;
            hallNameInput.value = hall.name;
            capacityInput.value = hall.capacity;
            columnsInput.value = hall.columns; // Set hidden input
            updateColumnButtons(hall.columns); // Update button visuals
        } else {
            // Adding new hall
            modalTitle.textContent = 'Add New Hall';
            hallIdInput.value = ''; // Clear ID
        }
        hallModal.classList.remove('hidden');
    };

    const closeModal = () => {
        hallModal.classList.add('hidden');
        hallForm.reset();
        hallIdInput.value = '';
        columnsInput.value = '4'; // Reset columns hidden input
        updateColumnButtons(4); // Reset button visuals
    };

    addHallButton.addEventListener('click', () => openModal());
    modalCloseButton.addEventListener('click', closeModal);
    hallModal.addEventListener('click', (event) => {
        if (event.target === hallModal) {
            closeModal();
        }
    });

    // --- Column Selector Logic ---
    function updateColumnButtons(selectedColumns) {
        columnButtons.forEach(button => {
            const buttonCols = parseInt(button.getAttribute('data-columns'), 10);
            if (buttonCols === selectedColumns) {
                button.classList.add('bg-white', 'dark:bg-gray-700', 'text-indigo-600', 'dark:text-indigo-300', 'shadow-sm');
                button.classList.remove('text-gray-600', 'dark:text-gray-400', 'hover:bg-gray-300', 'dark:hover:bg-gray-800');
            } else {
                button.classList.remove('bg-white', 'dark:bg-gray-700', 'text-indigo-600', 'dark:text-indigo-300', 'shadow-sm');
                button.classList.add('text-gray-600', 'dark:text-gray-400', 'hover:bg-gray-300', 'dark:hover:bg-gray-800');
            }
        });
    }

    columnButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedCols = parseInt(button.getAttribute('data-columns'), 10);
            columnsInput.value = selectedCols; // Update hidden input
            updateColumnButtons(selectedCols); // Update visuals
        });
    });

    // --- Data Fetching & Rendering ---
    async function fetchHalls() {
        try {
            hallTableBody.innerHTML = '<tr><td colspan="5" class="text-center py-10 text-gray-500 dark:text-gray-400">Loading halls...</td></tr>';
            noHallsMessage.classList.add('hidden');

            const response = await fetch('/api/admin/halls', { headers: authHeaders });
             if (!response.ok) {
                 if (response.status === 401 || response.status === 403) {
                     window.location.href = '/admin-login.html'; return;
                 }
                throw new Error(`HTTP error ${response.status}`);
            }
            allHalls = await response.json();
             // Sort by block then name
            allHalls.sort((a, b) => {
                const blockCompare = a.block.localeCompare(b.block);
                if (blockCompare !== 0) return blockCompare;
                return a.name.localeCompare(b.name, undefined, { numeric: true });
            });
            renderHalls(allHalls);
        } catch (error) {
            console.error('Error fetching halls:', error);
            hallTableBody.innerHTML = `<tr><td colspan="5" class="text-center py-10 text-red-500 dark:text-red-400">Error loading halls: ${error.message}</td></tr>`;
        }
    }

    function renderHalls(hallsToRender) {
        if (!hallsToRender || hallsToRender.length === 0) {
            hallTableBody.innerHTML = '';
             noHallsMessage.classList.remove('hidden');
            return;
        }

        noHallsMessage.classList.add('hidden');
        hallTableBody.innerHTML = hallsToRender.map(hall => `
            <tr class="hover:bg-gray-100 dark:hover:bg-gray-700/50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">${hall.block}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">${hall.name}</td>
                <td class="capacity-cell px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 cursor-pointer"
                    data-hall-id="${hall.id}">
                    ${hall.capacity}
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

        // Re-attach event listeners
        attachTableActionListeners();
    }

    // --- Tooltip Logic ---
    function showTooltip(event, hall) {
        const capacity = hall.capacity;
        const columns = hall.columns;
        const rows = Math.ceil(capacity / columns);
        const grid = Array.from({ length: rows * columns }, (_, i) => i < capacity);

        let gridColsClass = '';
        switch (columns) {
            case 2: gridColsClass = 'grid-cols-2'; break;
            case 3: gridColsClass = 'grid-cols-3'; break;
            case 4: gridColsClass = 'grid-cols-4'; break;
            default: gridColsClass = 'grid-cols-4';
        }

        const gridHTML = grid.map(isBench => `
            <div class="w-3 h-3 rounded-sm ${isBench ? 'bg-indigo-400 dark:bg-indigo-500' : 'bg-gray-400 dark:bg-gray-700'}"></div>
        `).join('');

        benchTooltip.innerHTML = `<div class="grid ${gridColsClass} gap-1 p-2">${gridHTML}</div>`;

        // Position the tooltip above the cell
        const rect = event.currentTarget.getBoundingClientRect();
        const tooltipHeight = benchTooltip.offsetHeight;
        benchTooltip.style.left = `${rect.left + window.scrollX + rect.width / 2}px`;
        benchTooltip.style.top = `${rect.top + window.scrollY - tooltipHeight - 10}px`; // Position above, with 10px gap

        benchTooltip.classList.remove('hidden');
    }

    function hideTooltip() {
        benchTooltip.classList.add('hidden');
    }

    // --- Event Listener Attachment ---
    function attachTableActionListeners() {
        // Edit Buttons
        document.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const hallId = e.currentTarget.getAttribute('data-hall-id');
                const hall = allHalls.find(h => String(h.id) === hallId);
                if (hall) {
                    openModal(hall);
                }
            });
        });

        // Delete Buttons
        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', async (e) => {
                 const hallId = e.currentTarget.getAttribute('data-hall-id');
                 const hall = allHalls.find(h => String(h.id) === hallId);
                 if (hall && confirm(`Are you sure you want to delete hall ${hall.name} in ${hall.block}?`)) {
                     await deleteHall(hallId);
                 }
            });
        });
        
        // Tooltip listeners on capacity cells
        document.querySelectorAll('.capacity-cell').forEach(cell => {
             cell.addEventListener('mouseenter', (e) => {
                 const hallId = e.currentTarget.getAttribute('data-hall-id');
                 const hall = allHalls.find(h => String(h.id) === hallId);
                 if (hall) {
                     showTooltip(e, hall);
                 }
             });
             cell.addEventListener('mouseleave', hideTooltip);
        });
    }

    // --- Form Submission (Add/Edit Hall) ---
    hallForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const hallId = hallIdInput.value;
        const isEditing = !!hallId;

        const hallData = {
            id: isEditing ? parseInt(hallId, 10) : undefined,
            block: blockInput.value.trim(),
            name: hallNameInput.value.trim(),
            capacity: parseInt(capacityInput.value, 10),
            columns: parseInt(columnsInput.value, 10)
        };

        // Basic frontend validation
        if (!hallData.block || !hallData.name || isNaN(hallData.capacity) || hallData.capacity <= 0 || isNaN(hallData.columns)) {
            alert('Please provide valid Block, Name, positive Capacity, and select Columns.');
            return;
        }

        try {
            // Note: Backend uses POST for both create and update for simplicity here
            const url = '/api/admin/halls'; 
            const method = 'POST'; // Backend AdminService.saveHall handles both

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(hallData),
            });

            if (!response.ok) {
                let errorMsg = `Failed to ${isEditing ? 'update' : 'add'} hall. Status: ${response.status}`;
                try { const errorData = await response.json(); errorMsg = errorData.message || errorMsg; } catch (e) {}
                throw new Error(errorMsg);
            }

            closeModal();
            await fetchHalls(); // Refresh list

        } catch (error) {
            console.error(`Error ${isEditing ? 'updating' : 'adding'} hall:`, error);
            alert(`Error: ${error.message}`);
        }
    });

    // --- Delete Hall Action ---
    async function deleteHall(hallId) {
        try {
            const response = await fetch(`/api/admin/halls/${hallId}`, {
                method: 'DELETE',
                headers: authHeaders
            });

            if (!response.ok) {
                 let errorMsg = `Failed to delete hall. Status: ${response.status}`;
                 try { const errorData = await response.json(); errorMsg = errorData.message || errorMsg; } catch (e) {}
                 throw new Error(errorMsg);
            }
            
            await fetchHalls(); // Refresh list

        } catch (error) {
            console.error('Error deleting hall:', error);
            alert(`Error deleting hall: ${error.message}`);
        }
    }

    // --- Initial Load ---
    fetchHalls();
});