const SuccessScreen = ({ link }) => {
  return (
    <div>
      <h3>Thank you for your feedback!</h3>
      {link && (
        <a href={link} target="_blank" rel="noreferrer">
          Leave Google Review
        </a>
      )}
    </div>
  );
};

export default SuccessScreen;
