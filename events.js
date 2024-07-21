const eventTitle = document.getElementById('eventTitle');
const eventDateTime = document.getElementById('eventDateTime');
const eventNote = document.getElementById('eventNote');
const selectAuthor = document.getElementById('selectAuthor');
const eventsContainer = document.getElementById('eventsContainer');
const paginationControls = document.getElementById('paginationControls');
const postsPerPage = 5;
let currentPage = 1;
let currentEventId = null;
const { DateTime } = luxon;

document.addEventListener('DOMContentLoaded', () => {
    loadEvents(currentPage);
});

async function addEvent() {
    const title = eventTitle.value;
    const dateTime = eventDateTime.value;
    const author = selectAuthor.value;
    const note = null;  // Si no hay nota, se establece como una cadena vacía.

    if (title.trim() === '' || dateTime === '' || author === '') return;

    const now = DateTime.now().setZone('America/El_Salvador').toISO();

    const { data, error } = await _supabase
        .from('events')
        .insert([{ title: title, date_time: dateTime, note: note, author: author, created_at: now }]);

    if (error) {
        console.error('Error al agregar el evento:', error);
    } else {
        eventTitle.value = '';
        eventDateTime.value = '';
        selectAuthor.value = '';
        loadEvents(currentPage);
    }
}

async function loadEvents(page = 1, authorFilter = '', monthFilter = '') {
    const postsPerPage = 5;
    const startRange = (page - 1) * postsPerPage;
    const endRange = startRange + postsPerPage - 1;

    // Construir filtros de fecha
    let dateFilterStart = '';
    let dateFilterEnd = '';

    if (monthFilter) {
        const startDate = DateTime.fromFormat(monthFilter, 'MM').startOf('month').toISO(); // Ajustar formato según sea necesario
        const endDate = DateTime.fromFormat(monthFilter, 'MM').endOf('month').toISO();
        dateFilterStart = startDate;
        dateFilterEnd = endDate;
    }

    const { data: totalEvents, error: totalError } = await _supabase
        .from('events')
        .select('id', { count: 'exact' })
        .ilike('author', `%${authorFilter}%`)
        .gte('date_time', dateFilterStart || '1970-01-01T00:00:00Z') // Usa una fecha mínima predeterminada si no se especifica
        .lte('date_time', dateFilterEnd || '9999-12-31T23:59:59Z'); // Usa una fecha máxima predeterminada si no se especifica

    if (totalError) {
        console.error('Error al contar los eventos:', totalError);
        return;
    }

    const total = totalEvents.length;
    const totalPages = Math.ceil(total / postsPerPage);

    const { data: events, error } = await _supabase
        .from('events')
        .select('*')
        .ilike('author', `%${authorFilter}%`)
        .gte('date_time', dateFilterStart || '1970-01-01T00:00:00Z') // Usa una fecha mínima predeterminada si no se especifica
        .lte('date_time', dateFilterEnd || '9999-12-31T23:59:59Z') // Usa una fecha máxima predeterminada si no se especifica
        .order('date_time', { ascending: false })
        .range(startRange, endRange);

    if (error) {
        console.error('Error al cargar los eventos:', error);
    } else {
        eventsContainer.innerHTML = '';
        events.forEach((event) => {
            createEventCard(event);
        });
        updatePaginationControls(totalPages, page);
    }
}



async function deleteEvent(eventId) {
    const result = await Swal.fire({
        title: '¿Lo borramos👀?',
        text: "¡Esta acción no se puede deshacer!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, que se quede'
    });

    if (result.isConfirmed) {
        const { data, error } = await _supabase
            .from('events')
            .delete()
            .eq('id', eventId);

        if (error) {
            console.error('Error al eliminar el evento:', error);
            Swal.fire('Error', 'No se pudo eliminar el evento', 'error');
        } else {
            loadEvents(currentPage);
            Swal.fire('Eliminado', 'El evento ha sido eliminado.', 'success');
        }
    }
}
function getRandomColorFromList() {
    const colors = ['#a5d8ea', '#DBEDCC', '#efbfd2', '#a1beff'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}
function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'post-card';
    const backgroundColor = getRandomColorFromList();

    card.style.backgroundColor = backgroundColor;

    const eventDate = DateTime.fromISO(event.date_time).setZone('America/El_Salvador').toLocaleString(DateTime.DATETIME_MED);
    card.innerHTML = `
        <div class="row text-center">
            <h3>${event.title}</h3>
            <p>Fecha y Hora: ${eventDate}</p>
            <p>Nota de Apoyo: ${event.note || 'No hay nota de apoyo'}</p>
            <p>Autor: ${event.author}</p>
            <div class="text-center d-flex justify-content-center align-items-center">
                <button class="btn btn-warning" onclick="openEditModal(${event.id}, '${event.note || ''}')">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-danger ms-2" onclick="deleteEvent(${event.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>
    `;
    eventsContainer.appendChild(card);
}

function updatePaginationControls(totalPages, currentPage) {
    paginationControls.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.className = 'btn btn-primary mx-1';
        button.textContent = i;
        button.onclick = () => {
            currentPage = i;
            loadEvents(currentPage);
        };
        if (i === currentPage) {
            button.classList.add('active');
        }
        paginationControls.appendChild(button);
    }
}

function openEditModal(eventId, note) {
    currentEventId = eventId;
    const modalNoteText = document.getElementById('modalNoteText');
    modalNoteText.value = note || '';  // Si no hay nota, se establece como una cadena vacía.
    const noteModal = new bootstrap.Modal(document.getElementById('noteModal'));
    noteModal.show();
}

async function saveNote() {
    const modalNoteText = document.getElementById('modalNoteText').value;

    if (currentEventId && modalNoteText.trim() !== '') {
        const { data, error } = await _supabase
            .from('events')
            .update({ note: modalNoteText })
            .eq('id', currentEventId);

        if (error) {
            console.error('Error al actualizar la nota:', error);
        } else {
            loadEvents(currentPage);
            const noteModal = bootstrap.Modal.getInstance(document.getElementById('noteModal'));
            noteModal.hide();
        }
    }
}
function filterEvents() {
    const authorFilter = document.getElementById('filterAuthor').value;
    const monthFilter = document.getElementById('filterMonth').value;

    // Llama a loadEvents con los filtros seleccionados
    loadEvents(1, authorFilter, monthFilter);
} 