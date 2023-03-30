// определяем вебсокет и основные переменные
const wsUri = 'wss://echo-ws-service.herokuapp.com';

const chat = document.querySelector(".chat"),
      input = document.querySelector(".input"),
      btnSent = document.querySelector(".btn-sent"),
      btnGeo = document.querySelector(".btn-geo");
  
let socket = new WebSocket(wsUri);

//работаем с сокетом
socket.onopen = () => {
  console.log("Соединение установлено");
};

socket.onmessage = ({ data }) => {
  innerChat(data, true);
};

socket.onerror = () => {
  console.log("Ошибка соединения с сервером");
};

// вешаем обработчик на первую кнопку, проверяем соединение с сокетом
btnSent.addEventListener("click", () => {
  const message = input.value.trim();
  if (!message || socket.readyState !== WebSocket.OPEN) return;
  sendAndLogMessage(message);
  input.value = "";
});

// вешаем обработчик на вторую кнопку для получения геолокации
btnGeo.addEventListener("click", () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const link = `https://www.openstreetmap.org/#map=18/${coords.latitude},${coords.longitude}`;
        writeOutput(`<a class="geo-info" href="${link}" target="_blank">Геолокация</a>`);
      },
      ({ message }) => {
        console.error(`Ошибка геолокации: ${message}`);
        writeOutput("Не удалось определить местоположение."); // обрабатываем ошибку при получении геолокации
      }
    );
  }
});

// отправляем сообщение на сервер с помощью сокета, 
// выводим в чат, как оправленное, передавая isReceived как false
function sendAndLogMessage(message) {
  socket.send(message);
  innerChat(message, false);
}

// функция выведения сообщений в чате, диву присваевается класс recieved 
// если isReceived - true, если false - класс sent
function innerChat(message, isReceived) {
  let messageHTML = `<div class="${isReceived ? "recieved" : "sent"}">${message}</div>`;
  chat.insertAdjacentHTML("beforeend", messageHTML);
}

// добавляем новое сообщение в чат, путем создания нового HTML элемента <p> с содержимым 
// переданного текста сообщения в качестве своего содержимого
function writeOutput(message) {
  let messageHTML = `<p>${message}</p>`;
  chat.insertAdjacentHTML("beforeend", messageHTML);
}