import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const logIn = async (event) => {
        event.preventDefault();
        console.log(email, password);
        try {
            await signInWithEmailAndPassword(getAuth(), email, password);
            navigate('/articles');
        } catch (error) {
            setError('Error logging in');
        }
    }
    
    return (
        <div>
            <h1>Login</h1>
            {{error} && <p>{error}</p>}
            <form id="login-form" onSubmit={logIn}>
                <label>
                    Email:
                    <input 
                        type="text"
                        placeholder="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </label>
                <label>
                    Password:
                    <input 
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </label>
                <button type="submit">Login</button>
                <Link to="/create-account">Don't have an account? Create Account!</Link>
            </form>
        </div>
    );
}
export default LoginPage;