// blog.js

const blogInput = document.getElementById('blogInput');
const postsContainer = document.getElementById('postsContainer');

// Agregar una nueva entrada
async function addPost() {
    const postContent = blogInput.value;
    if (postContent.trim() === '') return;

    const { data, error } = await _supabase
        .from('posts')
        .insert([{ content: postContent }]);

    if (error) {
        console.error('Error al agregar la entrada:', error);
    } else {
        blogInput.value = '';
        loadPosts();
    }
}

// Cargar las entradas del blog
async function loadPosts() {
    const { data: posts, error } = await _supabase
        .from('posts')
        .select('*');

    if (error) {
        console.error('Error al cargar las entradas:', error);
    } else {
        postsContainer.innerHTML = '';
        posts.forEach((post) => {
            createPostCard(post);
        });
    }
}

// Eliminar una entrada
async function deletePost(postId) {
    const { data, error } = await _supabase
        .from('posts')
        .delete()
        .eq('id', postId);

    if (error) {
        console.error('Error al eliminar la entrada:', error);
    } else {
        loadPosts();
    }
}

// Crear una tarjeta de publicación
function createPostCard(post) {
    const card = document.createElement('div');
    card.className = 'post-card';
    card.innerHTML = `
        <h3>${post.content}</h3>
        <button class="delete-btn" onclick="deletePost(${post.id})">Eliminar</button>
    `;
    postsContainer.appendChild(card);
}

// Inicialmente, cargamos las entradas del blog
document.addEventListener('DOMContentLoaded', loadPosts);
