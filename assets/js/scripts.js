const openMenu = () => {
    let menuIcon = document.querySelector('.header__menu--btn');
    let header = document.querySelector('.header');
    var submenuToggleButtons = document.querySelectorAll('.submenu-toggle');

    if (menuIcon) {
        menuIcon.addEventListener('click', function (e) {
            this.classList.toggle('is-active');
            header.classList.toggle('is-active');
        })
    }
}

const openAccordion = () => {
    var accordions = document.querySelectorAll('.faq__accordions--accordion');

    if (accordions) {
        accordions.forEach(accordion => {
            accordion.addEventListener('click', function (e) {
                e.preventDefault();

                let clickedIcon = e.target.closest('.icon');
                let currentAccordion = e.target.closest('.faq__accordions--accordion');

                if (clickedIcon) {
                    if (currentAccordion.classList.contains('active')) {
                        currentAccordion.classList.remove('active');
                    } else {
                        currentAccordion.classList.add('active');
                    }
                }
            })
        })
    }
}


window.addEventListener('load', e => {
    openMenu();
    openAccordion();
})