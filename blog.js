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
    const { data, error } = await _supabase
        .from('posts')
        .delete()
        .eq('id', postId);

    if (error) {
        console.error('Error al eliminar la entrada:', error);
    } else {
        loadPosts(currentPage);
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
        <h3>${post.content}</h3>
        <p>Escrito por: ${post.name}</p>
        <p>Fecha: ${createdAt}</p>
        <button class="btn delete-btn" onclick="deletePost(${post.id})">
            <i class="bi bi-backspace-fill"></i>
        </button>
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