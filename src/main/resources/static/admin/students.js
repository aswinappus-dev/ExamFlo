document.addEventListener('DOMContentLoaded', () => {
    // --- Authentication Check ---
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = '/admin-login.html';
        return;
    }

    // --- DOM Elements ---
    const studentTableBody = document.getElementById('student-table-body');
    const searchInput = document.getElementById('search-input');
    const addStudentButton = document.getElementById('add-student-button');
    const studentModal = document.getElementById('student-modal');
    const modalCloseButton = document.getElementById('modal-close-button');
    const modalTitle = document.getElementById('modal-title');
    const studentForm = document.getElementById('student-form');
    const classGroupSelect = document.getElementById('classGroupId');
    const studentIdInput = document.getElementById('student-id'); // Hidden input for editing
    const noResultsMessage = document.getElementById('no-results-message');
    const csvUploadInput = document.getElementById('csv-upload'); // CSV Input

    let allStudents = []; // Cache for all students to enable client-side search
    let classGroups = []; // Cache for class groups

    // --- Modal Handling ---
    const openModal = (student = null) => {
        studentForm.reset(); // Clear previous form data
        if (student) {
            // Editing existing student
            modalTitle.textContent = 'Edit Student';
            studentIdInput.value = student.id;
            document.getElementById('registerNumber').value = student.registerNumber;
            document.getElementById('name').value = student.name;
            classGroupSelect.value = student.classGroupId; // Make sure DTO includes classGroupId
        } else {
            // Adding new student
            modalTitle.textContent = 'Add New Student';
            studentIdInput.value = ''; // Clear ID
        }
        studentModal.classList.remove('hidden');
    };

    const closeModal = () => {
        studentModal.classList.add('hidden');
        studentForm.reset();
        studentIdInput.value = ''; // Ensure ID is cleared on close
    };

    addStudentButton.addEventListener('click', () => openModal());
    modalCloseButton.addEventListener('click', closeModal);
    // Optional: Close modal if clicking outside the form area
    studentModal.addEventListener('click', (event) => {
        if (event.target === studentModal) {
            closeModal();
        }
    });

    // --- Data Fetching ---
    async function fetchClassGroups() {
        try {
            const response = await fetch('/api/admin/class-groups', { /* Add headers if needed */ });
            if (!response.ok) throw new Error('Failed to fetch class groups');
            classGroups = await response.json();

            // Populate the dropdown in the modal
            classGroupSelect.innerHTML = '<option value="">-- Select Class Group --</option>'; // Placeholder
            classGroups.forEach(cg => {
                const option = document.createElement('option');
                option.value = cg.id;
                option.textContent = cg.name;
                classGroupSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching class groups:', error);
            classGroupSelect.innerHTML = '<option value="">Error loading</option>';
        }
    }

    async function fetchStudents() {
        try {
            studentTableBody.innerHTML = '<tr><td colspan="4" class="text-center py-10 text-gray-500">Loading students...</td></tr>';
            noResultsMessage.classList.add('hidden');

            const response = await fetch('/api/admin/students', { /* Add headers if needed */ });
            if (!response.ok) {
                 if (response.status === 401 || response.status === 403) {
                     window.location.href = '/admin-login.html'; // Redirect if unauthorized
                 }
                throw new Error('Failed to fetch students');
            }
            allStudents = await response.json();
            renderStudents(allStudents); // Initial render with all students
        } catch (error) {
            console.error('Error fetching students:', error);
            studentTableBody.innerHTML = '<tr><td colspan="4" class="text-center py-10 text-red-500">Error loading students.</td></tr>';
        }
    }

    // --- Rendering ---
    function renderStudents(studentsToRender) {
        if (studentsToRender.length === 0) {
            studentTableBody.innerHTML = ''; // Clear loading/error message
             noResultsMessage.classList.remove('hidden');
            return;
        }

        noResultsMessage.classList.add('hidden');
        studentTableBody.innerHTML = studentsToRender.map(student => `
            <tr key="${student.id}" class="hover:bg-gray-100 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">${student.registerNumber}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">${student.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">${student.classGroupName || 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                    <button data-student-id="${student.id}" class="edit-button text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-transform transform hover:scale-110">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button data-student-id="${student.id}" class="delete-button text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-transform transform hover:scale-110">
                         <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                </td>
            </tr>
        `).join('');

        // Add event listeners after rendering
        addTableActionListeners();
    }

    // --- Event Listeners ---
    function addTableActionListeners() {
        // Edit Buttons
        document.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const studentId = e.currentTarget.getAttribute('data-student-id');
                const student = allStudents.find(s => s.id == studentId); // Use == for type coercion if needed, or parse ID
                if (student) {
                    openModal(student);
                }
            });
        });

        // Delete Buttons
        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', async (e) => {
                const studentId = e.currentTarget.getAttribute('data-student-id');
                const student = allStudents.find(s => s.id == studentId);
                if (student && confirm(`Are you sure you want to delete ${student.name} (${student.registerNumber})?`)) {
                    await deleteStudent(studentId);
                }
            });
        });
    }

    // Search Functionality (Client-side filtering)
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (!query) {
            renderStudents(allStudents); // Show all if search is empty
            return;
        }
        const filteredStudents = allStudents.filter(student =>
            student.name.toLowerCase().includes(query) ||
            student.registerNumber.toLowerCase().includes(query)
        );
        renderStudents(filteredStudents);
    });

    // Form Submission (Add/Edit)
    studentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const studentId = studentIdInput.value;
        const isEditing = !!studentId;

        const studentData = {
            id: isEditing ? studentId : undefined, // Include ID only when editing
            registerNumber: document.getElementById('registerNumber').value,
            name: document.getElementById('name').value,
            classGroupId: document.getElementById('classGroupId').value
        };

        // Basic validation
        if (!studentData.registerNumber || !studentData.name || !studentData.classGroupId) {
            alert('Please fill in all fields.');
            return;
        }

        try {
            const url = isEditing ? `/api/admin/students/${studentId}` : '/api/admin/students';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    // Add Authorization header if needed
                },
                body: JSON.stringify(studentData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to ${isEditing ? 'update' : 'add'} student`);
            }

            closeModal();
            fetchStudents(); // Refresh the student list

        } catch (error) {
            console.error(`Error ${isEditing ? 'updating' : 'adding'} student:`, error);
            alert(`Error: ${error.message}`); // Show error to user
        }
    });

    // Delete Action
    async function deleteStudent(studentId) {
        try {
            const response = await fetch(`/api/admin/students/${studentId}`, {
                method: 'DELETE',
                headers: {
                    // Add Authorization header if needed
                }
            });

            if (!response.ok) {
                 const errorData = await response.json();
                 throw new Error(errorData.message || 'Failed to delete student');
            }
            fetchStudents(); // Refresh list after deleting

        } catch (error) {
            console.error('Error deleting student:', error);
            alert(`Error: ${error.message}`);
        }
    }

    // CSV Upload Listener (Basic - just logs file)
    csvUploadInput.addEventListener('change', (event) => {
        const file = event.target.files?.[0];
        if (file) {
            alert(`File "${file.name}" selected. Backend functionality for CSV upload needs to be implemented.`);
            // In a full implementation, you'd use FormData to send the file to a backend endpoint.
            // e.g., POST /api/admin/students/upload-csv
            csvUploadInput.value = ''; // Reset input
        }
    });

    // --- Initial Load ---
    fetchClassGroups(); // Load dropdown options first
    fetchStudents();    // Then load the student table
});