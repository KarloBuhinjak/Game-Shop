const meni = document.querySelector('#mobilni-menu')
const meniLinkovi = document.querySelector('.navigacijski_menu')

meni.addEventListener('click', function(){
    meni.classList.toggle('is-active');
    meniLinkovi.classList.toggle('active');
})

