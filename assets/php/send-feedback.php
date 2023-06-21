<?php

/* https://stackoverflow.com/a/64004168 */

/* Get content type */
$contentType = trim($_SERVER["CONTENT_TYPE"] ?? ''); // PHP 8+
// Otherwise:
// $contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';

/* Send error to Fetch API, if unexpected content type */
if ($contentType !== "application/json") {
  die(json_encode([
    'value' => 0,
    'error' => 'Content-Type is not set as "application/json"',
    'data' => null,
  ]));
}

/* Receive the RAW post data. */
$content = trim(file_get_contents("php://input"));

/* $decoded can be used the same as you would use $_POST in $.ajax */
$decoded = json_decode($content, true);

/* Send error to Fetch API, if JSON is broken */
if (!is_array($decoded)) {
  die(json_encode([
    'value' => 0,
    'error' => 'Received JSON is improperly formatted',
    'data' => null,
  ]));
}

/* NOTE: For some reason I had to add the next line as well at times, but it hadn't happen for a while now. Not sure what went on */
// $decoded = json_decode($decoded, true);

/* Send email */
$headers = 'From: <' . $decoded['email'] . '>' . "\r\n";
$to = 'neb@neb.host';
$subj = 'Gem Warrior feedback';
$body = $decoded['feedback'];

$mailSend = mail($to, $subj, $body, $headers);

/* Do something with received data and include it in response */
$response = array(
  'data' => $decoded
);

/* Perhaps database manipulation here? */
// query, etc.

die(json_encode([
  'value' => 1,
  'error' => $mailSend ? $mailSend : 'Mail could not be sent',
  'data' => $response
]));

?>
