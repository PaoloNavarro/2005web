document.addEventListener('DOMContentLoaded', function () {
    let lastRandomIndex = -1; // Variable para almacenar el índice del último mensaje mostrado

    function loadRandomNightMessage() {
        fetch('../datos/night.json')
            .then(response => response.json())
            .then(data => {
                // Seleccionar un mensaje aleatorio que no sea el mismo que el anterior
                const messages = data.nightMessages;
                let randomIndex;
                
                do {
                    randomIndex = Math.floor(Math.random() * messages.length);
                } while (randomIndex === lastRandomIndex);

                lastRandomIndex = randomIndex; // Actualizar el índice del último mensaje mostrado
                
                const message = messages[randomIndex];
                console.log(message);

                // Actualizar el contenido del modal
                document.getElementById('nightModalLabel').textContent = message.modalTitle;
                document.getElementById('textom1').innerHTML = message.mainText;
                document.getElementById('button-t').textContent = message.buttonText;
                document.getElementById('button-t').setAttribute('data-bs-title', message.popoverTitle);
                document.getElementById('button-t').setAttribute('data-bs-content', message.popoverContent);

                // Inicializar Popover
                var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
                var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
                    return new bootstrap.Popover(popoverTriggerEl);
                });

                // Actualizar las imágenes del carrusel
                for (let i = 0; i < message.carouselImages.length; i++) {
                    document.getElementById(`img-${i+1}`).src = message.carouselImages[i].src;
                    document.getElementById(`img-${i+1}`).alt = message.carouselImages[i].alt;
                }

                document.getElementById('fin-mod').innerHTML = message.footerText;
            })
            .catch(error => console.error('Error loading JSON:', error));
    }

    // Añadir evento para cargar el mensaje aleatorio cuando se abre el modal
    var nightModal = document.getElementById('nightModal');
    nightModal.addEventListener('show.bs.modal', loadRandomNightMessage);
});