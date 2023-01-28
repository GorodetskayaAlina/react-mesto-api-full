import React from "react";
import { Link } from 'react-router-dom';

function Register({onRegister}) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    function emailHandleChange(e) {
        setEmail(e.target.value);
    }

    function passwordHandleChange(e) {
        setPassword(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        onRegister(email, password);
    }

    return (
        <div className="content authorization">
            <h2 className="authorization__title">Регистрация</h2>
            <form className="authorization__form" onSubmit={handleSubmit}>
                <fieldset className="authorization__fieldset" name="signin">
                    <input type="email" name="email" value={email} onChange={emailHandleChange}
                        className="authorization__form-item" placeholder="Email" required />
                    <input type="password" name="password" value={password} onChange={passwordHandleChange}
                        className="authorization__form-item" placeholder="Пароль" required />
                </fieldset>
                <button className="authorization__button registration__button" type="submit">Зарегистрироваться</button>
                <p className="registration__text">Уже зарегистрированы? <Link to="sign-in" className="registration__text">Войти</Link></p>
            </form>
        </div>
    )
}

export default Register;