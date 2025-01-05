// File: /public/js/admin.js

document.addEventListener("DOMContentLoaded", function () {
  const itemTableBody = document.getElementById("item-table-body");
  const addItemForm = document.getElementById("add-item-form");

  // Fetch items and populate table
  async function fetchItems() {
    const response = await fetch("/api/items");
    const items = await response.json();

    itemTableBody.innerHTML = "";
    items.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${item.name}</td>
          <td>${item.price}</td>
          <td>${item.category}</td>
          <td>
            <button onclick="editItem('${item._id}')">Edit</button>
            <button onclick="deleteItem('${item._id}')">Delete</button>
          </td>
        `;
      itemTableBody.appendChild(row);
    });
  }

  fetchItems();

  // Add new item
  addItemForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const formData = new FormData(addItemForm);

    const response = await fetch("/api/items", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      fetchItems(); // Refresh the item list
    } else {
      alert("Error adding item");
    }
  });

  // Delete item
  window.deleteItem = async function (id) {
    if (confirm("Are you sure you want to delete this item?")) {
      await fetch(`/api/items/${id}`, { method: "DELETE" });
      fetchItems();
    }
  };

  // Edit item (You can expand this with an edit form similar to add)
  window.editItem = async function (id) {
    const newName = prompt("Enter new name for the item:");
    if (newName) {
      await fetch(`/api/items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
      fetchItems();
    }
  };
});
