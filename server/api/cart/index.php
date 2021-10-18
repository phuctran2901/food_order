<?php
    header('Content-Type: application/json;');
    require_once('../../config/db.php');
    require("../../helpers/cors.php");
    require("../../model/cart/cart.php");
    cors(); // use cors
    $event = "";
    if(isset($_POST["event"])) {
        $event = $_POST["event"];
    } else {
        $event = $_GET["event"];
    }
    switch($event) {
        case "addCart":
            $cart = new Cart($conn);
            $amount = (int) $_POST["amount"];
            $productID = (int) $_POST["productID"];
            $userID = (int) $_POST["userID"];
            $result = $cart->addOrUpdate($productID,$userID,$amount);
            echo json_encode($result);
            break;
        default:    
            break;
    }
?>