import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Card,
  Alert,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";

import {
  getMyShops,
  updateShopSettings,
} from "../../api/shop.api";

const EditShop = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Shop fields
  const [name, setName] = useState("");
  const [googleLink, setGoogleLink] = useState("");
  const [parameters, setParameters] = useState([]);

  const [maxFeedbackPerDay, setMaxFeedbackPerDay] = useState(1);

  const [couponEnabled, setCouponEnabled] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");

  /* ----------------------------
     LOAD SHOP DATA
  ---------------------------- */
  useEffect(() => {
    const loadShop = async () => {
      try {
        const res = await getMyShops();
        const shop = res.data.find((s) => s.id === shopId);

        if (!shop) {
          setError("Shop not found");
          return;
        }

        setName(shop.shop_name || "");
        setGoogleLink(shop.google_review_url || "");

        setMaxFeedbackPerDay(
          shop.max_feedback_per_device_per_day || 1
        );

        setCouponEnabled(!!shop.coupon_enabled);
        setCouponCode(shop.coupon_code || "");
        setCouponMessage(shop.coupon_message || "");

        // Parameters (if stored as array)
        setParameters(shop.parameters || []);
      } catch (err) {
        setError("Failed to load shop");
      } finally {
        setLoading(false);
      }
    };

    loadShop();
  }, [shopId]);

  /* ----------------------------
     PARAMETER HANDLERS
  ---------------------------- */
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

  /* ----------------------------
     SAVE CHANGES
  ---------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (couponEnabled && !couponCode.trim()) {
      setError("Coupon code is required when coupon is enabled");
      return;
    }

    setSaving(true);

    try {
      await updateShopSettings(shopId, {
        shop_name: name,
        google_review_url: googleLink,

        max_feedback_per_device_per_day: maxFeedbackPerDay,

        coupon_enabled: couponEnabled,
        coupon_code: couponEnabled ? couponCode : null,
        coupon_message: couponEnabled ? couponMessage : null,

        parameters: parameters.filter((p) => p.trim() !== ""),
      });

      navigate("/admin");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update shop"
      );
    } finally {
      setSaving(false);
    }
  };

  /* ----------------------------
     UI
  ---------------------------- */
  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card>
            <Card.Body>
              <Card.Title className="mb-4">
                Edit Shop
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
                      <Button
                        variant="outline-danger"
                        className="ms-2"
                        onClick={() =>
                          handleRemoveParam(index)
                        }
                      >
                        ✕
                      </Button>
                    </div>
                  ))}

                  {parameters.length < 3 && (
                    <Button
                      variant="outline-secondary"
                      onClick={handleAddParam}
                    >
                      Add Parameter
                    </Button>
                  )}
                </Form.Group>

                {/* Google Review */}
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

                {/* Feedback Limit */}
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
                </Form.Group>

                {/* Coupon Settings */}
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
                          setCouponMessage(
                            e.target.value
                          )
                        }
                      />
                    </Form.Group>
                  </>
                )}

                <Button
                  type="submit"
                  className="w-100"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Update Shop"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditShop;