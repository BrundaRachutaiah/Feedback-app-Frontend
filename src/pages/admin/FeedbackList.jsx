import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getShopFeedback,
  exportFeedbackCSV, // ✅ ADD
} from "../../api/feedback.api";

import {
  Container,
  Card,
  Row,
  Col,
  Badge,
  Spinner,
  Alert,
  Pagination,
  Button, // ✅ ADD
} from "react-bootstrap";

const FeedbackList = () => {
  const { shopId } = useParams();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [exporting, setExporting] = useState(false); // ✅ ADD

  const itemsPerPage = 10;

  /* ----------------------------
     LOAD FEEDBACK
  ---------------------------- */
  useEffect(() => {
    const loadFeedback = async () => {
      try {
        const res = await getShopFeedback(shopId);
        setFeedbacks(res.data || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Failed to load feedback"
        );
      } finally {
        setLoading(false);
      }
    };

    loadFeedback();
  }, [shopId]);

  /* ----------------------------
     CSV EXPORT HANDLER
  ---------------------------- */
  const handleExportCSV = async () => {
    try {
      setExporting(true);

      const res = await exportFeedbackCSV(shopId);

      const url = window.URL.createObjectURL(
        new Blob([res.data])
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `feedback-${shopId}.csv`
      );

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to export CSV");
    } finally {
      setExporting(false);
    }
  };

  /* ----------------------------
     PAGINATION
  ---------------------------- */
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = feedbacks.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(
    feedbacks.length / itemsPerPage
  );

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* HEADER */}
      <Row className="mb-4 align-items-center">
        <Col>
          <h2>Feedback List</h2>
        </Col>

        <Col className="text-end">
          <Button
            variant="outline-success"
            className="me-2"
            onClick={handleExportCSV}
            disabled={exporting || feedbacks.length === 0}
          >
            {exporting ? "Exporting..." : "Export CSV"}
          </Button>

          <Link
  to={`/admin/shop/${shopId}/dashboard`}
  className="btn btn-outline-secondary"
>
  Back to Dashboard
</Link>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {feedbacks.length === 0 ? (
        <Alert variant="info">No feedback yet.</Alert>
      ) : (
        <>
          <Row>
            {currentItems.map((fb, index) => (
              <Col
                key={`${fb.created_at}-${index}`}
                md={6}
                lg={4}
                className="mb-4"
              >
                <Card>
                  <Card.Body>
                    <div className="d-flex justify-content-between mb-2">
                      <Card.Title className="mb-0">
                        Feedback
                      </Card.Title>

                      <Badge
                        bg={
                          fb.rating >= 4
                            ? "success"
                            : fb.rating >= 3
                            ? "warning"
                            : "danger"
                        }
                      >
                        {fb.rating}/5
                      </Badge>
                    </div>

                    {fb.comment && (
                      <Card.Text>
                        <strong>Comment:</strong>{" "}
                        {fb.comment}
                      </Card.Text>
                    )}

                    {fb.param_scores &&
                      Object.keys(fb.param_scores).length >
                        0 && (
                        <div>
                          <strong>Parameters:</strong>
                          <ul className="mb-2">
                            {Object.entries(
                              fb.param_scores
                            ).map(([k, v]) => (
                              <li key={k}>
                                {k}: {v}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    <small className="text-muted">
                      {new Date(
                        fb.created_at
                      ).toLocaleString()}
                    </small>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {totalPages > 1 && (
            <Pagination className="justify-content-center">
              {[...Array(totalPages)].map((_, i) => (
                <Pagination.Item
                  key={i}
                  active={i + 1 === currentPage}
                  onClick={() =>
                    setCurrentPage(i + 1)
                  }
                >
                  {i + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          )}
        </>
      )}
    </Container>
  );
};

export default FeedbackList;