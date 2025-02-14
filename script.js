document.addEventListener('DOMContentLoaded', () => {
    const powers = [
        { 
            name: 'sword',
            image: 'images/kirby_sword.png',
            description: '¡Kirby obtuvo el poder de la espada!'
        },
        { 
            name: 'cutter',
            image: 'images/kirby_cutter.png',
            description: '¡Kirby obtuvo el poder de cortar!'
        },
        { 
            name: 'sleep',
            image: 'images/kirby_sleep.png',
            description: '¡Kirby está durmiendo!'
        },
        { 
            name: 'beam',
            image: 'images/kirby_beam.png',
            description: '¡Kirby obtuvo el poder del rayo!'
        }
    ];

    const normalKirby = {
        image: 'images/kirby_base.png',
        description: '¡Arrastra un enemigo hacia Kirby para que copie sus poderes!'
    };

    // Nueva imagen de Kirby con la boca abierta
    const kirbyMouthOpen = {
        image: 'images/kirby_open.png', // Necesitamos una imagen de Kirby con la boca abierta
        description: '¡Suelta el enemigo para que Kirby copie sus poderes!'
    };

    const kirbyImage = document.getElementById('kirby-image');
    const kirbyDescription = document.getElementById('kirby-description');
    const kirbyDropZone = document.getElementById('kirby-drop-zone');
    const enemies = document.querySelectorAll('.enemy');

    if (!kirbyImage || !kirbyDescription || !kirbyDropZone) {
        console.error('No se encontraron los elementos necesarios');
        return;
    }

    // Prevenir el comportamiento por defecto del navegador para permitir el drop
    document.addEventListener('dragover', (e) => e.preventDefault());
    document.addEventListener('drop', (e) => e.preventDefault());

    // Reset to normal Kirby when clicking the image
    kirbyImage.addEventListener('click', () => {
        kirbyImage.src = normalKirby.image;
        kirbyDescription.textContent = normalKirby.description;
    });

    // Drag and Drop functionality
    enemies.forEach(enemy => {
        enemy.addEventListener('dragstart', (e) => {
            enemy.classList.add('dragging');
            e.dataTransfer.setData('power', enemy.dataset.power);
        });

        enemy.addEventListener('dragend', () => {
            enemy.classList.remove('dragging');
        });
    });

    // Eventos del drop zone de Kirby
    kirbyDropZone.addEventListener('dragenter', (e) => {
        e.preventDefault();
        e.stopPropagation();
        kirbyDropZone.classList.add('dragover');
        kirbyImage.src = kirbyMouthOpen.image;
        kirbyDescription.textContent = kirbyMouthOpen.description;
    });

    kirbyDropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Asegurarse de que la imagen de boca abierta se mantenga
        if (kirbyImage.src !== kirbyMouthOpen.image) {
            kirbyImage.src = kirbyMouthOpen.image;
        }
    });

    kirbyDropZone.addEventListener('dragleave', (e) => {
        // Verificar si realmente salimos del drop zone y no de un elemento hijo
        const rect = kirbyDropZone.getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;
        
        if (x <= rect.left || x >= rect.right || y <= rect.top || y >= rect.bottom) {
            kirbyDropZone.classList.remove('dragover');
            kirbyImage.src = normalKirby.image;
            kirbyDescription.textContent = normalKirby.description;
        }
    });

    kirbyDropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        kirbyDropZone.classList.remove('dragover');
        
        const powerName = e.dataTransfer.getData('power');
        console.log('Power dropped:', powerName);
        
        const power = powers.find(p => p.name === powerName);
        if (power) {
            console.log('Transforming to:', power.name);
            kirbyImage.src = power.image;
            kirbyDescription.textContent = power.description;
        } else {
            console.log('Power not found:', powerName);
            kirbyImage.src = normalKirby.image;
            kirbyDescription.textContent = normalKirby.description;
        }
    });

    // Set initial Kirby image
    kirbyImage.src = normalKirby.image;
    kirbyDescription.textContent = normalKirby.description;
});