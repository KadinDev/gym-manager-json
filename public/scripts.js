// pegando toda a página em que está
const currentPage = location.pathname
const menuItems = document.querySelectorAll('.pages a')

for ( let item of menuItems){
    if ( currentPage.includes(item.getAttribute('href')) ){
        item.classList.add('active')
    }
}