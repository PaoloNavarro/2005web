const blogInput = document.getElementById('blogInput');
const postsContainer = document.getElementById('postsContainer');
const selectName = document.getElementById('selectName');
const paginationControls = document.getElementById('paginationControls');
const postsPerPage = 5;
let currentPage = 1;
const { DateTime } = luxon;

document.addEventListener('DOMContentLoaded', () => {
    loadPosts(currentPage);
    checkNotificationSupport();
});

function checkNotificationSupport() {
    if (!("Notification" in window)) {
        console.warn("Este navegador no soporta notificaciones de escritorio.");
        return;
    }

    if (Notification.permission !== 'denied' || Notification.permission === "default") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                console.log("Permiso concedido para enviar notificaciones.");
            }
        });
    }
}

async function addPost() {
    const postContent = blogInput.value;
    const authorName = selectName.value;


    // Determinar el correo y nombre del destinatario según el autor
    let recipientEmail;
    let recipientName;
    if (authorName === 'Paolo') {
        recipientEmail = 'moralesirma036@gmail.com';
        recipientName = 'Virginia';
    } else if (authorName === 'Virginia') {
        recipientEmail = 'navarropaolo2020@gmail.com';
        recipientName = 'Paolo';
    } else {
        // Manejar otros casos si es necesario
        recipientEmail = 'default@example.com';
        recipientName = 'Default';
    }


    if (postContent.trim() === '' || authorName === '') return;

    const now = DateTime.now().setZone('America/El_Salvador').toISO();

    const { data, error } = await _supabase
        .from('posts')
        .insert([{ content: postContent, name: authorName, created_at: now }]);

    if (error) {
        console.error('Error al agregar la entrada:', error);
    } else {
        blogInput.value = '';
        selectName.value = '';
        loadPosts(currentPage);
        showNotification('Nueva Nota Agregada', `Título: ${postContent}`);
        sendEmailNotification(postContent, authorName, recipientName, recipientEmail);

    }
}

function showNotification(title, body) {
    if (Notification.permission === "granted") {
        new Notification(title, {
            body: body,
            icon: 'iconweb.ico' // Opcional: agrega un ícono para la notificación
        });
    }
}

function sendEmailNotification(content, fromName, toName, toEmail) {
    const templateParams = {
        content: content,
        from_name: fromName,
        to_name: toName,
        to_email: toEmail // Agrega el destinatario aquí
    };

    emailjs.send('service_c2dcsop', 'template_49q8zd1', templateParams)
        .then((response) => {
            console.log('Correo enviado exitosamente!', response.status, response.text);
        }, (error) => {
            console.error('Error al enviar el correo:', error);
        });
}

async function loadPosts(page = 1) {
    const { data: totalPosts, error: totalError } = await _supabase
        .from('posts')
        .select('id', { count: 'exact' });

    if (totalError) {
        console.error('Error al contar las entradas:', totalError);
        return;
    }

    const total = totalPosts.length;
    const totalPages = Math.ceil(total / postsPerPage);
    const startRange = (page - 1) * postsPerPage;
    const endRange = startRange + postsPerPage - 1;

    const { data: posts, error } = await _supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .range(startRange, endRange);

    if (error) {
        console.error('Error al cargar las entradas:', error);
    } else {
        postsContainer.innerHTML = '';
        posts.forEach((post) => {
            createPostCard(post);
        });
        updatePaginationControls(totalPages, page);
    }
}

async function deletePost(postId) {
    // Muestra un mensaje de confirmación antes de eliminar la entrada
    const result = await Swal.fire({
        title: '¿VAMOS A BORRAR🤔?',
        text: "¡Esta acción no se puede deshacer!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, borremos esto',
        cancelButtonText: 'No, mejor que quede la nota'
    });

    if (result.isConfirmed) {
        // Si el usuario confirma, procede a eliminar la entrada
        const { data, error } = await _supabase
            .from('posts')
            .delete()
            .eq('id', postId);

        if (error) {
            console.error('Error al eliminar la entrada:', error);
            Swal.fire('Error', 'No se pudo eliminar la nota', 'error');
        } else {
            loadPosts(currentPage);
            Swal.fire('Eliminado', 'La nota ha sido eliminada.', 'success');
        }
    }
}

 
function getRandomColorFromList() {
    const colors = ['#a5d8ea', '#DBEDCC', '#efbfd2', '#a1beff'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

function createPostCard(post) {
    const card = document.createElement('div');
    card.className = 'post-card';
    const createdAt = DateTime.fromISO(post.created_at).setZone('America/El_Salvador').toLocaleString(DateTime.DATETIME_MED);
    const backgroundColor = getRandomColorFromList();
    card.style.backgroundColor = backgroundColor;
    card.innerHTML = `
        <div class="row text-center">
            <h3>${post.content}</h3>
            <p>Escrito por: ${post.name}</p>
            <p>Fecha: ${createdAt}</p>
            <div class="text-center d-flex justify-content-center alings-item-center">
             <button class="btn delete-btn " onclick="deletePost(${post.id})">
                <i class="bi bi-backspace-fill"></i>
            </button>
            </div>
           
        <div>
       
    `;
    postsContainer.appendChild(card);
}

function updatePaginationControls(totalPages, currentPage) {
    paginationControls.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = `btn ${i === currentPage ? 'btn-primary ms-2 pt-2' : 'btn-secondary ms-2 p-2'}`;
        pageButton.onclick = () => loadPosts(i);
        paginationControls.appendChild(pageButton);
    }
}