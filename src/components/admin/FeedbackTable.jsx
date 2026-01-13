const FeedbackTable = ({ feedbacks }) => {
  if (!feedbacks.length) return <p>No feedback yet</p>;

  return (
    <table border="1" cellPadding="8">
      <thead>
        <tr>
          <th>Rating</th>
          <th>Comment</th>
          <th>Parameters</th>
        </tr>
      </thead>
      <tbody>
        {feedbacks.map((fb) => (
          <tr key={fb.id}>
            <td>{fb.rating}</td>
            <td>{fb.comment}</td>
            <td>
              {Object.entries(fb.parameters || {}).map(([k, v]) => (
                <div key={k}>
                  {k}: {v}
                </div>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FeedbackTable;
