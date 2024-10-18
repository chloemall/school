import React, { useState } from "react";
import { Input, Button, Alert } from 'antd';
import { UserOutlined, LockOutlined, IdcardOutlined } from '@ant-design/icons';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import "./Login.css"; // Import CSS file for styles

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [admissionNo, setAdmissionNo] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [admissionError, setAdmissionError] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isSignUp, setIsSignUp] = useState(false); // State to toggle between login and sign-up
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value) ? "" : "Invalid email format");
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(value ? "" : "Password cannot be empty");
  };

  const handleAdmissionNoChange = (e) => {
    const value = e.target.value;
    setAdmissionNo(value);
    setAdmissionError(value ? "" : "Admission number cannot be empty");
  };

  const handleSignUp = async () => {
    if (!email || !password || !admissionNo) {
      window.alert("Please fill in all fields");
      return;
    }

    const studentQuery = query(
      collection(db, "students"),
      where("admissionNo", "==", admissionNo)
    );
    const studentSnapshot = await getDocs(studentQuery);

    if (studentSnapshot.empty) {
      window.alert("Sign up failed: Admission number does not exist");
      return;
    }

    const studentDoc = studentSnapshot.docs[0];
    const studentData = studentDoc.data();

    if (studentData.uid) {
      window.alert("Sign up failed: Admission number already associated with an account");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        console.log("User signed up:", user);

        // Update the student's document with the new user's UID and email
        await updateDoc(doc(db, "students", studentDoc.id), {
          uid: user.uid,
          email: user.email,
        });

        updateProfile(auth.currentUser, {
          displayName: email,
        });

        sendEmailVerification(auth.currentUser)
          .then(() => {
            console.log("Verification email sent");
          })
          .catch((error) => {
            console.error("Error sending verification email:", error);
          });

        window.alert("Sign up successful.");
        navigate("/dash");
      })
      .catch((error) => {
        console.log("Sign up error:", error.message);
        if (error.code === "auth/email-already-in-use") {
          window.alert("Sign up failed: Email already exists");
        } else {
          window.alert("Sign up failed: " + error.message);
        }
      });
  };

  const handleLogin = () => {
    if (!validateEmail(email) || !password) {
      window.alert("Please enter valid email and password");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User logged in:", user);

        if (!user.emailVerified) {
          sendEmailVerification(auth.currentUser)
            .then(() => {
              console.log("Verification email sent");
            })
            .catch((error) => {
              console.error("Error sending verification email:", error);
            });
        }

        setUser(user);
        window.alert("Login successful");
        navigate("/dash");
      })
      .catch((error) => {
        console.log("Login error:", error.message);
        window.alert("Login failed Wrong Email or Password" );

        setLoginAttempts(loginAttempts + 1);

        if (loginAttempts >= 3) {
          // Block the user after 4 incorrect attempts
          window.alert("Too many incorrect login attempts. Your account is blocked.");
          // You may want to implement further actions, such as blocking the account in your database.
        }
      });
  };

  const handleForgotPassword = () => {
    if (!validateEmail(email)) {
      window.alert("Please enter a valid email address");
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        window.alert("Password reset email sent. Check your inbox.");
      })
      .catch((error) => {
        console.error("Error sending password reset email:", error);
        window.alert("Failed to send password reset email.");
      });
  };

  return (
    <div className="login">
      <div className="login-container">
        <div className="logo-container">
          <img src="https://firebasestorage.googleapis.com/v0/b/college-1db7d.appspot.com/o/WhatsApp%20Image%202024-09-29%20at%2012.49.12%20PM.jpeg?alt=media&token=f7d14585-7ff9-48fe-98c3-3c4e76b453fe" alt="Logo" className="logo" />
        </div>
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Email"
          onChange={handleEmailChange}
          value={email}
          className="login-input"
        />
        {emailError && <Alert message={emailError} type="error" showIcon />}
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          className="login-input"
        />
        {passwordError && <Alert message={passwordError} type="error" showIcon />}
        {isSignUp && (
          <Input
            prefix={<IdcardOutlined className="site-form-item-icon" />}
            placeholder="Admission Number"
            onChange={handleAdmissionNoChange}
            value={admissionNo}
            className="login-input"
          />
        )}
        {admissionError && <Alert message={admissionError} type="error" showIcon />}
        {isSignUp ? (
          <>
            <Button type="primary" className="signup-button" onClick={handleSignUp}>
              Sign Up
            </Button>
            <Button type="link" className="switch-button" onClick={() => setIsSignUp(false)}>
              Already have an account? Login
            </Button>
          </>
        ) : (
          <>
            <Button type="primary" className="login-button" onClick={handleLogin}>
              Login
            </Button>
            <Button type="link" className="switch-button" onClick={() => setIsSignUp(true)}>
              Don't have an account? Sign Up
            </Button>
            <Button type="link" className="forgot-password" onClick={handleForgotPassword}>
              Forgot Password?
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
