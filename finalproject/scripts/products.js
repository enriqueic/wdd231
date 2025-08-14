const productList = document.getElementById('product-list');
const trackPriceBtn = document.getElementById('track-price');
const trackWeightBtn = document.getElementById('track-weight');

let trackingMode = 'price';
localStorage.setItem('trackingMode', trackingMode);

// Get/set favorites from localStorage (always as strings)
function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
}
function setFavorites(favs) {
    localStorage.setItem('favorites', JSON.stringify(favs));
}

// Get/set product history
function getProductHistory() {
    return JSON.parse(localStorage.getItem('productHistory') || '{}');
}
function setProductHistory(history) {
    localStorage.setItem('productHistory', JSON.stringify(history));
}

// Update product history for price or weight
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


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function fetchOpenFoodFactsProduct(code) {
    return fetch(`https://world.openfoodfacts.org/api/v0/product/${code}.json`)
        .then(res => res.json())
        .then(data => {
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
        })
        .catch(() => null);
}

function fetchFakeStoreProduct(id) {
    return fetch(`https://fakestoreapi.com/products/${id}`)
        .then(res => res.json())
        .then(p => ({
            id: String(p.id),
            title: p.title,
            category: p.category,
            price: p.price,
            image: p.image
        }))
        .catch(() => null);
}

function renderProducts(products, displayLimit = 8) {
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

    // Shuffle non-favorites
    shuffleArray(nonFavProducts);

    // Combine: favorites first, then shuffled non-favorites
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

// Fetch products, always random except favorites (which are always included)

function fetchAndRenderProducts() {
    const displayLimit = 8;
    const favorites = getFavorites().map(String);

    showSpinner();
    productList.innerHTML = "";

    if (trackingMode === 'price') {
        fetch('https://fakestoreapi.com/products')
            .then(res => res.json())
            .then(async data => {
                // Convert all ids to strings for comparison
                data = data.map(p => ({ ...p, id: String(p.id) }));

                // Separate favorites and non-favorites
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

                // Fetch any missing favorites
                const missingFavs = favorites.filter(fid => !favProducts.some(p => String(p.id || p.code || p.title) === fid));
                const fetchedMissing = await Promise.all(
                    missingFavs.map(fid => fetchFakeStoreProduct(fid))
                );
                // Filter out nulls (in case of bad ids)
                const allFavs = [...favProducts, ...fetchedMissing.filter(Boolean)];

                shuffleArray(nonFavProducts);
                // Always show all favorites, fill up to displayLimit with random non-favorites
                const combined = [...allFavs, ...nonFavProducts].slice(0, Math.max(displayLimit, allFavs.length));
                lastProducts = combined;
                updateProductHistory(combined);
                renderProducts(combined, displayLimit);
                hideSpinner();
            })
            .catch(() => {
                productList.innerHTML = '<p>Could not load products at this time.</p>';
            });
    } else {
        // Use a random page for more variety
        const randomPage = Math.floor(Math.random() * 20) + 1;
        fetch(`https://world.openfoodfacts.org/category/snacks.json?page_size=20&page=${randomPage}`)
            .then(res => res.json())
            .then(async data => {
                // Map Open Food Facts data to expected structure
                const products = data.products.map(p => ({
                    code: String(p.code),
                    product_name: p.product_name,
                    brands: p.brands,
                    quantity: p.quantity,
                    image_front_url: p.image_front_url
                }));
                // Separate favorites and non-favorites
                const favProducts = [];
                const nonFavProducts = [];
                products.forEach(product => {
                    const id = String(product.code || product.product_name);
                    if (favorites.includes(id)) {
                        favProducts.push(product);
                    } else {
                        nonFavProducts.push(product);
                    }
                });

                // Fetch any missing favorites
                const missingFavs = favorites.filter(fid => !favProducts.some(p => String(p.code || p.product_name) === fid));
                const fetchedMissing = await Promise.all(
                    missingFavs.map(fid => fetchOpenFoodFactsProduct(fid))
                );
                // Filter out nulls (in case of bad codes)
                const allFavs = [...favProducts, ...fetchedMissing.filter(Boolean)];

                shuffleArray(nonFavProducts);
                // Always show all favorites, fill up to displayLimit with random non-favorites
                const combined = [...allFavs, ...nonFavProducts].slice(0, Math.max(displayLimit, allFavs.length));
                lastProducts = combined;
                updateProductHistory(combined);
                renderProducts(combined, displayLimit);
                hideSpinner();
            })
            .catch(() => {
                hideSpinner();
                productList.innerHTML = '<p>Could not load products at this time.</p>';
            });
    }
}

// Toggle event listeners
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

// Handle favorite button clicks
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
        renderProducts(lastProducts);
    }
});

function showSpinner() {
    document.getElementById('loading-spinner').style.display = 'flex';
}
function hideSpinner() {
    document.getElementById('loading-spinner').style.display = 'none';
}

if (trackingMode === 'price') {
    trackPriceBtn.classList.add('active');
    trackWeightBtn.classList.remove('active');
} else {
    trackWeightBtn.classList.add('active');
    trackPriceBtn.classList.remove('active');
}
fetchAndRenderProducts();