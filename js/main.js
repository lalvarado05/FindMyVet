
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

const navbarLinks = document.querySelectorAll('.navbar-link');
navbarLinks.forEach(link => {
    link.addEventListener('click', () => {
        console.log('Navegando a:', link.href);
    });
});
