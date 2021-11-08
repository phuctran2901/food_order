<?php
    header('Content-Type: application/json;');
    require_once('../../config/db.php');
    require("../../helpers/cors.php");
    require("../../model/orders/orders.php");
    cors(); // use cors
    $event = "";
    if(isset($_POST["event"])) {
        $event = $_POST["event"];
    } else {
        $event = $_GET["event"];
    }
    switch($event) {
       case "addOrder":
            $order = new Orders($conn);
            $listProduct = $_POST["listProduct"];
            $userID = $_POST["userID"];
            $name = $_POST["name"];
            $phone = (int) $_POST["phone"];
            $address = $_POST["address"];
            $note = $_POST["note"];
            $totalMoney = (float) $_POST["totalMoney"];
            $result = $order->create($userID,$name,$phone,$address,$note,$listProduct,$totalMoney);
            echo json_encode($result);
            break;
        case "getListOrder":
            $order = new Orders($conn);
            $currentPage = (int) $_GET["currentPage"];
            $limit = (int) $_GET["limit"];
            $type = $_GET["type"];
            $listOrder = $order->getList($currentPage,$limit,$type);
            echo json_encode($listOrder);
            break;
        case "changeStatus":
            $order = new Orders($conn);
            $id = (int) $_POST["id"];
            $result = $order->changeStatus($id);
            echo json_encode($result);
            break;
        case "getOrder":
            $order = new Orders($conn);
            $id = (int) $_GET["id"];
            $result = $order->getOrder($id);
            echo json_encode($result);
            break;
        default:    
            break;
    }
?>