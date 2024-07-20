document.addEventListener('DOMContentLoaded', function () {
const container = document.getElementById('container');
const backgrounds = ['background-1', 'background-2', 'background-3'];
const randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  
container.classList.add(randomBackground);
});
