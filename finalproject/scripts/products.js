import { fetchJSON, showSpinner, hideSpinner, getFavorites, setFavorites, getProductHistory, setProductHistory, setupHamburgerMenu, setupFooterDate } from './utils.js';
import { renderProducts, shuffleArray } from './products-render.js';

let trackingMode = localStorage.getItem('trackingMode') || 'price';
localStorage.setItem('trackingMode', trackingMode);
let lastProducts = [];

const productList = document.getElementById('product-list');
const trackPriceBtn = document.getElementById('track-price');
const trackWeightBtn = document.getElementById('track-weight');

function updateProductHistory(products) {
    const history = getProductHistory();
    products.forEach(product => {
        const id = String(product.id || product.code || product.title || product.product_name);
        if (trackingMode === 'price') {
            const currentPrice = product.price || '';
            if (!history[id]) {
                history[id] = { priceChanges: 0, prices: [currentPrice] };
            } else {
                const prices = history[id].prices || [];
                if (prices[0] !== currentPrice) {
                    history[id].priceChanges = (history[id].priceChanges || 0) + 1;
                    history[id].prices = [currentPrice, ...prices].slice(0, 3);
                }
            }
        } else {
            const currentQuantity = product.quantity || '';
            if (!history[id]) {
                history[id] = { quantityChanges: 0, quantities: [currentQuantity] };
            } else {
                const quantities = history[id].quantities || [];
                if (quantities[0] !== currentQuantity) {
                    history[id].quantityChanges = (history[id].quantityChanges || 0) + 1;
                    history[id].quantities = [currentQuantity, ...quantities].slice(0, 3);
                }
            }
        }
    });
    setProductHistory(history);
}

async function fetchFakeStoreProduct(id) {
    try {
        const p = await fetchJSON(`https://fakestoreapi.com/products/${id}`);
        return {
            id: String(p.id),
            title: p.title,
            category: p.category,
            price: p.price,
            image: p.image
        };
    } catch {
        return null;
    }
}

async function fetchOpenFoodFactsProduct(code) {
    try {
        const data = await fetchJSON(`https://world.openfoodfacts.org/api/v0/product/${code}.json`);
        if (data.status === 1) {
            const p = data.product;
            return {
                code: p.code,
                product_name: p.product_name,
                brands: p.brands,
                quantity: p.quantity,
                image_front_url: p.image_front_url
            };
        }
        return null;
    } catch {
        return null;
    }
}

async function fetchAndRenderProducts() {
    const displayLimit = 8;
    const favorites = getFavorites().map(String);

    showSpinner('loading-spinner');
    productList.innerHTML = "";

    if (trackingMode === 'price') {
        try {
            let data = await fetchJSON('https://fakestoreapi.com/products');
            data = data.map(p => ({ ...p, id: String(p.id) }));
            const favProducts = [];
            const nonFavProducts = [];
            data.forEach(product => {
                const id = String(product.id || product.code || product.title);
                if (favorites.includes(id)) {
                    favProducts.push(product);
                } else {
                    nonFavProducts.push(product);
                }
            });
            const missingFavs = favorites.filter(fid => !favProducts.some(p => String(p.id || p.code || p.title) === fid));
            const fetchedMissing = await Promise.all(
                missingFavs.map(fid => fetchFakeStoreProduct(fid))
            );
            const allFavs = [...favProducts, ...fetchedMissing.filter(Boolean)];
            shuffleArray(nonFavProducts);
            const combined = [...allFavs, ...nonFavProducts].slice(0, Math.max(displayLimit, allFavs.length));
            lastProducts = combined;
            updateProductHistory(combined);
            renderProducts(combined, trackingMode, displayLimit);
            if (!combined.length) {
                productList.innerHTML = '<p>No products found.</p>';
            }
        } catch {
            productList.innerHTML = '<p>Could not load products at this time.</p>';
        } finally {
            hideSpinner('loading-spinner');
        }
    } else {
        try {
            const randomPage = Math.floor(Math.random() * 20) + 1;
            const data = await fetchJSON(`https://world.openfoodfacts.org/category/snacks.json?page_size=20&page=${randomPage}`);
            const products = (data.products || []).map(p => ({
                code: p.code,
                product_name: p.product_name,
                brands: p.brands,
                quantity: p.quantity,
                image_front_url: p.image_front_url
            }));

            // Find missing favorites
            const missingFavs = favorites.filter(fid => !products.some(p => String(p.code) === fid));
            const fetchedMissing = await Promise.all(
                missingFavs.map(fid => fetchOpenFoodFactsProduct(fid))
            );
            const allFavs = [
                ...products.filter(p => favorites.includes(String(p.code))),
                ...fetchedMissing.filter(Boolean)
            ];

            shuffleArray(products);
            const combined = [...allFavs, ...products].slice(0, Math.max(displayLimit, allFavs.length));
            lastProducts = combined;
            updateProductHistory(combined);
            renderProducts(combined, trackingMode, displayLimit);
            if (!combined.length) {
                productList.innerHTML = '<p>No products found.</p>';
            }
        } catch {
            productList.innerHTML = '<p>Could not load products at this time.</p>';
        } finally {
            hideSpinner('loading-spinner');
        }
    }
}

if (trackPriceBtn && trackWeightBtn) {
    trackPriceBtn.addEventListener('click', () => {
        trackingMode = 'price';
        localStorage.setItem('trackingMode', trackingMode);
        trackPriceBtn.classList.add('active');
        trackWeightBtn.classList.remove('active');
        fetchAndRenderProducts();
    });
    trackWeightBtn.addEventListener('click', () => {
        trackingMode = 'weight';
        localStorage.setItem('trackingMode', trackingMode);
        trackWeightBtn.classList.add('active');
        trackPriceBtn.classList.remove('active');
        fetchAndRenderProducts();
    });
}

if (productList) {
    productList.addEventListener('click', function (e) {
        if (e.target.classList.contains('fav-btn')) {
            const id = String(e.target.getAttribute('data-id'));
            let favorites = getFavorites().map(String);
            if (favorites.includes(id)) {
                favorites = favorites.filter(fav => fav !== id);
            } else {
                favorites.push(id);
            }
            setFavorites(favorites);
            renderProducts(lastProducts, trackingMode);
        }
    });
}

if (trackingMode === 'price') {
    trackPriceBtn?.classList.add('active');
    trackWeightBtn?.classList.remove('active');
} else {
    trackWeightBtn?.classList.add('active');
    trackPriceBtn?.classList.remove('active');
}

fetchAndRenderProducts();

document.addEventListener("DOMContentLoaded", () => {
    setupHamburgerMenu();
    setupFooterDate();
});