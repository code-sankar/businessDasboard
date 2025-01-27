import React, { useState, useCallback, FormEvent } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Assuming React Router is used

// Firebase configuration - Use environment variables in production
const firebaseConfig = {
  apiKey: 'AIzaSyDNR_Zys-O8wSgjuV0SY8ZnVN8C5aJVlms',
  authDomain: 'student-b6490.firebaseapp.com',
  projectId: 'student-b6490',
  storageBucket: 'student-b6490.firebasestorage.app',
  messagingSenderId: '452935164490',
  appId: '1:452935164490:web:cf2aa8d781a81375ab3cb3',
  measurementId: 'G-2R34Q7RSBY',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export function SignInView() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate(); // For navigation

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Login successful!');
      navigate('/dashboard'); 
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes('auth/wrong-password')) {
          setError('Incorrect password. Please try again.');
        } else if (err.message.includes('auth/user-not-found')) {
          setError('No user found with this email.');
        } else if (err.message.includes('auth/invalid-email')) {
          setError('Invalid email format.');
        } else {
          setError('An error occurred. Please try again.');
        }
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="login-box">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">
              Email
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="password">
              Password
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </label>
          </div>
          <button
            type="submit"
            className="submit-button"
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="signup-link">
          Don’t have an account? <a href="/signup">Sign up</a>
        </p>
      </div>

      <style>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f4f4f4;
        }

        .login-box {
          width: 100%;
          max-width: 400px;
          padding: 20px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        h2 {
          margin-bottom: 20px;
          font-size: 24px;
          font-weight: bold;
          color: #333;
        }

        .error-message {
          color: red;
          margin-bottom: 10px;
          font-size: 14px;
        }

        .form-group {
          margin-bottom: 15px;
          text-align: left;
        }

        label {
          display: block;
          font-size: 14px;
          margin-bottom: 5px;
          color: #555;
        }

        input {
          width: 100%;
          padding: 10px;
          font-size: 14px;
          border: 1px solid #ccc;
          border-radius: 5px;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
          outline: none;
          transition: border-color 0.2s ease-in-out;
        }

        input:focus {
          border-color: #007bff;
        }

        .submit-button {
          width: 100%;
          padding: 10px;
          background-color: #007bff;
          color: white;
          font-size: 16px;
          font-weight: bold;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.2s ease-in-out;
        }

        .submit-button:hover {
          background-color: #0056b3;
        }

        .signup-link {
          margin-top: 15px;
          font-size: 14px;
          color: #555;
        }

        .signup-link a {
          color: #007bff;
          text-decoration: none;
        }

        .signup-link a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
