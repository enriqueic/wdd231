document.addEventListener("DOMContentLoaded", function () {
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    const lastMod = document.getElementById("lastModified");
    if (lastMod) {
        lastMod.textContent = "Last Modified: " + document.lastModified;
    }
});