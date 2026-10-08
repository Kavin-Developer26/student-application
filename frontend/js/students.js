const API_BASE_URL = 'http://localhost:8080/api/students';

const tableBody = document.getElementById('studentsTableBody');
const searchInput = document.getElementById('searchInput');
const recordCount = document.getElementById('recordCount');
const refreshBtn = document.getElementById('refreshBtn');

let allStudents = [];

async function loadStudents() {
    tableBody.innerHTML = `
        <tr>
            <td colspan="7" class="empty-state">
                <span class="spinner"></span> Loading students from database...
            </td>
        </tr>
    `;

    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        allStudents = await response.json();
        renderTable(allStudents);
    } catch (error) {
        console.error('Fetch error:', error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state" style="color: var(--error);">
                    Failed to connect to backend server. Make sure Spring Boot is running on port 8080.
                </td>
            </tr>
        `;
    }
}

function renderTable(list) {
    if (!list || list.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    No students found in the database. <a href="register.html" style="color: var(--accent-primary);">Register a new student</a>
                </td>
            </tr>
        `;
        if (recordCount) recordCount.textContent = '0 records';
        return;
    }

    if (recordCount) recordCount.textContent = `${list.length} record${list.length > 1 ? 's' : ''}`;

    tableBody.innerHTML = list.map(student => `
        <tr>
            <td style="font-family: 'JetBrains Mono', monospace; color: var(--accent-secondary); font-weight: 600;">
                #${student.id}
            </td>
            <td style="font-weight: 600;">${escapeHtml(student.name)}</td>
            <td>${escapeHtml(student.email)}</td>
            <td style="font-family: 'JetBrains Mono', monospace;">${student.phone}</td>
            <td>${student.dob}</td>
            <td>${student.age}</td>
            <td>
                <button onclick="deleteStudent(${student.id})" 
                        style="background: transparent; border: 1px solid rgba(244, 63, 94, 0.4); color: var(--error); padding: 0.35rem 0.75rem; border-radius: var(--radius-sm); cursor: pointer; font-size: 0.8rem; transition: var(--transition);">
                    Delete
                </button>
            </td>
        </tr>
    `).join('');
}

async function deleteStudent(id) {
    if (!confirm(`Are you sure you want to delete student #${id}?`)) return;

    try {
        const res = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });
        if (res.ok) {
            allStudents = allStudents.filter(s => s.id !== id);
            filterStudents();
        } else {
            alert('Could not delete student from database.');
        }
    } catch (err) {
        console.error('Delete error', err);
        alert('Error connecting to backend server.');
    }
}

function filterStudents() {
    const term = (searchInput ? searchInput.value : '').toLowerCase().trim();
    if (!term) {
        renderTable(allStudents);
        return;
    }
    const filtered = allStudents.filter(s => 
        (s.name && s.name.toLowerCase().includes(term)) ||
        (s.email && s.email.toLowerCase().includes(term)) ||
        (s.phone && s.phone.toString().includes(term))
    );
    renderTable(filtered);
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

if (searchInput) searchInput.addEventListener('input', filterStudents);
if (refreshBtn) refreshBtn.addEventListener('click', loadStudents);

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadStudents);
