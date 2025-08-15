import { setupHamburgerMenu, setupFooterDate} from './utils.js';
import { loadWorldBankStats, populateCountrySelect, countries, fetchShrinkflationNews, fetchShrinkflationReddit } from './news.js';
import { loadModalData, injectModals, setupModalEvents } from './modal.js';

document.addEventListener('DOMContentLoaded', async () => {
    populateCountrySelect();

    const btn = document.getElementById('load-btn');
    const select = document.getElementById('country-select');

    btn.addEventListener('click', () => {
        loadWorldBankStats(select.value);
    });

    loadWorldBankStats(countries[0].code);

    fetchShrinkflationReddit();
    fetchShrinkflationNews();

    await loadModalData();
    injectModals();
    setupModalEvents();
    setupHamburgerMenu();
    setupFooterDate();
});