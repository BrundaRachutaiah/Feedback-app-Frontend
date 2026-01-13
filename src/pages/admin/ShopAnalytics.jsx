import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import { getCouponStats } from "../../api/analytics.api";
import AnalyticsCharts from "../../components/dashboard/AnalyticsCharts";

const ShopAnalytics = () => {
  const { shopId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const res = await getCouponStats(shopId);
        setAnalytics(res.data);
      } catch {
        setError("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [shopId]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col>
          <h4>Shop Analytics</h4>
          <Link
            to={`/admin/shop/${shopId}/dashboard`}
            className="btn btn-sm btn-outline-secondary mt-2"
          >
            ← Back to Dashboard
          </Link>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {analytics && <AnalyticsCharts analytics={analytics} />}
    </Container>
  );
};

export default ShopAnalytics;