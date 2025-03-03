// Initialize an empty cart array 
let cart = [];

if (window.location.pathname.includes('Pharmacy.html')) {
  localStorage.removeItem('cart')
}

function updateLocalStorage() {
localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to add items to the cart
function addToCart(item, price, quantity) {
  const qty = parseInt(quantity, 10); 
  if (isNaN(qty) || qty <= 0) { 
    alert("Please enter a valid quantity!"); 
    return; 
  }

  // Check if the item already exists in the cart
  const existingItem = cart.find(product => product.name === item); 
  if (existingItem) {
    existingItem.quantity += qty; 
  }
  else {
    cart.push({name: item, price, quantity: qty}); 
  }
  updateCart(); 
  updateLocalStorage();

  // Reset quantity input field for the item after adding to cart
  const quantityInput = document.getElementById(`quantity-${item.split(' ')[0].toLowerCase()}`);
  quantityInput.value = 1; // Reset the value to 1

  alert(`${item} added to the cart successfully!`);
}

// Function to update the cart display on the page
function updateCart() {
  const cartItems = document.getElementById('cart-items'); 
  const totalPrice = document.getElementById('total-price'); 
  cartItems.innerHTML = ''; 
  let total = 0; 

  // Loop through the cart and display each item's details
  cart.forEach((product, index) => {
    const row = document.createElement('tr'); 
    row.innerHTML = `
      <td>${product.name}</td> 
      <td>${product.price}</td>
      <td>
        <input type="number" min="1" value="${product.quantity}" 
               onchange="updateQuantity(${index}, this.value)"> 
      </td>
      <td>${(product.price * product.quantity).toFixed(2)}</td> 
      <td>
        <button onclick="removeItem(${index})">Remove</button> 
      </td>
    `;
    cartItems.appendChild(row); 
    total += product.price * product.quantity; 
  });

  totalPrice.textContent = `Rs. ${total.toFixed(2)}`; 
}

// Function to update the quantity of an item in the cart
function updateQuantity(index, newQuantity) {
  const quantity = parseInt(newQuantity, 10); 
  if (quantity > 0) { 
    cart[index].quantity = quantity; 
    updateCart(); 
    updateLocalStorage();
  } 
  else {
    alert("Quantity must be at least 1"); 
    updateCart(); 
  }
}

// Function to remove an item from the cart
function removeItem(index) {
  cart.splice(index, 1); 
  updateCart(); 
  updateLocalStorage();
}

// Function to proceed to the order page
function proceedToOrder() {
  if (cart.length === 0) { 
    alert("Your cart is empty. Add items to proceed."); 
    return; 
  }
  // Save the current cart data in local storage for the order page
  localStorage.setItem('cart', JSON.stringify(cart));
  window.location.href = 'Order.html'; 
}

// Function to load the cart details from local storage on the order page
function loadCartFromStorage() {
  const storedCart = localStorage.getItem('cart'); 
  if (storedCart) {
    cart = JSON.parse(storedCart); 
    displayOrder(); 
  }
}

// Function to display the order details on the order page
function displayOrder() {
    const orderItems = document.getElementById('order-items'); 
    const orderTotal = document.getElementById('order-total'); 
    orderItems.innerHTML = ''; 
    let total = 0; 
  
    // Loop through the cart and display each item's details
    cart.forEach(product => {
      const row = document.createElement('tr'); 
      row.innerHTML = `
        <td>${product.name}</td> 
        <td>${product.price}</td>
        <td>${product.quantity}</td> 
        <td>${(product.price * product.quantity).toFixed(2)}</td> 
      `;
      orderItems.appendChild(row); 
      total += product.price * product.quantity; 
    });
  
    orderTotal.textContent = `Rs. ${total.toFixed(2)}`; 
}

// Function to save the current order to favourites
function addToFavourites() {
  if (cart.length === 0) {
    alert("Please add items to the cart before saving to favourites!");
  } 
  else {
    localStorage.setItem('favourites', JSON.stringify(cart)); 
    alert('Favourites saved!');
  }
}
  
// Function to load saved favourites and apply them to the cart
function applyFavourites() {
    const savedFavourites = localStorage.getItem('favourites'); 
    if (savedFavourites) {
      const favourites = JSON.parse(savedFavourites);
      favourites.forEach(favItem => {
        const existingItem = cart.find(product => product.name === favItem.name);
        if (existingItem) {
          existingItem.quantity += favItem.quantity;
        } 
        else {
          cart.push(favItem);
        }
      });
      updateCart(); 
      updateLocalStorage();
      alert('Favourites applied successfully!');
    } 
    else {
      alert('No favourites found!');
    }
}

// Load the cart on the order page when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  loadCartFromStorage();
});

document.addEventListener('click', function(event) {
  
  if (event.target.classList.contains('add-to-cart')) {
    const button = event.target;
    const itemName = button.getAttribute('data-item');
    const price = parseFloat(button.getAttribute('data-price'));
    const quantityId = button.getAttribute('data-quantity-id');
    const quantity = document.getElementById(quantityId).value;
    addToCart(itemName, price, quantity);
  }

  if (event.target.id === 'buy-now') {
    proceedToOrder();
  }

  if (event.target.id === 'add-to-favourites') {
    addToFavourites();
  }
    
  if (event.target.id === 'apply-favourites') {
    applyFavourites();
  }
});  

// Function to handle payment validation and completion
function handlePayment(event) {
    event.preventDefault(); 
  
    // Get form input values and trim any extra spaces 
    const fullName = document.getElementById("full-name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const address = document.getElementById("address").value.trim();
    const postalCode = document.getElementById("postal-code").value.trim();
    const city = document.getElementById("city").value.trim();
    const cardType = document.getElementById("card-type").value.trim();
    const cardNumber = document.getElementById("card-number").value.trim();
    const expireMonth = parseInt(document.getElementById("expire-month").value, 10);
    const expireYear = parseInt(document.getElementById("expire-year").value, 10);
    const cvv = document.getElementById("cvv").value.trim();
  
    // Validate that all fields are filled
    if (!fullName || !phone || !email || !address || !postalCode || !city || !cardType || !cardNumber || !expireMonth || !expireYear || !cvv) {
      alert("Please complete all fields!", "error"); 
      return; 
    }
  
    // Additional field-specific validations
    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
      alert("Invalid phone number!", "error");
      return;
    }
  
    if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
      alert("Invalid card number!", "error");
      return;
    }
  
    if (cvv.length !== 3 || !/^\d+$/.test(cvv)) {
      alert("Invalid CVV!", "error");
      return;
    }
  
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    if (expireYear < currentYear || (expireYear === currentYear && expireMonth < currentMonth)) {
      alert("Invalid expiration date!", "error");
      return;
    }
  
    // Calculate and display the estimated delivery date
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7); 
    const formattedDate = deliveryDate.toLocaleDateString();

    // Show a success message
    showAlert(`Thank you, ${fullName}! Your order will arrive on ${formattedDate}. A confirmation with your delivery details have been sent to your email (${email}).`, "success");

    // Hide the form
    const formSection = document.getElementById("order-form");
    formSection.style.display = "none";

    // Display confirmation message
    const confirmationMessage = document.createElement("div");
    confirmationMessage.className = "confirmation";
    confirmationMessage.innerHTML = `
    <p>Your order has been placed successfully.</p>
    <p>We appreciate you choosing us and look forward to serving you again!</p>
    `;
    const footer = document.querySelector("footer"); 
    document.body.insertBefore(confirmationMessage, footer);
}

// Function to show an alert message with styling
function showAlert(message, type) {
    const alertBox = document.createElement("div"); 
    alertBox.className = `alert ${type}`; 
    alertBox.innerText = message; 
    document.body.appendChild(alertBox); 
  
    // Automatically remove the alert box after 4 seconds
    setTimeout(() => {
      alertBox.remove();
    }, 4000);
}
   
