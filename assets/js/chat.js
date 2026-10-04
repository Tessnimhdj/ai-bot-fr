const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const clearBtn = document.getElementById('clear-btn');
const micBtn = document.getElementById('mic-btn');
const counter = document.getElementById('msg-counter');

const PLACEHOLDER = 'Écrivez votre question ici... 🌸';
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    let isListening = false;

    recognition.lang = 'fr-FR';
    recognition.continuous = false;
    recognition.interimResults = false;

    function resetMic() {
        isListening = false;
        micBtn.classList.remove('listening');
        micBtn.title = 'Parler à Tessnim';
        userInput.placeholder = PLACEHOLDER;
    }

    micBtn.addEventListener('click', function () {
        if (isListening) {
            recognition.stop();
            return;
        }
        recognition.start();
    });

    recognition.addEventListener('start', function () {
        isListening = true;
        micBtn.classList.add('listening');
        micBtn.title = 'Cliquez pour arrêter...';
        userInput.placeholder = '🎤 Parlez maintenant...';
    });

    recognition.addEventListener('result', function (event) {
        userInput.value = event.results[0][0].transcript;
        sendMessage();
    });

    recognition.addEventListener('end', resetMic);

    recognition.addEventListener('error', function (event) {
        resetMic();
        if (event.error === 'not-allowed') {
            addMsg('❌ Accès au microphone refusé — Autorisez le micro dans votre navigateur.', 'err');
        } else if (event.error === 'no-speech') {
            addMsg('⚠️ Aucune parole détectée — Réessayez.', 'err');
        }
    });
} else {
    micBtn.style.display = 'none';
}

sendBtn.addEventListener('click', sendMessage);
clearBtn.addEventListener('click', clearChat);

userInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});

async function sendMessage() {
    const question = userInput.value.trim();
    if (!question) return;

    addMsg(question, 'user');
    userInput.value = '';
    setLoading(true);

    const thinkingId = addThinking();

    try {
        const response = await fetch('bot.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ question }),
        });
        const data = await response.json();

        removeEl(thinkingId);
        setLoading(false);

        if (data.error) {
            addMsg('❌ ' + data.error, 'err');
            return;
        }

        addMsg(data.answer, 'bot');
        if (data.historyCount) {
            counter.textContent = 'Messages dans le contexte : ' + data.historyCount;
        }
    } catch (error) {
        removeEl(thinkingId);
        setLoading(false);
        addMsg('❌ Connexion au serveur échouée — Vérifiez bot.php', 'err');
        console.error(error);
    }
}

function clearChat() {
    chatBox.innerHTML = '';
    counter.textContent = '';

    fetch('bot.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ clear: '1' }),
    });

    addMsg('Bonjour à nouveau ! 🌸 Comment puis-je vous aider ? 💕', 'bot');
}

function addMsg(text, type) {
    const id = 'msg-' + Date.now() + Math.random();
    const message = document.createElement('div');
    const label = document.createElement('span');
    const content = document.createElement('div');

    message.id = id;
    message.className = 'msg ' + type;
    label.className = 'msg-label';
    label.textContent = type === 'user' ? 'Vous 💬' : type === 'err' ? 'Erreur ⚠️' : 'Tessnim 🌸';
    content.innerHTML = escapeHtml(text).replace(/\n/g, '<br>');

    message.append(label, content);
    chatBox.appendChild(message);
    scrollToBottom();

    return id;
}

function addThinking() {
    const id = 'think-' + Date.now();
    const message = document.createElement('div');

    message.id = id;
    message.className = 'msg bot thinking';
    message.innerHTML =
        '<span class="msg-label">Tessnim réfléchit 🌸</span>' +
        '<div class="thinking-dots"><span></span><span></span><span></span></div>';

    chatBox.appendChild(message);
    scrollToBottom();

    return id;
}

function setLoading(active) {
    sendBtn.disabled = active;
    userInput.disabled = active;
    sendBtn.textContent = active ? '...' : 'Envoyer ✦';
}

function removeEl(id) {
    document.getElementById(id)?.remove();
}

function scrollToBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
}

function escapeHtml(text) {
    const node = document.createElement('div');
    node.textContent = text;
    return node.innerHTML;
}

window.addEventListener('load', function () {
    addMsg(
        "Bonjour ! 🌸 Je suis Tessnim, votre assistante intelligente.\nPosez-moi n'importe quelle question, je suis là pour vous ! 💕",
        'bot'
    );
});
