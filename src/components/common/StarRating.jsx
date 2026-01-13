import { Button } from "react-bootstrap";

const StarRating = ({ value, onChange, readonly = false }) => {
  return (
    <div className="d-flex justify-content-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Button
          key={star}
          variant="link"
          className="p-0 mx-1"
          onClick={() => !readonly && onChange(star)}
          disabled={readonly}
        >
          <span
            style={{
              fontSize: "2rem",
              color: star <= value ? "#ffc107" : "#e4e5e9",
            }}
          >
            ★
          </span>
        </Button>
      ))}
    </div>
  );
};

export default StarRating;