import { getCustOrders, createOrder} from './repository.js';

document.addEventListener('DOMContentLoaded', function() {
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
            html += `<tr>
                        <td>${order.customer}</td>
                
                        <td>${order.inventoryItem}</td>
                        <td>${order.quantity}</td>
                        <td>${order.status}</td>
                        <td>${order.totalPrice}</td>
                        <td>${order.orderDetails}</td>
                        <td>${new Date(order.date).toLocaleDateString()}</td>
                     </tr>`;
        });

        html += '</tbody></table>';
        ordersPanel.innerHTML = html;
    }

    //Handles creating of orders
    document.getElementById('createOrderForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const customer = document.getElementById('customerName').value;
        const inventoryItem = document.getElementById('inventoryItem').value;
        const quantity = document.getElementById('orderQuantity').value;
        const orderDetails = document.getElementById('orderDetails').value;
        const totalPrice = document.getElementById('totalPrice').value;

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
            inventoryItem, //this is refereced to inventory data...  REQUIRED!
            quantity,
            orderDetails,
            totalPrice:parseFloat(totalPrice)
        }

        // const testOrder = {
        //     customer: "fred jones",
        //     inventoryItem: "6660e44ec2776289efa4b188",
        //     quantity: 10,
        //     status: "Pending",
        //     totalPrice: 9.9
        // };
        // console.log('Test Order Data:', testOrder);

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


    // Make togglePanel function globally accessible
    window.togglePanel = togglePanel;
});