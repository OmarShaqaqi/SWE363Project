import React, { useEffect, useRef, useState } from 'react';

const CurvedLineChart = ({ data }) => {
    const chartRef = useRef(null);
    const [chart, setChart] = useState(null);

    // Load the chart libraries and prepare the chart
    useEffect(() => {
        window.google.charts.load('current', {'packages':['corechart']});
        window.google.charts.setOnLoadCallback(() => {
            if (chartRef.current) {
                const newChart = new window.google.visualization.LineChart(chartRef.current);
                setChart(newChart);
                drawChart(newChart);
            }
        });
    }, [data]); // Empty array means this effect runs once on mount

    // Draw or redraw the chart
    const drawChart = (chartInstance) => {
        const dataTable = new window.google.visualization.DataTable();
        dataTable.addColumn('string', 'Day');
        dataTable.addColumn('number', 'Habits');

        dataTable.addRows(data);

        const options = {
            title: 'Habits Achievement Over Time',
            width: '100%',
            height: '80%',
            colors: ['#0000ff'],
            legend: { position: 'bottom' }
        };

        chartInstance.draw(dataTable, options);
    };

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (chart) {
                drawChart(chart);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [chart]); // Depend on chart instance

    return (
        <div className="chart" ref={chartRef} style={{ width: '100%', height: '100%' }}></div>
    );
}

export default CurvedLineChart;
