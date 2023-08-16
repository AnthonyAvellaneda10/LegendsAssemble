/* ========== Navigation =========== */
const navList = document.querySelector(".nav-list");

document.querySelector(".hamburger").onclick = () => {
  navList.classList.add("show");
};

document.querySelector(".close").onclick = () => {
  navList.classList.remove("show");
};

/*=============== CHANGE BACKGROUND HEADER ===============*/
const scrollHeader = () =>{
  const header = document.getElementById('header')
  // When the scroll is greater than 50 viewport height, add the scroll-header class to the header tag
  this.scrollY >= 50 ? header.classList.add('bg-header') 
                     : header.classList.remove('bg-header')
}
window.addEventListener('scroll', scrollHeader)

/*=============== DARK LIGHT THEME ===============*/ 
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'ri-sun-line'

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'ri-moon-line' : 'ri-sun-line'

// We validate if the user previously chose a topic
if (selectedTheme) {
  // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
  themeButton.classList[selectedIcon === 'ri-moon-line' ? 'add' : 'remove'](iconTheme)
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener('click', () => {
    // Add or remove the dark / icon theme
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    // We save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})


/*=============== VARIABLES GLOBALES ===============*/ 
// Loader para mostrar hasta esperar que las imágenes estén cargadas para luego desaparecer el loader
const loader = document.querySelector('.container__loader');

// En este contenedor es donde inscrustaremos el HTML que formaremos a través del JS
const categoriesProducts = document.querySelector('.categories .products');
const lista = document.getElementById('products');

// Variables que obtenemos del HTML donde se define la paginacion y obtenemos sus valores
//para luego poder manipularlos
const paginacion = document.querySelector('.pagination');
const pageNumbersContainer = document.getElementById('pageNumbers');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentPage = 1; // Página actual
const charactersPerPage = 20; // Número de personajes por página
var totalPages = 0; // Total de páginas
let allCharacters = []; // Array para almacenar todos los personajes
let isSearch = false;

// Mediante este input que es parte del search para acceder a cada letre que tipee el usuario al
// momento de que busque a un personaje
const searchTextElement = document.getElementById('searchText');


// Mediante la variable 'lista' que es el contenedor donde se muestra a los personajes
// donde podemos acceder a los evento dentro de él mediante el event (e), por lo que podremos acceder
// al 'button' para que nos redirija a una nueva URL que es detalle de cada personaje mediante el 'id'
// que está asociado al botón que es parte del personaje
lista.addEventListener('click', (e) => {
  if (e.target && e.target.nodeName == 'BUTTON') {
    // Reseteamos el input del search
    searchTextElement.value = "";
    // Capturamos el ID que se encuentra dentro del botón
    var idCharacters = e.target.id;
    // Encriptamos el ID para que en la URL no se vea
    var encryptedIdCharacters = btoa(idCharacters);
    // Una vez capturado el ID nos redirigimos a la página de detalle del personaje, para poder obtener el ID a través de la URL
    window.location.href = '/pages/details.html?id=' + encodeURIComponent(encryptedIdCharacters);
  }
});

// Mostramos el loader mientras las imágenes se carguen por completo
function mostrarIndicadorDeCarga() {
  loader.style.display = 'flex';
  paginacion.style.display = 'none';
}
// Quitamos el loader cuando las imágenes se cargaron por completo
function ocultarIndicadorDeCarga() {
  loader.style.display = 'none';
  paginacion.style.display = 'flex';
}
// Al momento de escrbir un personaje que es de
function dataNotFound (searchText) {
  var html = "";
  // En caso borremos nuestra consulta, borrar el mensaje que muestra líneas más abajo
  // de personaje no encontrado
  if (searchText == "" || searchText == null || searchText == undefined) {
    html = "";
  }else {
    // Al momento de escrbir un personaje que es de nuestro interés y que no este disponible en nuestra
    // base de datos se le mostrará el siguiente mensaje
    ocultarIndicadorDeCarga();
    paginacion.style.display = 'none';
    html = "";
    html = `<small>No results found for: <b>${searchText}</b> 🥺</small>`
  }
  return html;
}

// Escuchamos mediante el onkeypress que es cuando presionamos una tecla de nuestro teclado y buscamos en nuestra API
// lo que se digite en dicho campo
// Función para manejar el evento de búsqueda al escribir en el campo
// Función para manejar el evento de búsqueda al escribir en el campo
function handleSearchInput() {
  const searchText = searchTextElement.value;
  const newUrl = new URL(window.location.href);
  if (searchText.trim() !== "") {
    newUrl.searchParams.set('s', searchText.trim());
  } else {
    newUrl.searchParams.delete('s'); // Eliminar el parámetro si el campo de búsqueda está vacío
  }
  currentPage = getUrlSearchParams(); // Actualizar currentPage con el valor de paginación actual
  history.replaceState({}, '', newUrl); // Actualizar el estado del historial sin generar una nueva entrada

  if (searchText === '') {
    categoriesProducts.innerHTML = '';
    const proyectoHTML = dataNotFound(searchText);
    categoriesProducts.insertAdjacentHTML('beforeend', proyectoHTML);
    consumoDeAPIMarvel();
  } else {
    buscarPersonajes(searchText);
  }

  // Actualizar el valor del input con el texto actual
  searchTextElement.value = searchText;
}


// Evento input para actualizar el parámetro 'searchText' en la URL mientras se escribe
searchTextElement.addEventListener('input', handleSearchInput);


function generarPersonajes (data) {
  return `
    <div class="product">
    <div class="top d-flex hover:shine">
      <img src='${data.thumbnail.path}.${data.thumbnail.extension}' alt="" />
      <div class="icon d-flex">
        <i class="bx bxs-heart"></i>
      </div>
    </div>
    <div class="bottom">
      <div class="d-flex">
        <h4>${data.name}</h4>
      </div>
      <div class="d-flex">
        <button href="" id="${data.id}" class="btn cart-btn">View detail <i class="uil uil-eye"></i></button>
      </div>
    </div>
  </div>
  
  `;
}

const buscarPersonajes = (searchText) => {
  categoriesProducts.innerHTML = '';
  mostrarIndicadorDeCarga();
  currentPage = getUrlSearchParams();
  fetch(`https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${searchText}&limit=80&apikey=97a6fcd5e744d6401c2bb739666e673a`)
  .then(response => response.json())
    .then(characters => {
      const totalCharacters = characters.data.count;
      calculateTotalPages(totalCharacters);
      allCharacters = characters.data.results;
      // Aquí recibes los datos de la API y puedes manipularlos como desees
      // Por ejemplo, puedes mostrar los resultados en la página
      if (totalCharacters === 0) {
        const proyectoHTML = dataNotFound(searchText)
        categoriesProducts.insertAdjacentHTML('beforeend', proyectoHTML);
      } else {
        showCurrentPageCharacters();
        showPageNumbers();
        updateUrlPagination();
      }
    })
    .catch(error => {
      // Manejo de errores, si es necesario
      console.error('Error al obtener los datos de la API:', error);
    });
}

function realizarConsulta(query) {
  categoriesProducts.innerHTML = '';
        
  query.forEach(data => {
    const proyectoHTML = generarPersonajes(data);
    categoriesProducts .insertAdjacentHTML('beforeend', proyectoHTML);
  });

  ocultarIndicadorDeCarga();
}

// Función para calcular el número total de páginas
function calculateTotalPages(totalCharacters) {
  totalPages = Math.ceil(totalCharacters / charactersPerPage);
}

// Función para mostrar los personajes de la página actual
function showCurrentPageCharacters() {
  const startIndex = (currentPage - 1) * charactersPerPage;
  const endIndex = startIndex + charactersPerPage;
  const charactersToShow = allCharacters.slice(startIndex, endIndex);
  realizarConsulta(charactersToShow);
  updatePaginationButtons();
}

// Función para crear y mostrar los números de página en la paginación
function showPageNumbers() {
  pageNumbersContainer.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    const pageNumberLink = document.createElement('a');
    pageNumberLink.textContent = i;
    pageNumberLink.addEventListener('click', () => {
      currentPage = i;
      showCurrentPageCharacters();
      updateUrlPagination();
      setActivePageNumber(i); // Llamamos a la función para establecer la clase 'active'
    });
    pageNumbersContainer.appendChild(pageNumberLink);
  }
  setActivePageNumber(currentPage); // Llamamos a la función para establecer la clase 'active' en la página actual
}

function setActivePageNumber(activePage) {
  const pageNumberLinks = document.querySelectorAll('#pageNumbers a');
  pageNumberLinks.forEach((link) => {
    if (Number(link.textContent) === activePage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    showCurrentPageCharacters();
    updateUrlPagination();
  }
});

nextBtn.addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++;
    showCurrentPageCharacters();
    updateUrlPagination();
  }
});

function updatePaginationState() {
  const pageNumberLinks = document.querySelectorAll('#pageNumbers a');
  pageNumberLinks.forEach((link) => {
    const pageNumber = Number(link.textContent);
    link.classList.toggle('active', pageNumber === currentPage);
  });
}

// Función para actualizar el estado de los botones de paginación
function updatePaginationButtons() {
  nextBtn.disabled = currentPage === totalPages;
  prevBtn.disabled = currentPage === 1;
  updatePaginationState(); // Agregamos esta línea para actualizar la clase 'active'
  // currentPage = parseUrlPagination();
}

function init() {
  currentPage = getUrlSearchParams();
  
  // Establecer el valor del campo de búsqueda basado en el parámetro 'searchText' de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const searchText = urlParams.get('s');
  searchTextElement.value = searchText || '';

  if (searchText) {
    isSearch = true;
    buscarPersonajes(searchText);
    isSearch = false;
  } else {
    consumoDeAPIMarvel();
  }

  // handleSearchInput();
  // showCurrentPageCharacters();
  // showPageNumbers();
}


// Función para obtener la información de búsqueda y paginación desde la URL
function getUrlSearchParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const searchText = urlParams.get('s');
  const pageNumber = parseInt(urlParams.get('p'));
  
  // Establecer el valor en el campo de búsqueda
  searchTextElement.value = searchText || ''; 
  return pageNumber || 1;
}

function updateUrlPagination() {
  // console.log("dg: ", totalPages)
  // console.log("cp: ", currentPage)
  const newUrl = new URL(window.location.href);
  if (currentPage === 1) {
    newUrl.searchParams.delete("p");
  } else if (currentPage > totalPages) {
    paginacion.style.display = 'none';
    window.location.href = '../index.html'
  } else {
    newUrl.searchParams.set("p", currentPage);
  }
  history.replaceState({}, '', newUrl);
}

// Función para obtener el número de página desde el parámetro de la URL
function getPaginationFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const pageNumber = parseInt(urlParams.get('p'));

  return pageNumber || 1;
  
}

// Consumo de la API, de los personajes de Marvel que por defecto nos devuelve 20, con un límite de 100
const consumoDeAPIMarvel = () => {
  try {
    mostrarIndicadorDeCarga();
    currentPage = getPaginationFromUrl();
    fetch('https://gateway.marvel.com:443/v1/public/characters?limit=80&apikey=97a6fcd5e744d6401c2bb739666e673a')
    .then(response => response.json())
    .then(characters => {
        const totalCharacters = characters.data.count;
        calculateTotalPages(totalCharacters);
        allCharacters = characters.data.results;
        if (!isSearch) { // Solo mostrar los personajes iniciales si no estamos realizando una búsqueda desde el campo de texto
          showCurrentPageCharacters();
          showPageNumbers();
        }
        updateUrlPagination();
      }
    )
    .catch(err => console.error(err));
  } catch (error) {
    console.log(error)
  }
}

/*=============== SHOW SCROLL UP ===============*/ 
const scrollUp = () =>{
	const scrollUp = document.getElementById('scroll-up')
    // When the scroll is higher than 350 viewport height, add the show-scroll class to the a tag with the scrollup class
	this.scrollY >= 350 ? scrollUp.classList.add('show-scroll')
						: scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)

var scrollup = document.getElementById('scroll-up');
  
// Agregar un evento de clic al botón de scroll up
scrollup.addEventListener('click', function(event) {
  event.preventDefault(); // Evitar el comportamiento predeterminado del enlace ('#')
  scrollToTop();
});

function scrollToTop() {
  window.scroll({
    top: 0,
    behavior: 'smooth' // Utilizar el comportamiento de scroll suave para una experiencia constante y rápida
  });
}

init();