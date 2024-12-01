import { useState, useRef, useEffect } from "react";

import Body from "../components/Body";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import InputField from "../components/InputField";
import React from "react";


export default function SignupPage() {

    const [formErrors, setFormErrors] = useState({});
    const usernameField = useRef();
    const emailField = useRef();
    const passwordField = useRef();
    const passwordField2 = useRef();

    useEffect(() => {
        usernameField.current.focus();
    }, []);

    const onSubmit = (ev) => {
        ev.preventDefault();

        const username = usernameField.current.value;
        const email = emailField.current.value;
        const password = passwordField.current.value;
        const password2 = passwordField2.current.value;

        console.log(`You entered ${username}, ${email} : ${password}, ${password2}`);

        const errors = {};
        if (!username) {
            errors.username = 'Username must not be empty.';
        }
        if (!email) {
            errors.email = 'Email must not be empty';
        }
        if (!password || !password2) {
            errors.password = 'Password must not be empty'
        }
        else if (password !== password2) {
            errors.password = 'Password must match.'
        }

        setFormErrors(errors);
        if (Object.keys(errors).length > 0) {
            return;
        }

    }


    return (
        <Body>
            <h1>Sign Up Here!</h1>
            <Form onSubmit={onSubmit}>
                <InputField name="username" label="Username"
                error={formErrors.username} fieldRef={usernameField}/>
                <InputField name="email" label="Email" type="email"
                error={formErrors.email} fieldRef={emailField} />
                <InputField name="password" label="Create a Password" type="password"
                error={formErrors.password} fieldRef={passwordField}/>
                <InputField name="password2" label="Repeat Password" type="password"
                error={formErrors.password} fieldRef={passwordField2} />
                <div className="d-grid">
                <Button variant="primary" size="lg" type="submit">Register</Button>
                </div>

            </Form>
        </Body>
    );
}