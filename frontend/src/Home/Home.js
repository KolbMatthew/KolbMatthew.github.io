import Form from "../Login/Form.js";
import "../styles/style.css"; // Import the global styles
import MRLogo from "../site-images/MRLogo.png"; // Import the logo image

function Home() {
  return (
    <div className="home-container">
      <div className="title">
        <img
          src={MRLogo}
          alt="Mind Racers Logo"
          style={{ width: "600px", marginBottom: "20px" }}
        />
      </div>
      <div className="form-container">
        <Form />
      </div>
    </div>
  );
}

export default Home;