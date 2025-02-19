import React, { useState, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import config from '../utils/config';
import { GlobalContext } from '../context/GlobalState';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { setAuthData } = useContext(GlobalContext);

    const [isLogin, setIsLogin] = useState(true);
    const [samePass, setSamePass] = useState(true);
    const [isPassLong, setIsPassLong] = useState(true);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailTaken, setEmailTaken] = useState(false);
    const [usernameTaken, setUsernameTaken] = useState(false);
    const [registerUsername, setRegisterUsername] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPass, setRegisterPass] = useState("");
    const [registerPassConfirm, setRegisterPassConfirm] = useState("");

    const updateRegisterPass = (e) => {
        setRegisterPass(e.target.value);
        if (e.target.value !== registerPassConfirm) {
            setSamePass(false);
        } else {
            setSamePass(true);
        }
    };

    const updateRegisterPassConfirm = (e) => {
        setRegisterPassConfirm(e.target.value);
        if (registerPass !== e.target.value) {
            setSamePass(false);
        } else {
            setSamePass(true);
        }
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    const createToast = (message, success) => {
        if (!success) {
            toast.error(message, {
                pauseOnHover: false,
                style: {
                    background: "rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(10px)",
                    color: "#fff",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: "10px",
                    fontWeight: "bold",
                },
            });
        } else {
            toast.success(message, {
                pauseOnHover: false,
                style: {
                    background: "rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(10px)",
                    color: "#fff",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: "10px",
                    fontWeight: "bold",
                },
            });
        }
    };

    const conectare = async () => {
        if (email === "" || password === "") {
            createToast("Email sau parolă lipsă!", false);
            return;
        }
        try {
            const response = await fetch(`${config.API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                }),
            });

            if (!response.ok) {
                createToast("A apărut o eroare la conectare!", false);
                return;
            }

            const data = await response.json();
            if (data) {
                setAuthData({ token: data.token, userId: data.user.id });
                createToast("Conectare reușită!", true);
                navigate(`/utilizator/${data.user.id}`);
            }
        } catch (error) {
            createToast("A apărut o eroare la conectare!", false);
        }
    };

    const inregistrare = async () => {
        if (registerPass.length < 8) {
            setIsPassLong(false);
            return;
        } else {
            setIsPassLong(true);
            try {
                const emailResponse = await fetch(`${config.API_URL}/auth/check-email`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: registerEmail
                    }),
                });
                if (!emailResponse.ok) {
                    createToast("A apărut o eroare la înregistrare 1!", false);
                    return;
                }
                const emailData = await emailResponse.json();
                setEmailTaken(emailData.exists);
                if (emailData.exists) {
                    createToast("Există deja un cont cu acest email!", false);
                    return;
                }

                const usernameResponse = await fetch(`${config.API_URL}/auth/check-username`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: registerUsername
                    }),
                });
                if (!usernameResponse.ok) {
                    createToast("A apărut o eroare la înregistrare 3!", false);
                    return;
                }
                const usernameData = await usernameResponse.json();
                setUsernameTaken(usernameData.taken);
                if (usernameData.taken) {
                    createToast("Acest username este deja folosit!", false);
                    return;
                }

                const registerResponse = await fetch(`${config.API_URL}/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: registerEmail,
                        username: registerUsername,
                        password: registerPass
                    }),
                });
                if (!registerResponse.ok) {
                    createToast("A apărut o eroare la înregistrare 5!", false);
                    return;
                }
                const registerData = await registerResponse.json();
                if (registerData) {
                    createToast("Înregistrare reușită!", true);
                    setAuthData({ token: registerData.token, userId: registerData.user.id });
                    navigate(`/utilizator/${registerData.user.id}`);
                }
            } catch (error) {
                createToast("A apărut o eroare la înregistrare 6!", false);
            }
        }
    };

    return (
        <div className="login-form-container">
            {isLogin ? (
                <div className="login-form">
                    <h2>Conectează-te!</h2>
                    <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Parola" onChange={(e) => setPassword(e.target.value)} />
                    <button onClick={conectare}>Conectează-te!</button>
                    <p onClick={toggleForm}>Nu ai cont? Înregistrează-te!</p>
                    <ToastContainer />
                </div>
            ) : (
                <div className="login-form">
                    <h2>Înregistrează-te!</h2>
                    <input type="text" placeholder="Username" onChange={(e) => setRegisterUsername(e.target.value)} />
                    <input type="email" placeholder="Email" onChange={(e) => setRegisterEmail(e.target.value)} />
                    <input type="password" placeholder="Parola" onChange={updateRegisterPass} />
                    <input type="password" placeholder="Confirmă Parola" onChange={updateRegisterPassConfirm} />
                    {!samePass && <p style={{ color: 'red' }}>Parolele nu se potrivesc!</p>}
                    {!isPassLong && <p style={{ color: 'red' }}>Parola trebuie să aibă cel puțin 8 caractere!</p>}
                    <button onClick={inregistrare} disabled={!samePass}>Creează cont!</button>
                    <p onClick={toggleForm}>Deja ai cont? Conectează-te!</p>
                    <ToastContainer />
                </div>
            )}
        </div>
    );
};

export default Login;