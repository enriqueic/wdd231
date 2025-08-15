// products-render.js: DOM rendering for products
import { getFavorites, getProductHistory } from './utils.js';

export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export function renderProducts(products, trackingMode, displayLimit = 8) {
    const productList = document.getElementById('product-list');
    const favorites = getFavorites().map(String);
    const history = getProductHistory();

    // Separate favorites and non-favorites
    const favProducts = [];
    const nonFavProducts = [];
    products.forEach(product => {
        const id = String(product.id || product.code || product.title || product.product_name);
        if (favorites.includes(id)) {
            favProducts.push(product);
        } else {
            nonFavProducts.push(product);
        }
    });

    shuffleArray(nonFavProducts);
    const combined = [...favProducts, ...nonFavProducts].slice(0, Math.max(displayLimit, favProducts.length));

    productList.innerHTML = combined.map(product => {
        const id = String(product.id || product.code || product.title || product.product_name);
        const isFav = favorites.includes(id);

        let infoHTML = '';
        if (trackingMode === 'price') {
            const priceChanges = history[id]?.priceChanges || 0;
            const prices = history[id]?.prices || [];
            const currentPrice = product.price !== undefined ? `$${product.price}` : 'N/A';
            infoHTML = `
                <p><strong>Price:</strong> ${currentPrice}</p>
                <div style="margin-top:0.5em;font-size:0.95em;color:#0d47a1;">
                    Price changes tracked: <strong>${priceChanges}</strong><br>
                    Recent prices: ${prices.map(p => `<span>$${p}</span>`).join(', ')}
                </div>
            `;
        } else {
            const quantityChanges = history[id]?.quantityChanges || 0;
            const quantities = history[id]?.quantities || [];
            infoHTML = `
                <p><strong>Quantity:</strong> ${product.quantity || 'N/A'}</p>
                <div style="margin-top:0.5em;font-size:0.95em;color:#0d47a1;">
                    Quantity changes tracked: <strong>${quantityChanges}</strong><br>
                    Recent quantities: ${quantities.map(q => `<span>${q}</span>`).join(', ')}
                </div>
            `;
        }

        return `
            <div class="card" data-id="${id}" style="margin-bottom:1em;">
                <h3>${product.title || product.product_name || 'Unnamed Product'}</h3>
                <p><strong>Category:</strong> ${product.category || product.brands || 'Unknown'}</p>
                ${infoHTML}
                ${product.image || product.image_front_url ? `<img src="${product.image || product.image_front_url}" alt="${product.title || product.product_name}" style="max-width:120px;">` : ''}
                <button class="fav-btn" data-id="${id}" aria-pressed="${isFav}">
                    ${isFav ? '★ Remove from Watch List' : '☆ Add to Watch List'}
                </button>
            </div>
        `;
    }).join('');
}
