var products = [
    {id:1, name:"Tog manzarasi", description:"Chiroyli tog korinishi", price:150000, category:"tabiat", image:"https://picsum.photos/400/300?random=1"},
    {id:2, name:"Dengiz botishi", description:"Quyosh botishi, dengiz", price:180000, category:"tabiat", image:"https://picsum.photos/400/300?random=2"},
    {id:3, name:"Shahar kechasi", description:"Tungi shahar, chiroqlar", price:200000, category:"shahar", image:"https://picsum.photos/400/300?random=3"},
    {id:4, name:"Koprik", description:"Zamonaviy koprik", price:170000, category:"shahar", image:"https://picsum.photos/400/300?random=4"},
    {id:5, name:"Ranglar oqimi", description:"Abstrakt, yorqin ranglar", price:250000, category:"abstrakt", image:"https://picsum.photos/400/300?random=5"},
    {id:6, name:"Geometriya", description:"Geometrik shakllar", price:220000, category:"abstrakt", image:"https://picsum.photos/400/300?random=6"},
    {id:7, name:"Ayol portreti", description:"Professional portret", price:300000, category:"portret", image:"https://picsum.photos/400/300?random=7"},
    {id:8, name:"Oilaviy surat", description:"Oilaviy suratga buyurtma", price:350000, category:"portret", image:"https://picsum.photos/400/300?random=8"},
    {id:9, name:"Gul bogi", description:"Bahorgi gullar", price:160000, category:"tabiat", image:"https://picsum.photos/400/300?random=9"},
    {id:10, name:"Shahar panorama", description:"Panoramik korinish", price:280000, category:"shahar", image:"https://picsum.photos/400/300?random=10"},
    {id:11, name:"Abstrakt gullar", description:"Gullar abstrakt uslubda", price:190000, category:"abstrakt", image:"https://picsum.photos/400/300?random=11"},
    {id:12, name:"Bolalar portreti", description:"Bolalar uchun surat", price:280000, category:"portret", image:"https://picsum.photos/400/300?random=12"}
];

var cart = [];

function formatPrice(price) {
    return price.toLocaleString() + " som";
}

function renderProducts(filter) {
    var grid = document.getElementById("productsGrid");
    var filtered = products;
    if (filter && filter !== "all") {
        filtered = products.filter(function(p) { return p.category === filter; });
    }
    grid.innerHTML = "";
    filtered.forEach(function(product) {
        var card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = '<img class="product-image" src="' + product.image + '" alt="' + product.name + '"><div class="product-info"><h3>' + product.name + '</h3><p>' + product.description + '</p><div class="product-price">' + formatPrice(product.price) + '</div><button class="add-to-cart-btn" onclick="addToCart(' + product.id + ')">Savatchaga</button></div>';
        grid.appendChild(card);
    });
}

function addToCart(id) {
    var product = products.find(function(p) { return p.id === id; });
    var existing = cart.find(function(item) { return item.id === id; });
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1});
    }
    updateCartCount();
    alert(product.name + " savatchaga qoshildi!");
}

function updateCartCount() {
    var total = 0;
    cart.forEach(function(item) { total += item.quantity; });
    document.getElementById("cartCount").textContent = total;
}

function renderCart() {
    var cartItems = document.getElementById("cartItems");
    var cartTotal = document.getElementById("cartTotal");
    if (cart.length === 0) {
        cartItems.innerHTML = "<p style='text-align:center;padding:20px'>Savatcha bosh</p>";
        cartTotal.textContent = "0";
        return;
    }
    cartItems.innerHTML = "";
    var total = 0;
    cart.forEach(function(item, index) {
        total += item.price * item.quantity;
        var div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = '<img class="cart-item-img" src="' + item.image + '"><div class="cart-item-info"><h4>' + item.name + ' x' + item.quantity + '</h4><p>' + formatPrice(item.price * item.quantity) + '</p></div><button class="cart-item-remove" onclick="removeFromCart(' + index + ')">X</button>';
        cartItems.appendChild(div);
    });
    cartTotal.textContent = total.toLocaleString();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    renderCart();
}

document.getElementById("cartIcon").addEventListener("click", function() {
    renderCart();
    document.getElementById("cartModal").classList.add("active");
});

document.getElementById("closeCart").addEventListener("click", function() {
    document.getElementById("cartModal").classList.remove("active");
});

document.getElementById("orderBtn").addEventListener("click", function() {
    if (cart.length === 0) { alert("Savatcha bosh!"); return; }
    document.getElementById("cartModal").classList.remove("active");
    document.getElementById("orderModal").classList.add("active");
});

document.getElementById("closeOrder").addEventListener("click", function() {
    document.getElementById("orderModal").classList.remove("active");
});

document.getElementById("orderForm").addEventListener("submit", function(e) {
    e.preventDefault();
    var name = document.getElementById("orderName").value;
    var phone = document.getElementById("orderPhone").value;
    var address = document.getElementById("orderAddress").value;
    var msg = "YANGI BUYURTMA!

Ism: " + name + "
Tel: " + phone + "
Manzil: " + address + "

Mahsulotlar:
";
    var total = 0;
    cart.forEach(function(item) {
        msg += "- " + item.name + " x" + item.quantity + " = " + formatPrice(item.price * item.quantity) + "
";
        total += item.price * item.quantity;
    });
    msg += "
Jami: " + formatPrice(total);
    var botToken = "8824602116:AAFrLjoX-SleXc9Yl_A6_c27dccD9sFF8NQ";
    var chatId = "8200861284";
    var url = "https://api.telegram.org/bot" + botToken + "/sendMessage";
    fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({chat_id: chatId, text: msg})
    }).then(function() {
        alert("Buyurtma qabul qilindi!");
        cart = [];
        updateCartCount();
        document.getElementById("orderModal").classList.remove("active");
        document.getElementById("orderForm").reset();
    });
});

document.getElementById("contactForm").addEventListener("submit", function(e) {
    e.preventDefault();
    alert("Xabaringiz yuborildi!");
    document.getElementById("contactForm").reset();
});

document.querySelectorAll(".filter-btn").forEach(function(btn) {
    btn.addEventListener("click", function() {
        document.querySelectorAll(".filter-btn").forEach(function(b) { b.classList.remove("active"); });
        btn.classList.add("active");
        renderProducts(btn.dataset.filter);
    });
});

document.getElementById("cartModal").addEventListener("click", function(e) {
    if (e.target === document.getElementById("cartModal")) document.getElementById("cartModal").classList.remove("active");
});

document.getElementById("orderModal").addEventListener("click", function(e) {
    if (e.target === document.getElementById("orderModal")) document.getElementById("orderModal").classList.remove("active");
});

renderProducts("all");
