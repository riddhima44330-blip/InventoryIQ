
"use strict";

// ==========================================
// 1. INVENTORY INITIALIZATION
// ==========================================

let inventory = [
  { id: 1, name: "Laptop", price: 800 },
  { id: 2, name: "Mouse", price: 25 },
  { id: 3, name: "Keyboard", price: 4000 }
];

let nextId = 4;
let toastTimeout;

// ==========================================
// 2. CATEGORY CLASSIFICATION
// ==========================================

function getCategory(price) {
  let categoryLevel;

  if (!Number.isFinite(price) || price <= 0) {
    return "Unknown";
  } else if (price < 50) {
    categoryLevel = 1;
  } else if (price < 200) {
    categoryLevel = 2;
  } else {
    categoryLevel = 3;
  }

  switch (categoryLevel) {
    case 1:
      return "Budget";
    case 2:
      return "Standard";
    case 3:
      return "Premium";
    default:
      return "Unknown";
  }
}

// ==========================================
// 3. HELPER FUNCTIONS
// ==========================================

const formatCurrency = (amount) =>
  "$" + amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

const calculateTotal = (items) =>
  items.reduce((total, item) => total + item.price, 0);

function calculateWithTax(total, taxRate = 0.18) {
  // taxRate and tax remain local to this function.
  const tax = total * taxRate;
  return total + tax;
}

const applyDiscount = (total, discountRate = 0.10) => {
  return total - total * discountRate;
};

function showToast(message, isError = false) {
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.classList.toggle("error", isError);
  toast.classList.add("show");

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

// ==========================================
// 4. PRODUCT INPUT AND VALIDATION
// ==========================================

function openProductModal() {
  document.getElementById("productForm").reset();
  document.getElementById("formError").textContent = "";
  document.getElementById("productModal").hidden = false;
  document.getElementById("productName").focus();
}

function closeProductModal() {
  document.getElementById("productModal").hidden = true;
}

function addProduct(event) {
  event.preventDefault();

  const nameInput = document.getElementById("productName").value;
  const priceInput = document.getElementById("productPrice").value;

  const name = nameInput.trim();
  const price = Number(priceInput);

  const error = document.getElementById("formError");

  // Reject missing product names.
  if (name === "") {
    error.textContent = "Product name cannot be empty.";
    return;
  }

  // Explicit numeric conversion and price validation.
  if (
    priceInput.trim() === "" ||
    !Number.isFinite(price) ||
    price <= 0
  ) {
    error.textContent = "Enter a valid price greater than zero.";
    return;
  }

  // Check duplicate names without adding a duplicate.
  const duplicate = inventory.some(
    (item) => item.name.toLowerCase() === name.toLowerCase()
  );

  if (duplicate) {
    error.textContent = "A product with this name already exists.";
    return;
  }

  inventory.push({
    id: nextId++,
    name: name,
    price: price
  });

  closeProductModal();
  renderDashboard();
  showToast(`${name} added successfully!`);

  console.log(`${name} added successfully.`);
  displayInventory();
}

// ==========================================
// 5. INVENTORY ROSTER: forEach()
// ==========================================

function displayInventory() {
  console.log("--- Processing Inventory Roster (forEach) ---");

  inventory.forEach((item) => {
    console.log(
      `Item: ${item.name} (${formatCurrency(item.price)}) -> Category: ${getCategory(item.price)}`
    );
  });
}

function renderInventory() {
  const inventoryList = document.getElementById("inventoryList");
  const searchTerm = document
    .getElementById("searchInput")
    .value.trim()
    .toLowerCase();

  const category = document.getElementById("categoryFilter").value;
  const sortOrder = document.getElementById("sortOrder").value;

  // filter() creates a new array and leaves inventory unchanged.
  let visibleItems = inventory.filter((item) => {
    if (!item || !item.name) {
      return false;
    }

    const matchesSearch = item.name.toLowerCase().includes(searchTerm);
    const matchesCategory =
      category === "All" || getCategory(item.price) === category;

    return matchesSearch && matchesCategory;
  });

  // Sort a copy so the original inventory order stays intact.
  visibleItems = [...visibleItems];

  if (sortOrder === "low") {
    visibleItems.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "high") {
    visibleItems.sort((a, b) => b.price - a.price);
  } else if (sortOrder === "name") {
    visibleItems.sort((a, b) => a.name.localeCompare(b.name));
  }

  inventoryList.replaceChildren();

  if (visibleItems.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.colSpan = 4;
    cell.className = "empty-state";
    cell.textContent = "No matching products found.";

    row.appendChild(cell);
    inventoryList.appendChild(row);
  } else {
    visibleItems.forEach((item) => {
      const row = document.createElement("tr");

      const productCell = document.createElement("td");
      const productWrapper = document.createElement("div");
      productWrapper.className = "product-cell";

      const avatar = document.createElement("span");
      avatar.className = "product-avatar";
      avatar.textContent = item.name.charAt(0).toUpperCase();

      const productName = document.createElement("span");
      productName.textContent = item.name;

      productWrapper.append(avatar, productName);
      productCell.appendChild(productWrapper);

      const priceCell = document.createElement("td");
      priceCell.className = "price";
      priceCell.textContent = formatCurrency(item.price);

      const categoryCell = document.createElement("td");
      const badge = document.createElement("span");
      const itemCategory = getCategory(item.price);

      badge.className = `badge badge-${itemCategory.toLowerCase()}`;
      badge.textContent = itemCategory;
      categoryCell.appendChild(badge);

      const actionsCell = document.createElement("td");
      const actions = document.createElement("div");
      actions.className = "row-actions";

      const editButton = document.createElement("button");
      editButton.className = "icon-button";
      editButton.textContent = "✎";
      editButton.title = `Edit ${item.name}`;
      editButton.setAttribute("aria-label", `Edit ${item.name}`);
      editButton.addEventListener("click", () => editProduct(item.id));

      const deleteButton = document.createElement("button");
      deleteButton.className = "icon-button delete-button";
      deleteButton.textContent = "×";
      deleteButton.title = `Delete ${item.name}`;
      deleteButton.setAttribute("aria-label", `Delete ${item.name}`);
      deleteButton.addEventListener("click", () => deleteProduct(item.id));

      actions.append(editButton, deleteButton);
      actionsCell.appendChild(actions);

      row.append(productCell, priceCell, categoryCell, actionsCell);
      inventoryList.appendChild(row);
    });
  }

  document.getElementById("inventoryCount").textContent =
    `Showing ${visibleItems.length} of ${inventory.length} products`;
}

// ==========================================
// 6. EDIT AND DELETE PRODUCTS
// ==========================================

function editProduct(id) {
  const item = inventory.find((product) => product.id === id);

  if (!item) {
    showToast("Product not found.", true);
    return;
  }

  const newNameInput = prompt("Enter updated product name:", item.name);

  if (newNameInput === null) {
    return;
  }

  const newName = newNameInput.trim();

  if (!newName) {
    showToast("Product name cannot be empty.", true);
    return;
  }

  const duplicate = inventory.some(
    (product) =>
      product.id !== id &&
      product.name.toLowerCase() === newName.toLowerCase()
  );

  if (duplicate) {
    showToast("Another product already uses that name.", true);
    return;
  }

  const newPriceInput = prompt("Enter updated product price:", item.price);

  if (newPriceInput === null) {
    return;
  }

  const newPrice = Number(newPriceInput);

  if (
    newPriceInput.trim() === "" ||
    !Number.isFinite(newPrice) ||
    newPrice <= 0
  ) {
    showToast("Enter a valid price greater than zero.", true);
    return;
  }

  item.name = newName;
  item.price = newPrice;

  renderDashboard();
  showToast("Product updated successfully.");
}

function deleteProduct(id) {
  const item = inventory.find((product) => product.id === id);

  if (!item) {
    showToast("Product not found.", true);
    return;
  }

  const confirmed = confirm(`Delete "${item.name}" from inventory?`);

  if (!confirmed) {
    return;
  }

  // filter() keeps every product except the one being deleted.
  inventory = inventory.filter((product) => product.id !== id);

  renderDashboard();
  showToast(`${item.name} deleted successfully.`);
}

// ==========================================
// 7. FINANCIAL ANALYTICS
// ==========================================

function analyzeInventory() {
  let total = 0;

  // Meaningful loop and flow-control demonstration.
  for (let i = 0; i < inventory.length; i++) {
    const item = inventory[i];

    // Skip invalid or missing entries.
    if (!item || !Number.isFinite(item.price) || item.price <= 0) {
      continue;
    }

    total += item.price;

    // Stop after the final inventory entry.
    if (i === inventory.length - 1) {
      break;
    }
  }

  const affordable = inventory.filter((item) => item.price < 200);

  const report = inventory.map(
    (item) => `${item.name.toUpperCase()}: ${formatCurrency(item.price)}`
  );

  const afterTax = calculateWithTax(total, 0.18);
  const afterDiscount = applyDiscount(total, 0.10);

  document.getElementById("analyticsTotal").textContent =
    formatCurrency(total);

  document.getElementById("taxValue").textContent =
    formatCurrency(afterTax);

  document.getElementById("discountValue").textContent =
    formatCurrency(afterDiscount);

  document.getElementById("affordableCount").textContent =
    affordable.length;

  document.getElementById("reportOutput").textContent =
    report.length > 0
      ? report.join("\n")
      : "No products available.";

  console.log("--- Financial Analytics ---");
  console.log("Total Inventory Value: " + formatCurrency(total));
  console.log(
    "Filtered Affordable Items:",
    affordable.map((item) => item.name)
  );
  console.log("Formatted Report List:", report);
  console.log("Value with 18% tax:", formatCurrency(afterTax));
  console.log("Value after 10% discount:", formatCurrency(afterDiscount));

  return { total, affordable, report, afterTax, afterDiscount };
}

// ==========================================
// 8. DASHBOARD STATISTICS
// ==========================================

function renderStats() {
  const total = calculateTotal(inventory);

  const budgetProducts = inventory.filter(
    (item) => getCategory(item.price) === "Budget"
  );

  const premiumProducts = inventory.filter(
    (item) => getCategory(item.price) === "Premium"
  );

  document.getElementById("totalProducts").textContent = inventory.length;
  document.getElementById("totalValue").textContent = formatCurrency(total);
  document.getElementById("budgetCount").textContent = budgetProducts.length;
  document.getElementById("premiumCount").textContent = premiumProducts.length;
}

function renderBreakdown() {
  const breakdown = document.getElementById("categoryBreakdown");

  const categories = [
    { name: "Budget", className: "fill-budget" },
    { name: "Standard", className: "fill-standard" },
    { name: "Premium", className: "fill-premium" }
  ];

  breakdown.replaceChildren();

  categories.forEach((category) => {
    const count = inventory.filter(
      (item) => getCategory(item.price) === category.name
    ).length;

    const percentage =
      inventory.length === 0 ? 0 : (count / inventory.length) * 100;

    const wrapper = document.createElement("div");
    wrapper.className = "breakdown-item";

    const heading = document.createElement("div");
    heading.className = "breakdown-heading";

    const label = document.createElement("span");
    label.textContent = category.name;

    const countLabel = document.createElement("span");
    countLabel.textContent = `${count} products · ${percentage.toFixed(0)}%`;

    heading.append(label, countLabel);

    const track = document.createElement("div");
    track.className = "progress-track";

    const fill = document.createElement("div");
    fill.className = `progress-fill ${category.className}`;
    fill.style.width = `${percentage}%`;

    track.appendChild(fill);
    wrapper.append(heading, track);
    breakdown.appendChild(wrapper);
  });
}

// ==========================================
// 9. RENDER ALL DASHBOARD SECTIONS
// ==========================================

function renderDashboard() {
  renderInventory();
  renderStats();
  renderBreakdown();
  analyzeInventory();
}

// ==========================================
// 10. EVENT LISTENERS
// ==========================================

document.getElementById("addProduct").addEventListener(
  "click",
  openProductModal
);

document.getElementById("closeModal").addEventListener(
  "click",
  closeProductModal
);

document.getElementById("cancelModal").addEventListener(
  "click",
  closeProductModal
);

document.getElementById("productForm").addEventListener(
  "submit",
  addProduct
);

document.getElementById("searchInput").addEventListener(
  "input",
  renderInventory
);

document.getElementById("categoryFilter").addEventListener(
  "change",
  renderInventory
);

document.getElementById("sortOrder").addEventListener(
  "change",
  renderInventory
);

document.getElementById("productModal").addEventListener(
  "click",
  (event) => {
    if (event.target.id === "productModal") {
      closeProductModal();
    }
  }
);

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    !document.getElementById("productModal").hidden
  ) {
    closeProductModal();
  }
});

document.getElementById("copyReport").addEventListener(
  "click",
  async () => {
    const report = document.getElementById("reportOutput").textContent;

    try {
      await navigator.clipboard.writeText(report);
      showToast("Inventory report copied!");
    } catch {
      showToast("Clipboard unavailable. Select and copy the report manually.", true);
    }
  }
);

// ==========================================
// 11. START APPLICATION
// ==========================================

console.log("--- Initializing Inventory System ---");

renderDashboard();
displayInventory();
