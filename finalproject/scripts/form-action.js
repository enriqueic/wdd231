
const params = new URLSearchParams(window.location.search);
const user = params.get('user') || 'Anonymous';
const comment = params.get('comment') || '';
document.getElementById('form-data').innerHTML = `
    <p><strong>Name:</strong> ${user}</p>
    <p><strong>Comment/Report:</strong> ${comment}</p>
`