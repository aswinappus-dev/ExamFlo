document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('student-table-body'); // Add this ID to your <tbody>
    const addStudentModal = document.getElementById('add-student-modal'); // Add this ID to your Modal div
    const openModalButton = document.getElementById('open-modal-btn');
    const studentForm = document.getElementById('student-form');

    // 1. Fetch and render students (replaces useMemo/useEffect)
    async function fetchStudents() {
        const response = await fetch('/api/admin/students');
        const students = await response.json();
        
        // Replaces .map()
        tableBody.innerHTML = students.map(student => `
            <tr class="hover:bg-gray-100 dark:hover:bg-gray-700">
                <td class="px-6 py-4">${student.registerNumber}</td>
                <td class="px-6 py-4">${student.name}</td>
                <td class="px-6 py-4">${student.classGroup.name}</td>
                <td class="px-6 py-4 space-x-4">
                    <button class="text-indigo-600">...</button>
                    <button class="text-red-600">...</button>
                </td>
            </tr>
        `).join('');
    }

    // 2. Handle Modals (replaces useState)
    openModalButton.addEventListener('click', () => {
        addStudentModal.classList.remove('hidden');
    });
    // Add logic for close buttons to add 'hidden'

    // 3. Handle Form Submit (replaces handleSaveStudent)
    studentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(studentForm);
        const student = {
            registerNumber: formData.get('registerNumber'),
            name: formData.get('name'),
            departmentId: formData.get('departmentId')
        };

        await fetch('/api/admin/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(student)
        });
        
        addStudentModal.classList.add('hidden');
        fetchStudents(); // Refresh the table
    });

    fetchStudents(); // Initial load
});