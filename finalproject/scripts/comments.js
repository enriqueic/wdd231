document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('comment-form');
    const commentsList = document.getElementById('comments-list');

    // Load existing comments from localStorage
    let comments = JSON.parse(localStorage.getItem('comments')) || [];
    renderComments();

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const user = document.getElementById('user').value.trim() || 'Anonymous';
        const comment = document.getElementById('comment').value.trim();
        if (!comment) return;

        const newComment = {
            user,
            comment,
            date: new Date().toLocaleString()
        };
        comments.unshift(newComment);
        localStorage.setItem('comments', JSON.stringify(comments));
        renderComments();
        form.reset();
    });

    function renderComments() {
        commentsList.innerHTML = comments.map(c => `
            <div class="comment">
                <strong>${c.user}</strong> <span class="date">${c.date}</span>
                <p>${c.comment}</p>
            </div>
        `).join('');
    }
});