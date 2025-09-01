let currentSort = { field: '', direction: '' };
let debounceTimer;

async function loadTasks() {
    document.getElementById('loading-spinner').style.display = 'block';
    let url = '/tasks?';
    const params = new URLSearchParams();

    // Add filters
    const entity = document.getElementById('filter-entity').value;
    if (entity) params.append('entity_name', entity);
    const type = document.getElementById('filter-type').value;
    if (type) params.append('task_type', type);
    const status = document.getElementById('filter-status').value;
    if (status) params.append('status', status);
    const date = document.getElementById('filter-date').value;
    if (date) params.append('date', date);
    const contact = document.getElementById('filter-contact').value;
    if (contact) params.append('contact_person', contact);

    // Add sort
    if (currentSort.field) {
        params.append('sort', `${currentSort.field}:${currentSort.direction}`);
    }

    url += params.toString();

    const response = await fetch(url);
    const tasks = await response.json();
    const tbody = document.getElementById('task-table-body');
    tbody.innerHTML = '';

    tasks.forEach(task => {
        const row = document.createElement('tr');
        row.classList.add('fade-in');
        row.innerHTML = `
            <td>${moment(task.creation_date).format('MMM DD, YYYY HH:mm')}</td>
            <td>${task.entity_name}</td>
            <td>${task.task_type}</td>
            <td>${moment(task.task_time).format('MMM DD, YYYY HH:mm')}</td>
            <td>${task.contact_person}</td>
            <td>${task.note || ''}</td>
            <td>
                <span class="badge ${task.status === 'open' ? 'bg-success' : 'bg-danger'}">
                    <i class="bi ${task.status === 'open' ? 'bi-check-circle' : 'bi-x-circle'} me-1"></i>${task.status}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-info edit-btn" data-id="${task.id}" data-bs-toggle="tooltip" title="Edit this task"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-sm btn-warning toggle-status" data-id="${task.id}" data-bs-toggle="tooltip" title="Toggle status">
                    <i class="bi ${task.status === 'open' ? 'bi-toggle-off' : 'bi-toggle-on'}"></i> ${task.status === 'open' ? 'Close' : 'Open'}
                </button>
                <button class="btn btn-sm btn-danger delete-btn" data-id="${task.id}" data-bs-toggle="tooltip" title="Delete this task"><i class="bi bi-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Re-attach event listeners and init tooltips
    document.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', openEditModal));
    document.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', deleteTask));
    document.querySelectorAll('.toggle-status').forEach(btn => btn.addEventListener('click', toggleStatus));
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    document.getElementById('loading-spinner').style.display = 'none';
}

function openCreateModal() {
    document.getElementById('modalTitle').innerHTML = '<i class="bi bi-plus-square me-2"></i>Create Task';
    document.getElementById('taskForm').reset();
    document.getElementById('taskId').value = '';
    clearValidation();
}

async function openEditModal(e) {
    const id = e.target.dataset.id;
    const response = await fetch(`/tasks?id=${id}`);
    const [task] = await response.json();
    document.getElementById('modalTitle').innerHTML = '<i class="bi bi-pencil-square me-2"></i>Edit Task';
    document.getElementById('taskId').value = task.id;
    document.getElementById('entity_name').value = task.entity_name;
    document.getElementById('task_type').value = task.task_type;
    document.getElementById('task_time').value = moment(task.task_time).format('YYYY-MM-DDTHH:mm');
    document.getElementById('contact_person').value = task.contact_person;
    document.getElementById('note').value = task.note || '';
    new bootstrap.Modal(document.getElementById('taskModal')).show();
    clearValidation();
}

function validateForm() {
    const form = document.getElementById('taskForm');
    form.classList.add('was-validated');
    return form.checkValidity();
}

function clearValidation() {
    const form = document.getElementById('taskForm');
    form.classList.remove('was-validated');
}

async function saveTask() {
    if (!validateForm()) return;
    const id = document.getElementById('taskId').value;
    const data = {
        entity_name: document.getElementById('entity_name').value,
        task_type: document.getElementById('task_type').value,
        task_time: document.getElementById('task_time').value,
        contact_person: document.getElementById('contact_person').value,
        note: document.getElementById('note').value
    };

    let url = '/tasks';
    let method = 'POST';
    if (id) {
        url += `/${id}`;
        method = 'PUT';
    }

    const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        bootstrap.Modal.getInstance(document.getElementById('taskModal')).hide();
        loadTasks();
    } else {
        alert('Error saving task');
    }
}

async function deleteTask(e) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    const id = e.target.dataset.id;
    const response = await fetch(`/tasks/${id}`, { method: 'DELETE' });
    if (response.ok) loadTasks();
}

async function toggleStatus(e) {
    const id = e.target.dataset.id;
    const response = await fetch(`/tasks/${id}/status`, { method: 'PATCH' });
    if (response.ok) loadTasks();
}

function handleSort(e) {
    const th = e.target.closest('th');
    if (!th) return;
    const field = th.dataset.sort;
    if (!field) return;

    if (currentSort.field === field) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        currentSort.field = field;
        currentSort.direction = 'asc';
    }

    document.querySelectorAll('th').forEach(el => el.classList.remove('sort-asc', 'sort-desc'));
    th.classList.add(`sort-${currentSort.direction}`);

    loadTasks();
}

function debounceLoad() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(loadTasks, 300);
}

function clearFilters() {
    document.getElementById('filter-entity').value = '';
    document.getElementById('filter-type').value = '';
    document.getElementById('filter-status').value = '';
    document.getElementById('filter-date').value = '';
    document.getElementById('filter-contact').value = '';
    loadTasks();
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    document.getElementById('create-task-btn').addEventListener('click', openCreateModal);
    document.getElementById('saveTask').addEventListener('click', saveTask);
    document.getElementById('apply-filters').addEventListener('click', loadTasks);
    document.getElementById('clear-filters').addEventListener('click', clearFilters);
    document.querySelector('thead').addEventListener('click', handleSort);

    // Live filtering
    const filterInputs = ['filter-entity', 'filter-type', 'filter-contact'];
    filterInputs.forEach(id => document.getElementById(id).addEventListener('input', debounceLoad));
    document.getElementById('filter-status').addEventListener('change', loadTasks);
    document.getElementById('filter-date').addEventListener('change', loadTasks);

    // Init tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
});