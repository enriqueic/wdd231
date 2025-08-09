document.addEventListener('DOMContentLoaded', () => {
  const timestamp = document.getElementById('timestamp');
  if (timestamp) {
    timestamp.value = new Date().toISOString();
  }

  document.querySelectorAll('.card-info-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const modalId = this.dataset.modal;
      const dialog = document.getElementById(modalId);
      if (dialog) dialog.showModal();
    });
  });

  document.querySelectorAll('dialog [data-close]').forEach(btn => {
    btn.addEventListener('click', function() {
      this.closest('dialog').close();
    });
  });

  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.addEventListener('keydown', function(e) {
      if (e.key === "Escape") {
        dialog.close();
      }
    });
  });
});