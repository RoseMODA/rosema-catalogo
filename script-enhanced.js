// Enhanced E-commerce functionality
document.addEventListener("DOMContentLoaded", function () {
  // Initialize all functionality
  initializeCarousel();
  initializeMobileMenu();
  initializeProductModal();
  initializeCart();
});

// Carousel functionality
function initializeCarousel() {
  try {
    const track = document.getElementById('carousel-track');
    const prevBtns = document.querySelectorAll('.prev');
    const nextBtns = document.querySelectorAll('.next');
    
    if (!track) return;
    
    const items = track.children;
    const totalItems = items.length;
    let currentIndex = 0;

    // Number of visible items depends on screen width
    function getVisibleCount() {
      let w = window.innerWidth;
      if(w < 400) return 1;
      if(w < 640) return 2;
      if(w < 1024) return 3;
      return 4;
    }

    // Update carousel position
    function updateCarousel() {
      const visibleCount = getVisibleCount();
      const maxIndex = totalItems - visibleCount;
      if(currentIndex < 0) currentIndex = 0;
      if(currentIndex > maxIndex) currentIndex = maxIndex;

      const translateX = -(currentIndex * (100 / visibleCount));
      track.style.transform = `translateX(${translateX}%)`;
    }

    // Add event listeners to all carousel buttons
    prevBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        currentIndex--;
        updateCarousel();
      });
    });

    nextBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        currentIndex++;
        updateCarousel();
      });
    });

    // Update on resize
    window.addEventListener('resize', updateCarousel);
    
    // Initialize carousel
    updateCarousel();
  } catch (error) {
    console.error('Error initializing carousel:', error);
  }
}

// Mobile menu functionality
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

// Product modal functionality
function initializeProductModal() {
  try {
    const modal = document.getElementById('product-modal');
    const closeBtn = document.querySelector('.modal-close');
    const productCards = document.querySelectorAll('.product-card');
    
    if (!modal) return;

    // Open modal when product card is clicked
    productCards.forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        openProductModal(card);
      });
    });

    // Close modal functionality
    if (closeBtn) {
      closeBtn.addEventListener('click', closeProductModal);
    }

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeProductModal();
      }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeProductModal();
      }
    });

    // Quantity controls
    initializeQuantityControls();
    
    // Add to cart functionality
    initializeAddToCart();
    
  } catch (error) {
    console.error('Error initializing product modal:', error);
  }
}

function openProductModal(productCard) {
  try {
    const modal = document.getElementById('product-modal');
    const productData = {
      id: productCard.dataset.productId,
      name: productCard.dataset.productName,
      price: parseInt(productCard.dataset.productPrice),
      originalPrice: productCard.dataset.productOriginalPrice ? parseInt(productCard.dataset.productOriginalPrice) : null,
      image: productCard.dataset.productImage,
      sku: productCard.dataset.productSku,
      sale: productCard.dataset.productSale === 'true'
    };

    // Populate modal with product data
    document.getElementById('modal-product-image').src = productData.image;
    document.getElementById('modal-product-image').alt = productData.name;
    document.getElementById('modal-title').textContent = productData.name;
    document.getElementById('modal-price').textContent = `$ ${productData.price.toLocaleString()}`;
    document.getElementById('modal-sku').textContent = productData.sku;

    // Handle original price for sale items
    const originalPriceEl = document.getElementById('modal-original-price');
    if (productData.sale && productData.originalPrice) {
      originalPriceEl.textContent = `$ ${productData.originalPrice.toLocaleString()}`;
      originalPriceEl.classList.remove('hidden');
    } else {
      originalPriceEl.classList.add('hidden');
    }

    // Reset form
    document.getElementById('size-select').value = '';
    document.getElementById('quantity-input').value = '1';
    document.getElementById('modal-error').classList.add('hidden');

    // Store product data for add to cart
    modal.dataset.productData = JSON.stringify(productData);

    // Show modal
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    
    // Focus management
    document.querySelector('.modal-close').focus();
  } catch (error) {
    console.error('Error opening product modal:', error);
  }
}

function closeProductModal() {
  try {
    const modal = document.getElementById('product-modal');
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  } catch (error) {
    console.error('Error closing product modal:', error);
  }
}

function initializeQuantityControls() {
  try {
    const minusBtn = document.getElementById('quantity-minus');
    const plusBtn = document.getElementById('quantity-plus');
    const quantityInput = document.getElementById('quantity-input');

    if (minusBtn && plusBtn && quantityInput) {
      minusBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
          quantityInput.value = currentValue - 1;
        }
      });

      plusBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        const maxValue = parseInt(quantityInput.max) || 10;
        if (currentValue < maxValue) {
          quantityInput.value = currentValue + 1;
        }
      });

      // Validate input
      quantityInput.addEventListener('input', () => {
        const value = parseInt(quantityInput.value);
        const min = parseInt(quantityInput.min) || 1;
        const max = parseInt(quantityInput.max) || 10;
        
        if (value < min) quantityInput.value = min;
        if (value > max) quantityInput.value = max;
      });
    }
  } catch (error) {
    console.error('Error initializing quantity controls:', error);
  }
}

function initializeAddToCart() {
  try {
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', handleAddToCart);
    }
  } catch (error) {
    console.error('Error initializing add to cart:', error);
  }
}

function handleAddToCart() {
  try {
    const modal = document.getElementById('product-modal');
    const sizeSelect = document.getElementById('size-select');
    const quantityInput = document.getElementById('quantity-input');
    const errorDiv = document.getElementById('modal-error');
    
    // Validate size selection
    if (!sizeSelect.value) {
      showModalError('Por favor selecciona un talle');
      return;
    }

    // Get product data
    const productData = JSON.parse(modal.dataset.productData);
    const cartItem = {
      id: `${productData.id}-${sizeSelect.value}`,
      productId: productData.id,
      name: productData.name,
      price: productData.price,
      originalPrice: productData.originalPrice,
      image: productData.image,
      sku: productData.sku,
      size: sizeSelect.value,
      quantity: parseInt(quantityInput.value),
      sale: productData.sale
    };

    // Add to cart
    addToCart(cartItem);
    
    // Show success and close modal
    showModalError('¡Producto agregado al carrito!', 'success');
    setTimeout(() => {
      closeProductModal();
    }, 1000);
    
  } catch (error) {
    console.error('Error adding to cart:', error);
    showModalError('Error al agregar el producto al carrito');
  }
}

function showModalError(message, type = 'error') {
  const errorDiv = document.getElementById('modal-error');
  errorDiv.textContent = message;
  errorDiv.classList.remove('hidden');
  
  if (type === 'success') {
    errorDiv.style.backgroundColor = '#d1fae5';
    errorDiv.style.color = '#065f46';
  } else {
    errorDiv.style.backgroundColor = '#fee2e2';
    errorDiv.style.color = '#dc2626';
  }
}

// Cart functionality
function initializeCart() {
  try {
    updateCartCount();
  } catch (error) {
    console.error('Error initializing cart:', error);
  }
}

function addToCart(item) {
  try {
    let cart = getCart();
    
    // Check if item already exists
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
    
    if (existingItemIndex > -1) {
      // Update quantity
      cart[existingItemIndex].quantity += item.quantity;
    } else {
      // Add new item
      cart.push(item);
    }
    
    // Save to localStorage
    localStorage.setItem('rosema_cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
  } catch (error) {
    console.error('Error adding to cart:', error);
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

// Utility functions
function formatPrice(price) {
  return `$ ${price.toLocaleString()}`;
}

// Error handling for missing elements
function safeQuerySelector(selector) {
  try {
    return document.querySelector(selector);
  } catch (error) {
    console.warn(`Element not found: ${selector}`);
    return null;
  }
}
