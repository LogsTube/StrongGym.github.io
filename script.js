// Product Database (Default Data)
const defaultProducts = [
    {
        id: 1,
        name: "STRONG WHEY",
        price: 200000,
        category: "proteinas",
        image: "protein_powder.png",
        desc: "Proteína aislada de rápida absorción. 30g por servicio.",
        badge: "BEST SELLER"
    },
    {
        id: 2,
        name: "PURE CREATINE",
        price: 100000,
        category: "creatinas",
        image: "creatine_tub.png",
        desc: "Monohidrato micronizado para fuerza explosiva.",
        badge: ""
    },
    {
        id: 3,
        name: "RAGE PRE-WORKOUT",
        price: 140000,
        category: "preentrenos",
        image: "preworkout_jar.png",
        desc: "Energía extrema y enfoque láser. Sabor Frutos Rojos.",
        badge: "NUEVO"
    },
    {
        id: 4,
        name: "MULTI-VIT PRO",
        price: 80000,
        category: "vitaminas",
        image: "vitamins_bottle.png",
        desc: "Complejo vitamínico completo para recuperación y salud.",
        badge: "ESENCIAL"
    },
    {
        id: 5,
        name: "RAGE BLUE RASPBERRY",
        price: 140000,
        category: "preentrenos",
        image: "preworkout_jar.png",
        desc: "La misma potencia, nuevo sabor electrizante.",
        badge: "NUEVO"
    },
    {
        id: 6,
        name: "RAGE STIM-FREE",
        price: 130000,
        category: "preentrenos",
        image: "preworkout_jar.png",
        desc: "Pumo muscular máximo sin cafeína. Para entrenar tarde.",
        badge: ""
    },
    {
        id: 7,
        name: "OMEGA 3 GOLD",
        price: 90000,
        category: "vitaminas",
        image: "vitamins_bottle.png",
        desc: "Aceite de pescado ultra puro para salud cardiovascular.",
        badge: ""
    },
    {
        id: 8,
        name: "CREATINE HCL",
        price: 120000,
        category: "creatinas",
        image: "creatine_tub.png",
        desc: "Clorhidrato de creatina para ultra-absorción.",
        badge: ""
    },
    {
        id: 9,
        name: "CINTURÓN DE CUERO PRO",
        price: 180000,
        category: "accesorios",
        image: "gym_accessories.png",
        desc: "Cuero genuino reforzado para soporte lumbar máximo.",
        badge: "PREMIUM"
    },
    {
        id: 10,
        name: "STRAPS DE AGARRE",
        price: 60000,
        category: "accesorios",
        image: "gym_accessories.png",
        desc: "Mejora tu agarre en pesos muertos y remos.",
        badge: ""
    },
    {
        id: 11,
        name: "MUÑEQUERAS STRONG",
        price: 50000,
        category: "accesorios",
        image: "gym_accessories.png",
        desc: "Estabilidad total para tus levantamientos de empuje.",
        badge: ""
    }
];

// App State Management
window.App = {
    init: () => {
        App.loadData();
        App.setupEventListeners();
        App.renderProducts();
        App.renderPromotions(); // Render promotions if element exists
        App.checkAdminStatus();
        App.updateCartCount();
        App.renderCart(); // If on cart page
        App.renderAdminDashboard(); // If on admin page
    },

    loadData: () => {
        if (!localStorage.getItem('sg_products')) {
            localStorage.setItem('sg_products', JSON.stringify(defaultProducts));
        }
        if (!localStorage.getItem('sg_promotions')) {
            localStorage.setItem('sg_promotions', '[]');
        }
    },

    getProducts: () => {
        return JSON.parse(localStorage.getItem('sg_products'));
    },

    saveProducts: (products) => {
        localStorage.setItem('sg_products', JSON.stringify(products));
        App.renderProducts();
    },

    // --- Promotions System ---
    getPromotions: () => {
        return JSON.parse(localStorage.getItem('sg_promotions') || '[]');
    },

    savePromotions: (promos) => {
        localStorage.setItem('sg_promotions', JSON.stringify(promos));
        App.renderPromotions();
    },

    addPromotion: (promo) => {
        const promos = App.getPromotions();
        promo.id = Date.now();
        promos.push(promo);
        App.savePromotions(promos);
    },

    deletePromotion: (id) => {
        const promos = App.getPromotions();
        const filtered = promos.filter(p => p.id != id);
        App.savePromotions(filtered);
    },

    togglePromotionStatus: (id) => {
        const promos = App.getPromotions();
        const promo = promos.find(p => p.id == id);
        if (promo) {
            promo.active = !promo.active;
            App.savePromotions(promos);
        }
    },

    renderPromotions: () => {
        const promoContainer = document.getElementById('promo-container');
        if (!promoContainer) return;

        const promos = App.getPromotions().filter(p => p.active);

        if (promos.length === 0) {
            promoContainer.style.display = 'none';
            return;
        }

        promoContainer.style.display = 'block';
        promoContainer.innerHTML = `
            <div class="container section-padding" style="padding-bottom: 0;">
                <div class="section-header" style="margin-bottom: 30px;">
                    <h2>OFERTAS <span class="accent">ESPECIALES</span></h2>
                </div>
                <div class="promo-grid">
                    ${promos.map(p => `
                        <div class="promo-card" style="background-image: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url('${p.image || ''}'); background-size: cover; background-position: center;">
                            <div class="promo-content">
                                ${p.price ? `<div class="promo-price-badge">$${parseFloat(p.price).toLocaleString('es-CO')}</div>` : ''}
                                <h3>${p.title}</h3>
                                <p>${p.desc}</p>
                                <div class="promo-code">${p.code || 'SIN CÓDIGO'}</div>
                                <button class="btn btn-primary" style="margin-top: 15px; width: 100%;" onclick="App.addToCart(${p.id})">Añadir al Carrito</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // --- Cart System ---
    getCart: () => {
        return JSON.parse(localStorage.getItem('sg_cart') || '[]');
    },

    saveCart: (cart) => {
        localStorage.setItem('sg_cart', JSON.stringify(cart));
        App.updateCartCount();
        App.renderCart();
    },

    addToCart: (productId) => {
        const products = App.getProducts();
        let product = products.find(p => p.id == productId);

        if (!product) {
            // Check in promotions
            const promotions = App.getPromotions();
            const promo = promotions.find(p => p.id == productId);
            if (promo) {
                product = {
                    id: promo.id,
                    name: promo.title,
                    price: parseFloat(promo.price),
                    image: promo.image,
                    desc: promo.desc,
                    category: 'promocion'
                };
            }
        }

        if (!product) return;

        let cart = App.getCart();
        const existingItem = cart.find(item => item.id == productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        App.saveCart(cart);

        // Show Feedback
        const btn = event.target;
        // Check if event.target is actually the button (it might be a child element if we had icons)
        // But here we are calling it directly from onclick on the button.
        if (btn) {
            const originalText = btn.innerText;
            btn.innerText = "¡AÑADIDO!";
            btn.style.background = "#28a745";
            btn.style.color = "white";
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.background = "";
                btn.style.color = "";
            }, 1500);
        }
    },

    removeFromCart: (productId) => {
        let cart = App.getCart();
        cart = cart.filter(item => item.id != productId);
        App.saveCart(cart);
    },

    updateQuantity: (productId, change) => {
        let cart = App.getCart();
        const item = cart.find(i => i.id == productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                App.removeFromCart(productId);
                return;
            }
        }
        App.saveCart(cart);
    },

    clearCart: () => {
        localStorage.setItem('sg_cart', '[]');
        App.updateCartCount();
    },

    getCartTotal: () => {
        const cart = App.getCart();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    updateCartCount: () => {
        const cart = App.getCart();
        const count = cart.reduce((acc, item) => acc + item.quantity, 0);
        const cartBtns = document.querySelectorAll('a[href="#products"].btn-outline, a[href="cart.html"].btn-outline');

        cartBtns.forEach(btn => {
            btn.innerText = `Carrito (${count})`;
            btn.href = 'cart.html';
        });

        // Update Floating Badge
        const floatBadge = document.getElementById('floating-cart-badge');
        if (floatBadge) {
            floatBadge.innerText = count;
            floatBadge.style.display = count > 0 ? 'flex' : 'none';
        }
    },

    renderCart: () => {
        const cartContainer = document.getElementById('cart-items');
        const cartTotalEl = document.getElementById('cart-total');

        if (!cartContainer) return;

        const cart = App.getCart();

        if (cart.length === 0) {
            cartContainer.innerHTML = '<p style="text-align:center; color:#888; padding: 40px;">Tu carrito está vacío.</p>';
            if (cartTotalEl) cartTotalEl.innerText = '$0';
            return;
        }

        cartContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p class="item-price">$${item.price.toLocaleString('es-CO')}</p>
                </div>
                <div class="item-actions">
                    <button onclick="App.updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="App.updateQuantity(${item.id}, 1)">+</button>
                </div>
                <div class="item-subtotal">
                    $${(item.price * item.quantity).toLocaleString('es-CO')}
                </div>
            </div>
        `).join('');

        if (cartTotalEl) {
            cartTotalEl.innerText = '$' + App.getCartTotal().toLocaleString('es-CO');
        }
    },

    // --- Order System ---
    createOrder: (customerDetails) => {
        const cart = App.getCart();
        const total = App.getCartTotal();

        const order = {
            id: 'ORD-' + Date.now(),
            date: new Date().toISOString(),
            customer: customerDetails,
            items: cart,
            total: total,
            status: 'Pendiente', // Requires Admin Confirmation
            paymentMethod: customerDetails.paymentMethod
        };

        const orders = JSON.parse(localStorage.getItem('sg_orders') || '[]');
        orders.unshift(order); // Add to top
        localStorage.setItem('sg_orders', JSON.stringify(orders));

        App.clearCart();
        return order.id;
    },

    getOrders: () => {
        return JSON.parse(localStorage.getItem('sg_orders') || '[]');
    },

    clearOrders: () => {
        localStorage.removeItem('sg_orders');
    },

    confirmOrder: (orderId) => {
        const orders = App.getOrders();
        const order = orders.find(o => o.id === orderId);
        if (order) {
            order.status = 'Completado';
            localStorage.setItem('sg_orders', JSON.stringify(orders));
            return true;
        }
        return false;
    },

    // --- Core Rendering ---
    renderProducts: () => {
        // Find containers
        const containers = document.querySelectorAll('.dynamic-product-grid');
        const allProducts = App.getProducts();

        containers.forEach(container => {
            const categoryFilter = container.dataset.category;
            let displayProducts = allProducts;

            if (categoryFilter && categoryFilter !== 'all') {
                if (categoryFilter === 'featured') {
                    displayProducts = allProducts.slice(0, 4);
                } else {
                    displayProducts = allProducts.filter(p => p.category === categoryFilter);
                }
            }

            container.innerHTML = displayProducts.map(product => `
                <div class="product-card scroll-reveal">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}">
                        ${product.badge ? `<div class="badge">${product.badge}</div>` : ''}
                    </div>
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p class="product-desc">${product.desc}</p>
                        <div class="price-row">
                            <span class="price">$${product.price.toLocaleString('es-CO')}</span>
                            <button class="add-to-cart" onclick="App.addToCart(${product.id})">Añadir</button>
                        </div>
                    </div>
                </div>
            `).join('');

            // Re-trigger animations for new elements
            App.setupScrollReveal();
        });
    },

    addToCartAnim: (name) => {
        // Legacy support just in case, but actual logic moved to addToCart with ID
    },

    setupScrollReveal: () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
    },

    // Auth System
    register: (username, email, password) => {
        const users = JSON.parse(localStorage.getItem('sg_users') || '[]');
        if (users.find(u => u.username === username)) {
            return { success: false, message: 'El usuario ya existe' };
        }
        users.push({ username, email, password, role: 'user' });
        localStorage.setItem('sg_users', JSON.stringify(users));
        return { success: true };
    },

    login: (username, password) => {
        if (username === 'admin' && password === 'strong123') {
            localStorage.setItem('sg_session', JSON.stringify({ username: 'Admin', role: 'admin' }));
            return { success: true, role: 'admin' };
        }

        const users = JSON.parse(localStorage.getItem('sg_users') || '[]');
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            localStorage.setItem('sg_session', JSON.stringify({ username: user.username, role: 'user' }));
            return { success: true, role: 'user' };
        }

        return { success: false, message: 'Credenciales inválidas' };
    },

    logout: () => {
        localStorage.removeItem('sg_session');
        window.location.href = 'index.html';
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('sg_session'));
    },

    isAdmin: () => {
        const user = App.getCurrentUser();
        return user && user.role === 'admin';
    },

    checkAdminStatus: () => {
        const navLinks = document.querySelector('.nav-links');
        const user = App.getCurrentUser();
        if (!navLinks) return;

        // Clean up any previously injected panel link
        const existingPanel = document.getElementById('nav-panel-link');
        if (existingPanel) existingPanel.remove();

        // Find the Auth Link (Login/Logout)
        let authLink = Array.from(navLinks.querySelectorAll('a')).find(a =>
            a.href.includes('admin.html') || a.id === 'nav-auth-link'
        );

        if (authLink) {
            authLink.id = 'nav-auth-link'; // Ensure stable ID

            if (user) {
                // Logged In State
                authLink.innerHTML = 'Cerrar Sesión';
                authLink.href = "#";
                authLink.style.color = '#fff';
                authLink.onclick = (e) => {
                    e.preventDefault();
                    App.logout();
                };

                // If Admin, inject Dashboard link
                if (user.role === 'admin' && !window.location.href.includes('admin.html')) {
                    const panelLi = document.createElement('li');
                    panelLi.id = 'nav-panel-link';
                    panelLi.innerHTML = `<a href="admin.html" style="color: #ff2a2a; font-family: 'Teko', sans-serif; font-size: 1.3rem; letter-spacing: 1px; font-weight: 500;">PANEL ADMIN</a>`;
                    authLink.parentElement.parentElement.insertBefore(panelLi, authLink.parentElement);
                }
            } else {
                // Guest State
                authLink.innerHTML = 'Iniciar Sesión';
                authLink.href = 'admin.html';
                authLink.style.color = 'var(--primary)';
                authLink.onclick = null;
            }
        }
    },

    renderAdminDashboard: () => {
        // Logic handled in admin.html specific scripts, but we could unify here
    },

    // Admin CRUD Operations
    addProduct: (product) => {
        const products = App.getProducts();
        product.id = Date.now(); // Simple ID
        products.push(product);
        App.saveProducts(products);
    },

    deleteProduct: (id) => {
        const products = App.getProducts();
        const filtered = products.filter(p => p.id != id);
        App.saveProducts(filtered);
    },

    setupEventListeners: () => {
        // Sticky Header
        window.addEventListener('scroll', () => {
            const header = document.getElementById('navbar');
            if (header) {
                if (window.scrollY > 50) {
                    header.style.background = 'rgba(5, 5, 5, 0.95)';
                    header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
                } else {
                    header.style.background = 'rgba(5, 5, 5, 0.9)';
                    header.style.boxShadow = 'none';
                }
            }
        });

        // Mobile Menu
        const mobileBtn = document.querySelector('.mobile-menu-toggle');
        if (mobileBtn) {
            mobileBtn.addEventListener('click', () => {
                const navLinks = document.querySelector('.nav-links');
                navLinks.classList.toggle('active');

                let mobileMenu = document.querySelector('.mobile-menu');
                if (!mobileMenu) {
                    mobileMenu = document.createElement('div');
                    mobileMenu.className = 'mobile-menu';
                    Object.assign(mobileMenu.style, {
                        position: 'fixed', top: '70px', left: '0', width: '100%',
                        background: '#0a0a0a', padding: '20px', zIndex: '999',
                        borderBottom: '1px solid #333', display: 'flex', flexDirection: 'column', gap: '20px'
                    });

                    const links = document.querySelector('.nav-links').cloneNode(true);
                    links.style.display = 'flex';
                    links.style.flexDirection = 'column';
                    mobileMenu.innerHTML = links.innerHTML;

                    document.body.appendChild(mobileMenu);
                    mobileMenu.querySelectorAll('a').forEach(l => l.addEventListener('click', () => mobileMenu.remove()));
                } else {
                    mobileMenu.remove();
                }
            });
        }
    }
};

document.addEventListener('DOMContentLoaded', App.init);
