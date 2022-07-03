import { useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import validator from "validator";

function LoginForm(props) {
  const [mail, setMail] = useState("john.doe@polito.it");
  const [password, setPassword] = useState("password");

  const [mailError, setMailError] = useState("");
  const [passwordValid, setPasswordValid] = useState(true);

  const [loginError, setLoginError] = useState("");
  const [waiting, setWaiting] = useState(false);

  const handleSubmit = event => {
    event.preventDefault();

    // Clear previous errors
    setLoginError("");

    // Validate form
    const trimmedMail = mail.trim();
    const mailError = validator.isEmpty(trimmedMail) ? "eMail must not be empty" : (
      !validator.isEmail(trimmedMail) ? "Not a valid eMail" : ""
    );
    const passwordValid = !validator.isEmpty(password);

    if (!mailError && passwordValid) {
      // Submit login
      setWaiting(true);

      props.login(trimmedMail, password)
        .catch(e => {
          setWaiting(false);
          setLoginError(e[0]); // There will only be one error
        });
    } else {
      setMailError(mailError);
      setPasswordValid(passwordValid);
    }
  };

  return (
    <Container fluid style={{"padding": "0", "marginTop": "1rem", "maxWidth": "60%"}}>
      <Row style={{"paddingLeft": "0.7rem"}}>
        <h1>
          Login
        </h1>
      </Row>
      <Container className="border border-4 rounded" style={{"marginTop": "0.5rem", "padding": "1rem"}}>
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label>eMail</Form.Label>
              <Form.Control isInvalid={!!mailError}
                            type="email"
                            placeholder="mail@provider.com"
                            value={mail}
                            onChange={event => {setMail(event.target.value); setMailError("");}}/>
              <Form.Control.Feedback type="invalid">
                {mailError}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label>Password</Form.Label>
              <Form.Control isInvalid={!passwordValid}
                            type="password"
                            value={password}
                            onChange={event => {setPassword(event.target.value); setPasswordValid(true);}}/>
              <Form.Control.Feedback type="invalid">
                Password must not be empty
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Button type="submit" disabled={waiting}>Login</Button>
        </Form>
        {
          loginError ? <LoginError error={loginError} clearError={() => setLoginError("")}/> : false
        }
      </Container>
    </Container>
  );
}

function LoginError(props) {
  return <Alert variant="danger" style={{"margin": "2rem"}} dismissible onClose={props.clearError}>
    {props.error}
  </Alert>;
}

export { LoginForm };