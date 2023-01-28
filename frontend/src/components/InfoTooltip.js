import React from "react";
import successImg from '../images/success-img.svg';
import failImg from '../images/fail-img.svg';

function InfoTooltip({ isOpen, onClose, isSuccess }) {
    return (
        <div className={`popup ${isOpen ? "popup_opened" : ""}`}>
            <div className="popup__container">
                <button className="popup__close hover" type="button" onClick={onClose}></button>
                <div className="popup__body">
                    <img src={isSuccess ? successImg : failImg} alt="Фото профиля" className="popup__img" />
                    <h2 className="popup__title popup__title-InfoTooltip">{isSuccess ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте ещё раз.'}</h2>
                </div>
            </div>
        </div>
    )
}

export default InfoTooltip;