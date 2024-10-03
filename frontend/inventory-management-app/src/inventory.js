
import { getInventoryItems, createInventoryItem, getItemByName} from './repository.js';

document.addEventListener('DOMContentLoaded', function () {
    function togglePanel(panelId) {
        const panels = document.querySelectorAll('.panel-container');
        panels.forEach(panel => {
            if (panel.id === panelId) {
                panel.style.display = (panel.style.display === 'none' || panel.style.display === '') ? 'block' : 'none';
                if (panelId === 'viewInventoryPanel') {
                    fetchInventory(); // Fetch inventory data when viewing the inventory panel
                }
            } else {
                panel.style.display = 'none';
            }
        });
    }

    // Fetch and display inventory items
    async function fetchInventory() {
        try {
            const inventoryData = await getInventoryItems(); // Use the repository function to get inventory items
            displayInventory(inventoryData);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        }
    }

    function displayInventory(inventory) {
        const inventoryPanel = document.getElementById('viewInventoryPanel');
        let html = '<table class="table table-striped"><thead><tr><th>Name</th><th>Quantity</th><th>Location</th><th>Description</th><th>Price</th></tr></thead><tbody>';

        inventory.forEach(item => {
            html += `<tr>
                        <td>${item.name}</td>
                
                        <td>${item.quantity}</td>
                        <td>${item.location}</td>
                        <td>${item.description}</td>
                        <td>${item.pricePerItem}</td>
                     </tr>`;
        });

        html += '</tbody></table>';
        inventoryPanel.innerHTML = html;
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
            html += `<tr>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>${item.location}</td>
                        <td>${item.description}</td>
                        <td>${item.pricePerItem}</td>
                     </tr>`;
        });
    
        html += '</tbody></table>';
        searchResultsDiv.innerHTML = html;  // Show results in the searchResults div
    }

   
    window.togglePanel = togglePanel;
});