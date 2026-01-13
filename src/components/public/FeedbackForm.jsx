import StarRating from "../common/StarRating";
import Button from "../common/Button";

const FeedbackForm = ({
  rating,
  setRating,
  parameters,
  setParameters,
  paramList,
  comment,
  setComment,
  onSubmit,
}) => {
  return (
    <>
      <StarRating value={rating} onChange={setRating} />

      {paramList.map((p) => (
        <select
          key={p}
          onChange={(e) =>
            setParameters({ ...parameters, [p]: e.target.value })
          }
        >
          <option value="">Select {p}</option>
          <option value="good">Good</option>
          <option value="average">Average</option>
          <option value="bad">Bad</option>
        </select>
      ))}

      <textarea
        placeholder="Optional comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <Button type="button" onClick={onSubmit}>Submit</Button>
    </>
  );
};

export default FeedbackForm;
