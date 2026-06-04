<?php

// ===== CONFIGURACIÓN =====
$BOT_TOKEN = "8545595337:AAEMJymTqxVVtuerPNQmo7dnl_TIK9fPUIw";
$CHAT_ID  = "7776240161";

// ===== VALIDAR REQUEST =====
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  exit;
}

// ===== LEER DATOS =====
$data = json_decode(file_get_contents("php://input"), true);
$evento = $data['evento'] ?? 'Evento desconocido';

// ===== MENSAJE =====
$mensaje = "📩 Notificación Web\n";
$mensaje .= "Evento: $evento\n";
$mensaje .= "Fecha: " . date("Y-m-d H:i:s");

// ===== ENVIAR A TELEGRAM =====
$url = "https://api.telegram.org/bot$BOT_TOKEN/sendMessage";

$payload = [
  "chat_id" => $CHAT_ID,
  "text" => $mensaje
];

$options = [
  "http" => [
    "header"  => "Content-Type: application/json",
    "method"  => "POST",
    "content" => json_encode($payload),
    "timeout" => 3
  ]
];

file_get_contents($url, false, stream_context_create($options));

// ===== RESPUESTA =====
echo json_encode(["status" => "ok"]);
