<?php
    header('Content-Type: application/json;');
    require_once('../../config/db.php');
    require("../../helpers/cors.php");
    require("../../model/users/users.php");
    cors(); // use cors
    $event = "";
    if(isset($_POST["event"])) {
        $event = $_POST["event"];
    } else {
        $event = $_GET["event"];
    }
    switch($event) {
        case "getListUser":
            $currentPage = (int) $_GET["currentPage"];
            $limit =(int) $_GET["limit"];
            $role =(int) $_GET["role"];
            $users = new Users($conn);
            $result = $users->getList($role,$currentPage,$limit);
            echo json_encode($result);
            break;
        default : 
            echo json_encode("Không hợp lệ"); 
            break;
    }
?>