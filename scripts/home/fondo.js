document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('container');
    const backgrounds = ['background-1', 'background-2', 'background-3', 'background-4', 'background-5', 'background-6'];
    
    // Si no hay fondos no utilizados en el almacenamiento, inicializa la lista de fondos no utilizados
    if (!sessionStorage.getItem('unusedBackgrounds')) {
        sessionStorage.setItem('unusedBackgrounds', JSON.stringify(backgrounds));
    }

    let unusedBackgrounds = JSON.parse(sessionStorage.getItem('unusedBackgrounds'));

    if (unusedBackgrounds.length === 0) {
        // Reinicia la lista de fondos no utilizados
        unusedBackgrounds = [...backgrounds];
    }

    const randomIndex = Math.floor(Math.random() * unusedBackgrounds.length);
    const selectedBackground = unusedBackgrounds.splice(randomIndex, 1)[0];
    
    container.classList.add(selectedBackground);

    // Guarda la lista actualizada de fondos no utilizados
    sessionStorage.setItem('unusedBackgrounds', JSON.stringify(unusedBackgrounds));
});

