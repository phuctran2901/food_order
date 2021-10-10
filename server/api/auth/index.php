<?php
    header('Content-Type: application/json;');
    require_once('../../config/db.php');
    require("../../helpers/cors.php");
    require("../../model/auth/auth.php");
    cors(); // use cors
    $event = "";
    if(isset($_POST["event"])) {
        $event = $_POST["event"];
    } else {
        $event = $_GET["event"];
    }
    switch($event) {
        case 'loginWithGoogle':
            $auth = new Auth($conn);
            $email = $_POST["email"];
            $fullName = $_POST["fullName"];
            $image = $_POST["image"];
            $result = $auth->authWithGoogle($email,$fullName,$image);
            echo json_encode($result);
            break;
        default:    
            break;
    }
?>