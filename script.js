
document.addEventListener("DOMContentLoaded", function () {

    let cart = [];

    const addButtons = document.querySelectorAll(".add-btn");
    const cartItems = document.getElementById("cart-items");
    const emptyCart = document.querySelector(".cart-empty");
    const summaryValues = document.querySelectorAll(".cart-summary p strong");
    const searchForm = document.querySelector(".search-bar");
    const searchInput = document.querySelector('.search-bar input[type="search"]');
    const checkoutForm = document.querySelector(".checkout-container form");

    // ADD FOOD TO CART
    addButtons.forEach(function (button) {
        button.addEventListener("click", function () {

            const foodCard = button.closest(".food-card");
            const foodName = foodCard.querySelector("h3").textContent.trim();
            const priceText = foodCard.querySelector(".price").textContent;
            const price = Number(priceText.replace(/[^\d.]/g, ""));

            const existingItem = cart.find(function (item) {
                return item.name === foodName;
            });

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    name: foodName,
                    price: price,
                    quantity: 1
                });
            }

            button.textContent = "✓ Added";

            setTimeout(function () {
                button.textContent = "+ Add";
            }, 700);

            updateCart();
        });
    });

    // UPDATE CART
    function updateCart() {

        cartItems.innerHTML = "";

        const isEmpty = cart.length === 0;

        emptyCart.style.display = isEmpty ? "block" : "none";
        cartItems.style.display = isEmpty ? "none" : "block";

        let subtotal = 0;

        cart.forEach(function (item, index) {

            subtotal += item.price * item.quantity;

            const itemElement = document.createElement("div");
            itemElement.className = "cart-item";

            itemElement.innerHTML = `
                <div>
                    <h3>${item.name}</h3>
                    <p>₹${item.price} × ${item.quantity}</p>
                </div>

                <div class="cart-item-actions">
                    <button type="button"
                        class="quantity-btn decrease"
                        data-index="${index}">−</button>

                    <span>${item.quantity}</span>

                    <button type="button"
                        class="quantity-btn increase"
                        data-index="${index}">+</button>

                    <button type="button"
                        class="remove-btn"
                        data-index="${index}">Remove</button>
                </div>
            `;

            cartItems.appendChild(itemElement);
        });

        const deliveryFee = subtotal === 0 ? 0 : 30;
        const total = subtotal + deliveryFee;

        summaryValues[0].textContent = "₹" + subtotal;
        summaryValues[1].textContent = "₹" + deliveryFee;
        summaryValues[2].textContent = "₹" + total;
    }

    // INCREASE, DECREASE OR REMOVE FOOD
    cartItems.addEventListener("click", function (event) {

        const button = event.target.closest("button[data-index]");

        if (!button) return;

        const index = Number(button.dataset.index);

        if (!cart[index]) return;

        if (button.classList.contains("increase")) {
            cart[index].quantity++;
        } else if (button.classList.contains("decrease")) {
            cart[index].quantity--;

            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }
        } else if (button.classList.contains("remove-btn")) {
            cart.splice(index, 1);
        }

        updateCart();
    });

    // SEARCH FOOD
    searchForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const query = searchInput.value.trim().toLowerCase();
        const foodCards = document.querySelectorAll(".food-card");

        foodCards.forEach(function (card) {
            card.style.display = "";
        });

        if (query === "") {
            alert("Please enter a food name to search.");
            return;
        }

        let found = false;

        foodCards.forEach(function (card) {

            const foodName =
                card.querySelector("h3").textContent.toLowerCase();

            const description =
                card.querySelector(".food-content > p").textContent.toLowerCase();

            const category =
                card.querySelector(".food-category").textContent.toLowerCase();

            const matches =
                foodName.includes(query) ||
                description.includes(query) ||
                category.includes(query);

            card.style.display = matches ? "" : "none";

            if (matches) {
                found = true;
            }
        });

        document.getElementById("menu").scrollIntoView({
            behavior: "smooth"
        });

        if (!found) {
            alert("Sorry, no matching food was found. Try another search.");
        }
    });

    // DEMO CHECKOUT
    checkoutForm.addEventListener("submit", function (event) {

        event.preventDefault();

        if (cart.length === 0) {
            alert("Your cart is empty. Please add food before checkout.");
            return;
        }

        const itemCount = cart.reduce(function (sum, item) {
            return sum + item.quantity;
        }, 0);

        alert(
            "Your demo order is ready!\n\n" +
            "Items: " + itemCount +
            "\nTotal: " + summaryValues[2].textContent +
            "\n\nThis is a student project. No real order has been placed."
        );
    });

    updateCart();

});

