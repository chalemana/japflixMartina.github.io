let peliculasArray = [];
let buscarInput = document.getElementById('inputBuscar');
let botonBuscar = document.getElementById('btnBuscar');
let offcanvasElement = null; 

// Pauta 1 - tener info de pelis dispponible sin que lo vea el usuario
document.addEventListener('DOMContentLoaded', () => {
    fetch('https://japceibal.github.io/japflix_api/movies-data.json')
        .then(response => response.json())
        .then(data => {
            peliculasArray = data;
            console.log('Películas subidas, sin mostrarlo al usuario', peliculasArray);
        })
        .catch(error => {
            console.error('Error con las películas subidas', error);
        });
});

// Pauta 2 a- cuando hace click el boton se muestra el listado que coincide segun title o genres o tagline u overview
botonBuscar.addEventListener('click', () => {
    let buscarTerm = buscarInput.value.toLowerCase();
    
    if (buscarTerm) {
        let filterPeli = peliculasArray.filter(peli => 
            peli.title.toLowerCase().includes(buscarTerm) || 
            peli.genres.some(genre => genre.name.toLowerCase().includes(buscarTerm)) ||
            peli.tagline.toLowerCase().includes(buscarTerm) || 
            peli.overview.toLowerCase().includes(buscarTerm)
        );
        mostrarPeli(filterPeli);  
    } 
});

//Pauta 2 b- La información a mostrar en este punto será: title, tagline, y vote_average (en formato de "estrellas").
function mostrarPeli(filterPeli) {
    let lista = document.getElementById('lista');
    lista.innerHTML = ''; 

    filterPeli.forEach(peli => {
        let li = document.createElement('li');
        li.classList.add('list-group-item');

        let textContainer = document.createElement('div');
        textContainer.classList.add('text-container');
        let title = document.createElement('h5');
        let tagline = document.createElement('p');
        title.textContent = peli.title;
        tagline.textContent = peli.tagline;
        textContainer.append(title, tagline);
        
        let rating = document.createElement('div');
        rating.classList.add('rating-container');
        rating.appendChild(puntuacionEstrella(peli.vote_average));

        li.append(textContainer, rating);

        li.addEventListener('click', () => mostrarDetallesPelicula(peli)); 

        lista.appendChild(li); 
    });
}

//vote_average (en formato de "estrellas")
function puntuacionEstrella(voteAverage) {
    let estrellaCont = document.createElement('div');
    estrellaCont.className = 'star-rating';
    
    for (let i = 1; i <= 5; i++) {
        let estrella = document.createElement('span');
        estrella.classList.add('fa', 'fa-star');
        if (i <= Math.round(voteAverage / 2)) {
            estrella.classList.add('checked');
        }
        estrellaCont.appendChild(estrella);
    }
    
    return estrellaCont;
}

//Pauta 3 y 4 crear un OffCanvas con info de dicha película: title, overview y lista de genres. Y Añadir en lo anterior un botón con un desplegable que contenga el año de lanzamiento (sin el mes ni el día), la duración del largometraje, el presupuesto con el que contó y las ganancias obtenidas
function crearOffcanvas() {
    offcanvasElement = document.createElement('div'); 
    offcanvasElement.className = 'offcanvas offcanvas-top';
    offcanvasElement.id = 'detallePeli';
    document.body.appendChild(offcanvasElement);
}

function mostrarDetallesPelicula(peli) {
    if (offcanvasElement) {
        offcanvasElement.innerHTML = ''; 
    } else {
        crearOffcanvas();
    }
    offcanvasElement.innerHTML = `
        <div class="offcanvas-header">
            <h5 class="offcanvas-title">${peli.title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div class="offcanvas-body">
            <p>${peli.overview}</p>
            <p><strong>Géneros:</strong> ${peli.genres.map(genre => genre.name).join(', ')}</p>
            <div class="dropdown">
                <button class="btn btn-outline-secondary" type="button" data-bs-toggle="dropdown">
                    More
                </button>
                <ul class="dropdown-menu">
                    <li>Year: ${peli.release_date.split('-')[0]}</li>
                    <li>Runtime: ${peli.runtime} minutos</li>
                    <li>Budget: $${peli.budget.toLocaleString()}</li>
                    <li>Revenue: $${peli.revenue.toLocaleString()}</li>
                </ul>
            </div>
        </div>
    `;

    let detallePeli = new bootstrap.Offcanvas(offcanvasElement);
    detallePeli.show();
}
