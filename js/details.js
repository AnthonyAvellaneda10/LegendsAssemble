/* ========== Navigation =========== */
const navList = document.querySelector(".nav-list");

document.querySelector(".hamburger").onclick = () => {
  navList.classList.add("show");
};

document.querySelector(".close").onclick = () => {
  navList.classList.remove("show");
};

const scrollHeader = () =>{
    const header = document.getElementById('header')
    // When the scroll is greater than 50 viewport height, add the scroll-header class to the header tag
    this.scrollY >= 50 ? header.classList.add('bg-header') 
                       : header.classList.remove('bg-header')
  }
  window.addEventListener('scroll', scrollHeader)

/*=============== ACCORDION ===============*/
const lista = document.getElementById('containers');
const accordionItems = document.querySelectorAll('.accordion__item');
const loader = document.querySelector('.container__loader');

lista.addEventListener('click', (e) => {
  const clickedHeader = e.target;
  const clickedAccordionItem = clickedHeader.closest('.accordion__item');
  
  if (clickedHeader.classList.contains('accordion__header') || clickedHeader.classList.contains('accordion__icon') || clickedHeader.classList.contains('accordion__title')) {
    const openItem = document.querySelector('.accordion-open');

    toggleItem(clickedAccordionItem);

    if (openItem && openItem !== clickedAccordionItem) {
      toggleItem(openItem);
    }
  }
  if (clickedHeader.nodeName == "BUTTON") {
    window.location.href = '../index.html';
  }
});

const toggleItem = (item) => {
  const accordionContent = item.querySelector('.accordion__content');

  if (item.classList.contains('accordion-open')) {
    accordionContent.removeAttribute('style');
    item.classList.remove('accordion-open');
  } else {
    accordionContent.style.height = accordionContent.scrollHeight + 'px';
    item.classList.add('accordion-open');
  }
};

const btnInicio = document.querySelector('.logo img');
btnInicio.addEventListener('click', () => {
    window.location.href = '../index.html'
})


const contenedorDetalle = document.querySelector('.containers');

function mostrarDetalleDelPersonaje(data, maxItems) {

     // Función para crear una lista de elementos <li>
     function createListItems(items) {
        return items
            .slice(0, maxItems) // Limitar la cantidad de elementos mostrados
            .map(item => `<li>✓ ${item.name}</li>`)
            .join('');
    }

    return `
        <div class="left">
            <div class="main_image">
            <img
                src='${data.thumbnail.path}.${data.thumbnail.extension}'
                class="slide"
            />
            </div>
        </div>

        
          <div class="right">
              <h3 class="name">${data.name}</h3>
              <h5>Description</h5>
              <p class="description">
                  ${data.description ? data.description : "This character has no description 😢"}
              </p>
              <h5>More related information</h5>

              <div class="accordion__container">
                  <div class="accordion__item">
                      <header class="accordion__header">
                      <i class="bx bx-plus accordion__icon"></i>
                      <h3 class="accordion__title">Comics</h3>
                      </header>

                      <div class="accordion__content">
                      <ul class="accordion__description">
                          ${createListItems(data.comics.items)}
                      </ul>
                      </div>
                  </div>
                  <div class="accordion__item">
                      <header class="accordion__header">
                      <i class="bx bx-plus accordion__icon"></i>
                      <h3 class="accordion__title">Series</h3>
                      </header>

                      <div class="accordion__content">
                      <ul class="accordion__description">
                          ${createListItems(data.series.items)}
                      </ul>
                      </div>
                  </div>
                  <div class="accordion__item">
                      <header class="accordion__header">
                      <i class="bx bx-plus accordion__icon"></i>
                      <h3 class="accordion__title">Stories</h3>
                      </header>

                      <div class="accordion__content">
                      <ul class="accordion__description">
                          ${createListItems(data.stories.items)}
                      </ul>
                      </div>
                  </div>
              </div>
              <button class="btn-back">Go Back</button>
          </div>
  `;
}

function mostrarIndicadorDeCarga() {
  loader.style.display = 'flex';
  lista.style.display = 'none';
}

function ocultarIndicadorDeCarga() {
  loader.style.display = 'none';
  lista.style.display = 'flex';
}

function realizarConsulta(query) {
    contenedorDetalle.innerHTML = '';
          
    query.forEach(data => {
        const proyectoHTML = mostrarDetalleDelPersonaje(data, 3); // Mostrar solo 3 elementos en cada lista
        contenedorDetalle.insertAdjacentHTML('beforeend', proyectoHTML);
    });
    ocultarIndicadorDeCarga();
  }


  

/*Lógica para mostrar el detalle del personaje */
function obtenerIdPersonaje() {
    // Obtener los valores de los parámetros encriptados de la URL
    var urlParams = new URLSearchParams(window.location.search);
    var encryptedIdCharacters = urlParams.get('id');

    // Desencriptar los valores
    var id = atob(encryptedIdCharacters);
    
    mostrarIndicadorDeCarga();

    fetch(`https://gateway.marvel.com:443/v1/public/characters/${id}?apikey=97a6fcd5e744d6401c2bb739666e673a`)
  
    .then(response => response.json())
      .then(charactersDetails => {
        realizarConsulta(charactersDetails.data.results)
        
      })
      .catch(error => {
        // Manejo de errores, si es necesario
        console.error('Error al obtener los datos de la API:', error);
      });
  }

  obtenerIdPersonaje();