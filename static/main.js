document.querySelectorAll('.example').forEach((el) => {
    el.addEventListener('click', (e) => {
        document.querySelectorAll('.example').forEach((el) => { el.classList.remove('active'); });
        el.classList.add('active');
        document.querySelector('.shellviz-window img').src = el.dataset['preview'];
    });
})
