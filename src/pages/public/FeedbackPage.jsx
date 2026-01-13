import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { submitFeedback } from "../../api/feedback.api";
import { getDeviceId } from "../../utils/device"; // 🛡️ NEW
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";

const FeedbackPage = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [paramScores, setParamScores] = useState({});
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // (Later this can come from backend config)
  const feedbackParams = ["Service", "Quality", "Cleanliness"];

  const handleSubmit = async () => {
    if (!rating) {
      setError("Please give a rating");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // ✅ Payload WITH device_id
      const payload = {
  rating,
  service: paramScores.Service || null,
  quality: paramScores.Quality || null,
  cleanliness: paramScores.Cleanliness || null,
  comment,
  deviceId: getDeviceId(), // camelCase
};

      // Axios response → data is inside response.data
      const response = await submitFeedback(shopId, payload);
      const data = response?.data;

      navigate("/thank-you", {
        state: {
          showGoogleReview: data.showGoogleReview,
          googleReviewLink: data.googleReviewUrl,

          showCoupon: data.showCoupon,
          couponCode: data.couponCode,
          couponMessage: data.couponMessage,
        },
      });
    } catch (err) {
  console.error("FULL SUBMIT ERROR >>>", err);
  console.error("RESPONSE >>>", err.response);
  console.error("RESPONSE DATA >>>", err.response?.data);

  setError(
    err.response?.data?.message ||
    "Failed to submit feedback"
  );
} finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Card>
        <Card.Body>
          <Card.Title className="text-center mb-4">
            Rate Your Experience
          </Card.Title>

          {error && (
            <Alert variant="danger">{error}</Alert>
          )}

          <Form>
            {/* ⭐ Rating */}
            <div className="text-center mb-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <Button
                  key={s}
                  variant="link"
                  onClick={() => setRating(s)}
                  style={{
                    fontSize: "2rem",
                    color:
                      s <= rating ? "#ffc107" : "#ccc",
                  }}
                >
                  ★
                </Button>
              ))}
            </div>

            {/* Parameters */}
            {feedbackParams.map((p) => (
              <Form.Group key={p} className="mb-3">
                <Form.Label>{p}</Form.Label>
                <Form.Select
                  onChange={(e) =>
                    setParamScores({
                      ...paramScores,
                      [p]: e.target.value,
                    })
                  }
                >
                  <option value="">Select</option>
                  <option value="excellent">
                    Excellent
                  </option>
                  <option value="good">Good</option>
                  <option value="average">
                    Average
                  </option>
                  <option value="poor">Poor</option>
                </Form.Select>
              </Form.Group>
            ))}

            {/* Comment */}
            <Form.Group className="mb-3">
              <Form.Label>Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={comment}
                onChange={(e) =>
                  setComment(e.target.value)
                }
              />
            </Form.Group>

            {/* Submit */}
            <Button
              className="w-100"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <Spinner size="sm" />
              ) : (
                "Submit Feedback"
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FeedbackPage;