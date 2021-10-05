<?php
    header('Content-Type: application/json;');
    require_once('../../config/db.php');
    require("../../config/cloud/index.php");
    require("../../helpers/cors.php");
    require("../../model/product/product.php");
    cors(); // use cors
    $event = "";
    $acceptType = array ("jpg","jpeg","png");
    $folder_path = "uploads/"; // url folder upload image
    if(isset($_POST["event"])) {
        $event = $_POST["event"];
    } else {
        $event = $_GET["event"];
    }
    switch($event) {
        case "getListProduct":
            $product = new Product($conn);
            $result = $product->getList($_GET["currentPage"],$_GET["limit"]);
            if($result) {
                $result["status"] = "success";
                echo json_encode($result);
            } else {
                $result["status"] = "failed";
                echo json_encode($result);
            }
            break;
        case "addProduct":
            $response["status"] = true;
            $product = new Product($conn);
            $name = $_POST["name"];
            $price = (float) $_POST["price"];
            $description = $_POST["description"];
            $discount = (float) $_POST["discount"];
            $categoryID = $_POST["categoryID"];
            $statusUploadImage = false;
            $file_path = $folder_path.$_FILES["image"]["name"]; // dẫn file vào upload
            $file_type =  strtolower(pathinfo($file_path,PATHINFO_EXTENSION));
            if(isset($_FILES["image"])) {
                if(in_array($file_type,$acceptType)) {
                    if(move_uploaded_file($_FILES["image"]["tmp_name"],$file_path)) {
                        $image = $upload->upload($file_path)['secure_url'];// upload image to cloudinary
                        $statusUploadImage = true;
                    } else {
                        $response["status"] = false;
                    }
                } 
            }
            if($statusUploadImage) {
                $result = $product->create($name,$price,$description,$discount,$image,$categoryID);
            }
            echo json_encode($response);
            break;
        case "deleteProduct":
            $product = new Product($conn);
            $productID = (int)$_POST["productID"];
            $result = $product->delete($productID);
            $response["status"] = true; 
            echo json_encode($response);
            break;
        default : 
            echo json_encode("Không hợp lệ"); 
            break;
    }
?>