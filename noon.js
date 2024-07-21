document.addEventListener('DOMContentLoaded', function () {
    let lastNoonIndex = -1; // Variable para almacenar el índice del último mensaje mostrado

    function loadRandomNoonMessage() {
        fetch('./medio.json')
            .then(response => response.json())
            .then(data => {
                const messages = data.noonMessages;
                let randomIndex;
                
                // Seleccionar un mensaje aleatorio que no sea el mismo que el anterior
                do {
                    randomIndex = Math.floor(Math.random() * messages.length);
                } while (randomIndex === lastNoonIndex);

                lastNoonIndex = randomIndex; // Actualizar el índice del último mensaje mostrado
                
                const message = messages[randomIndex];
                console.log(message);

                // Actualizar el contenido del modal
                document.getElementById('noonModalLabel').textContent = message.modalTitle;
                document.getElementById('texto1').innerHTML = message.headerText;
                document.getElementById('imagen').src = message.image.src;
                document.getElementById('imagen').alt = message.image.alt;
                document.getElementById('textob').textContent = message.buttonText;
            })
            .catch(error => console.error('Error loading JSON:', error));
    }

    // Añadir evento para cargar el mensaje aleatorio cuando se abre el modal
    var noonModal = document.getElementById('noonModal');
    noonModal.addEventListener('show.bs.modal', loadRandomNoonMessage);
});