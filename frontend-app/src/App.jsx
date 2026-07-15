import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Signup from './Signup';
import Login from './Login';
import ForgotPassword from './ForgotPassword'; 
import Legal from './Legal'; 
import ReportItem from './ReportItem';
import Dashboard from './Dashboard';
import ItemDetails from './ItemDetails';
import Browse from './Browse';
import About from './About';
import MatchReview from './MatchReview';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        <Route 
          path="/TermsOfService" 
          element={
            <Legal 
              title="Terms of Service" 
              content={
                <div className="space-y-4">
                  <p>Welcome to LostFoundPK. By using our platform, you agree to the following terms:</p>
                  <h3 className="font-bold text-xl">1. Acceptance of Terms</h3>
                  <p>By accessing this website, you agree to be bound by these terms and all applicable laws.</p>
                  <h3 className="font-bold text-xl">2. User Responsibilities</h3>
                  <p>You are responsible for the accuracy of any lost or found items you report. Misuse of the platform is strictly prohibited.</p>
                  <h3 className="font-bold text-xl">3. Safety Disclaimer</h3>
                  <p>LostFoundPK facilitates connections. Please exercise caution when meeting others for item recovery.</p>
                </div>
              } 
            />
          } 
        />

        <Route 
          path="/Legal" 
          element={
            <Legal 
              title="Privacy Policy" 
              content={
                <div className="space-y-4">
                  <p>Your privacy is important to us. This policy outlines how we handle your data:</p>
                  <h3 className="font-bold text-xl">1. Data Collection</h3>
                  <p>We collect necessary information such as your name, email, and location to help in the recovery process.</p>
                  <h3 className="font-bold text-xl">2. Data Usage</h3>
                  <p>Your information is used exclusively for matching reports and facilitating community recovery.</p>
                  <h3 className="font-bold text-xl">3. Security</h3>
                  <p>We implement industry-standard encryption to ensure your personal information remains secure.</p>
                </div>
              } 
            />
          } 
        />

        {/* Yahan path ko lowercase '/report' kar diya hai */}
        <Route path="/report" element={<ReportItem />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/item/:id" element={<ItemDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/match/:id" element={<MatchReview />} />
      </Routes>
    </Router>
  );
}

export default App;