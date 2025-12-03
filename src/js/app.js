const defaultMenu = [
  {
    id: "idly",
    name: "Idly",
    price: 20,
    image:
      "https://images.pexels.com/photos/31199041/pexels-photo-31199041.jpeg?auto=compress&cs=tinysrgb&w=1000",
  },
  {
    id: "dosa",
    name: "Dosa",
    price: 40,
    image:
      "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: "cofee",
    name: "Coffee",
    price: 35,
    image:
      "https://images.pexels.com/photos/302896/pexels-photo-302896.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: "vada",
    name: "Vada",
    price: 25,
    image:
      "https://images.pexels.com/photos/21751212/pexels-photo-21751212.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: "poori",
    name: "Poori",
    price: 30,
    image:
      "https://images.pexels.com/photos/20422124/pexels-photo-20422124.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

const template = document.getElementById("menu-card-template");
const elements = {
  menuGrid: document.getElementById("menu-grid"),
  cartItems: document.getElementById("cart-items"),
  cartTotal: document.getElementById("cart-total"),
  clearCart: document.getElementById("clear-cart"),
  generateInvoice: document.getElementById("generate-invoice"),
  payNow: document.getElementById("pay-now"),
  payCard: document.getElementById("pay-card"),
};

const state = {
  menuItems: defaultMenu,
  cart: {},
};

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function renderMenu() {
  elements.menuGrid.innerHTML = "";
  state.menuItems.forEach((item) => {
    const clone = template.content.cloneNode(true);
    const img = clone.querySelector(".menu-card-image");
    if (img && item.image) {
      img.src = item.image;
      img.alt = item.name;
    }
    clone.querySelector(".menu-card-title").textContent = item.name;
    clone.querySelector(".price").textContent = formatCurrency(item.price);
    const addBtn = clone.querySelector(".add-btn");
    addBtn.dataset.id = item.id;
    addBtn.addEventListener("click", () => addToCart(item.id));
    elements.menuGrid.appendChild(clone);
  });
}

function addToCart(menuId) {
  const entry = state.cart[menuId] || 0;
  state.cart[menuId] = entry + 1;
  renderCart();
}

function clearCart() {
  state.cart = {};
  renderCart();
}

function renderCart() {
  const ids = Object.keys(state.cart);
  elements.cartItems.innerHTML = "";
  elements.cartItems.classList.toggle("empty", !ids.length);

  if (!ids.length) {
    elements.cartItems.innerHTML = "<p>No dishes yet. Tap a dish to start a bill.</p>";
    elements.cartTotal.textContent = formatCurrency(0);
  } else {
    let total = 0;
    ids.forEach((id) => {
      const menu = state.menuItems.find((item) => item.id === id);
      if (!menu) {
        return;
      }
      const qty = state.cart[id];
      const lineTotal = qty * Number(menu.price);
      total += lineTotal;

      const line = document.createElement("div");
      line.className = "cart-line";
      line.innerHTML = `
        <div>
          <strong>${menu.name}</strong>
          <span>${qty} × ${formatCurrency(menu.price)}</span>
        </div>
      `;

      elements.cartItems.append(line);
    });
    elements.cartTotal.textContent = formatCurrency(total);
  }
}

function generateInvoice() {
  const ids = Object.keys(state.cart);
  if (!ids.length) {
    alert("Add at least one dish before generating an invoice.");
    return;
  }

  const items = ids.map((id) => {
    const menu = state.menuItems.find((item) => item.id === id);
    return {
      name: menu?.name ?? id,
      quantity: state.cart[id],
      unitPrice: menu?.price ?? 0,
      subtotal: (menu?.price ?? 0) * state.cart[id],
    };
  });

  const total = items.reduce((sum, item) => sum + item.subtotal, 0);
  const invoice = {
    id: `INV-${Date.now()}`,
    createdAt: new Date().toLocaleString(),
    items,
    total,
  };

  downloadInvoice(invoice);
}

function togglePayQr() {
  if (!elements.payCard) return;
  const hasItems = Object.keys(state.cart).length > 0;
  if (!hasItems) {
    alert("Add at least one dish to the cart before paying.");
    return;
  }
  elements.payCard.classList.toggle("hidden");
}

function downloadInvoice(invoice) {
  const lines = [
    `Invoice ID: ${invoice.id}`,
    `Created At: ${invoice.createdAt}`,
    "----------------------------------------",
    ...invoice.items.map(
      (item) =>
        `${item.quantity} x ${item.name} @ ${formatCurrency(item.unitPrice)} = ${formatCurrency(
          item.subtotal,
        )}`,
    ),
    "----------------------------------------",
    `TOTAL: ${formatCurrency(invoice.total)}`,
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${invoice.id}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function attachEvents() {
  elements.clearCart.addEventListener("click", clearCart);
  elements.generateInvoice.addEventListener("click", generateInvoice);
  elements.payNow.addEventListener("click", togglePayQr);
}

function init() {
  attachEvents();
  renderMenu();
  renderCart();
}

init();

