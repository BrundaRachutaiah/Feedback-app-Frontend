import { useState } from "react";
import { createShop } from "../../api/shop.api";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Card,
  Alert,
  Row,
  Col,
} from "react-bootstrap";

const CreateShop = () => {
  // Existing states (UNCHANGED)
  const [name, setName] = useState("");
  const [parameters, setParameters] = useState([""]);
  const [googleLink, setGoogleLink] = useState("");

  // ✅ NEW (safe default = 1)
  const [maxFeedbackPerDay, setMaxFeedbackPerDay] = useState(1);

  // Coupon states (UNCHANGED)
  const [couponEnabled, setCouponEnabled] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleAddParam = () => {
    if (parameters.length < 3) {
      setParameters([...parameters, ""]);
    }
  };

  const handleParamChange = (index, value) => {
    const updated = [...parameters];
    updated[index] = value;
    setParameters(updated);
  };

  const handleRemoveParam = (index) => {
    const updated = [...parameters];
    updated.splice(index, 1);
    setParameters(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createShop({
        // 🔒 KEEP EXISTING PAYLOAD AS-IS
        name,
        parameters: parameters.filter((p) => p.trim() !== ""),
        google_review_link: googleLink,

        // ✅ NEW FIELD (NON-BREAKING)
        max_feedback_per_device_per_day: maxFeedbackPerDay,

        // Coupon fields (UNCHANGED)
        coupon_enabled: couponEnabled,
        coupon_code: couponEnabled ? couponCode : null,
        coupon_message: couponEnabled ? couponMessage : null,
      });

      navigate("/admin");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create shop"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card>
            <Card.Body>
              <Card.Title className="mb-4">
                Create Shop
              </Card.Title>

              {error && (
                <Alert variant="danger">{error}</Alert>
              )}

              <Form onSubmit={handleSubmit}>
                {/* Shop Name */}
                <Form.Group className="mb-3">
                  <Form.Label>Shop Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    required
                  />
                </Form.Group>

                {/* Feedback Parameters */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    Feedback Parameters (Max 3)
                  </Form.Label>

                  {parameters.map((param, index) => (
                    <div
                      key={index}
                      className="d-flex mb-2"
                    >
                      <Form.Control
                        type="text"
                        value={param}
                        onChange={(e) =>
                          handleParamChange(
                            index,
                            e.target.value
                          )
                        }
                      />
                      {parameters.length > 1 && (
                        <Button
                          variant="outline-danger"
                          className="ms-2"
                          onClick={() =>
                            handleRemoveParam(index)
                          }
                        >
                          ✕
                        </Button>
                      )}
                    </div>
                  ))}

                  {parameters.length < 3 && (
                    <Button
                      variant="outline-secondary"
                      onClick={handleAddParam}
                      className="mt-2"
                    >
                      Add Parameter
                    </Button>
                  )}
                </Form.Group>

                {/* Google Review Link */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    Google Review Link
                  </Form.Label>
                  <Form.Control
                    type="url"
                    value={googleLink}
                    onChange={(e) =>
                      setGoogleLink(e.target.value)
                    }
                  />
                </Form.Group>

                {/* ✅ NEW: Feedback Limit */}
                <hr />
                <h5>Feedback Settings</h5>

                <Form.Group className="mb-3">
                  <Form.Label>
                    Max feedback per device per day
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min={1}
                    max={10}
                    value={maxFeedbackPerDay}
                    onChange={(e) =>
                      setMaxFeedbackPerDay(
                        Number(e.target.value)
                      )
                    }
                  />
                  <Form.Text className="text-muted">
                    Default is 1. Increase only if needed.
                  </Form.Text>
                </Form.Group>

                {/* Coupon Settings (UNCHANGED) */}
                <hr />
                <h5>Coupon Settings</h5>

                <Form.Check
                  type="switch"
                  label="Enable Coupon After Feedback (⭐ 4+)"
                  checked={couponEnabled}
                  onChange={(e) =>
                    setCouponEnabled(e.target.checked)
                  }
                  className="mb-3"
                />

                {couponEnabled && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Coupon Code
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={couponCode}
                        onChange={(e) =>
                          setCouponCode(e.target.value)
                        }
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>
                        Coupon Message
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={couponMessage}
                        onChange={(e) =>
                          setCouponMessage(e.target.value)
                        }
                      />
                    </Form.Group>
                  </>
                )}

                <Button
                  type="submit"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Save Shop"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateShop;