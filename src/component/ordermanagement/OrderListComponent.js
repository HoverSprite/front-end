import React, { useState } from 'react';

// Sample data
const orders = [
    { id: 1, cropType: 'Wheat', area: '50.00', status: 'PENDING', location: 'Field A' },
    { id: 2, cropType: 'Corn', area: '30.00', status: 'CONFIRMED', location: 'Field B' },
    { id: 3, cropType: 'Soybean', area: '25.00', status: 'IN_PROGRESS', location: 'Field C' },
    { id: 4, cropType: 'Rice', area: '40.00', status: 'COMPLETED', location: 'Field D' },
    { id: 5, cropType: 'Barley', area: '10.00', status: 'CANCELLED', location: 'Field E' },
    { id: 6, cropType: 'Oats', area: '15.00', status: 'ASSIGNED', location: 'Field F' },
    { id: 7, cropType: 'Rye', area: '35.00', status: 'SPRAY_COMPLETED', location: 'Field G' },
    { id: 8, cropType: 'Millet', area: '20.00', status: 'ASSIGN_PROCESSING', location: 'Field H' },
];

const statusColors = {
    PENDING: '#FFC107',
    CANCELLED: '#DC3545',
    CONFIRMED: '#17A2B8',
    ASSIGN_PROCESSING: '#6C757D',
    ASSIGNED: '#28A745',
    IN_PROGRESS: '#FFC107',
    SPRAY_COMPLETED: '#007BFF',
    COMPLETED: '#343A40',
};

const cropTypeColors = {
    Wheat: '#F0E5CF',
    Corn: '#F7E3A1',
    Soybean: '#D9F0A5',
    Rice: '#F5F5F5',
    Barley: '#F3D5AB',
    Oats: '#E2C8B9',
    Rye: '#D4A6A8',
    Millet: '#F5E0B7',
};

function OrderListComponent() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [sortOption, setSortOption] = useState('date');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
    };

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.cropType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === 'All' || order.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const sortedOrders = filteredOrders.sort((a, b) => {
        if (sortOption === 'date') {
            return new Date(b.date) - new Date(a.date);
        } else if (sortOption === 'area') {
            return b.area - a.area;
        } else {
            return 0;
        }
    });

    const paginatedOrders = sortedOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div style={styles.container}>
            <div style={styles.toolsContainer}>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearch}
                    style={styles.searchInput}
                />
                <select
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    style={styles.filterSelect}
                >
                    <option value="All">All Statuses</option>
                    {Object.keys(statusColors).map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
                <select
                    value={sortOption}
                    onChange={handleSortChange}
                    style={styles.sortSelect}
                >
                    <option value="date">Sort by Date</option>
                    <option value="area">Sort by Area</option>
                </select>
            </div>
            {paginatedOrders.map(order => (
                <div key={order.id} style={styles.card}>
                    <div style={styles.header}>
                        <span style={{ ...styles.cropType, color: cropTypeColors[order.cropType] }}>
                            {order.cropType}
                        </span>
                        <span style={{ ...styles.status, color: statusColors[order.status] }}>
                            {order.status}
                        </span>
                    </div>
                    <h3 style={styles.title}>{`Order #${order.id}`}</h3>
                    <p style={styles.details}>{`Area: ${order.area} hectares`}</p>
                    <p style={styles.details}>{`Location: ${order.location}`}</p>
                </div>
            ))}
            <div style={styles.pagination}>
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>{`Page ${currentPage}`}</span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage * itemsPerPage >= sortedOrders.length}>
                    Next
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        margin: '0',
        padding: '0',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px',
        boxSizing: 'border-box',
        backgroundColor: '#f8f8f8',
    },
    toolsContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: '16px',
    },
    searchInput: {
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '16px',
        flex: '1',
        marginRight: '8px',
    },
    filterSelect: {
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '16px',
        marginRight: '8px',
        maxWidth: '110px'
    },
    sortSelect: {
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '16px',
        maxWidth: '110px'
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        width: '100%',
        padding: '16px',
        marginBottom: '16px',
        boxSizing: 'border-box',
        position: 'relative',
    },
    header: {
        position: 'absolute',
        top: '16px',
        right: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    cropType: {
        fontSize: '12px',
        fontWeight: '600',
        marginBottom: '4px',
    },
    status: {
        fontSize: '12px',
        color: 'white',
    },
    title: {
        margin: '0',
        fontSize: '18px',
        fontWeight: '600',
        color: '#333',
    },
    details: {
        margin: '8px 0',
        fontSize: '14px',
        color: '#666',
    },
    pagination: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        maxWidth: '800px',
        justifyContent: 'center',
        marginTop: '16px',
    },
};

export default OrderListComponent;

