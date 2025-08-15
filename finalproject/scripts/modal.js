let modalData = {};

export async function loadModalData() {
    const res = await fetch('data/modal.json');
    modalData = await res.json();
}

export function createModal(id, title, body) {
    return `
        <div id="${id}" class="modal" role="dialog" aria-modal="true" aria-labelledby="${id}-title" style="display:none;">
            <div class="modal-content">
                <button class="close" data-close="${id}" aria-label="Close">&times;</button>
                <h3 id="${id}-title">${title}</h3>
                ${body}
            </div>
        </div>
    `;
}

export function injectModals() {
    const container = document.getElementById('modal-container');
    container.innerHTML =
        createModal('modal-world-bank', modalData.worldBank.title, modalData.worldBank.body) +
        createModal('modal-inflation', modalData.inflation.title, modalData.inflation.body);
}

export function setupModalEvents() {
    document.getElementById('about-world-bank-btn')
        .addEventListener('click', () => openModal('modal-world-bank'));
    document.getElementById('about-inflation-btn')
        .addEventListener('click', () => openModal('modal-inflation'));

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('close')) {
            closeModal(e.target.getAttribute('data-close'));
        }
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
        }
    });
}

export function openModal(id) {
    document.getElementById(id).style.display = 'block';
}

export function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}