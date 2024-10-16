import { getCustOrders, createOrder, getInventoryItems, updateCustOrder, getOrderById} from './repository.js';

document.addEventListener('DOMContentLoaded', async function() {
    function togglePanel(panelId) {
        const panels = document.querySelectorAll('.panel-container');
        panels.forEach(panel => {
            if (panel.id === panelId) {
                panel.style.display = (panel.style.display === 'none' || panel.style.display === '') ? 'block' : 'none';
                if (panelId === 'viewOrdersPanel') {
                    fetchOrders();

                }
            } else {
                panel.style.display = 'none';
            }
        });
    }


    //Fetch and display all customer orders
    async function fetchOrders() {
        try {
            const ordersData = await getCustOrders(); 
            displayOrders(ordersData);
        } catch (error) {
            console.error('Error fetching customer orders:', error);
        }
    }

    function displayOrders(orders) {
        const ordersPanel = document.getElementById('viewOrdersPanel');
        let html = '<table class="table table-striped"><thead><tr><th>Name</th><th>Inventory Item</th><th>Quantity</th><th>Status</th><th>Total Price</th><th>Details</th><th>Order Date</th></tr></thead><tbody>';
    
        orders.forEach(order => {
            html += `<tr data-order-id="${order._id}" class="order-item">
                        <td>${order.customer}</td>
                        <td>${order.inventoryItem?.name || order.inventoryItem}</td>
                        <td>${order.quantity}</td>
                        <td>${order.status}</td>
                        <td>${order.totalPrice}</td>
                        <td>${order.orderDetails || 'None'}</td>
                        <td>${new Date(order.date).toLocaleDateString()}</td>
                     </tr>`;
        });
    
        html += '</tbody></table>';
        ordersPanel.innerHTML = html;
    
        document.querySelectorAll('.order-item').forEach(row => {
            row.addEventListener('click', () => {
                const orderId = row.getAttribute('data-order-id');
                console.log("Clicked order ID:", orderId);// for debug remove later
                openOrderEditPanel(orderId);
            });
        });
    }


    try {
        const inventoryItems = await getInventoryItems();
        populateInventoryDropdown(inventoryItems);
    } catch (error) {
        console.error('Error fetching inventory items for dropdown:', error);
    }

    function populateInventoryDropdown(items) {
        const inventorySelect = document.getElementById('inventoryItemSelect');
        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item._id;
            option.textContent = item.name;
            inventorySelect.appendChild(option);
        });
    }

    //Handles creating of orders
    document.getElementById('createOrderForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const customer = document.getElementById('customerName').value;
        const inventoryItem = document.getElementById('inventoryItemSelect').value;
        const quantity = document.getElementById('orderQuantity').value;
        const orderDetails = document.getElementById('orderDetails').value;
        //const status = document.getElementById('orderStatus').value;
        const totalPrice = document.getElementById('totalPrice').value;

        if (!inventoryItem) {
            alert('Please select an inventory item.');
            return;
        }
        
        // Validation to check if price or quantity is valid
        if (!/^(\d+(\.\d{1,2})?)$/.test(totalPrice)) {
            alert("Please enter a valid price (e.g., 10.99 or 2.00).");
            return;
        }
        if (quantity < 0 || !Number.isInteger(+quantity)) {
            alert("Please enter a valid quantity.");
            return;
        }
        const newOrder = {
            customer,
            inventoryItem,
            quantity,
            //status,
            totalPrice
        };
        // New Item sent to server
        createOrder(newOrder) 
            .then(response => {
                alert('Order Created Successfully');
                fetchOrders();
                document.getElementById('createOrderForm').reset();

            }) .catch(error => {
                alert('Error Creating Item: ' + error.message);
            })
        
    });


    async function openOrderEditPanel(orderId) {  
        try {
            const orderData = await getOrderById(orderId);
            populateOrderEditPanel(orderData);
            togglePanel('editOrderPanel');
        } catch (error) {
            console.error('Error fetching order:', error);
        }
    }
    
    function populateOrderEditPanel(order) {
        document.getElementById('editCustomerName').value = order.customer;
        document.getElementById('editOrderQuantity').value = order.quantity;
        document.getElementById('editOrderStatus').value = order.status;
        document.getElementById('editOrderDetails').value = order.orderDetails || '';
        document.getElementById('editOrderForm').setAttribute('data-order-id', order._id);
    }

    document.getElementById('editOrderForm').addEventListener('submit', async function (e) {
        e.preventDefault();
    
        const orderId = e.target.getAttribute('data-order-id');
        const updatedOrder = {
            customer: document.getElementById('editCustomerName').value,
            quantity: document.getElementById('editOrderQuantity').value,
            status: document.getElementById('editOrderStatus').value,
            orderDetails: document.getElementById('editOrderDetails').value
        };
    
        try {
            await updateCustOrder(orderId, updatedOrder);
            alert('Order updated successfully');
            togglePanel('viewOrdersPanel');
            fetchOrders();
        } catch (error) {
            console.error('Error updating order:', error);
        }
    });
    
    document.getElementById('deleteOrderButton').addEventListener('click', async function () {
        const orderId = document.getElementById('editOrderForm').getAttribute('data-order-id');
    
        if (confirm('Are you sure you want to delete this order?')) {
            try {
                await deleteOrder(orderId);
                alert('Order deleted successfully');
                togglePanel('viewOrdersPanel');
                fetchOrders();
            } catch (error) {
                console.error('Error deleting order:', error);
            }
        }
    });

    window.togglePanel = togglePanel;
});