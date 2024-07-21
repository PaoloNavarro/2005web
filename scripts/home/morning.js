document.addEventListener('DOMContentLoaded', function () {
    let previousIndex = null;

    function loadRandomMorningMessage() {
      fetch('../../datos/morning.json')
        .then(response => response.json())
        .then(data => {
          const messages = data.morningMessages;
          let randomIndex;

          do {
            randomIndex = Math.floor(Math.random() * messages.length);
          } while (randomIndex === previousIndex);

          previousIndex = randomIndex;
          const message = messages[randomIndex];

          // Actualizar el contenido del modal
          document.getElementById('morningModalLabel').textContent = message.modalTitle;
          document.getElementById('morningHeaderText').innerHTML = message.headerText;
          document.getElementById('morningImage').src = message.imageModal.src;
          document.getElementById('morningImage').alt = message.imageModal.alt;

          document.getElementById('titulo-acordion-morning').textContent = message.accordion.accordionTitle;
          
          message.accordion.messages.forEach((msg, index) => {
            document.getElementById(`f${index + 1}-morning`).textContent = msg.text;
          });

          // Asignar una imagen para el acordeón si existe
          document.getElementById('accordionImage').src = message.imageAcordion.src;
          document.getElementById('accordionImage').alt = message.imageAcordion.alt;
        })
        .catch(error => console.error('Error loading JSON:', error));
    }

    var myModal = document.getElementById('morningModal');
    myModal.addEventListener('show.bs.modal', loadRandomMorningMessage);
  });