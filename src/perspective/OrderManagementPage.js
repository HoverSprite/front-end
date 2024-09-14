// src/perspective/OrderManagementPage.js

import React from 'react';
import OrderListManagement from '../component/ordermanagement/OrderListComponent';

function OrderManagementPage() {
    return (
        <div style={{ margin: '0', padding: '0', width: '100%', height: '100%' }}>
            <OrderListManagement />
        </div>
    );
}

export default OrderManagementPage;
