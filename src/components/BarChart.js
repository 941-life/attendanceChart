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

    useEffect(() => {
        axios.get('https://air.aiia-gcu.com/attendance/rate')
            .then(res => setUsers(res.data.data))
            .catch(err => console.error('API fetch error:', err));
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
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: { stepSize: 10 },
            },
        },
    };

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <h3 style={{ textAlign: 'center' }}>멤버별 출석률</h3>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default AttendanceBarChart;
