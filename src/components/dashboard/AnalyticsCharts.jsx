import { Card, Row, Col } from "react-bootstrap";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useMemo } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

const AnalyticsCharts = ({ analytics }) => {
  if (!analytics) return null;

  /* ---------- Memoized data (prevents re-render noise) ---------- */
  const trendData = useMemo(
    () => ({
      labels: analytics.ratingTrend?.map((d) => d.date) || [],
      datasets: [
        {
          label: "Average Rating",
          data:
            analytics.ratingTrend?.map(
              (d) => Number(d.avgRating)
            ) || [],
          tension: 0.4,
        },
      ],
    }),
    [analytics]
  );

  const distributionData = useMemo(
    () => ({
      labels: ["⭐1", "⭐2", "⭐3", "⭐4", "⭐5"],
      datasets: [
        {
          label: "Ratings Count",
          data: Object.values(
            analytics.ratingDistribution || {}
          ),
        },
      ],
    }),
    [analytics]
  );

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    responsive: true,
  };

  return (
    <>
      {/* 📈 Rating Trend */}
      <Row className="mb-3 g-0" key="rating-trend">
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title className="small text-muted mb-2">
                Rating Trend
              </Card.Title>
              <div style={{ height: 220 }}>
                <Line
                  data={trendData}
                  options={chartOptions}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 📊 Rating Distribution */}
      <Row className="g-0" key="rating-distribution">
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title className="small text-muted mb-2">
                Rating Distribution
              </Card.Title>
              <div style={{ height: 220 }}>
                <Bar
                  data={distributionData}
                  options={chartOptions}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AnalyticsCharts;