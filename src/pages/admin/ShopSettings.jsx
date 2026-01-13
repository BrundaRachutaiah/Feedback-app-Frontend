import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";

import {
  getMyShops,
  updateShopSettings,
  deleteShop,
} from "../../api/shop.api";

const ShopSettings = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const qrRef = useRef(null);

  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [maxFeedback, setMaxFeedback] = useState(1);
  const [couponEnabled, setCouponEnabled] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [googleReview, setGoogleReview] = useState("");

  /* ----------------------------
     LOAD SHOP SETTINGS
  ---------------------------- */
  useEffect(() => {
    const loadShop = async () => {
      try {
        const res = await getMyShops();
        const found = res.data.find(
          (s) => s.id === shopId || s._id === shopId
        );

        if (!found) {
          setError("Shop not found");
          return;
        }

        setShop(found);
        setMaxFeedback(found.max_feedback_per_device_per_day || 1);
        setCouponEnabled(found.coupon_enabled || false);
        setCouponCode(found.coupon_code || "");
        setCouponMessage(found.coupon_message || "");
        setGoogleReview(found.google_review_url || "");
      } catch (err) {
        console.error(err);
        setError("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    loadShop();
  }, [shopId]);

  /* ----------------------------
     SAVE SETTINGS
  ---------------------------- */
  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await updateShopSettings(shopId, {
        maxFeedbackPerDevicePerDay: maxFeedback,
        coupon_enabled: couponEnabled,
        coupon_code: couponCode,
        coupon_message: couponMessage,
        google_review_url: googleReview,
      });

      setSuccess("Settings saved successfully");
    } catch (err) {
      console.error(err);
      setError("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  /* ----------------------------
     DELETE SHOP
  ---------------------------- */
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "This will permanently delete this shop and all feedback. Continue?"
    );
    if (!confirmDelete) return;

    try {
      await deleteShop(shopId);
      navigate("/admin/shops");
    } catch {
      alert("Failed to delete shop");
    }
  };

  /* ----------------------------
     DOWNLOAD QR CODE
  ---------------------------- */
  const handleDownloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    const pngUrl = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = `${shop?.shop_name || "shop"}-feedback-qr.png`;
    link.click();
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner />
      </div>
    );
  }

  return (
    <Card className="mx-auto" style={{ maxWidth: 600 }}>
      <Card.Body>
        <Card.Title>{shop.shop_name}</Card.Title>
        <Card.Subtitle className="mb-3 text-muted">
          Shop Settings
        </Card.Subtitle>

        {success && <Alert variant="success">{success}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        {/* ================= FEEDBACK ================= */}
        <h6>Feedback</h6>
        <Form.Group className="mb-3">
          <Form.Label>Max feedback per device per day</Form.Label>
          <Form.Control
            type="number"
            min={1}
            max={10}
            value={maxFeedback}
            onChange={(e) => setMaxFeedback(+e.target.value)}
          />
        </Form.Group>

        {/* ================= GOOGLE REVIEW ================= */}
        <h6 className="mt-4">Google Review</h6>
        <Form.Group className="mb-3">
          <Form.Control
            type="url"
            placeholder="https://g.page/..."
            value={googleReview}
            onChange={(e) => setGoogleReview(e.target.value)}
          />
        </Form.Group>

        {/* ================= COUPON ================= */}
        <h6 className="mt-4">Coupon</h6>
        <Form.Check
          type="switch"
          label="Enable coupon after feedback"
          checked={couponEnabled}
          onChange={(e) => setCouponEnabled(e.target.checked)}
        />

        {couponEnabled && (
          <>
            <Form.Group className="mb-2">
              <Form.Label>Coupon Code</Form.Label>
              <Form.Control
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Coupon Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={couponMessage}
                onChange={(e) => setCouponMessage(e.target.value)}
              />
            </Form.Group>
          </>
        )}

        {/* ================= ACTION BUTTONS ================= */}
        <div className="d-flex gap-2 mt-3">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Settings"}
          </Button>

          <Link
            to="/admin/shops"
            className="btn btn-outline-secondary"
          >
            Back
          </Link>
        </div>

        {/* ================= QR CODE ================= */}
        <hr className="my-4" />
        <h6>Feedback QR Code</h6>

        <div className="text-center mb-3" ref={qrRef}>
          <QRCodeCanvas
            value={`${window.location.origin}/feedback/${shopId}`}
            size={160}
            includeMargin
          />
        </div>

        <div className="d-flex justify-content-center">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={handleDownloadQR}
          >
            Download QR Code
          </Button>
        </div>

        {/* ================= DANGER ZONE ================= */}
        <hr className="my-4" />
        <Button
          variant="outline-danger"
          onClick={handleDelete}
        >
          Delete Shop
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ShopSettings;