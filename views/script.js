const btnmobile = document.getElementById('button-mobile');

function toggleMenu() {
  document.getElementById("navbar-vertical").classList.toggle("active");
  document.getElementById("welcome").classList.toggle("active");
  
}
btnmobile.addEventListener('click', toggleMenu);