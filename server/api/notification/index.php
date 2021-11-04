<?php
    header('Content-Type: application/json;');
    require_once('../../config/db.php');
    require("../../helpers/cors.php");
    require("../../config/cloud/index.php");
    require("../../model/notification/notification.php");
    cors(); // use cors
    $event = "";
    if(isset($_POST["event"])) {
        $event = $_POST["event"];
    } else {
        $event = $_GET["event"];
    }
    switch($event) {
       case "getList":
            $notification = new Notification($conn);
            $result = $notification->getList();
            echo json_encode($result);
            break;
        default : 
            echo json_encode("Không hợp lệ"); 
            break;
    }
?>