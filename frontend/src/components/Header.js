import React from "react";
import logo from '../images/logo.svg';
import { Route, Link, Switch } from 'react-router-dom';

function Header({ email, onSignOut }) {
    return (
        <header className="header">
            <img src={logo} alt="Логотип" className="header__logo logo-hover" />
            <Switch>
                <Route path="/sign-in">
                    <Link to='sign-up' className="header__link">Регистрация</Link>
                </Route>
                <Route path="/sign-up">
                    <Link to='sign-in' className="header__link">Войти</Link>
                </Route>
                <Route exact path="/">
                    <div className="header__exite">
                        <p className="header__email">{email}</p>
                        <button type="button" className="header__button" onClick={onSignOut}>Выйти</button>
                    </div>
                </Route>
            </Switch>
        </header>
    );
}

export default Header;