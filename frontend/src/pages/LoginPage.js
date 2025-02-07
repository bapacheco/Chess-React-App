import { useState, useRef, useEffect } from "react";

import Body from "../components/Body";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputField from "../components/InputField";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from "../contexts/UserProvider";

export default function LoginPage() {
    const [formErrors, setFormErrors] = useState({});
    const usernameField = useRef();
    const passwordField = useRef();

    const { login } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        usernameField.current.focus();
    }, []);

    const onSubmit = async (ev) => {
        ev.preventDefault();
        const username = usernameField.current.value;
        const password = passwordField.current.value;

        const errors = {};
        if (!username) {
            errors.username = 'Username must not be empty.';
        }
        if (!password) {
            errors.password = 'Password must not be empty.';
        }

        setFormErrors(errors);
        if (Object.keys(errors).length > 0) {
            return;
        }

        const result = await login(username, password);

        if (result === 'fail') {
            //flash here;
        }
        else if (result === 'ok') {
            let next = '/';
            //modify next to where user was before login (or not)
            navigate(next);
        }
    }


    return (
        <Body>
            <h1>Login</h1>
            <Form onSubmit={onSubmit}>
            <InputField 
                name="username" label="Email address"
                error={formErrors.username} fieldRef={usernameField}/>
            <InputField
                name="password" label="Password" type="password"
                error={formErrors.password} fieldRef={passwordField} />
            <div className="d-grid">
            <Button variant="primary" size="lg" type="submit">Login</Button>
            </div>
            </Form>
            <hr />
            <p>Don&apos;t have an account? <Link to={"/sign-up"}>Register here</Link> !</p>
        </Body>
    );
}