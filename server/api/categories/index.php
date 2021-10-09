<?php
    header('Content-Type: application/json;');
    require_once('../../config/db.php');
    require("../../helpers/cors.php");
    require("../../model/categories/categories.php");
    cors(); // use cors
    $event = "";
    if(isset($_POST["event"])) {
        $event = $_POST["event"];
    } else {
        $event = $_GET["event"];
    }
    switch($event) {
        case "addCategories":
            $categories = new Categories($conn);
            $result = $categories->add($_POST["name"]);
            echo json_encode($result);
            break;
        case "getListCategories":
            $categories = new Categories($conn);
            $result = $categories->getList();
            if(count($result["data"]) > 0 ) {
                $result["status"] = true;
            } else $result["status"] = false;
            echo json_encode($result);
            break;
        case "deleteCategories":
            $categories = new Categories($conn);
            $id = (int) $_POST["id"];
            $result = $categories->delete($id);
            echo json_encode($result);
            break;
        default : 
            echo json_encode("Không hợp lệ"); 
            break;
    }
?>