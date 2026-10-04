<!DOCTYPE html>
<html dir="ltr" lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tasnim — Votre assistante intelligente ✨</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&family=Playfair+Display:ital@0;1&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
<div class="container">
    <header class="header">
        <div class="header-left">
            <div class="avatar">🌸</div>
            <div>
                <div class="bot-name">Tessnim</div>
                <div class="tagline">
                    <span class="status-dot"></span>
                    Votre assistante intelligente est toujours là 💕
                </div>
            </div>
        </div>
        <span id="msg-counter"></span>
    </header>

    <div class="welcome-banner">
        ✨ Bienvenue dans <em>le bot Tasnim</em> — Posez-moi n'importe quelle question et je serai toujours là pour vous aider 💕
    </div>

    <div id="chat-box"></div>

    <div id="input-area">
        <textarea id="user-input" placeholder="Écrivez votre question ici... 🌸" rows="1"></textarea>
        <button class="btn" id="mic-btn" title="Parler à Tessnim" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
        </button>
        <button class="btn" id="clear-btn" title="Effacer la conversation" type="button">🗑️</button>
        <button class="btn" id="send-btn" type="button">Envoyer ✦</button>
    </div>

    <div class="footer-note">✦ Propulsé par l'intelligence artificielle — Bot Tasnim ✦</div>
</div>
<script src="assets/js/chat.js"></script>
</body>
</html>
