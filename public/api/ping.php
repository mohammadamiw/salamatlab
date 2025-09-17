<?php
header('Content-Type: application/json; charset=UTF-8');
echo json_encode(['ok' => true, 'time' => date('Y-m-d H:i:s')], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
?>


