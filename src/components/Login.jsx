import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

export default function Login({ onLoginSuccess }) {
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Visual SQL Builder</h2>
        <p>Sign in with Google to securely manage and query your datasets.</p>
        <div className="google-btn-wrapper">
          <GoogleLogin
            onSuccess={onLoginSuccess}
            onError={() => {
              console.error('Login Failed');
              alert('Google Login Failed. Please try again.');
            }}
            useOneTap
            shape="rectangular"
            theme="filled_blue"
            size="large"
          />
        </div>
      </div>
    </div>
  );
}
