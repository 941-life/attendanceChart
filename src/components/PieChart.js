import { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const AttendancePieChart = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        const apiUrl = `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_API_ATTENDANCE_PATH}`;
        
        axios.get(apiUrl)
            .then(res => {
                setUsers(res.data.data);
                setSelectedUser(res.data.data[0]);
                setError(null);
            })
            .catch(err => {
                setError('데이터를 불러오는데 실패했습니다.');
                console.error('API fetch error:', err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const chartData = selectedUser && {
        labels: ['출석', '지각', '결석'],
        datasets: [
            {
                label: `${selectedUser.name} 출석 분포`,
                data: [
                    selectedUser.attendanceCount,
                    selectedUser.lateCount,
                    selectedUser.absenceCount
                ],
                backgroundColor: [
                    'rgba(76, 175, 80, 0.8)',
                    'rgba(255, 152, 0, 0.8)',
                    'rgba(244, 67, 54, 0.8)'
                ],
                borderColor: [
                    'rgb(76, 175, 80)',
                    'rgb(255, 152, 0)',
                    'rgb(244, 67, 54)'
                ],
                borderWidth: 1,
                hoverOffset: 15,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: {
                        size: 14,
                        weight: 'bold',
                    },
                    padding: 20,
                },
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const total = selectedUser.attendanceCount + selectedUser.lateCount + selectedUser.absenceCount;
                        const percentage = ((context.raw / total) * 100).toFixed(1);
                        return `${context.label}: ${context.raw}회 (${percentage}%)`;
                    },
                },
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: {
                    size: 14,
                    weight: 'bold',
                },
                bodyFont: {
                    size: 13,
                },
            },
        },
        animation: {
            duration: 1000,
            easing: 'easeInOutQuart',
        },
    };

    if (loading) {
        return (
            <div className="chart-container loading">
                <div className="loading-spinner"></div>
                <p>데이터를 불러오는 중...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="chart-container error">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="chart-container">
            <h3 className="chart-title">유저별 출석 분포</h3>
            
            <div className="user-selector">
                {users.map(user => (
                    <button
                        key={user.userId}
                        onClick={() => setSelectedUser(user)}
                        className={`user-button ${selectedUser?.userId === user.userId ? 'active' : ''}`}
                    >
                        {user.name}
                    </button>
                ))}
            </div>

            {selectedUser && (
                <>
                    <div className="chart-wrapper">
                        <Pie data={chartData} options={options} />
                    </div>
                    <div className="user-stats">
                        <div className="stat-item">
                            <span className="stat-label">총 출석일</span>
                            <span className="stat-value">
                                {selectedUser.attendanceCount + selectedUser.lateCount + selectedUser.absenceCount}일
                            </span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">출석률</span>
                            <span className="stat-value">
                                {((selectedUser.attendanceCount / (selectedUser.attendanceCount + selectedUser.lateCount + selectedUser.absenceCount)) * 100).toFixed(1)}%
                            </span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AttendancePieChart;
