import React from "react";
import "../Login.css";
import at from "../res/svg/at.svg";
import asterisk from "../res/svg/asterisk.svg";

const apiUrl = process.env.REACT_APP_APIURL;

function Register() {
    return (
        <div className="formDiv">
            <h1>Register</h1>
            <p>
                You can register down below or if you already have an account{" "}
                <a href="./signin">sign in</a>
            </p>
            <form method="post" action={`${apiUrl}register`} >
                <span className="formText">
                    <input
                        value="test"
                        type={"text"}
                        id="regEmail"
                        name="email"
                        placeholder="E-Mail"
                        required
                    />
                    <label htmlFor="email">
                        <img src={at} alt="@" />
                    </label>
                </span>
                <span className="formText">
                    <input
                        value="test"
                        id="regPassword"
                        type={"password"}
                        name="password"
                        placeholder="********"
                        required
                    />
                    <label htmlFor="password">
                        <img src={asterisk} alt="*" />
                    </label>
                </span>
                <span className="buttonSpan">
                    <button>Submit</button>
                    <div>
                        <p>or</p>
                        <a href="/signin">login</a>
                    </div>
                </span>
            </form>
        </div>
    );
}

function SignIn() {
    return (
        <div className="formDiv">
            <h1>Login</h1>
            <p>
                You can sign in below or <a href="./register">register</a> a new
                account
            </p>
            <form method="POST" action={`${apiUrl}login`}>
                <span className="formText">
                    <input
                        type={"text"}
                        id="signEmail"
                        name="email"
                        placeholder="E-Mail"
                        value="test"
                        required
                    />
                    <label htmlFor="email">
                        <img src={at} alt="@" />
                    </label>
                </span>
                <span className="formText">
                    <input
                        id="signPassword"
                        type={"password"}
                        name="password"
                        placeholder="********"
                        value="test"
                        required
                    />
                    <label htmlFor="password">
                        <img src={asterisk} alt="*" />
                    </label>
                </span>
                <span className="buttonSpan">
                    <button type="submit">Submit</button>
                    <div>
                        <p>or</p>
                        <a href="/register">register</a>
                    </div>
                </span>
            </form>
        </div>
    );
}

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            register: this.props.register,
        };
    }
    render() {
        return (
            <span id="login">
                <div id="loginHero"></div>
                <div id="loginForm">
                    {/*<h3>Welcome</h3>*/}
                    {this.props.register ? Register() : SignIn()}
                    <button>Google</button>
                </div>
            </span>
        );
    }
}

export default Login;
