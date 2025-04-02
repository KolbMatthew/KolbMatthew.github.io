import Form from "../Login/Form.js";
import "../styles/style.css"; // Import the global styles

function Home() {
  return (
    <div className="home-container">
      <div className="title">
        <h1>Mind Racers</h1>
      </div>
      <div className="form-container">
        <Form />
      </div>
    </div>
  );
}

export default Home;