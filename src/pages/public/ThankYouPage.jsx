import { useLocation, Link } from "react-router-dom";
import { Container, Card, Button, Row, Col } from "react-bootstrap";

const ThankYouPage = () => {
  const { state } = useLocation();

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="text-center">
            <Card.Body className="p-5">
              <div className="mb-4">
                <i
                  className="bi bi-check-circle-fill text-success"
                  style={{ fontSize: "4rem" }}
                ></i>
              </div>

              <Card.Title as="h2" className="mb-3">
                Thank You for Your Feedback!
              </Card.Title>

              <Card.Text className="mb-4">
                We appreciate your time and input. Your feedback helps us improve our services.
              </Card.Text>

              {/* ⭐ Google Review */}
              {state?.showGoogleReview && state?.googleReviewLink && (
                <div className="mb-4">
                  <p className="mb-2">
                    Loved your experience? 🌟
                  </p>
                  <Button
                    variant="outline-primary"
                    href={state.googleReviewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Leave a Google Review
                  </Button>
                </div>
              )}

              {/* 🎁 Coupon Reveal */}
              {state?.showCoupon && state?.couponCode && (
                <div className="mt-4">
                  <hr />
                  <p className="fw-bold mb-2">🎁 Your Reward</p>
                  <Card className="p-3 mb-3">
                    <h5 className="mb-1">{state.couponCode}</h5>
                    <small>Use this coupon on your next purchase</small>
                  </Card>
                </div>
              )}

              {/* Low rating fallback */}
              {!state?.showGoogleReview && (
                <p className="mt-3 text-muted">
                  Thanks for your honest feedback 💙  
                  We’ll work on improving your experience.
                </p>
              )}

              <Link to="/">
                <Button variant="secondary" className="mt-3">
                  Back to Home
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ThankYouPage;