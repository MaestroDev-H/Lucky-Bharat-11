<?php
// Allow cross-origin requests and set response type to JSON
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Get the posted JSON data
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->frontImage) && !empty($data->backImage) && !empty($data->playerName)) {
    
    // Clean the player name to use in the file name
    $safeName = preg_replace('/[^a-zA-Z0-9]/', '_', $data->playerName);
    
    // Create a folder named 'saved_designs' if it doesn't exist
    $folderPath = 'saved_designs/';
    if (!file_exists($folderPath)) {
        mkdir($folderPath, 0777, true);
    }

    // Isolate the base64 string (remove the "data:image/png;base64," part)
    $frontBase64 = explode(',', $data->frontImage)[1];
    $backBase64 = explode(',', $data->backImage)[1];

    // Generate unique file names
    $timestamp = time(); // Adds a timestamp so files don't overwrite each other
    $frontFileName = $folderPath . $safeName . '_Front_' . $timestamp . '.png';
    $backFileName = $folderPath . $safeName . '_Back_' . $timestamp . '.png';

    // Decode and save the files to the folder
    $frontSaved = file_put_contents($frontFileName, base64_decode($frontBase64));
    $backSaved = file_put_contents($backFileName, base64_decode($backBase64));

    if ($frontSaved && $backSaved) {
        http_response_code(200);
        echo json_encode(array("message" => "Success! Designs saved to the project folder."));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Error: Could not save files to the server. Check folder permissions."));
    }

} else {
    // Data is missing
    http_response_code(400);
    echo json_encode(array("message" => "Error: Incomplete data sent."));
}
?>