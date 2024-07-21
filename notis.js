const { DateTime } = luxon;

document.addEventListener('DOMContentLoaded', () => {
    checkEventsForToday();
    setTimeout(checkNotesForToday, 3000); // Mostrar notas después de 3 segundos para dar tiempo a mostrar recordatorios
});

async function checkEventsForToday() {
    const todayStart = DateTime.now().startOf('day').toISO(); // Comienzo del día de hoy
    const todayEnd = DateTime.now().endOf('day').toISO(); // Fin del día de hoy

    // Obtener todos los eventos para hoy
    const { data: events, error } = await _supabase
        .from('events')
        .select('*')
        .gte('date_time', todayStart)
        .lte('date_time', todayEnd);

    if (error) {
        console.error('Error al verificar eventos de hoy:', error);
        return;
    }

    // Contar eventos por autor
    const eventsCountByAuthor = events.reduce((acc, event) => {
        if (!acc[event.author]) {
            acc[event.author] = 0;
        }
        acc[event.author]++;
        return acc;
    }, {});

    // Intercambiar eventos si alguno tiene 5 o más
    const authors = Object.keys(eventsCountByAuthor);
    if (authors.length === 2) {
        const [author1, author2] = authors;
        if (eventsCountByAuthor[author1] >= 5) {
            eventsCountByAuthor[author2] += eventsCountByAuthor[author1];
            eventsCountByAuthor[author1] = 0;
        } else if (eventsCountByAuthor[author2] >= 5) {
            eventsCountByAuthor[author1] += eventsCountByAuthor[author2];
            eventsCountByAuthor[author2] = 0;
        }
    }

    // Crear el mensaje del toast
    let toastMessage = '📅 Recordatorios para hoy:';
    for (const [author, count] of Object.entries(eventsCountByAuthor)) {
        toastMessage += `<br>${author}: ${count} evento${count > 1 ? 's' : ''}`;
    }

    // Mostrar el toast
    Toastify({
        text: toastMessage,
        duration: 3000, // Duración del toast en milisegundos
        gravity: "top", // Posición vertical del toast
        position: 'center', // Posición horizontal del toast
        stopOnFocus: true, // Detener la desaparición si el usuario pasa el mouse sobre el toast
        className: "toast-custom", // Clase personalizada para el estilo
        escapeMarkup: false // Permitir HTML en el texto
    }).showToast();
}

async function checkNotesForToday() {
    const todayStart = DateTime.now().startOf('day').toISO(); // Comienzo del día de hoy
    const todayEnd = DateTime.now().endOf('day').toISO(); // Fin del día de hoy

    // Obtener todas las notas para hoy
    const { data: posts, error } = await _supabase
        .from('posts')
        .select('*')
        .gte('created_at', todayStart)
        .lte('created_at', todayEnd);

    if (error) {
        console.error('Error al verificar notas de hoy:', error);
        return;
    }

    // Contar notas por nombre (invertir si es Paolo)
    const postCountByName = posts.reduce((acc, post) => {
        const name = post.name === 'Paolo' ? 'Virginia' : 'Paolo';
        if (!acc[name]) {
            acc[name] = 0;
        }
        acc[name]++;
        return acc;
    }, {});

    // Crear el mensaje del toast
    let toastMessage = '📅 Notas para hoy:';
    for (const [name, count] of Object.entries(postCountByName)) {
        toastMessage += `</br>Para ${name} hay ${count} nota${count > 1 ? 's' : ''}<br>`;
    }

    // Mostrar el toast
    Toastify({
        text: toastMessage,
        duration: 3000, // Duración del toast en milisegundos
        gravity: "top", // Posición vertical del toast
        position: 'center', // Posición horizontal del toast
        stopOnFocus: true, // Detener la desaparición si el usuario pasa el mouse sobre el toast
        className: "toast-custom", // Clase personalizada para el estilo
        escapeMarkup: false // Permitir HTML en el texto
    }).showToast();
}
