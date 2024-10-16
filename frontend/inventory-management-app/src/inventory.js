
import { getInventoryItems, createInventoryItem, updateInventoryItem,
    getItemByName, getInventoryItemByID, deleteInventoryItem} from './repository.js';

document.addEventListener('DOMContentLoaded', function () {
    function togglePanel(panelId) {
        console.log("Attempting to toggle panel:", panelId);
        const panels = document.querySelectorAll('.panel-container');
        panels.forEach(panel => {
            if (panel.id === panelId) {
                panel.style.display = (panel.style.display === 'none' || panel.style.display === '') ? 'block' : 'none';
                if (panelId === 'viewInventoryPanel') {
                    fetchInventory();
                }

            } else {
                panel.style.display = 'none';
            }
        });
    }

    // Fetch and display inventory items
    async function fetchInventory() {
        try {
            const inventoryData = await getInventoryItems();
            displayInventory(inventoryData);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        }
    }

    function displayInventory(inventory) {
        const inventoryPanel = document.getElementById('viewInventoryPanel');
        let html = '<table class="table table-striped"><thead><tr><th>Name</th><th>Quantity</th><th>Location</th><th>Description</th><th>Price</th></tr></thead><tbody>';
    
        inventory.forEach(item => {
            html += `<tr data-item-id="${item._id}" class="inventory-item">
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>${item.location}</td>
                        <td>${item.description}</td>
                        <td>${item.pricePerItem}</td>
                     </tr>`;
        });
    
        html += '</tbody></table>';
        inventoryPanel.innerHTML = html;
    
        // Add click event listener to each inventory item row
        document.querySelectorAll('.inventory-item').forEach(row => {
            row.addEventListener('click', () => {
                const itemId = row.getAttribute('data-item-id');
                console.log("Clicked item ID:", itemId);
                openEditPanel(itemId);
            });
        });
    }
    

    // Handles creation of inventory items
    document.getElementById('createInventoryForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const name = document.getElementById('itemName').value;
        const quantity = document.getElementById('itemQuantity').value;
        const location = document.getElementById('itemLocation').value;
        const description = document.getElementById('itemDescription').value;
        const price = document.getElementById('itemPrice').value;

        // Validation to check if price or quantity is valid
        if (!/^(\d+(\.\d{1,2})?)$/.test(price)) {
            alert("Please enter a valid price (e.g., 10.99 or 2.00).");
            return;
        }
        if (quantity < 0 || !Number.isInteger(+quantity)) {
            alert("Please enter a valid quantity.");
            return;
        }

        const newItem = {
            name,
            quantity,
            location,
            description,
            pricePerItem:parseFloat(price)
        }

        // New Item sent to server
        createInventoryItem(newItem) 
            .then(response => {
                alert('Item Created Successfully');
                fetchInventory(); //refresh
                document.getElementById('createInventoryForm').reset(); //clear form'

            }) .catch(error => {
                alert('Error Creating Item: ' + error.message);
            })
        
    });

    //handles searches for certain items by name
    document.getElementById('searchInventoryForm').addEventListener('submit', async function (e) {
        e.preventDefault();  
    
    const itemName = document.getElementById('searchName').value;  

    try {
        const items = await getItemByName(itemName); 
        if (items && items.length) {
            displaySearchResults(items); 
        } else {
            alert('No items found with that name.');
            //NOTE: catch triggered when no item found, 
            //else needs to be triggered in that scenario
        }
    } catch (error) {
        console.error('Error fetching item:', error);
        //alert('An error occurred while fetching the item.');
        alert('No item found.');
    }
    });

    function displaySearchResults(items) {
        const searchResultsDiv = document.getElementById('searchResults');
        let html = '<table class="table table-striped"><thead><tr><th>Name</th><th>Quantity</th><th>Location</th><th>Description</th><th>Price</th></tr></thead><tbody>';
    
        items.forEach(item => {
            html += `<tr data-item-id="${item._id}" class="inventory-item">
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>${item.location}</td>
                        <td>${item.description}</td>
                        <td>${item.pricePerItem}</td>
                     </tr>`;
        });
    
        html += '</tbody></table>';
        searchResultsDiv.innerHTML = html;
    
        // Add click event listener to each inventory item row
        document.querySelectorAll('.inventory-item').forEach(row => {
            row.addEventListener('click', () => {
                const itemId = row.getAttribute('data-item-id');
                console.log("Clicked item ID:", itemId); 
                openEditPanel(itemId);
            });
        });
    }
    
    async function openEditPanel(itemId) {
        try {
            console.log("Opening edit panel for item ID:", itemId);
            togglePanel('editInventoryPanel');
    
            const itemData = await getInventoryItemByID(itemId);
            console.log("Item data received:", itemData);
            populateEditPanel(itemData);
        } catch (error) {
            console.error('Error fetching inventory item:', error);
        }
    }
    

    function populateEditPanel(item) {
        document.getElementById('editItemName').value = item.name;
        document.getElementById('editItemQuantity').value = item.quantity;
        document.getElementById('editItemLocation').value = item.location;
        document.getElementById('editItemDescription').value = item.description;
        document.getElementById('editItemPrice').value = item.pricePerItem;
        document.getElementById('editInventoryForm').setAttribute('data-item-id', item._id);
    }
    
    //handles updating for the edit panel
    document.getElementById('editInventoryForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const itemId = e.target.getAttribute('data-item-id');
        const updatedItem = {
            name: document.getElementById('editItemName').value,
            quantity: document.getElementById('editItemQuantity').value,
            location: document.getElementById('editItemLocation').value,
            description: document.getElementById('editItemDescription').value,
            pricePerItem: document.getElementById('editItemPrice').value
        };

        try {
            await updateInventoryItem(itemId, updatedItem)
            alert('Item updated successfully');
            togglePanel('viewInventoryPanel');
            fetchInventory();
        } catch (error) {
            console.error('Error updating inventory item:', error);
        }
    });

    //handles deletion in the edit panel
    document.getElementById('deleteItemButton').addEventListener('click', async function () {
        const itemId = document.getElementById('editInventoryForm').getAttribute('data-item-id');

        if (confirm('Are you sure you want to delete this item?')) {
            try {
                await deleteInventoryItem(itemId);
                alert('Item deleted successfully');
                togglePanel('viewInventoryPanel');
                fetchInventory();
            } catch (error) {
                console.error('Error deleting inventory item:', error);
            }
        }
    });
   
    window.togglePanel = togglePanel;
});