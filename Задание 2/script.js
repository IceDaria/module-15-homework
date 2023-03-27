const width = window.screen.width;
const height = window.screen.height;

document.querySelector('.btn').addEventListener('click', function() {
    alert(`Высота вашего экрана ${height}, ширина ${width}`)
})
