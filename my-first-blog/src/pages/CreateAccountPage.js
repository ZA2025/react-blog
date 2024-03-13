import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const CreateAccountPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

   const cretaeAccount = async (event) => {
        event.preventDefault();
        if (password !== passwordConfirm) {
            setError('Passwords do not match');
            return;
        }
        try {
            const response = await createUserWithEmailAndPassword(getAuth(), email, password);
            console.log(response);
            navigate('/articles');
        } catch (error) {
            setError('Error creating account');
        }
    }
    return (
        <div>
            <h1>Create Account</h1>
            {{error} && <p className="error">{error}</p>}
            <form id="login-form" onSubmit={cretaeAccount}>
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
                <label>
                    Confirm Password:
                    <input 
                        type="passwordConfirm"
                        placeholder="confirm password"
                        value={passwordConfirm}
                        onChange={e => setPasswordConfirm(e.target.value)}
                    />
                </label>
                <button type="submit">Create Account</button>
                <Link to="/login">login if already registered</Link>
            </form>
        </div>
    );
}
export default CreateAccountPage;
