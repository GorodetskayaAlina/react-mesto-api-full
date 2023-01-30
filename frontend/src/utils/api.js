class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`)
  }

  //Информация о пользователе
  getUserInfo() {
    const token = localStorage.getItem('jwt');
    return fetch(`${this._baseUrl}/users/me`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: 'GET',
      })
      .then(this._checkResponse)
      .then((data) => {
        return data;
      })
  }

  //загрузка аватара
  getProfileAvatar(urlAvatar) {
    const token = localStorage.getItem('jwt');
    return fetch(`${this._baseUrl}/users/me/avatar`,
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        method: 'PATCH',
        body: JSON.stringify({
          avatar: urlAvatar
        })
      })
      .then(this._checkResponse)
      .then((data) => {
        return data;
      })
  }

  //Обновление информации о пользователе
  updateUserInfo(userName, userJob) {
    const token = localStorage.getItem('jwt');
    return fetch(`${this._baseUrl}/users/me`,
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: userName,
          about: userJob
        }),
        method: 'PATCH',
      })
      .then(this._checkResponse)
      .then((data) => {
        return data;
      })
  }

  //загрузка начальных карточек
  getInitialCards() {
    const token = localStorage.getItem('jwt');
    return fetch(`${this._baseUrl}/cards`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: 'GET',
      })
      .then(this._checkResponse)
      .then((data) => {
        return data;
      })
  }

  //загрузка новых карточек
  createNewCards(name, link) {
    const token = localStorage.getItem('jwt');
    return fetch(`${this._baseUrl}/cards`,
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name,
          link: link
        }),
        method: 'POST',
      })
      .then(this._checkResponse)
      .then((data) => {
        return data;
      })
  }

  //постановка и удаление лайка
  changeLikeCardStatus(cardId, isLiked) {
    const token = localStorage.getItem('jwt');
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`,
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        method: `${isLiked? 'PUT' : 'DELETE'}`,
      })
      .then(this._checkResponse)
      .then((data) => {
        return data;
      })
  }

  //удаление карточки
  deleteCardItem(cardId) {
    const token = localStorage.getItem('jwt');
    return fetch(`${this._baseUrl}/cards/${cardId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        method: 'DELETE',
      })
      .then(this._checkResponse)
      .then((data) => {
        return data;
      })
  }
}

const api = new Api({
  baseUrl: 'http://localhost:3000',
});

export default api;