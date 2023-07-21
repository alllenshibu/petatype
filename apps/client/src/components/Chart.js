import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);



const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Performance',
        },
    },
};

const Chart = ({ speedTimeGraph, accuracyTimeGraph }) => {
    const data = {
        labels: speedTimeGraph.map((item) => item[0]),
        datasets: [
            {
                label: 'Speed',
                data: speedTimeGraph.map((item) => item[1]),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Accuracy',
                data: accuracyTimeGraph.map((item) => item[1]),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    return <Line options={options} data={data} />;
};

export default Chart;
