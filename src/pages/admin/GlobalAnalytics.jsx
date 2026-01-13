import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
} from "react-bootstrap";
import { getGlobalAnalytics } from "../../api/analytics.api";
import AnalyticsCharts from "../../components/dashboard/AnalyticsCharts";

const GlobalAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const res = await getGlobalAnalytics();
        setData(res.data);
      } catch {
        setError("Failed to load global analytics");
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h4>Global Analytics</h4>
          <small className="text-muted">
            Overall performance across all shops
          </small>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {data && (
        <>
          <Row className="mb-4">
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Total Feedback</Card.Title>
                  <h3>{data.totalFeedback}</h3>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Average Rating</Card.Title>
                  <h3>⭐ {data.avgRating}</h3>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* OPTIONAL: enable when backend returns distribution & trend */}
          {data.ratingDistribution && data.ratingTrend && (
            <AnalyticsCharts analytics={data} />
          )}
        </>
      )}
    </Container>
  );
};

export default GlobalAnalytics;