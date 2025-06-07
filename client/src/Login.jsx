import React,{useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";

function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    function handleSubmit() {
        const userData = {
            email: email,
            password: password
        };
        fetch("http://localhost:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        })
        .then(response => {
            if (!response.ok) {
                alert("Error logging in");
            }
            if (response.status === 200) {
                //alert("Login successful");
                navigate(`/dashboard/api_key/${email}`);
            } else {
                alert("Error logging in");
            }
            return response.json();
        })
        .catch(error => {
            console.error("Error:", error);
        });
    } 

    return(
        <div className="login-container">
            <h2>Login</h2>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" onClick={handleSubmit}>Login</button>
                <p>Don't have an account? <a href="/">Sign Up</a></p>
            </div>
    );
}

export default Login;