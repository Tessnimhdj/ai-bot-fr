<?php

require_once 'config.php';

session_start();
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée']);
    exit;
}

if (isset($_POST['clear'])) {
    $_SESSION['history'] = [];
    echo json_encode(['success' => true]);
    exit;
}

$question = trim(strip_tags($_POST['question'] ?? ''));

if ($question === '') {
    echo json_encode(['error' => 'La question est vide']);
    exit;
}

if (!isset($_SESSION['history']) || !is_array($_SESSION['history'])) {
    $_SESSION['history'] = [];
}

$_SESSION['history'][] = [
    'role' => 'user',
    'content' => $question,
];

$messages = array_merge(
    [['role' => 'system', 'content' => SYSTEM_PROMPT]],
    array_slice($_SESSION['history'], -MAX_HISTORY)
);

$payload = json_encode([
    'model' => GROQ_MODEL,
    'messages' => $messages,
    'max_tokens' => 1024,
    'temperature' => 0.7,
    'reasoning_effort' => 'low',
], JSON_UNESCAPED_UNICODE);

$ch = curl_init(GROQ_URL);
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Authorization: Bearer ' . GROQ_API_KEY,
    ],
    CURLOPT_TIMEOUT => 30,
    CURLOPT_SSL_VERIFYPEER => false,
]);

$response = curl_exec($ch);
$curlError = curl_error($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($curlError) {
    echo json_encode(['error' => 'cURL : ' . $curlError]);
    exit;
}

$data = json_decode($response, true);

if ($httpCode !== 200) {
    $message = $data['error']['message'] ?? 'Erreur inconnue';
    echo json_encode(['error' => "Erreur {$httpCode} : {$message}"]);
    exit;
}

$answer = $data['choices'][0]['message']['content'] ?? 'Aucune réponse reçue';

$_SESSION['history'][] = [
    'role' => 'assistant',
    'content' => $answer,
];

echo json_encode([
    'answer' => $answer,
    'historyCount' => count($_SESSION['history']),
], JSON_UNESCAPED_UNICODE);
