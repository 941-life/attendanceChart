import AttendanceBarChart from './components/BarChart';
import AttendancePieChart from './components/PieChart';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        const apiUrl = `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_API_ATTENDANCE_PATH}`;
        
        axios.get(apiUrl)
            .then((res) => {
                setData(res.data.data);
                setError(null);
            })
            .catch((err) => {
                setError('데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>AIIA 출석 현황 대시보드</h1>
                <p className="subtitle">AIIA 멤버들의 출석 현황을 한눈에 확인하세요</p>
            </header>

            {loading && (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>데이터를 불러오는 중...</p>
                </div>
            )}

            {error && (
                <div className="error-container">
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()}>새로고침</button>
                </div>
            )}

            {!loading && !error && data.length > 0 && (
                <main className="dashboard-container">
                    <AttendanceBarChart />
                    <AttendancePieChart user={data[0]} />
                </main>
            )}
        </div>
    );
}

export default App;
