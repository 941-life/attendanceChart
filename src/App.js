import AttendanceBarChart from './components/BarChart';
import AttendancePieChart from './components/PieChart';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('https://air.aiia-gcu.com/attendance/rate')
            .then((res) => {
                setData(res.data.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    return (
        <div style={{ padding: '2rem' }}>
            <h1>AIIA attendance dashboard</h1>
            {data.length > 0 && (
                <>
                    <AttendanceBarChart />
                    <AttendancePieChart user={data[0]} />
                </>
            )}
        </div>
    );
}

export default App;
