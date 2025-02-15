document.addEventListener('DOMContentLoaded', () => {
    const powers = [
        { 
            name: 'sword',
            image: 'images/kirby_sword.png',
            description: 'Kirby got the power to wild a mighty sword!'
        },
        { 
            name: 'cutter',
            image: 'images/kirby_cutter.png',
            description: 'Kirby got the power to throw cutting boomerangs!'
        },
        { 
            name: 'sleep',
            image: 'images/kirby_sleep.png',
            description: 'Kirby is sleeping, shhh...'
        },
        { 
            name: 'beam',
            image: 'images/kirby_beam.png',
            description: 'Kirby got the power to beam... well, beams!'
        }
    ];

    const normalKirby = {
        image: 'images/kirby_base.png',
        description: 'Drag an enemy into Kirby for him to swallow them!'
    };

    const kirbyMouthOpen = {
        image: 'images/kirby_open.png',
        description: 'Drop the enemy!'
    };

    const kirbyImage = document.getElementById('kirby-image');
    const kirbyDescription = document.getElementById('kirby-description');
    const kirbyDropZone = document.getElementById('kirby-drop-zone');
    const enemies = document.querySelectorAll('.enemy');

    if (!kirbyImage || !kirbyDescription || !kirbyDropZone) {
        console.error("Couldn't find the necessary elements");
        return;
    }

    // Crear un elemento fantasma para el arrastre
    const createDragGhost = (enemy) => {
        const ghost = enemy.cloneNode(true);
        ghost.classList.add('enemy-ghost');
        ghost.style.position = 'fixed';
        ghost.style.pointerEvents = 'none';
        ghost.style.zIndex = '1000';
        ghost.style.opacity = '1';
        document.body.appendChild(ghost);
        return ghost;
    };

    // Actualizar la posición del elemento fantasma
    const updateGhostPosition = (ghost, e) => {
        if (ghost && e.clientX && e.clientY) {
            const rect = ghost.getBoundingClientRect();
            ghost.style.left = `${e.clientX - rect.width / 2}px`;
            ghost.style.top = `${e.clientY}px`;
        }
    };

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
        let ghostElement = null;

        enemy.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('power', enemy.dataset.power);
            
            // Crear el elemento fantasma inmediatamente
            ghostElement = createDragGhost(enemy);
            updateGhostPosition(ghostElement, e);
            
            // Configurar una imagen transparente para el drag nativo
            const img = new Image();
            img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
            e.dataTransfer.setDragImage(img, 0, 0);
            
            enemy.style.opacity = '0';
        });

        enemy.addEventListener('drag', (e) => {
            if (e.clientX !== 0 && e.clientY !== 0) { // Ignorar eventos con coordenadas 0
                updateGhostPosition(ghostElement, e);
            }
        });

        enemy.addEventListener('dragend', () => {
            enemy.style.opacity = '1';
            if (ghostElement) {
                ghostElement.remove();
                ghostElement = null;
            }
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
        if (kirbyImage.src !== kirbyMouthOpen.image) {
            kirbyImage.src = kirbyMouthOpen.image;
        }
    });

    kirbyDropZone.addEventListener('dragleave', (e) => {
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