document.addEventListener('DOMContentLoaded', () => {
    const btnOui = document.getElementById('btn-oui');
    const btnNon = document.getElementById('btn-non');
    const quizContainer = document.getElementById('quiz-container');
    const qcmContainer = document.getElementById('qcm-container');
    const mainContent = document.getElementById('main-content');
    const reasonsList = document.getElementById('reasons-list');
    const heartsBg = document.getElementById('hearts-bg');

    // A. LECTEUR DE MUSIQUE
    const bgMusic = document.getElementById('bg-music');
    const btnMusic = document.getElementById('btn-music');
    const volumeSlider = document.getElementById('volume-slider');
    let isPlaying = false;

    if (btnMusic && bgMusic && volumeSlider) {
        bgMusic.volume = volumeSlider.value;

        btnMusic.addEventListener('click', () => {
            if (isPlaying) {
                bgMusic.pause();
                btnMusic.textContent = 'Play';
            } else {
                bgMusic.play();
                btnMusic.textContent = 'Pause';
            }
            isPlaying = !isPlaying;
        });

        volumeSlider.addEventListener('input', (e) => {
            bgMusic.volume = e.target.value;
        });
    }

    // B. COMPTEUR DE TEMPS ENSEMBLE (1er janvier 2024 à 00h01)
    const startDate = new Date('2024-01-01T00:01:00'); 

    function updateTimer() {
        const daysEl = document.getElementById('days');
        if (!daysEl) return;

        const now = new Date();
        const diff = now - startDate;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = hours;
        document.getElementById('minutes').textContent = minutes;
        document.getElementById('seconds').textContent = seconds;
    }

    setInterval(updateTimer, 1000);
    updateTimer();

    // 0. GENERATEUR DE COEURS FLOTTANTS EN FOND
    function createFloatingHeart() {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        
        const heartsSymbols = ['❤️', '💖', '💕', '💗', '✨'];
        heart.textContent = heartsSymbols[Math.floor(Math.random() * heartsSymbols.length)];
        
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = (Math.random() * 4 + 6) + 's';
        heart.style.fontSize = (Math.random() * 1 + 1) + 'rem';
        
        heartsBg.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 10000);
    }
    
    setInterval(createFloatingHeart, 500);

    // 1. Déplacement du bouton NON (sans emojis + textes dynamiques)
    const messagesNon = [
        "NON",
        "Essaye encore",
        "Raté !",
        "Mais...",
        "Tu n'y arriveras pas",
        "Toujours pas",
        "Hop là !",
        "Mauvais choix",
        "Clique sur OUI plutôt",
        "Presque !"
    ];
    let messageIndex = 0;

    function moveBtnNon(e) {
        if (e) e.preventDefault(); // Empêche le clic natif de valider quoi que ce soit

        const minDistance = 80;
        const maxDistance = 180;

        let randomX = (Math.random() - 0.5) * maxDistance * 2;
        let randomY = (Math.random() - 0.5) * maxDistance * 2;

        if (Math.abs(randomX) < minDistance) randomX = randomX < 0 ? -minDistance : minDistance;
        if (Math.abs(randomY) < minDistance) randomY = randomY < 0 ? -minDistance : minDistance;

        btnNon.style.transform = `translate(${randomX}px, ${randomY}px)`;

        // Met à jour le texte à chaque tentative
        messageIndex = (messageIndex + 1) % messagesNon.length;
        btnNon.textContent = messagesNon[messageIndex];
    }

    // Déclenche le déplacement au survol ET au clic/toucher
    btnNon.addEventListener('mouseover', moveBtnNon);
    btnNon.addEventListener('click', moveBtnNon);
    btnNon.addEventListener('touchstart', moveBtnNon);

    // 2. Passage au QCM quand elle clique sur OUI
    btnOui.addEventListener('click', () => {
        quizContainer.style.opacity = '0';
        setTimeout(() => {
            quizContainer.classList.add('hidden');
            qcmContainer.classList.remove('hidden');
            setTimeout(() => {
                qcmContainer.style.opacity = '1';
                loadQuestion();
            }, 50);
        }, 800);
    });

    // 3. LOGIQUE DU QCM
    const qcmQuestions = [
        {
            question: "Où a eu lieu notre tout premier rendez-vous ?",
            options: ["Au restaurant", "Au parc", "Au cinéma", "Dans un café"],
            correct: 2
        },
        {
            question: "Quel est mon plat préféré quand c'est toi qui le cuisines ?",
            options: ["Les pâtes carbonara", "La pizza maison", "Les crêpes", "Tout ce que tu fais ❤️"],
            correct: 3
        },
        {
            question: "Est-ce que je suis beau ?",
            options: ["Oui ❤️", "Évidemment Oui !", "Le plus beau du monde ❤️", "Oui à 1000% ❣️ "],
            correct: "all"
        }
    ];

    let currentQuestionIndex = 0;

    function loadQuestion() {
        const q = qcmQuestions[currentQuestionIndex];
        document.getElementById('qcm-progress').textContent = `Question ${currentQuestionIndex + 1} / ${qcmQuestions.length}`;
        document.getElementById('qcm-question').textContent = q.question;
        document.getElementById('qcm-feedback').textContent = '';

        const optionsContainer = document.getElementById('qcm-options');
        optionsContainer.innerHTML = '';

        q.options.forEach((optText, index) => {
            const btn = document.createElement('button');
            btn.classList.add('opt-btn');
            btn.textContent = optText;
            btn.addEventListener('click', () => checkAnswer(index, btn));
            optionsContainer.appendChild(btn);
        });
    }

    function checkAnswer(selectedIndex, selectedBtn) {
        const q = qcmQuestions[currentQuestionIndex];
        const allButtons = document.querySelectorAll('.opt-btn');
        allButtons.forEach(b => b.disabled = true);

        const isCorrect = (q.correct === "all") || (selectedIndex === q.correct);
        const isLastQuestion = (currentQuestionIndex === qcmQuestions.length - 1);

        if (isCorrect) {
            selectedBtn.classList.add('correct');
            
            if (isLastQuestion) {
                document.getElementById('qcm-feedback').textContent = "BRAVO T ES TROP FORTE";
            } else {
                document.getElementById('qcm-feedback').textContent = "Bonne réponse !";
            }
            
            setTimeout(() => {
                currentQuestionIndex++;
                if (currentQuestionIndex < qcmQuestions.length) {
                    loadQuestion();
                } else {
                    unlockGallery();
                }
            }, isLastQuestion ? 2000 : 1200);
        } else {
            selectedBtn.classList.add('wrong');
            document.getElementById('qcm-feedback').textContent = "Mauvaise réponse... Réessaie !";
            
            setTimeout(() => {
                allButtons.forEach(b => b.disabled = false);
                selectedBtn.classList.remove('wrong');
            }, 1200);
        }
    }

    // 3.5 GALERIE PHOTO INTERMÉDIAIRE
    const galleryPhotos = [
        "photo1.png",
        "photo2.png",
        "photo3.png",
        "photo4.png",
        "photo5.png",
        "photo6.png"
    ];

    let currentPhotoIndex = 0;
    const galleryContainer = document.getElementById('gallery-container');
    const galleryImg = document.getElementById('gallery-img');
    const btnPrevPhoto = document.getElementById('btn-prev-photo');
    const btnNextPhoto = document.getElementById('btn-next-photo');
    const btnSkipGallery = document.getElementById('btn-skip-gallery');

    function showPhoto(index) {
        if (galleryPhotos.length === 0) return;
        galleryImg.src = galleryPhotos[index];
    }

    btnPrevPhoto.addEventListener('click', () => {
        currentPhotoIndex = (currentPhotoIndex - 1 + galleryPhotos.length) % galleryPhotos.length;
        showPhoto(currentPhotoIndex);
    });

    btnNextPhoto.addEventListener('click', () => {
        if (currentPhotoIndex === galleryPhotos.length - 1) {
            goToFinalPage();
        } else {
            currentPhotoIndex++;
            showPhoto(currentPhotoIndex);
        }
    });

    btnSkipGallery.addEventListener('click', () => {
        goToFinalPage();
    });

    function unlockGallery() {
        qcmContainer.style.opacity = '0';
        setTimeout(() => {
            qcmContainer.classList.add('hidden');
            galleryContainer.classList.remove('hidden');
            setTimeout(() => {
                galleryContainer.style.opacity = '1';
                showPhoto(0);
            }, 50);
        }, 800);
    }

    function goToFinalPage() {
        galleryContainer.style.opacity = '0';
        setTimeout(() => {
            galleryContainer.classList.add('hidden');
            mainContent.classList.remove('hidden');
            setTimeout(() => {
                mainContent.style.opacity = '1';
                generateReasons();
            }, 50);
        }, 800);
    }

    // 4. LES 100 RAISONS
    const reasonsData = [
        "Tes yeux", "Ton sourire", "Ton magnifique corps", "Tes cheveux", "Ton humour", 
        "Ton rire", "Ta gentillesse", "Ta voix", "Ton grain de folie", "Ta sensibilité", 
        "Nos fous rires à deux", "Ta beauté", "Ton amour", "Ton côté neuneu d'amour", "Ton caractère", 
        "Ta jalousie", "Tu mérites d'être aimée comme tu m'aimes", "T'es la meilleure chose qui soit arrivée dans ma vie", 
        "Le fait que tu crois en moi", "Car tu sais quand quelque chose ne va pas", "Ta force surhumaine", 
        "Ton côté râleuse", "Ton côté têtue", "Tes repas", "Ton regard", "Tes fefesses", 
        "Ton honnêteté", "Nos câlins", "Nos projets pour plus tard", "Nos dates", "Notre premier ciné", 
        "Ton soutien dans tout", "Ton parfum Burberry", "Ta tête quand tu ne comprends pas quelque chose que je dis", 
        "Tes habits", "Toi au naturel", "Ton côté architecte", "Ton côté jeux vidéo", "Tes fossettes", 
        "Ta générosité", "Ta bienveillance", "Parce que tu trouves tout mignon", "Tes chats", "Ton lit deux places", 
        "Notre histoire", "Ton amour sincère", "Ta motivation", "Tu veux toujours me rendre heureux", 
        "L'envie de te faire sourire chaque jour", "Nos regards complices", "On se comprend sans parler", 
        "Nos réf à nous deux", "Nos batailles de chatouilles", "Tes mains", "Ton odeur", 
        "Nos sessions de shopping et que tu râles parce que je prends du temps", "Nos siestes", 
        "Tout ce que l'on a construit ensemble", "Ton petit carnet que tu m'as offert", 
        "Tes petits cadres dans mon setup", "Tes envies de manger à n'importe quelle heure", 
        "Ta gamme de shampooing", "Ta façon de marcher avec tes pieds vers l'intérieur", 
        "Car tu es la plus belle rencontre de ma vie", "Ta façon de vouloir toujours refaire mes cheveux", 
        "Ton comportement de maman avec moi", "Nos délires", "Tu me racontes tout", "Nos musiques en commun", 
        "Ton doudou", "Ta chambre", "Les repas de ta maman", "Les frites de ton papa", 
        "Ton regard quand tu fais une bêtise", "Tes photos", "Tes bisous sur tes photos", 
        "Tes câlins dans le lit", "Ton côté studieuse", "Tes projets dans la vie", "Ton côté bordélique", 
        "Ton côté Hello Kitty", "Ton impatience", "Ta timidité", "Notre passion", 
        "Le fait que je peux être 100% moi-même avec toi", "L'idée de vieillir avec toi", 
        "Fonder une famille ensemble", "Le bonheur d'être avec toi", "Ta présence", 
        "Ta tête quand tu manges un truc trop bon", "Tes AirPods", "Les pâtes de ta maman", 
        "Ton côté romantique", "Ta curiosité", "Ton respect", "Ton amour pour les détails", 
        "Les surnoms que tu me donnes", "Tes petites attentions", "Parce que tu es toi", "TOI"
    ];

    function generateReasons() {
        reasonsList.innerHTML = '';
        reasonsData.forEach((text, index) => {
            const card = document.createElement('div');
            card.classList.add('reason-card');

            const cardHeader = document.createElement('div');
            cardHeader.classList.add('reason-card-header');

            const badge = document.createElement('span');
            badge.classList.add('reason-number-badge');
            badge.innerHTML = `#${index + 1}`;
            cardHeader.appendChild(badge);

            const textP = document.createElement('p');
            textP.classList.add('reason-text');
            textP.textContent = text;

            card.appendChild(cardHeader);
            card.appendChild(textP);

            reasonsList.appendChild(card);
        });
    }
});
