import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AttendanceBarChart = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        const apiUrl = `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_API_ATTENDANCE_PATH}`;
        
        axios.get(apiUrl)
            .then(res => {
                setUsers(res.data.data);
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

    const usersWithCalculatedRate = users.map(user => {
        const { attendanceCount, lateCount, absenceCount } = user;
        const total = attendanceCount + lateCount + absenceCount;
        const calculatedRate = total === 0 ? 0 : (attendanceCount / total) * 100;

        return {
            ...user,
            calculatedRate: Math.round(calculatedRate),
        };
    });

    const chartData = {
        labels: usersWithCalculatedRate.map(user => user.name),
        datasets: [
            {
                label: '출석률 (%)',
                data: usersWithCalculatedRate.map(user => user.calculatedRate),
                backgroundColor: usersWithCalculatedRate.map(user => {
                    const rate = user.calculatedRate;
                    if (rate >= 80) return 'rgba(75, 192, 192, 0.8)';
                    if (rate >= 60) return 'rgba(255, 159, 64, 0.8)';
                    return 'rgba(255, 99, 132, 0.8)';
                }),
                borderColor: usersWithCalculatedRate.map(user => {
                    const rate = user.calculatedRate;
                    if (rate >= 80) return 'rgb(75, 192, 192)';
                    if (rate >= 60) return 'rgb(255, 159, 64)';
                    return 'rgb(255, 99, 132)';
                }),
                borderWidth: 1,
                borderRadius: 5,
                hoverBackgroundColor: usersWithCalculatedRate.map(user => {
                    const rate = user.calculatedRate;
                    if (rate >= 80) return 'rgba(75, 192, 192, 1)';
                    if (rate >= 60) return 'rgba(255, 159, 64, 1)';
                    return 'rgba(255, 99, 132, 1)';
                }),
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: 14,
                        weight: 'bold',
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const user = usersWithCalculatedRate[context.dataIndex];
                        return [
                            `출석률: ${context.raw}%`,
                            `출석: ${user.attendanceCount}회`,
                            `지각: ${user.lateCount}회`,
                            `결석: ${user.absenceCount}회`,
                        ];
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
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    stepSize: 10,
                    font: {
                        size: 12,
                    },
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                },
            },
            x: {
                ticks: {
                    font: {
                        size: 12,
                    },
                },
                grid: {
                    display: false,
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
            <h3 className="chart-title">멤버별 출석률</h3>
            <div className="chart-wrapper">
                <Bar data={chartData} options={options} />
            </div>
            <div className="chart-legend">
                <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: 'rgba(75, 192, 192, 0.8)' }}></span>
                    <span>80% 이상</span>
                </div>
                <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: 'rgba(255, 159, 64, 0.8)' }}></span>
                    <span>60-79%</span>
                </div>
                <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: 'rgba(255, 99, 132, 0.8)' }}></span>
                    <span>60% 미만</span>
                </div>
            </div>
        </div>
    );
};

export default AttendanceBarChart;
