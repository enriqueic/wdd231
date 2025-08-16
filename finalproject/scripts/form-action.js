const params = new URLSearchParams(window.location.search);
const user = params.get('user') || 'Anonymous';
const comment = params.get('comment') || '';

document.getElementById('form-data').innerHTML = `
    <p><strong>Name:</strong> ${user}</p>
    <p><strong>Comment/Report:</strong> ${comment}</p>
`;

// Persist the comment to localStorage
if (comment) {
    let comments = JSON.parse(localStorage.getItem('comments')) || [];
    comments.unshift({
        user,
        comment,
        date: new Date().toLocaleString()
    });
    localStorage.setItem('comments', JSON.stringify(comments));
}