let $ = document.querySelector.bind(document);
let $$ = document.querySelectorAll.bind(document);

function toggleHamburger() {
    $$('.bar').forEach(bar => bar.classList.toggle('x'));
    $('nav').classList.toggle('visible');
}

$('.nav-toggle').addEventListener('click', toggleHamburger);

$('#theme-select').addEventListener('change', (e) => {
    $('html').classList.remove(...$('html').classList);
    $('html').classList.add($('#theme-select').value);
    localStorage.setItem("theme", $('#theme-select').value);
});

let selectedTheme = localStorage.getItem("theme");
if (selectedTheme) {
    $('html').classList.add(selectedTheme);
    $('#theme-select').value = selectedTheme;
}

$('#print').addEventListener('click', () => {
    var content = $('section').innerHTML;
    var WinPrint = window.open('', '_blank', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
    WinPrint.document.write(content);
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
    WinPrint.close();
})

$('#theme-mode').addEventListener('click', () => {
    $('html').style.filter = $('html').style.filter === "invert(1)" ? "" : "invert(1)";
})