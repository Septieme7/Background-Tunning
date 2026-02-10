// ===== SYSTÈME BGSEVEN - MOTEUR D'ANIMATION =====
class BgsevenAnimationSystem {
    constructor() {
        this.config = {
            // COMMANDE: Configuration des images par effet
            imagePaths: {
                // BOUNCE: Utilise seulement CroixCamarguaise.png
                bounce: ['assets/images/CroixCamarguaise.png'],
                
                // COLLIDE: Utilise seulement CroixCamarguaise.png  
                collide: ['assets/images/CroixCamarguaise.png'],
                
                // TRIOSPHERES: Utilise bgseven1.png avec lignes centrées
                triospheres: ['assets/images/bgseven1.png',
                            'assets/images/bgseven3.png',
                            'assets/images/bgseven4.png' 
                ],
                // PARTICLES: Utilise bgseven2.png, bgseven3.png, bgseven4.png
                particles: [
                    'assets/images/bgseven2.png',
                    'assets/images/bgseven3.png', 
                    'assets/images/bgseven4.png'
                ],
                
                // WAVES: Utilise bgseven5.png à bgseven9.png
                waves: [
                    'assets/images/bgseven5.png',
                    'assets/images/bgseven6.png',
                    'assets/images/bgseven7.png',
                    'assets/images/bgseven8.png',
                    'assets/images/bgseven9.png'
                ],
                
                // NETWORK: Utilise bgseven10.png à bgseven14.png
                network: [
                    'assets/images/bgseven10.png',
                    'assets/images/bgseven11.png',
                    'assets/images/bgseven12.png',
                    'assets/images/bgseven13.png',
                    'assets/images/bgseven14.png'
                ],
                
                // GEOM: Utilise bgseven15.png à bgseven19.png
                geom: [
                    'assets/images/bgseven15.png',
                    'assets/images/bgseven16.png',
                    'assets/images/bgseven17.png',
                    'assets/images/bgseven18.png',
                    'assets/images/bgseven19.png'
                ]
            },
            
            currentEffect: 'bounce',
            
            // COMMANDE: Configuration des paramètres par effet
            effects: {
                // BOUNCE: 12 éléments, taille 40-90px, vitesse 1-3
                bounce: { count: 12, minSize: 40, maxSize: 90, minSpeed: 1, maxSpeed: 3 },
                
                // COLLIDE: 15 éléments, taille 35-70px, vitesse 2-4  
                collide: { count: 15, minSize: 35, maxSize: 70, minSpeed: 2, maxSpeed: 4 },
                
                // TRIOSPHERES: 9 éléments (3 trios), taille 50-80px, vitesse 1-2
                triospheres: { count: 9, minSize: 50, maxSize: 80, minSpeed: 1, maxSpeed: 2 },
                
                // PARTICLES: 25 éléments, taille 25-60px, vitesse 1-3
                particles: { count: 25, minSize: 25, maxSize: 60, minSpeed: 1, maxSpeed: 3 },
                
                // WAVES: 20 éléments, taille 30-70px, vitesse 1-2
                waves: { count: 20, minSize: 30, maxSize: 70, minSpeed: 1, maxSpeed: 2 },
                
                // NETWORK: 18 éléments, taille 35-75px, vitesse 1-2
                network: { count: 18, minSize: 35, maxSize: 75, minSpeed: 1, maxSpeed: 2 },
                
                // GEOM: 15 éléments, taille 40-80px, vitesse 1-2
                geom: { count: 15, minSize: 40, maxSize: 80, minSpeed: 1, maxSpeed: 2 }
            }
        };
        
        this.elements = [];
        this.connections = [];
        this.animationId = null;
        this.waves = [];
        
        this.effectDescriptions = {
            bounce: "Images qui rebondissent sur les bords de l'écran avec différentes tailles et vitesses.",
            collide: "Quand les images se rencontrent, elles disparaissent et réapparaissent ailleurs aléatoirement.",
            triospheres: "Groupes de trois images reliées par des lignes, tournant et rebondissant ensemble.",
            particles: "Nuage d'images variées qui s'attirent et se repoussent créant des mouvements organiques.",
            waves: "Ondes sinusoïdales formées par différentes images qui se propagent et interfèrent.",
            network: "Réseau d'images connectées qui se réorganisent dynamiquement.",
            geom: "Images géométriques variées qui se transforment et se déplacent harmonieusement."
        };
        
        this.init();
    }

    // COMMANDE: Initialisation du système
    init() {
        this.initThemeToggle();
        this.initEffectsMenu();
        this.initCurrentEffect();
        this.bindEvents();
        console.log('🎨 Système BgSeven initialisé');
    }

    // COMMANDE: Gestion du thème clair/sombre
    initThemeToggle() {
        const themeToggle = document.getElementById('bgsevenThemeToggle');
        const body = document.body;
        
        const savedTheme = localStorage.getItem('bgseven-theme') || 'light';
        if (savedTheme === 'dark') {
            body.classList.remove('bgseven-light-mode');
            body.classList.add('bgseven-dark-mode');
            themeToggle.textContent = '☀️';
        } else {
            body.classList.remove('bgseven-dark-mode');
            body.classList.add('bgseven-light-mode');
            themeToggle.textContent = '🌙';
        }
        
        themeToggle.addEventListener('click', () => {
            if (body.classList.contains('bgseven-light-mode')) {
                body.classList.remove('bgseven-light-mode');
                body.classList.add('bgseven-dark-mode');
                themeToggle.textContent = '☀️';
                localStorage.setItem('bgseven-theme', 'dark');
            } else {
                body.classList.remove('bgseven-dark-mode');
                body.classList.add('bgseven-light-mode');
                themeToggle.textContent = '🌙';
                localStorage.setItem('bgseven-theme', 'light');
            }
        });
    }

    // COMMANDE: Gestion du menu des effets
    initEffectsMenu() {
        const menuToggle = document.getElementById('bgsevenMenuToggle');
        const effectsList = document.getElementById('bgsevenEffectsList');
        const effectButtons = document.querySelectorAll('.bgseven-effect-btn');
        
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            effectsList.classList.toggle('show');
        });
        
        effectButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const effect = btn.dataset.effect;
                this.changeEffect(effect);
                effectsList.classList.remove('show');
                
                effectButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.bgseven-effects-menu')) {
                effectsList.classList.remove('show');
            }
        });
    }

    // COMMANDE: Changement d'effet
    changeEffect(effectName) {
        console.log(`🔄 Changement d'effet: ${effectName}`);
        this.stopAnimation();
        this.clearElements();
        this.config.currentEffect = effectName;
        this.initCurrentEffect();
        
        this.updateEffectInfo(effectName);
    }

    // COMMANDE: Mise à jour des informations d'effet
    updateEffectInfo(effectName) {
        const config = this.config.effects[effectName];
        document.getElementById('currentEffectName').textContent = this.getEffectDisplayName(effectName);
        document.getElementById('effectDescription').textContent = this.effectDescriptions[effectName];
        document.getElementById('elementCount').textContent = config.count;
        document.getElementById('sizeRange').textContent = `${config.minSize}-${config.maxSize}px`;
        document.getElementById('speedRange').textContent = `${config.minSpeed}-${config.maxSpeed}`;
    }

    getEffectDisplayName(effect) {
        const names = {
            bounce: "Rebonds",
            collide: "Collisions", 
            triospheres: "Trios Sphères",
            particles: "Particules",
            waves: "Ondes",
            network: "Réseau",
            geom: "Géométrie"
        };
        return names[effect] || effect;
    }

    // COMMANDE: Sélection aléatoire d'image pour un effet
    getRandomImageForEffect(effect) {
        const images = this.config.imagePaths[effect];
        if (!images || images.length === 0) {
            console.warn(`⚠️ Aucune image trouvée pour l'effet: ${effect}`);
            return 'assets/images/CroixCamarguaise.png'; // Fallback
        }
        return images[Math.floor(Math.random() * images.length)];
    }

    // COMMANDE: Initialisation de l'effet courant
    initCurrentEffect() {
        const effect = this.config.currentEffect;
        console.log(`🎯 Initialisation effet: ${effect}`);
        
        switch(effect) {
            case 'bounce': this.initBounceEffect(); break;        // BOUNCE: Rebonds simples
            case 'collide': this.initCollideEffect(); break;      // COLLIDE: Collisions avec téléportation
            case 'triospheres': this.initTrioSpheresEffect(); break; // TRIOSPHERES: Trios avec lignes centrées
            case 'particles': this.initParticlesEffect(); break;  // PARTICLES: Particules avec attraction
            case 'waves': this.initWavesEffect(); break;          // WAVES: Ondes sinusoïdales
            case 'network': this.initNetworkEffect(); break;      // NETWORK: Réseau connecté
            case 'geom': this.initGeometryEffect(); break;        // GEOM: Géométrie rotative
        }
        
        this.startAnimation();
    }

    // COMMANDE: Création d'un élément image
    createImageElement(x, y, size, effect) {
        const element = document.createElement('img');
        const imageSrc = this.getRandomImageForEffect(effect);
        
        element.src = imageSrc;
        element.classList.add('bgseven-bouncing-image');
        element.alt = `Element ${effect}`;
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        element.style.opacity = '0';
        
        // Animation d'apparition
        setTimeout(() => {
            element.style.transition = 'opacity 0.5s ease';
            element.style.opacity = '1';
        }, 100);
        
        return element;
    }

    // COMMANDE BOUNCE: Initialise l'effet de rebonds simples
    initBounceEffect() {
        const config = this.config.effects.bounce;
        const container = document.getElementById('bgsevenAnimatedBackground');
        
        for (let i = 0; i < config.count; i++) {
            const size = Math.floor(Math.random() * (config.maxSize - config.minSize)) + config.minSize;
            const x = Math.random() * (window.innerWidth - size);
            const y = Math.random() * (window.innerHeight - size);
            
            const element = this.createImageElement(x, y, size, 'bounce');
            container.appendChild(element);
            
            this.elements.push({
                element,
                x, y, size,
                speedX: (Math.random() * (config.maxSpeed - config.minSpeed) + config.minSpeed) * (Math.random() < 0.5 ? -1 : 1),
                speedY: (Math.random() * (config.maxSpeed - config.minSpeed) + config.minSpeed) * (Math.random() < 0.5 ? -1 : 1)
            });
        }
    }

    // COMMANDE COLLIDE: Initialise l'effet de collisions avec téléportation
    initCollideEffect() {
        const config = this.config.effects.collide;
        const container = document.getElementById('bgsevenAnimatedBackground');
        
        for (let i = 0; i < config.count; i++) {
            const size = Math.floor(Math.random() * (config.maxSize - config.minSize)) + config.minSize;
            const x = Math.random() * (window.innerWidth - size);
            const y = Math.random() * (window.innerHeight - size);
            
            const element = this.createImageElement(x, y, size, 'collide');
            container.appendChild(element);
            
            this.elements.push({
                element,
                x, y, size,
                speedX: (Math.random() * (config.maxSpeed - config.minSpeed) + config.minSpeed) * (Math.random() < 0.5 ? -1 : 1),
                speedY: (Math.random() * (config.maxSpeed - config.minSpeed) + config.minSpeed) * (Math.random() < 0.5 ? -1 : 1),
                visible: true
            });
        }
    }

    // COMMANDE TRIOSPHERES: Initialise l'effet trios avec lignes centrées
    initTrioSpheresEffect() {
        const config = this.config.effects.triospheres;
        const container = document.getElementById('bgsevenAnimatedBackground');
        const trioCount = Math.floor(config.count / 3);
        
        for (let i = 0; i < trioCount; i++) {
            const centerX = Math.random() * window.innerWidth;
            const centerY = Math.random() * window.innerHeight;
            const radius = 100 + Math.random() * 80;
            const trio = [];
            
            for (let j = 0; j < 3; j++) {
                const angle = (j * 2 * Math.PI) / 3;
                const size = Math.floor(Math.random() * (config.maxSize - config.minSize)) + config.minSize;
                const x = centerX + Math.cos(angle) * radius - size/2;
                const y = centerY + Math.sin(angle) * radius - size/2;
                
                const element = this.createImageElement(x, y, size, 'triospheres');
                container.appendChild(element);
                
                const obj = {
                    element,
                    x, y, size,
                    centerX, centerY, radius, angle,
                    angularSpeed: (Math.random() * 0.02 + 0.01) * (Math.random() < 0.5 ? -1 : 1),
                    speedX: (Math.random() * (config.maxSpeed - config.minSpeed) + config.minSpeed) * (Math.random() < 0.5 ? -1 : 1),
                    speedY: (Math.random() * (config.maxSpeed - config.minSpeed) + config.minSpeed) * (Math.random() < 0.5 ? -1 : 1)
                };
                
                this.elements.push(obj);
                trio.push(obj);
            }
            
            this.createTrioConnections(trio);
        }
    }

    // COMMANDE PARTICLES: Initialise l'effet particules avec images variées
    initParticlesEffect() {
        const config = this.config.effects.particles;
        const container = document.getElementById('bgsevenAnimatedBackground');
        
        for (let i = 0; i < config.count; i++) {
            const size = Math.floor(Math.random() * (config.maxSize - config.minSize)) + config.minSize;
            const x = Math.random() * (window.innerWidth - size);
            const y = Math.random() * (window.innerHeight - size);
            
            const element = this.createImageElement(x, y, size, 'particles');
            element.style.opacity = '0.8';
            container.appendChild(element);
            
            this.elements.push({
                element,
                x, y, size,
                speedX: (Math.random() * (config.maxSpeed - config.minSpeed) + config.minSpeed) * (Math.random() < 0.5 ? -1 : 1),
                speedY: (Math.random() * (config.maxSpeed - config.minSpeed) + config.minSpeed) * (Math.random() < 0.5 ? -1 : 1)
            });
        }
    }

    // COMMANDE WAVES: Initialise l'effet ondes sinusoïdales
    initWavesEffect() {
        const config = this.config.effects.waves;
        const container = document.getElementById('bgsevenAnimatedBackground');
        this.waves = [];
        
        for (let i = 0; i < 4; i++) {
            const wave = {
                amplitude: 60 + Math.random() * 80,
                frequency: 0.008 + Math.random() * 0.015,
                speed: 1 + Math.random() * 2,
                phase: Math.random() * Math.PI * 2,
                y: Math.random() * window.innerHeight,
                image: this.getRandomImageForEffect('waves'),
                elements: []
            };
            
            const elementsPerWave = Math.floor(config.count / 4);
            for (let j = 0; j < elementsPerWave; j++) {
                const size = Math.floor(Math.random() * (config.maxSize - config.minSize)) + config.minSize;
                const x = (j / elementsPerWave) * window.innerWidth;
                const y = wave.y;
                
                const element = document.createElement('img');
                element.src = wave.image;
                element.classList.add('bgseven-bouncing-image');
                element.alt = 'Onde';
                element.style.width = `${size}px`;
                element.style.height = `${size}px`;
                element.style.left = `${x}px`;
                element.style.top = `${y}px`;
                element.style.opacity = '0.7';
                container.appendChild(element);
                
                const obj = {
                    element,
                    x, y, size,
                    waveIndex: i,
                    elementIndex: j,
                    baseY: wave.y
                };
                
                this.elements.push(obj);
                wave.elements.push(obj);
            }
            
            this.waves.push(wave);
        }
    }

    // COMMANDE NETWORK: Initialise l'effet réseau connecté
    initNetworkEffect() {
        const config = this.config.effects.network;
        const container = document.getElementById('bgsevenAnimatedBackground');
        
        for (let i = 0; i < config.count; i++) {
            const size = Math.floor(Math.random() * (config.maxSize - config.minSize)) + config.minSize;
            const x = Math.random() * (window.innerWidth - size);
            const y = Math.random() * (window.innerHeight - size);
            
            const element = this.createImageElement(x, y, size, 'network');
            container.appendChild(element);
            
            this.elements.push({
                element,
                x, y, size,
                speedX: (Math.random() * (config.maxSpeed - config.minSpeed) + config.minSpeed) * (Math.random() < 0.5 ? -1 : 1),
                speedY: (Math.random() * (config.maxSpeed - config.minSpeed) + config.minSpeed) * (Math.random() < 0.5 ? -1 : 1)
            });
        }
    }

    // COMMANDE GEOM: Initialise l'effet géométrie rotative
    initGeometryEffect() {
        const config = this.config.effects.geom;
        const container = document.getElementById('bgsevenAnimatedBackground');
        
        for (let i = 0; i < config.count; i++) {
            const size = Math.floor(Math.random() * (config.maxSize - config.minSize)) + config.minSize;
            const x = Math.random() * (window.innerWidth - size);
            const y = Math.random() * (window.innerHeight - size);
            
            const element = this.createImageElement(x, y, size, 'geom');
            container.appendChild(element);
            
            this.elements.push({
                element,
                x, y, size,
                speedX: (Math.random() * (config.maxSpeed - config.minSpeed) + config.minSpeed) * (Math.random() < 0.5 ? -1 : 1),
                speedY: (Math.random() * (config.maxSpeed - config.minSpeed) + config.minSpeed) * (Math.random() < 0.5 ? -1 : 1),
                rotation: 0,
                rotationSpeed: (Math.random() - 0.5) * 0.03
            });
        }
    }

    // COMMANDE: Création des connexions pour les trios
    createTrioConnections(trio) {
        for (let i = 0; i < trio.length; i++) {
            for (let j = i + 1; j < trio.length; j++) {
                const line = document.createElement('div');
                line.classList.add('bgseven-connection');
                document.getElementById('bgsevenAnimatedBackground').appendChild(line);
                
                this.connections.push({
                    element: line,
                    point1: trio[i],
                    point2: trio[j]
                });
            }
        }
    }

    // COMMANDE: Mise à jour de la position d'un élément
    updateElementPosition(obj) {
        obj.element.style.left = `${obj.x}px`;
        obj.element.style.top = `${obj.y}px`;
        
        if (obj.rotation !== undefined) {
            obj.element.style.transform = `rotate(${obj.rotation}rad)`;
        }
    }

    // COMMANDE: Mise à jour des connexions
    updateConnections() {
        this.connections.forEach(conn => {
            const x1 = conn.point1.x + conn.point1.size/2;
            const y1 = conn.point1.y + conn.point1.size/2;
            const x2 = conn.point2.x + conn.point2.size/2;
            const y2 = conn.point2.y + conn.point2.size/2;
            
            const dx = x2 - x1;
            const dy = y2 - y1;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);
            
            conn.element.style.width = `${length}px`;
            conn.element.style.left = `${x1}px`;
            conn.element.style.top = `${y1}px`;
            conn.element.style.transform = `rotate(${angle}rad)`;
        });
    }

    // COMMANDE: Boucle d'animation principale
    animate() {
        const effect = this.config.currentEffect;
        
        switch(effect) {
            case 'bounce': this.animateBounce(); break;        // BOUNCE: Animation rebonds
            case 'collide': this.animateCollide(); break;      // COLLIDE: Animation collisions
            case 'triospheres': this.animateTrioSpheres(); break; // TRIOSPHERES: Animation trios
            case 'particles': this.animateParticles(); break;  // PARTICLES: Animation particules
            case 'waves': this.animateWaves(); break;          // WAVES: Animation ondes
            case 'network': this.animateNetwork(); break;      // NETWORK: Animation réseau
            case 'geom': this.animateGeometry(); break;        // GEOM: Animation géométrie
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    // COMMANDE BOUNCE: Animation des rebonds simples
    animateBounce() {
        this.elements.forEach(obj => {
            obj.x += obj.speedX;
            obj.y += obj.speedY;
            
            if (obj.x <= 0 || obj.x >= window.innerWidth - obj.size) {
                obj.speedX = -obj.speedX;
                obj.x = Math.max(0, Math.min(obj.x, window.innerWidth - obj.size));
            }
            
            if (obj.y <= 0 || obj.y >= window.innerHeight - obj.size) {
                obj.speedY = -obj.speedY;
                obj.y = Math.max(0, Math.min(obj.y, window.innerHeight - obj.size));
            }
            
            this.updateElementPosition(obj);
        });
    }

    // COMMANDE COLLIDE: Animation des collisions avec téléportation
    animateCollide() {
        this.elements.forEach(obj => {
            if (!obj.visible) return;
            
            obj.x += obj.speedX;
            obj.y += obj.speedY;
            
            if (obj.x <= 0 || obj.x >= window.innerWidth - obj.size) {
                obj.speedX = -obj.speedX;
                obj.x = Math.max(0, Math.min(obj.x, window.innerWidth - obj.size));
            }
            
            if (obj.y <= 0 || obj.y >= window.innerHeight - obj.size) {
                obj.speedY = -obj.speedY;
                obj.y = Math.max(0, Math.min(obj.y, window.innerHeight - obj.size));
            }
            
            this.elements.forEach(other => {
                if (obj !== other && other.visible) {
                    const dx = (obj.x + obj.size/2) - (other.x + other.size/2);
                    const dy = (obj.y + obj.size/2) - (other.y + other.size/2);
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < (obj.size + other.size) / 2) {
                        obj.visible = false;
                        other.visible = false;
                        obj.element.style.opacity = '0';
                        other.element.style.opacity = '0';
                        
                        setTimeout(() => {
                            obj.x = Math.random() * (window.innerWidth - obj.size);
                            obj.y = Math.random() * (window.innerHeight - obj.size);
                            other.x = Math.random() * (window.innerWidth - other.size);
                            other.y = Math.random() * (window.innerHeight - other.size);
                            obj.visible = true;
                            other.visible = true;
                            obj.element.style.opacity = '1';
                            other.element.style.opacity = '1';
                        }, 500);
                    }
                }
            });
            
            this.updateElementPosition(obj);
        });
    }

    // COMMANDE TRIOSPHERES: Animation des trios avec lignes centrées
    animateTrioSpheres() {
        const trios = {};
        this.elements.forEach(obj => {
            const key = `${obj.centerX}_${obj.centerY}`;
            if (!trios[key]) trios[key] = [];
            trios[key].push(obj);
        });
        
        Object.values(trios).forEach(trio => {
            if (trio.length > 0) {
                const leader = trio[0];
                leader.centerX += leader.speedX;
                leader.centerY += leader.speedY;
                
                if (leader.centerX <= 0 || leader.centerX >= window.innerWidth) {
                    leader.speedX = -leader.speedX;
                    leader.centerX = Math.max(0, Math.min(leader.centerX, window.innerWidth));
                }
                
                if (leader.centerY <= 0 || leader.centerY >= window.innerHeight) {
                    leader.speedY = -leader.speedY;
                    leader.centerY = Math.max(0, Math.min(leader.centerY, window.innerHeight));
                }
                
                trio.forEach(obj => {
                    obj.angle += obj.angularSpeed;
                    obj.x = leader.centerX + Math.cos(obj.angle) * obj.radius - obj.size/2;
                    obj.y = leader.centerY + Math.sin(obj.angle) * obj.radius - obj.size/2;
                    obj.centerX = leader.centerX;
                    obj.centerY = leader.centerY;
                    this.updateElementPosition(obj);
                });
            }
        });
        
        this.updateConnections();
    }

    // COMMANDE PARTICLES: Animation des particules
    animateParticles() {
        this.elements.forEach(obj => {
            obj.x += obj.speedX;
            obj.y += obj.speedY;
            
            if (obj.x <= 0 || obj.x >= window.innerWidth - obj.size) {
                obj.speedX = -obj.speedX;
                obj.x = Math.max(0, Math.min(obj.x, window.innerWidth - obj.size));
            }
            
            if (obj.y <= 0 || obj.y >= window.innerHeight - obj.size) {
                obj.speedY = -obj.speedY;
                obj.y = Math.max(0, Math.min(obj.y, window.innerHeight - obj.size));
            }
            
            this.updateElementPosition(obj);
        });
    }

    // COMMANDE WAVES: Animation des ondes sinusoïdales
    animateWaves() {
        const time = Date.now() * 0.001;
        
        this.waves.forEach(wave => {
            wave.elements.forEach(obj => {
                obj.y = obj.baseY + Math.sin(obj.x * wave.frequency + time * wave.speed + wave.phase) * wave.amplitude;
                this.updateElementPosition(obj);
            });
        });
    }

    // COMMANDE NETWORK: Animation du réseau connecté
    animateNetwork() {
        this.elements.forEach(obj => {
            obj.x += obj.speedX;
            obj.y += obj.speedY;
            
            if (obj.x <= 0 || obj.x >= window.innerWidth - obj.size) {
                obj.speedX = -obj.speedX;
                obj.x = Math.max(0, Math.min(obj.x, window.innerWidth - obj.size));
            }
            
            if (obj.y <= 0 || obj.y >= window.innerHeight - obj.size) {
                obj.speedY = -obj.speedY;
                obj.y = Math.max(0, Math.min(obj.y, window.innerHeight - obj.size));
            }
            
            this.updateElementPosition(obj);
        });
        
        this.updateNetworkConnections();
    }

    // COMMANDE GEOM: Animation de la géométrie rotative
    animateGeometry() {
        this.elements.forEach(obj => {
            obj.x += obj.speedX;
            obj.y += obj.speedY;
            obj.rotation += obj.rotationSpeed;
            
            if (obj.x <= 0 || obj.x >= window.innerWidth - obj.size) {
                obj.speedX = -obj.speedX;
                obj.x = Math.max(0, Math.min(obj.x, window.innerWidth - obj.size));
            }
            
            if (obj.y <= 0 || obj.y >= window.innerHeight - obj.size) {
                obj.speedY = -obj.speedY;
                obj.y = Math.max(0, Math.min(obj.y, window.innerHeight - obj.size));
            }
            
            this.updateElementPosition(obj);
        });
    }

    // COMMANDE: Mise à jour des connexions du réseau
    updateNetworkConnections() {
        this.connections.forEach(conn => conn.element.remove());
        this.connections = [];
        
        this.elements.forEach((obj, i) => {
            this.elements.forEach((other, j) => {
                if (i < j) {
                    const dx = obj.x - other.x;
                    const dy = obj.y - other.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 120) {
                        const line = document.createElement('div');
                        line.classList.add('bgseven-connection');
                        document.getElementById('bgsevenAnimatedBackground').appendChild(line);
                        
                        const x1 = obj.x + obj.size/2;
                        const y1 = obj.y + obj.size/2;
                        const x2 = other.x + other.size/2;
                        const y2 = other.y + other.size/2;
                        
                        const dx2 = x2 - x1;
                        const dy2 = y2 - y1;
                        const length = Math.sqrt(dx2 * dx2 + dy2 * dy2);
                        const angle = Math.atan2(dy2, dx2);
                        
                        line.style.width = `${length}px`;
                        line.style.left = `${x1}px`;
                        line.style.top = `${y1}px`;
                        line.style.transform = `rotate(${angle}rad)`;
                        line.style.opacity = `${1 - distance/120}`;
                        
                        this.connections.push({ element: line, point1: obj, point2: other });
                    }
                }
            });
        });
    }

    // COMMANDE: Démarrage de l'animation
    startAnimation() {
        if (!this.animationId) {
            this.animate();
            console.log('▶️ Animation démarrée');
        }
    }

    // COMMANDE: Arrêt de l'animation
    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
            console.log('⏹️ Animation arrêtée');
        }
    }

    // COMMANDE: Nettoyage des éléments
    clearElements() {
        this.stopAnimation();
        
        this.elements.forEach(obj => {
            if (obj.element && obj.element.parentNode) {
                obj.element.parentNode.removeChild(obj.element);
            }
        });
        this.elements = [];
        
        this.connections.forEach(conn => {
            if (conn.element && conn.element.parentNode) {
                conn.element.parentNode.removeChild(conn.element);
            }
        });
        this.connections = [];
        
        this.waves = [];
        console.log('🧹 Éléments nettoyés');
    }

    // COMMANDE: Gestion des événements
    bindEvents() {
        window.addEventListener('resize', () => {
            this.elements.forEach(obj => {
                if (obj.x > window.innerWidth - obj.size) {
                    obj.x = window.innerWidth - obj.size;
                }
                if (obj.y > window.innerHeight - obj.size) {
                    obj.y = window.innerHeight - obj.size;
                }
                this.updateElementPosition(obj);
            });
        });

        window.addEventListener('beforeunload', () => {
            this.stopAnimation();
        });
    }
}

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', () => {
    window.bgsevenSystem = new BgsevenAnimationSystem();
    console.log('🚀 BgSeven prêt!');
});

// ===== API GLOBALE =====
window.BgsevenBackground = {
    // COMMANDE: Initialiser un effet spécifique
    init: function(effect = 'bounce') {
        if (window.bgsevenSystem) {
            window.bgsevenSystem.changeEffect(effect);
        }
    },
    
    // COMMANDE: Changer le thème clair/sombre
    setTheme: function(theme) {
        const body = document.body;
        const themeToggle = document.getElementById('bgsevenThemeToggle');
        
        if (theme === 'dark') {
            body.classList.remove('bgseven-light-mode');
            body.classList.add('bgseven-dark-mode');
            themeToggle.textContent = '☀️';
            localStorage.setItem('bgseven-theme', 'dark');
        } else {
            body.classList.remove('bgseven-dark-mode');
            body.classList.add('bgseven-light-mode');
            themeToggle.textContent = '🌙';
            localStorage.setItem('bgseven-theme', 'light');
        }
    },
    
    // COMMANDE: Obtenir la configuration actuelle
    getConfig: function() {
        return window.bgsevenSystem ? window.bgsevenSystem.config : null;
    },
    
    // COMMANDE: Arrêter toutes les animations
    stop: function() {
        if (window.bgsevenSystem) {
            window.bgsevenSystem.stopAnimation();
        }
    }
};