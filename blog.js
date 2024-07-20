// script.js
const blogInput = document.getElementById('blogInput');
const postsContainer = document.getElementById('postsContainer');

let posts = JSON.parse(localStorage.getItem('posts')) || [];

// Cargar las entradas del blog desde localStorage
document.addEventListener('DOMContentLoaded', () => {
    posts.forEach((post, index) => createPostCard(post, index));
});

function addPost() {
    const postContent = blogInput.value;
    if (postContent.trim() === '') return;

    const post = { content: postContent };
    posts.push(post);
    localStorage.setItem('posts', JSON.stringify(posts));
    
    createPostCard(post, posts.length - 1);
    blogInput.value = '';
}

function createPostCard(post, index) {
    const card = document.createElement('div');
    card.className = 'post-card';
    card.innerHTML = `
        <h3>${post.content}</h3>
        <button class="delete-btn" onclick="deletePost(${index})">Eliminar</button>
    `;
    postsContainer.appendChild(card);
}

function deletePost(index) {
    posts.splice(index, 1);
    localStorage.setItem('posts', JSON.stringify(posts));
    postsContainer.innerHTML = '';
    posts.forEach((post, index) => createPostCard(post, index));
}

function downloadPosts() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(posts));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "posts.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function loadPostsFromFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        try {
            posts = JSON.parse(content);
            localStorage.setItem('posts', JSON.stringify(posts));
            postsContainer.innerHTML = '';
            posts.forEach((post, index) => createPostCard(post, index));
        } catch (error) {
            console.error("Error parsing JSON:", error);
        }
    };
    reader.readAsText(file);
}
