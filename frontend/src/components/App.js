import React from "react";
import { Route, Switch } from 'react-router-dom';
import Login from './Login.js';
import Register from './Register.js';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import InfoTooltip from './InfoTooltip';
import api from '../utils/api';
import * as auth from '../utils/auth';
import { useHistory } from 'react-router-dom';
import ProtectedRoute from "./ProtectedRoute";
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import '../index.css';

function App() {
    const history = useHistory();

    //попапы
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [isInfoTooltipPopupOpen, setInfoTooltipPopupOpen] = React.useState(false);
    const [selectedCard, setSelectedCard] = React.useState({});

    //загрузка начальных данных профиля
    const [currentUser, setCurrentUser] = React.useState({});

    //загрузка начальных карточек
    const [cards, setCards] = React.useState([]);

    //проверка регистрации пользователя
    const [loggedIn, setLoggedIn] = React.useState(false);

    //загрузка Email пользователя
    const [email, setEmail] = React.useState('')

    // открытие и закрытие попапов
    const handleAddPlaceClick = () => {
        setIsAddPlacePopupOpen(!isAddPlacePopupOpen);
    };

    const handleEditAvatarClick = () => {
        setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen);
    };

    const handleEditProfileClick = () => {
        setIsEditProfilePopupOpen(!isEditProfilePopupOpen);
    };

    const handleInfoTooltipClick = () => {
        setInfoTooltipPopupOpen(!isInfoTooltipPopupOpen);
    };

    //Проверка успеха регистрации
    const [isSuccess, setIsSuccess] = React.useState();

    const closeAllPopups = () => {
        setIsAddPlacePopupOpen(false);
        setIsEditProfilePopupOpen(false);
        setIsEditAvatarPopupOpen(false);
        setInfoTooltipPopupOpen(false);
        setSelectedCard({});
    };

    //добавление новых карточек 
    function handleAddPlaceSubmit({ name, link }) {
        // запрос в API и обновление карточки
        api.createNewCards(name, link)
            .then((newCard) => {
                setCards([newCard, ...cards]);
                closeAllPopups();
            })
            .catch((err) => {
                console.log(`Ошибка: ${err}`);
            })
    }

    //реализация лайков
    function handleCardLike(card) {
        //определяем, ставил ли пользователь лайк
        const isLiked = card.likes.some(i => i._id === currentUser._id);

        // запрос в API и обновление карточки
        api.changeLikeCardStatus(card._id, !isLiked)
            .then((newCard) => {
                setCards((cards) => cards.map((c) => c._id === card._id ? newCard : c));
            })
            .catch((err) => {
                console.log(`Ошибка: ${err}`);
            })
    }

    //удаление карточки 
    function handleCardDelete(deletedCard) {
        // запрос в API и обновление карточки
        api.deleteCardItem(deletedCard)
            .then(() => {
                setCards((cards) => cards.filter((card) => card._id !== deletedCard));
            })
            .catch((err) => {
                console.log(`Ошибка: ${err}`);
            })
    }

    //попап с увеличенной картинкой карточки
    const handleCardClick = (card) => {
        setSelectedCard(card);
    };

    React.useEffect(() => {
        if (localStorage.getItem('jwt')) {
        Promise.all([api.getUserInfo(), api.getInitialCards()])
            .then(([user, card]) => {
                setCurrentUser(user);
                setCards(card);
            })
            .catch((err) => {
                console.log(`Ошибка: ${err}`);
            })
    }}, [loggedIn]);

    //Обновление информации о пользователе
    const handleUpdateUser = ({ name, about }) => {
        api.updateUserInfo(name, about)
            .then((data) => {
                setCurrentUser(data);
                closeAllPopups();
            })
            .catch((err) => {
                console.log(`Ошибка: ${err}`);
            })
    }

    //Обновление аватара
    const handleUpdateAvatar = ({ avatar }) => {
        api.getProfileAvatar(avatar)
            .then((data) => {
                setCurrentUser(data);
                closeAllPopups();
            })
            .catch((err) => {
                console.log(`Ошибка: ${err}`);
            })
    }

    //Регистрация
    function handleRegister(email, password) {
        auth.register(email, password)
            .then(() => {
                setIsSuccess(true);
                handleInfoTooltipClick();
                history.push('/sign-in')
            })
            .catch((err) => {
                setIsSuccess(false);
                handleInfoTooltipClick();
                console.log(`Ошибка: ${err}`);
            })
    }

    //Вход
    function handleLogin(userData) {
        auth.authorize(userData.email, userData.password)
            .then((data) => {
                if (data.token) {
                    setLoggedIn(true);
                    history.push('/');
                }
            })
            .catch((err) => {
                setIsSuccess(false);
                handleInfoTooltipClick();
                console.log(`Ошибка: ${err}`);
            })
    }

    //Проверка токена
    function checkToken() {
        const jwt = localStorage.getItem('jwt');
            if (jwt) {
                auth.getContent(jwt).then((res) => {
                    if (res) {
                        setLoggedIn(true);
                        setEmail(res.data.email);
                        history.push('/');
                    }
                })
                .catch((err) => { 
                    console.log(`Ошибка: ${err}`); 
                })
            }
    }

    React.useEffect(() => {
        checkToken();
    }, [checkToken]);

    React.useEffect(() => {
        if (loggedIn) {
            history.push('/');
        }
    }, [loggedIn]);

    //Выход
    function onSignOut() {
        localStorage.removeItem('jwt');
        setLoggedIn(false);
        history.push('/sign-in');
    }

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <div>
                <Header
                    email={email}
                    onSignOut={onSignOut}
                />
                <Switch>
                    <Route path="/sign-in">
                        <Login onLogin={handleLogin}
                        />
                    </Route>
                    <Route path="/sign-up">
                        <Register onRegister={handleRegister}
                        />
                    </Route>
                    <ProtectedRoute exact path="/"
                        component={Main}
                        loggedIn={loggedIn}
                        onEditProfile={handleEditProfileClick}
                        onAddPlace={handleAddPlaceClick}
                        onEditAvatar={handleEditAvatarClick}
                        cards={cards}
                        onCardClick={handleCardClick}
                        onCardLike={handleCardLike}
                        onCardDelete={handleCardDelete}
                    />
                </Switch>
                <Footer />

                <InfoTooltip
                    isOpen={isInfoTooltipPopupOpen}
                    onClose={closeAllPopups}
                    isSuccess={isSuccess}
                />

                <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />

                <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} />

                <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />

                <ImagePopup card={selectedCard} onClose={closeAllPopups} />
            </div>
        </CurrentUserContext.Provider>
    );
}

export default App;