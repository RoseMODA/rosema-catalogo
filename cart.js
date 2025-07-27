// Cart page functionality
document.addEventListener("DOMContentLoaded", function () {
  initializeCartPage();
  initializeMobileMenu();
});

function initializeCartPage() {
  try {
    loadCartItems();
    updateCartSummary();
    updateCartCount();
    
    // Initialize checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', handleCheckout);
    }
  } catch (error) {
    console.error('Error initializing cart page:', error);
  }
}

function initializeMobileMenu() {
  try {
    const toggle = document.getElementById("menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");

    if (toggle && mobileMenu) {
      toggle.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");
      });
    }
  } catch (error) {
    console.error('Error initializing mobile menu:', error);
  }
}

function loadCartItems() {
  try {
    const cart = getCart();
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart');
    
    if (!cartItemsContainer || !emptyCartMessage) return;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '';
      emptyCartMessage.classList.remove('hidden');
      return;
    }

    emptyCartMessage.classList.add('hidden');
    cartItemsContainer.innerHTML = '';

    cart.forEach(item => {
      const cartItemElement = createCartItemElement(item);
      cartItemsContainer.appendChild(cartItemElement);
    });
  } catch (error) {
    console.error('Error loading cart items:', error);
  }
}

function createCartItemElement(item) {
  const cartItem = document.createElement('div');
  cartItem.className = 'p-6';
  cartItem.dataset.itemId = item.id;

  cartItem.innerHTML = `
    <div class="flex items-start space-x-4">
      <!-- Product Image -->
      <div class="flex-shrink-0">
        <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-lg border border-gray-200"
             onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNCAzNkg0NlY0Nkg0NlYzNloiIGZpbGw9IiNEOUQ5RDkiLz4KPHA+CjwvcGF0aD4KPC9zdmc+Cg=='; this.alt='Imagen no disponible'">
      </div>
      
      <!-- Product Details -->
      <div class="flex-1 min-w-0">
        <h3 class="text-lg font-semibold text-gray-900 mb-1">${item.name}</h3>
        <p class="text-sm text-gray-600 mb-2">SKU: ${item.sku}</p>
        <p class="text-sm text-gray-600 mb-2">Talle: ${item.size}</p>
        
        <!-- Price -->
        <div class="flex items-center space-x-2 mb-3">
          ${item.sale && item.originalPrice ? `
            <span class="text-sm text-gray-500 line-through">$ ${item.originalPrice.toLocaleString()}</span>
            <span class="text-lg font-semibold text-red-600">$ ${item.price.toLocaleString()}</span>
          ` : `
            <span class="text-lg font-semibold text-gray-900">$ ${item.price.toLocaleString()}</span>
          `}
        </div>
        
        <!-- Quantity Controls -->
        <div class="flex items-center space-x-3">
          <div class="flex items-center border border-gray-300 rounded-lg">
            <button type="button" class="quantity-decrease p-2 hover:bg-gray-100 transition-colors" data-item-id="${item.id}">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
              </svg>
            </button>
            <span class="px-4 py-2 text-sm font-medium quantity-display">${item.quantity}</span>
            <button type="button" class="quantity-increase p-2 hover:bg-gray-100 transition-colors" data-item-id="${item.id}">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
            </button>
          </div>
          
          <button type="button" class="remove-item text-red-600 hover:text-red-800 text-sm font-medium transition-colors" data-item-id="${item.id}">
            Eliminar
          </button>
        </div>
      </div>
      
      <!-- Item Total -->
      <div class="flex-shrink-0 text-right">
        <p class="text-lg font-semibold text-gray-900 item-total">$ ${(item.price * item.quantity).toLocaleString()}</p>
      </div>
    </div>
  `;

  // Add event listeners
  const decreaseBtn = cartItem.querySelector('.quantity-decrease');
  const increaseBtn = cartItem.querySelector('.quantity-increase');
  const removeBtn = cartItem.querySelector('.remove-item');

  if (decreaseBtn) {
    decreaseBtn.addEventListener('click', () => updateItemQuantity(item.id, -1));
  }
  
  if (increaseBtn) {
    increaseBtn.addEventListener('click', () => updateItemQuantity(item.id, 1));
  }
  
  if (removeBtn) {
    removeBtn.addEventListener('click', () => removeCartItem(item.id));
  }

  return cartItem;
}

function updateItemQuantity(itemId, change) {
  try {
    let cart = getCart();
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) return;
    
    cart[itemIndex].quantity += change;
    
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);
    }
    
    // Save updated cart
    localStorage.setItem('rosema_cart', JSON.stringify(cart));
    
    // Reload cart display
    loadCartItems();
    updateCartSummary();
    updateCartCount();
    
  } catch (error) {
    console.error('Error updating item quantity:', error);
  }
}

function removeCartItem(itemId) {
  try {
    let cart = getCart();
    cart = cart.filter(item => item.id !== itemId);
    
    // Save updated cart
    localStorage.setItem('rosema_cart', JSON.stringify(cart));
    
    // Reload cart display
    loadCartItems();
    updateCartSummary();
    updateCartCount();
    
  } catch (error) {
    console.error('Error removing cart item:', error);
  }
}

function updateCartSummary() {
  try {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Update summary elements
    const totalItemsEl = document.getElementById('total-items');
    const subtotalEl = document.getElementById('subtotal');
    const totalPriceEl = document.getElementById('total-price');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (totalItemsEl) {
      totalItemsEl.textContent = totalItems;
    }
    
    if (subtotalEl) {
      subtotalEl.textContent = `$ ${subtotal.toLocaleString()}`;
    }
    
    if (totalPriceEl) {
      totalPriceEl.textContent = `$ ${subtotal.toLocaleString()}`;
    }
    
    if (checkoutBtn) {
      checkoutBtn.disabled = cart.length === 0;
    }
    
  } catch (error) {
    console.error('Error updating cart summary:', error);
  }
}

function handleCheckout() {
  try {
    const cart = getCart();
    
    if (cart.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }
    
    // Create WhatsApp message
    let message = '¡Hola! Me gustaría realizar el siguiente pedido:\n\n';
    let total = 0;
    
    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      
      message += `${index + 1}. ${item.name}\n`;
      message += `   - Talle: ${item.size}\n`;
      message += `   - Cantidad: ${item.quantity}\n`;
      message += `   - Precio unitario: $${item.price.toLocaleString()}\n`;
      message += `   - Subtotal: $${itemTotal.toLocaleString()}\n\n`;
    });
    
    message += `*Total: $${total.toLocaleString()}*\n\n`;
    message += 'Por favor, confirma la disponibilidad y el método de pago. ¡Gracias!';
    
    // Encode message for WhatsApp URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5492604381502?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
  } catch (error) {
    console.error('Error handling checkout:', error);
    alert('Error al procesar el pedido. Por favor, intenta nuevamente.');
  }
}

function getCart() {
  try {
    const cart = localStorage.getItem('rosema_cart');
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error getting cart:', error);
    return [];
  }
}

function updateCartCount() {
  try {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountEl = document.getElementById('cart-count');
    
    if (cartCountEl) {
      if (totalItems > 0) {
        cartCountEl.textContent = totalItems;
        cartCountEl.classList.remove('hidden');
      } else {
        cartCountEl.classList.add('hidden');
      }
    }
  } catch (error) {
    console.error('Error updating cart count:', error);
  }
}

// Utility function to format prices
function formatPrice(price) {
  return `$ ${price.toLocaleString()}`;
}
