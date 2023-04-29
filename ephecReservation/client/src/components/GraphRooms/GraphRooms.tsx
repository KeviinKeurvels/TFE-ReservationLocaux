import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

import './GraphRooms.css'

type Props = {
  data: { day: string, count: number }[];
};

const GraphRooms = ({ data }: Props) => {
  const chartContainer = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartContainer && chartContainer.current) {
      const days = data.map(d => d.day);
      const counts = data.map(d => d.count);

      chartRef.current = new Chart(chartContainer.current, {
        type: 'line',
        data: {
          labels: days,
          datasets: [{
            label: 'Réservation(s)',
            data: counts,
            borderColor: 'orange',
            fill: false,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Date',
              },
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Nombre de réservation',
              },
              beginAtZero: true,
              ticks: {
                stepSize: 1,
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartRef && chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data]);

  useEffect(() => {
    const updateChart = () => {
      if (chartRef && chartRef.current) {
        chartRef.current.update();
      }
    };

    let animationFrameId: number;
    const startAnimation = () => {
      animationFrameId = requestAnimationFrame(function animate() {
        updateChart();
        animationFrameId = requestAnimationFrame(animate);
      });
    };

    const stopAnimation = () => {
      cancelAnimationFrame(animationFrameId);
    };

    startAnimation();

    return () => {
      stopAnimation();
    };
  }, []);

  return (
    <div id="graph_content">
      <canvas id="graph" ref={chartContainer} />
    </div>
  );
};

export default GraphRooms;
