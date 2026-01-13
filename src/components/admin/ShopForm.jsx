import Input from "../common/Input";
import Button from "../common/Button";

const ShopForm = ({
  // Shop basic details
  name,
  setName,

  parameters,
  setParameters,

  googleLink,
  setGoogleLink,

  // 🎁 Coupon settings (NEW)
  couponEnabled,
  setCouponEnabled,
  couponCode,
  setCouponCode,
  couponMessage,
  setCouponMessage,

  onSubmit,
}) => {
  const addParam = () => {
    if (parameters.length < 3) {
      setParameters([...parameters, ""]);
    }
  };

  const updateParam = (index, value) => {
    const updated = [...parameters];
    updated[index] = value;
    setParameters(updated);
  };

  return (
    <>
      {/* Shop Name */}
      <Input
        placeholder="Shop Name"
        value={name}
        onChange={setName}
      />

      {/* Feedback Parameters */}
      <h4 style={{ marginTop: "16px" }}>
        Feedback Parameters (max 3)
      </h4>

      {parameters.map((p, i) => (
        <Input
          key={i}
          placeholder={`Parameter ${i + 1}`}
          value={p}
          onChange={(val) => updateParam(i, val)}
        />
      ))}

      {parameters.length < 3 && (
        <Button onClick={addParam}>
          Add Parameter
        </Button>
      )}

      {/* Google Review Link */}
      <Input
        placeholder="Google Review Link"
        value={googleLink}
        onChange={setGoogleLink}
      />

      {/* 🎁 Coupon Settings */}
      <hr style={{ margin: "24px 0" }} />

      <h4>Coupon Settings</h4>

      <label
        style={{
          display: "block",
          marginBottom: "12px",
          cursor: "pointer",
        }}
      >
        <input
          type="checkbox"
          checked={couponEnabled}
          onChange={(e) =>
            setCouponEnabled(e.target.checked)
          }
          style={{ marginRight: "8px" }}
        />
        Enable Coupon After Feedback (⭐ 4+)
      </label>

      {couponEnabled && (
        <>
          <Input
            placeholder="Coupon Code (e.g. THANKYOU10)"
            value={couponCode}
            onChange={setCouponCode}
          />

          <Input
            placeholder="Coupon Message (optional)"
            value={couponMessage}
            onChange={setCouponMessage}
          />
        </>
      )}

      {/* Submit */}
      <Button onClick={onSubmit}>
        Save Shop
      </Button>
    </>
  );
};

export default ShopForm;