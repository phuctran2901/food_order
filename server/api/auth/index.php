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
        case 'loginWithSocical':
            $auth = new Auth($conn);
            $email = $_POST["email"];
            $fullName = $_POST["fullName"];
            $image = $_POST["image"];
            $userID = $_POST["userID"];
            $result = $auth->authWithSocical($userID,$email,$fullName,$image);
            echo json_encode($result);
            break;
        case "login":
            $auth = new Auth($conn);
            $email = $_POST["email"];
            $password = $_POST["password"];
            $result = $auth->login($email,$password);
            echo json_encode($result);
        default:    
            break;
    }
?>