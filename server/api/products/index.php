<?php
    header('Content-type : application/json');
    require_once('../../config/db.php');
    require("../../helpers/cors.php");
    require("../../model/product/product.php");
    cors(); // use cors

    $event = $_GET["event"] ? $_GET["event"] : $_POST["event"];
    switch($event) {
        case "getListProduct":
            $product = new Product($conn);
            $result = $product->getList($_GET["currentPage"],$_GET["limit"]);
            if($result) {
                $result["status"] = "success";
                json_encode($result);
            } else {
                $result["status"] = "failed";
                json_encode($result);
            }
            break;
        case "addProduct":
            $product = new Product($conn);
            $name = $_POST["name"];
            $price = (float) $_POST["price"];
            $description = $_POST["description"];
            $discount = $_POST["discount"];
            $image = $_POST["image"];
            $categoryID = $_POST["categoryID"];
            $result = $product->create($name,$price,$description,$discount,$image,$categoryID);
            if($result) {
                $result["status"] = "success";
                echo json_encode($result);
            }
        default : 
            json_encode("Không hợp lệ"); 
            break;
    }
?>