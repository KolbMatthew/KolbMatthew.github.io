import "../../styles/Option.css";
import "../../styles/global.css";

function Option({ text, onClick }) {
  return (
    <button onClick={onClick} className="option">
      {text}
    </button>
  );
}

export default Option;
