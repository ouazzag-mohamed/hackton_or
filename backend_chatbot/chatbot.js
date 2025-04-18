// Chatbot interface JavaScript with enhanced design features
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const messagesContainer = document.getElementById('messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-btn');
    const languageButtons = document.querySelectorAll('.lang-btn');
    const suggestionChips = document.querySelectorAll('.suggestion-chip');
    const newChatButton = document.getElementById('new-chat');
    const memoryStatusButton = document.getElementById('memory-status');
    const clearMemoryButton = document.getElementById('clear-memory');
    const infoLinks = document.querySelectorAll('.info-link');
    const pathwayLinks = document.querySelectorAll('.pathway-link');
    const collapseBtn = document.querySelector('.collapse-btn');
    const infoPanel = document.querySelector('.info-panel');
    const infoToggle = document.querySelector('.info-toggle');
    
    // Current settings
    let currentLanguage = 'en';
    let currentTheme = localStorage.getItem('chatTheme') || 'blue';
    let isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    // UI translations
    const translations = {
        en: {
            // Section titles
            sections: {
                pathways: "Pathways",
                quickInfo: "Quick Info",
                chatControls: "Chat Controls"
            },
            // Pathway links
            pathways: {
                scientific: "Scientific Bac",
                literary: "Literary Bac",
                economics: "Economics & Management",
                tech: "Science & Technology"
            },
            // Info links
            infoLinks: {
                universities: "Top Universities in Morocco",
                international: "International Study Options",
                admission: "Admission Requirements",
                scholarship: "Scholarship Opportunities"
            },
            // Memory controls
            memoryControls: {
                newChat: "New Chat",
                memoryStatus: "Memory Status",
                clearMemory: "Clear Memory"
            },
            // Suggested questions
            suggestions: {
                apply: "How to apply to universities?",
                baccalaureate: "Tell me about Baccalaureate options",
                abroad: "Study abroad opportunities",
                scholarship: "Scholarship programs"
            },
            // Pathway visualization
            pathwayVisualization: {
                middleSchool: "Middle School",
                highSchool: "High School",
                baccalaureate: "Baccalaureate",
                higherEducation: "Higher Education",
                selectPathway: "Select a pathway to see detailed information about educational options.",
                middleSchoolDetails: "Middle School in Morocco (Collège) is a critical phase. Students must complete the CNEE (National Exam) at the end to qualify for high school admission.",
                highSchoolDetails: "High School in Morocco (Lycée) typically spans three years. The first year offers common core subjects, while the second and third years are specialized based on your chosen track.",
                baccalaureateDetails: "The Baccalaureate exam is a comprehensive assessment taken at the end of high school. It determines university eligibility and potential programs based on your scores and specialization.",
                higherEducationDetails: "Morocco offers diverse higher education options including public universities, private institutions, and specialized schools. Admission requirements vary based on your Baccalaureate results and chosen field."
            },
            // Other UI elements
            ui: {
                inputPlaceholder: "Type your question here...",
                sendTooltip: "Send message",
                helpfulTooltip: "Helpful",
                notHelpfulTooltip: "Not helpful",                initialGreeting: "Hello! I am your expert academic guidance counselor for Morocco. How can I help you today?",
                logoText: "IRCHAD Assistant",
                footer: "© 2025 IRCHAD Assistant | Powered by AI"
            }
        },
        fr: {
            sections: {
                pathways: "Parcours",
                quickInfo: "Informations Rapides",
                chatControls: "Contrôle du Chat"
            },
            pathways: {
                scientific: "Bac Scientifique",
                literary: "Bac Littéraire",
                economics: "Économie & Gestion",
                tech: "Sciences & Technologie"
            },
            infoLinks: {
                universities: "Meilleures Universités au Maroc",
                international: "Options d'Études Internationales",
                admission: "Conditions d'Admission",
                scholarship: "Opportunités de Bourses"
            },
            memoryControls: {
                newChat: "Nouvelle Conversation",
                memoryStatus: "Statut de la Mémoire",
                clearMemory: "Effacer la Mémoire"
            },
            suggestions: {
                apply: "Comment postuler aux universités ?",
                baccalaureate: "Parlez-moi des options du Baccalauréat",
                abroad: "Opportunités d'études à l'étranger",
                scholarship: "Programmes de bourses"
            },
            pathwayVisualization: {
                middleSchool: "Collège",
                highSchool: "Lycée",
                baccalaureate: "Baccalauréat",
                higherEducation: "Enseignement Supérieur",
                selectPathway: "Sélectionnez un parcours pour voir des informations détaillées sur les options éducatives.",
                middleSchoolDetails: "Le collège au Maroc est une phase critique. Les élèves doivent passer l'examen national (CNEE) à la fin pour être admis au lycée.",
                highSchoolDetails: "Le lycée au Maroc s'étend généralement sur trois ans. La première année offre un tronc commun, tandis que les deuxième et troisième années sont spécialisées selon la filière choisie.",
                baccalaureateDetails: "L'examen du Baccalauréat est une évaluation complète passée à la fin du lycée. Il détermine l'éligibilité universitaire et les programmes potentiels en fonction de vos notes et de votre spécialisation.",
                higherEducationDetails: "Le Maroc offre diverses options d'enseignement supérieur comprenant des universités publiques, des institutions privées et des écoles spécialisées. Les conditions d'admission varient selon vos résultats au Baccalauréat et le domaine choisi."
            },
            ui: {
                inputPlaceholder: "Tapez votre question ici...",
                sendTooltip: "Envoyer le message",
                helpfulTooltip: "Utile",
                notHelpfulTooltip: "Pas utile",                initialGreeting: "Bonjour ! Je suis votre conseiller expert en orientation académique au Maroc. Comment puis-je vous aider aujourd'hui ?",
                logoText: "Assistant IRCHAD",
                footer: "© 2025 Assistant IRCHAD | Propulsé par l'IA"
            }
        },
        ar: {
            sections: {
                pathways: "المسارات التعليمية",
                quickInfo: "معلومات سريعة",
                chatControls: "التحكم بالمحادثة"
            },
            pathways: {
                scientific: "باكالوريا علمية",
                literary: "باكالوريا أدبية",
                economics: "الاقتصاد والتدبير",
                tech: "العلوم والتكنولوجيا"
            },
            infoLinks: {
                universities: "أفضل الجامعات في المغرب",
                international: "خيارات الدراسة الدولية",
                admission: "متطلبات القبول",
                scholarship: "فرص المنح الدراسية"
            },
            memoryControls: {
                newChat: "محادثة جديدة",
                memoryStatus: "حالة الذاكرة",
                clearMemory: "مسح الذاكرة"
            },
            suggestions: {
                apply: "كيف يمكنني التقديم للجامعات المغربية؟",
                baccalaureate: "ما هي مسارات الباكالوريا المتاحة؟",
                abroad: "أريد معلومات عن الدراسة في الخارج",
                scholarship: "أخبرني عن فرص المنح الدراسية المتاحة"
            },
            pathwayVisualization: {
                middleSchool: "المدرسة الإعدادية",
                highSchool: "المدرسة الثانوية",
                baccalaureate: "الباكالوريا",
                higherEducation: "التعليم العالي",
                selectPathway: "اختر مسارًا لمشاهدة معلومات مفصلة حول الخيارات التعليمية.",
                middleSchoolDetails: "المدرسة الإعدادية في المغرب هي مرحلة حاسمة. يجب على الطلاب إكمال الامتحان الوطني (CNEE) في النهاية للتأهل للقبول في المدرسة الثانوية.",
                highSchoolDetails: "تمتد المدرسة الثانوية في المغرب عادة على مدار ثلاث سنوات. توفر السنة الأولى مواد الجذع المشترك، بينما تتخصص السنتان الثانية والثالثة بناءً على المسار الذي اخترته.",
                baccalaureateDetails: "امتحان الباكالوريا هو تقييم شامل يؤخذ في نهاية المدرسة الثانوية. يحدد أهلية الجامعة والبرامج المحتملة بناءً على درجاتك وتخصصك.",
                higherEducationDetails: "يقدم المغرب خيارات متنوعة للتعليم العالي بما في ذلك الجامعات العامة والمؤسسات الخاصة والمدارس المتخصصة. تختلف متطلبات القبول بناءً على نتائج الباكالوريا والمجال الذي اخترته."
            },
            ui: {
                inputPlaceholder: "اكتب سؤالك هنا...",
                sendTooltip: "إرسال الرسالة",
                helpfulTooltip: "مفيد",
                notHelpfulTooltip: "غير مفيد",                initialGreeting: "مرحبًا! أنا مستشارك الخبير في التوجيه الأكاديمي في المغرب. كيف يمكنني مساعدتك اليوم؟",
                logoText: "مساعد إرشاد",
                footer: "© 2025 مساعد إرشاد | مدعوم بالذكاء الاصطناعي"
            }
        },
        es: {
            sections: {
                pathways: "Itinerarios",
                quickInfo: "Información Rápida",
                chatControls: "Controles de Chat"
            },
            pathways: {
                scientific: "Bachillerato Científico",
                literary: "Bachillerato Literario",
                economics: "Economía y Gestión",
                tech: "Ciencia y Tecnología"
            },
            infoLinks: {
                universities: "Mejores Universidades en Marruecos",
                international: "Opciones de Estudio Internacional",
                admission: "Requisitos de Admisión",
                scholarship: "Oportunidades de Becas"
            },
            memoryControls: {
                newChat: "Nuevo Chat",
                memoryStatus: "Estado de Memoria",
                clearMemory: "Borrar Memoria"
            },
            suggestions: {
                apply: "¿Cómo solicitar ingreso a universidades?",
                baccalaureate: "Háblame sobre las opciones de Bachillerato",
                abroad: "Oportunidades de estudio en el extranjero",
                scholarship: "Programas de becas"
            },
            pathwayVisualization: {
                middleSchool: "Escuela Secundaria",
                highSchool: "Instituto",
                baccalaureate: "Bachillerato",
                higherEducation: "Educación Superior",
                selectPathway: "Seleccione un itinerario para ver información detallada sobre opciones educativas.",
                middleSchoolDetails: "La Escuela Secundaria en Marruecos es una fase crítica. Los estudiantes deben completar el Examen Nacional (CNEE) al final para calificar para la admisión al instituto.",
                highSchoolDetails: "El instituto en Marruecos generalmente abarca tres años. El primer año ofrece materias comunes, mientras que el segundo y tercer año se especializan según la rama elegida.",
                baccalaureateDetails: "El examen de Bachillerato es una evaluación integral que se realiza al final del instituto. Determina la elegibilidad universitaria y los programas potenciales según tus calificaciones y especialización.",
                higherEducationDetails: "Marruecos ofrece diversas opciones de educación superior, incluyendo universidades públicas, instituciones privadas y escuelas especializadas. Los requisitos de admisión varían según tus resultados de Bachillerato y el campo elegido."
            },
            ui: {
                inputPlaceholder: "Escribe tu pregunta aquí...",
                sendTooltip: "Enviar mensaje",
                helpfulTooltip: "Útil",
                notHelpfulTooltip: "No útil",                initialGreeting: "¡Hola! Soy tu consejero experto en orientación académica en Marruecos. ¿Cómo puedo ayudarte hoy?",
                logoText: "Asistente IRCHAD",
                footer: "© 2025 Asistente IRCHAD | Impulsado por IA"
            }
        }
    };
    
    // Server communication settings
    const API_ENDPOINT = '/api/chat';
    let isWaitingForResponse = false;
    // Session management
    let sessionId = localStorage.getItem('chatSessionId') || null;
    
    // Initialize theme and mode settings
    initializeThemeSettings();
    
    // Add event listeners
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Auto-resize text area based on content
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        const maxHeight = 150; // Maximum height in pixels
        const scrollHeight = this.scrollHeight;
        this.style.height = (scrollHeight > maxHeight ? maxHeight : scrollHeight) + 'px';
    });
    
    // Language selection
    languageButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            setLanguage(lang);
            
            // Update UI
            languageButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update greeting message based on language
            updateGreeting(lang);
        });
    });
    
    // Suggestion chips with hover effects
    suggestionChips.forEach(chip => {
        chip.addEventListener('click', function() {
            // Extract only the text without the icon
            const chipText = this.textContent.trim();
            const iconText = this.querySelector('i') ? this.querySelector('i').textContent.trim() : '';
            userInput.value = chipText.replace(iconText, '').trim();
            
            // Add an animation class, then remove it after animation completes
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 300);
            
            userInput.focus();
        });
        
        // Add ripple effect on click
        chip.addEventListener('mousedown', createRippleEffect);
    });
    
    // Memory management
    newChatButton.addEventListener('click', startNewChat);
    memoryStatusButton.addEventListener('click', checkMemoryStatus);
    clearMemoryButton.addEventListener('click', clearMemory);
    
    // Memory buttons with ripple effect
    document.querySelectorAll('.memory-btn').forEach(btn => {
        btn.addEventListener('mousedown', createRippleEffect);
    });
    
    // Info links
    infoLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const question = this.textContent.trim();
            userInput.value = question;
            sendMessage();
        });
    });
    
    // Pathway links
    pathwayLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pathway = this.getAttribute('data-path');
            let question = '';
            
            // Extract only the text part, ignoring the icon
            const linkText = this.textContent.trim();
            const iconText = this.querySelector('i') ? this.querySelector('i').textContent.trim() : '';
            const cleanText = linkText.replace(iconText, '').trim();
            
            switch(pathway) {
                case 'scientific':
                    question = `Tell me about ${cleanText} pathway`;
                    break;
                case 'literary':
                    question = `What is the ${cleanText} pathway?`;
                    break;
                case 'economics':
                    question = `Information about ${cleanText}`;
                    break;
                case 'tech':
                    question = `Details about ${cleanText}`;
                    break;
                default:
                    question = `Tell me about the ${cleanText} pathway`;
            }
            
            userInput.value = question;
            sendMessage();
            
            if (window.innerWidth <= 768) {
                infoPanel.classList.remove('active');
            }
        });
    });
    
    // Collapse info panel on smaller screens
    collapseBtn.addEventListener('click', function() {
        infoPanel.classList.remove('active');
    });
    
    // Toggle info panel visibility
    infoToggle.addEventListener('click', function() {
        infoPanel.classList.toggle('active');
    });
    
    // Function to create ripple effect
    function createRippleEffect(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.className = 'ripple';
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Function to initialize theme settings
    function initializeThemeSettings() {
        // Set the theme
        setTheme(currentTheme);
        
        // Set dark mode if enabled
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        
        // Add ripple style
        const styleRipple = document.createElement('style');
        styleRipple.innerHTML = `
            .ripple {
                position: absolute;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            }
            
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
            
            .suggestion-chip.clicked {
                animation: pulse 0.3s;
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(styleRipple);
    }
    
    // Function to set theme
    function setTheme(theme) {
        // Remove any existing theme classes
        document.body.classList.remove('theme-blue', 'theme-green', 'theme-purple', 'theme-orange');
        
        // Add the selected theme class
        document.body.classList.add(`theme-${theme}`);
        
        // Store the selected theme
        currentTheme = theme;
        localStorage.setItem('chatTheme', theme);
    }
    
    // Function to toggle dark mode
    function toggleDarkMode(enabled) {
        if (enabled) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        
        isDarkMode = enabled;
        localStorage.setItem('darkMode', enabled);
    }
    
    // Function to send message with animation
    function sendMessage() {
        const message = userInput.value.trim();
        
        if (message === '' || isWaitingForResponse) return;
        
        // Add user message to chat
        addMessageToChat('user', message);
        
        // Clear input and reset its height
        userInput.value = '';
        userInput.style.height = 'auto';
        
        // Show typing indicator with enhanced animation
        showTypingIndicator();
        
        // Set waiting state
        isWaitingForResponse = true;
        
        // Always use the real API call instead of simulation
        fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                query: message,
                language: currentLanguage,
                sessionId: sessionId
            })
        })
        .then(response => response.json())
        .then(data => {
            // Remove typing indicator
            removeTypingIndicator();
            
            // Add bot response
            addMessageToChat('bot', data.response);
            
            // Update session ID if provided
            if (data.sessionId) {
                sessionId = data.sessionId;
                localStorage.setItem('chatSessionId', sessionId);
            }
            
            // Reset waiting state
            isWaitingForResponse = false;
        })
        .catch(error => {
            console.error('Error communicating with the agent:', error);
            
            // Remove typing indicator
            removeTypingIndicator();
            
            // Show error message
            addMessageToChat('bot', 'Sorry, I encountered an error processing your request. Please try again.');
            
            // Reset waiting state
            isWaitingForResponse = false;
        });
    }
    
    // Function to add message to chat with enhanced animations
    function addMessageToChat(sender, text) {
        const messageRow = document.createElement('div');
        messageRow.classList.add('message-row');
        messageRow.classList.add(sender);
        
        // Set initial state for animation
        messageRow.style.opacity = '0';
        messageRow.style.transform = 'translateY(20px)';
        
        const now = new Date();
        let timeString = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
        
        let avatarImage = '';
        if (sender === 'bot') {
            avatarImage = '<img src="https://img.freepik.com/premium-vector/bot-icon-chatbot-icon-concept-vector-illustration_230920-1327.jpg" alt="Bot Avatar">';
        } else {
            avatarImage = '<img src="https://img.icons8.com/color/96/000000/user-male-circle--v1.png" alt="User Avatar">';
        }
        
        // Process markdown-like formatting in text
        const formattedText = processTextFormatting(text);
        
        // Add feedback buttons only for bot messages
        let feedbackHtml = '';
        if (sender === 'bot') {
            feedbackHtml = `
                <div class="message-feedback">
                    <button class="feedback-btn like tooltip" data-tooltip="Helpful"><i class="fas fa-thumbs-up"></i></button>
                    <button class="feedback-btn dislike tooltip" data-tooltip="Not helpful"><i class="fas fa-thumbs-down"></i></button>
                </div>
            `;
        }
        
        messageRow.innerHTML = `
            <div class="avatar">
                ${avatarImage}
            </div>
            <div class="message">
                <div class="message-content">
                    ${formattedText}
                </div>
                <div class="message-time">${timeString}</div>
                ${feedbackHtml}
            </div>
        `;
        
        messagesContainer.appendChild(messageRow);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Add animation with a slight delay
        setTimeout(() => {
            messageRow.style.transition = 'opacity 0.3s ease, transform 0.4s ease';
            messageRow.style.opacity = '1';
            messageRow.style.transform = 'translateY(0)';
        }, 50);
        
        // Add feedback button event listeners
        const feedbackButtons = messageRow.querySelectorAll('.feedback-btn');
        feedbackButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const isLike = this.classList.contains('like');
                const isFeedbackGiven = this.parentElement.querySelector('.active') !== null;
                
                // Reset all buttons
                feedbackButtons.forEach(b => b.classList.remove('active'));
                
                // If not already active, set active and send feedback
                if (!isFeedbackGiven || !this.classList.contains('active')) {
                    this.classList.add('active');
                    
                    // Add a visual effect
                    this.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1.1)';
                    }, 200);
                    
                    // Send feedback to the server (you can implement this)
                    console.log(`User gave ${isLike ? 'positive' : 'negative'} feedback`);
                }
            });
        });
    }
    
    // Process text formatting (enhanced with better markdown and UI elements)
    function processTextFormatting(text) {
        // Convert URLs to links
        text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
        
        // Convert line breaks to <br>
        text = text.replace(/\n/g, '<br>');
        
        // Simple markdown for bold and italic
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Code blocks (inline and multiline)
        text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Support for lists
        const listRegex = /^\s*[*-]\s+(.*?)$/gm;
        if (text.match(listRegex)) {
            let inList = false;
            const lines = text.split('<br>');
            text = lines.map(line => {
                const listMatch = line.match(/^\s*[*-]\s+(.*?)$/);
                if (listMatch) {
                    if (!inList) {
                        inList = true;
                        return '<ul><li>' + listMatch[1] + '</li>';
                    } else {
                        return '<li>' + listMatch[1] + '</li>';
                    }
                } else {
                    if (inList) {
                        inList = false;
                        return '</ul>' + line;
                    } else {
                        return line;
                    }
                }
            }).join('<br>');
            
            if (inList) {
                text += '</ul>';
            }
        }
        
        // Add a style for code elements
        const styleCode = document.createElement('style');
        styleCode.innerHTML = `
            .message-content code {
                background-color: rgba(0, 0, 0, 0.05);
                padding: 2px 4px;
                border-radius: 3px;
                font-family: monospace;
                font-size: 0.9em;
            }
            
            .dark-mode .message-content code {
                background-color: rgba(255, 255, 255, 0.1);
            }
        `;
        document.head.appendChild(styleCode);
        
        return '<p>' + text + '</p>';
    }
    
    // Function to show typing indicator with enhanced animation
    function showTypingIndicator() {
        const typingRow = document.createElement('div');
        typingRow.classList.add('message-row', 'bot', 'typing-indicator-row');
        
        typingRow.innerHTML = `
            <div class="avatar">
                <img src="https://img.freepik.com/premium-vector/bot-icon-chatbot-icon-concept-vector-illustration_230920-1327.jpg" alt="Bot Avatar">
            </div>
            <div class="message">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        messagesContainer.appendChild(typingRow);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // Function to remove typing indicator
    function removeTypingIndicator() {
        const typingRow = document.querySelector('.typing-indicator-row');
        if (typingRow) {
            // Add fade-out animation
            typingRow.style.transition = 'opacity 0.3s ease';
            typingRow.style.opacity = '0';
            
            setTimeout(() => {
                if (typingRow.parentNode === messagesContainer) {
                    messagesContainer.removeChild(typingRow);
                }
            }, 300);
        }
    }
      // Function to set language
    function setLanguage(lang) {
        currentLanguage = lang;
        document.documentElement.setAttribute('lang', lang);
        
        // Store language preference
        localStorage.setItem('chatLanguage', lang);
        
        // Update all UI elements with translations
        updateUITranslations(lang);
    }
    
    // Function to update all UI elements with translations
    function updateUITranslations(lang) {
        // Make sure we have translations for this language
        if (!translations[lang]) {
            console.error(`No translations available for language: ${lang}`);
            return;
        }
        
        const t = translations[lang];
        
        // Update section titles
        document.querySelectorAll('.info-section h3').forEach((heading, index) => {
            if (index === 0) heading.textContent = t.sections.pathways;
            else if (index === 1) heading.textContent = t.sections.quickInfo;
        });
        document.querySelector('.memory-controls h3').textContent = t.sections.chatControls;
        
        // Update pathway links
        const pathwayLinks = document.querySelectorAll('.pathway-link');
        pathwayLinks.forEach(link => {
            const pathway = link.getAttribute('data-path');
            const icon = link.querySelector('i').outerHTML;
            link.innerHTML = `${icon} ${t.pathways[pathway]}`;
        });
        
        // Update info links
        const infoLinks = document.querySelectorAll('.info-link');
        infoLinks.forEach((link, index) => {
            const icon = link.querySelector('i').outerHTML;
            switch (index) {
                case 0: link.innerHTML = `${icon} ${t.infoLinks.universities}`; break;
                case 1: link.innerHTML = `${icon} ${t.infoLinks.international}`; break;
                case 2: link.innerHTML = `${icon} ${t.infoLinks.admission}`; break;
                case 3: link.innerHTML = `${icon} ${t.infoLinks.scholarship}`; break;
            }
        });
        
        // Update memory control buttons
        newChatButton.innerHTML = `<i class="fas fa-plus"></i> ${t.memoryControls.newChat}`;
        memoryStatusButton.innerHTML = `<i class="fas fa-database"></i> ${t.memoryControls.memoryStatus}`;
        clearMemoryButton.innerHTML = `<i class="fas fa-trash"></i> ${t.memoryControls.clearMemory}`;
        
        // Update suggestion chips
        const suggestionChips = document.querySelectorAll('.suggestion-chip');
        suggestionChips.forEach((chip, index) => {
            const icon = chip.querySelector('i').outerHTML;
            switch (index) {
                case 0: chip.innerHTML = `${icon} ${t.suggestions.apply}`; break;
                case 1: chip.innerHTML = `${icon} ${t.suggestions.baccalaureate}`; break;
                case 2: chip.innerHTML = `${icon} ${t.suggestions.abroad}`; break;
                case 3: chip.innerHTML = `${icon} ${t.suggestions.scholarship}`; break;
            }
        });
        
        // Update pathway visualization elements
        const pathwaySteps = document.querySelectorAll('.pathway-step .step-label');
        pathwaySteps.forEach((step, index) => {
            switch (index) {
                case 0: step.textContent = t.pathwayVisualization.middleSchool; break;
                case 1: step.textContent = t.pathwayVisualization.highSchool; break;
                case 2: step.textContent = t.pathwayVisualization.baccalaureate; break;
                case 3: step.textContent = t.pathwayVisualization.higherEducation; break;
            }
        });
        document.querySelector('.pathway-details').textContent = t.pathwayVisualization.selectPathway;
        
        // Update other UI elements
        userInput.placeholder = t.ui.inputPlaceholder;
        sendButton.setAttribute('data-tooltip', t.ui.sendTooltip);
        document.querySelector('.logo h1').textContent = t.ui.logoText;
        document.querySelector('.chat-footer p').textContent = t.ui.footer;
        
        // Update tooltips
        document.querySelectorAll('.feedback-btn.like').forEach(btn => {
            btn.setAttribute('data-tooltip', t.ui.helpfulTooltip);
        });
        document.querySelectorAll('.feedback-btn.dislike').forEach(btn => {
            btn.setAttribute('data-tooltip', t.ui.notHelpfulTooltip);
        });
    }
    
    // Function to update greeting based on language
    function updateGreeting(lang) {
        // Get greeting from translations
        let greeting = translations[lang]?.ui.initialGreeting || "Hello! I am your expert academic guidance counselor for Morocco. How can I help you today?";
        
        // Clear messages and add new greeting with animation
        messagesContainer.innerHTML = '';
        addMessageToChat('bot', greeting);
    }
    
    // Memory management functions
    function startNewChat() {
        // Clear chat messages except for the greeting
        messagesContainer.innerHTML = '';
        addMessageToChat('bot', "I've started a new conversation. How can I help you today?");
        sessionId = null;
        localStorage.removeItem('chatSessionId');
        
        // Add a visual confirmation
        newChatButton.classList.add('active');
        setTimeout(() => {
            newChatButton.classList.remove('active');
        }, 300);
    }
    
    function checkMemoryStatus() {
        // Show typing indicator
        showTypingIndicator();
        
        if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
            // Simulate API response for local development
            setTimeout(() => {
                removeTypingIndicator();
                const mockData = {
                    conversationCount: 3,
                    lastUpdated: new Date().toISOString(),
                    totalExchanges: 15
                };
                
                const statusMessage = `Memory status: ${mockData.conversationCount} conversation(s) stored. 
                Last updated: ${new Date(mockData.lastUpdated).toLocaleString()}
                Total exchanges: ${mockData.totalExchanges}`;
                addMessageToChat('bot', statusMessage);
            }, 1000);
        } else {
            // Call API to get memory status
            fetch('/api/memory')
                .then(response => response.json())
                .then(data => {
                    removeTypingIndicator();
                    
                    if (data.conversationCount) {
                        const statusMessage = `Memory status: ${data.conversationCount} conversation(s) stored. 
                        Last updated: ${new Date(data.lastUpdated).toLocaleString()}
                        Total exchanges: ${data.totalExchanges}`;
                        addMessageToChat('bot', statusMessage);
                    } else {
                        addMessageToChat('bot', "Memory status: No conversation history stored.");
                    }
                })
                .catch(error => {
                    console.error('Error checking memory status:', error);
                    removeTypingIndicator();
                    addMessageToChat('bot', "Sorry, I couldn't retrieve the memory status.");
                });
        }
    }
    
    function clearMemory() {
        // Show typing indicator
        showTypingIndicator();
        
        if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
            // Simulate API response for local development
            setTimeout(() => {
                removeTypingIndicator();
                addMessageToChat('bot', "Memory cleared. All previous conversations have been forgotten.");
                sessionId = null;
                localStorage.removeItem('chatSessionId');
            }, 1000);
        } else {
            // Call API to clear memory
            fetch('/api/memory/clear', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                removeTypingIndicator();
                addMessageToChat('bot', data.message || "Memory cleared. All previous conversations have been forgotten.");
                sessionId = null;
                localStorage.removeItem('chatSessionId');
            })
            .catch(error => {
                console.error('Error clearing memory:', error);
                removeTypingIndicator();
                addMessageToChat('bot', "Sorry, I encountered an error while trying to clear the memory.");
            });
        }
    }
    
    // Check for stored language preference and apply it
    const storedLanguage = localStorage.getItem('chatLanguage');
    if (storedLanguage) {
        setLanguage(storedLanguage);
        
        // Update language button UI
        languageButtons.forEach(btn => {
            if (btn.getAttribute('data-lang') === storedLanguage) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    // Mobile-specific handling for info panel
    if (window.innerWidth <= 768) {
        infoToggle.addEventListener('click', function() {
            infoPanel.classList.toggle('active');
        });
    }
    
    // Add mouseover effect to the rotating cap
    const rotatingCap = document.querySelector('.rotating-cap');
    if (rotatingCap) {
        rotatingCap.addEventListener('mouseover', function() {
            const capElement = document.querySelector('.cap-3d');
            capElement.style.animationDuration = '3s';
            
            setTimeout(() => {
                capElement.style.animationDuration = '15s';
            }, 3000);
        });
    }
    
    // Make pathway steps interactive
    const pathwaySteps = document.querySelectorAll('.pathway-step');
    pathwaySteps.forEach((step, index) => {
        step.addEventListener('click', function() {
            // Remove active class from all steps
            pathwaySteps.forEach(s => s.classList.remove('active'));
            
            // Add active class to the clicked step
            this.classList.add('active');
            
            // Update pathway details based on the selected step
            const pathwayDetails = document.querySelector('.pathway-details');
            let detailsContent = '';
            
            switch(index) {
                case 0: // Middle School
                    detailsContent = 'Middle School in Morocco (Collège) is a critical phase. Students must complete the CNEE (National Exam) at the end to qualify for high school admission.';
                    break;
                case 1: // High School
                    detailsContent = 'High School in Morocco (Lycée) typically spans three years. The first year offers common core subjects, while the second and third years are specialized based on your chosen track.';
                    break;
                case 2: // Baccalaureate
                    detailsContent = 'The Baccalaureate exam is a comprehensive assessment taken at the end of high school. It determines university eligibility and potential programs based on your scores and specialization.';
                    break;
                case 3: // Higher Education
                    detailsContent = 'Morocco offers diverse higher education options including public universities, private institutions, and specialized schools. Admission requirements vary based on your Baccalaureate results and chosen field.';
                    break;
            }
            
            pathwayDetails.innerHTML = detailsContent;
            
            // Show the pathway visualization if it's hidden
            const pathwayVisualization = document.querySelector('.pathway-visualization');
            if (pathwayVisualization.style.display === 'none') {
                pathwayVisualization.style.display = 'block';
            }
        });
    });
    
    // Make the chat container responsive to window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            infoPanel.classList.remove('active');
        }
    });
    
    // Initialize auto-height for textarea
    userInput.dispatchEvent(new Event('input'));
});