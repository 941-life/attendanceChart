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

    useEffect(() => {
        axios.get('https://air.aiia-gcu.com/attendance/rate')
            .then(res => {
                setUsers(res.data.data);
                setSelectedUser(res.data.data[0]);
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
                backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        plugins: {
            legend: { position: 'bottom' },
        },
    };

    return (
        <div style={{ maxWidth: '500px', margin: '2rem auto' }}>
            <h3 style={{ textAlign: 'center' }}>유저별 출석 분포</h3>

            {/* 유저 선택 버튼 */}
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                {users.map(user => (
                    <button
                        key={user.userId}
                        onClick={() => setSelectedUser(user)}
                        style={{
                            margin: '0.25rem',
                            padding: '0.5rem 1rem',
                            backgroundColor: selectedUser?.userId === user.userId ? '#4caf50' : '#eee',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    >
                        {user.name}
                    </button>
                ))}
            </div>

            {/* Pie 차트 */}
            {selectedUser && <Pie data={chartData} options={options} />}
        </div>
    );
};

export default AttendancePieChart;
