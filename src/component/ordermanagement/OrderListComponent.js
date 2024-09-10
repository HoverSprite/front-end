import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWheatAlt, faSeedling, faBowlRice, faLeaf } from '@fortawesome/free-solid-svg-icons';

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

const sprayStatusSteps = ['PENDING', 'CONFIRMED', 'ASSIGNED', 'IN_PROGRESS', 'SPRAY_COMPLETED', 'COMPLETED'];

const Milestone = ({ steps, currentStep }) => (
    <div style={milestoneStyles.container}>
        {steps.map((step, index) => (
            <div key={index} style={milestoneStyles.stepContainer}>
                <div
                    style={{
                        ...milestoneStyles.circle,
                        backgroundColor: currentStep >= index ? '#28a745' : '#d3d3d3',
                    }}
                >
                    {currentStep > index ? '✔️' : index + 1}
                </div>
                {index < steps.length - 1 && (
                    <div
                        style={{
                            ...milestoneStyles.line,
                            backgroundColor: currentStep > index ? '#28a745' : '#d3d3d3',
                        }}
                    />
                )}
                <span style={milestoneStyles.stepLabel}>{step}</span>
            </div>
        ))}
    </div>
);

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

    const getSprayStatusProgress = (status) => {
        return sprayStatusSteps.indexOf(status);
    };

    const getCropIcon = (cropType) => {
        switch (cropType.toLowerCase()) {
            case 'wheat':
            case 'barley':
            case 'rye':
                return faWheatAlt;
            case 'corn':
            case 'oats':
            case 'millet':
                return faSeedling;
            case 'rice':
                return faBowlRice;
            case 'soybean':
            default:
                return faLeaf;
        }
    };

    return (
        <div style={styles.container}>
            {/* ... (keep the existing toolsContainer) */}
            {paginatedOrders.map(order => (
                <div key={order.id} style={styles.card}>
                    <div style={styles.cardHeader}>
                        <FontAwesomeIcon icon={getCropIcon(order.cropType)} style={styles.cropIcon} />
                        <span style={{ ...styles.cropType, backgroundColor: cropTypeColors[order.cropType] }}>
                            {order.cropType}
                        </span>
                    </div>
                    <h3 style={styles.title}>{`Order #${order.id}`}</h3>
                    <p style={styles.details}>{`Area: ${order.area} hectares`}</p>
                    <p style={styles.details}>{`Location: ${order.location}`}</p>
                    <p style={styles.details}>{`Date: ${new Date().toLocaleDateString()}`}</p>
                    <Milestone steps={sprayStatusSteps} currentStep={getSprayStatusProgress(order.status)} />
                </div>
            ))}
            <div style={styles.pagination}>
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} style={styles.pageButton}>
                    Previous
                </button>
                {Array.from({ length: Math.ceil(sortedOrders.length / itemsPerPage) }, (_, i) => (
                    <button 
                        key={i} 
                        onClick={() => handlePageChange(i + 1)} 
                        style={{
                            ...styles.pageButton,
                            backgroundColor: currentPage === i + 1 ? '#007BFF' : 'white',
                            color: currentPage === i + 1 ? 'white' : '#007BFF'
                        }}
                    >
                        {i + 1}
                    </button>
                ))}
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage * itemsPerPage >= sortedOrders.length} style={styles.pageButton}>
                    Next
                </button>
            </div>
        </div>
    );
}

const milestoneStyles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '16px 0',
        position: 'relative',
    },
    stepContainer: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        flex: 1,
        position: 'relative',
        zIndex: 1,
    },
    circle: {
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        color: '#fff',
        fontSize: '16px',
    },
    line: {
        position: 'absolute',
        top: '25%',
        left: '53%',
        width: '100%',
        height: '2px',
        // transform: 'translateY(-50%)',
        zIndex: -1,
    },
    stepLabel: {
        marginTop: '8px',
        fontSize: '12px',
        textAlign: 'center',
    },
};

const styles = {
    container: {
        margin: '0',
        padding: '20px',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f9f9f9',
    },
    toolsContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '80%',
        marginBottom: '20px',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '100%',
        marginBottom: '20px',
    },
    cardHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cropIcon: {
        fontSize: '24px',
    },
    cropType: {
        fontSize: '14px',
        fontWeight: 'bold',
        padding: '5px 10px',
        borderRadius: '5px',
        color: '#333',
    },
    title: {
        fontSize: '18px',
        margin: '10px 0',
    },
    details: {
        fontSize: '14px',
        color: '#555',
    },
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        margin: '20px 0',
    },
    pageButton: {
        margin: '0 5px',
        padding: '8px 16px',
        border: 'none',
        backgroundColor: 'white',
        color: '#007BFF',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};
export default OrderListComponent;
