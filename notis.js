const { DateTime } = luxon;

document.addEventListener('DOMContentLoaded', () => {
    checkEventsForCurrentMonth ();
    checkEventsForToday();
    setTimeout(checkNotesForToday, 3000);
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


async function checkEventsForCurrentMonth() {
    const now = DateTime.now().setZone('America/El_Salvador'); // Ajusta la zona horaria si es necesario
    const startOfMonth = now.startOf('month').toISO();
    const endOfMonth = now.endOf('month').toISO();
    const startOfNextMonth = now.plus({ months: 1 }).startOf('month').toISO();
    const endOfNextMonth = now.plus({ months: 1 }).endOf('month').toISO();
    const startOfWeek = now.startOf('week').toISO();
    const endOfWeek = now.endOf('week').toISO();
    const startOfDay = now.startOf('day').toISO();
    const endOfDay = now.endOf('day').toISO();

    // Obtener eventos del mes actual y del próximo mes
    const { data: events, error } = await _supabase
        .from('events')
        .select('*')
        .or(`date_time.gte.${startOfMonth},date_time.lte.${endOfNextMonth}`);

    if (error) {
        console.error('Error al obtener eventos:', error);
        return;
    }

    // Filtrar eventos según proximidad
    const eventsToNotify = events.filter(event => {
        const eventDate = DateTime.fromISO(event.date_time);
        const isToday = eventDate >= now.startOf('day') && eventDate <= now.endOf('day');
        const isThisWeek = eventDate >= now.startOf('week') && eventDate <= now.endOf('week');
        const isThisMonth = eventDate >= now.startOf('month') && eventDate <= now.endOf('month');
        const isNextMonth = eventDate >= now.plus({ months: 1 }).startOf('month') && eventDate <= now.plus({ months: 1 }).endOf('month');
    
        if (event.email_sent === 0) {
            if (isToday) return true;
            if (isThisWeek) return true;
            if (isThisMonth) return true;
            if (isNextMonth) return true;
        } else if (event.email_sent === 1 && isNextMonth) {
            return true;
        } else if (event.email_sent === 2 && isThisMonth) {
            return true;
        } else if (event.email_sent === 3 && isThisWeek) {
            return true;
        } else if (event.email_sent === 4 && isToday) {
            return true;
        } else if (event.email_sent === 5 && isToday) {
            return true;
        }
    
        return false;
    });
    console.log('Events to notify:', eventsToNotify);

    // Enviar notificaciones y actualizar la columna email_sent
    for (const event of eventsToNotify) {
        const proximity = getProximity(event.date_time);
        // Enviar correos a ambos destinatarios
        await sendEmailReminders(event, proximity);

        // Actualizar el estado del correo enviado
        const { error: updateError } = await _supabase
            .from('events')
            .update({ email_sent: proximity })
            .match({ id: event.id });

        if (updateError) {
            console.error('Error al actualizar el estado del evento:', updateError);
        }
    }
}

function getProximity(eventDate) {
    const now = DateTime.now();
    const event = DateTime.fromISO(eventDate);

    if (event.hasSame(now, 'day')) return 5;
    if (event.hasSame(now, 'week')) return 4;
    if (event.hasSame(now, 'month')) return 3;
    if (event.hasSame(now.plus({ months: 1 }).startOf('month'), 'month')) return 2;
    if (event.hasSame(now.plus({ months: 1 }).startOf('month'), 'month')) return 1;

    return 0;
}

async function sendEmailReminders(event, proximity) {
    const recipients = [
        { name: 'Paolo', email: 'piopiopaolo12@gmail.com' },
        { name: 'Virginia', email: 'moralesirma036@gmail.com@gmail.com' }
    ];

    for (const recipient of recipients) {
        const templateParams = {
            event_title: event.title,
            event_date: DateTime.fromISO(event.date_time).toLocaleString(DateTime.DATETIME_MED),
            to_name: recipient.name,
            to_email: recipient.email,
            proximity: proximity
        };

        await emailjs.send('service_c2dcsop', 'template_o789stq', templateParams)
            .then((response) => {
                console.log(`Correo enviado exitosamente para evento ${event.title} a ${recipient.name}`, response.status, response.text);
            }, (error) => {
                console.error('Error al enviar el correo:', error);
            });
    }
}