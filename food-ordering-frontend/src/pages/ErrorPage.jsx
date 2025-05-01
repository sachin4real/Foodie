// === src/pages/ErrorPage.jsx ===
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/'); // Redirect to home page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-lg mx-auto">
        <h2 className="text-4xl font-bold text-red-500 mb-4">Oops! Something Went Wrong.</h2>
        <p className="text-lg text-gray-700 mb-6">We couldn't find the page you're looking for.</p>
        <button
          onClick={handleGoHome}
          className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-lg font-semibold"
        >
          Go to Home Page
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
