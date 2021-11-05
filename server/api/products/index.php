<?php
    header('Content-Type: application/json;');
    require_once('../../config/db.php');
    require("../../config/cloud/index.php");
    require("../../helpers/cors.php");
    require("../../model/product/product.php");
    cors(); // use cors
    // 0 tăng dần , 1 giảm dần
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
            $result = $product->getList($_GET["currentPage"],$_GET["limit"],$_GET["categoryID"]);
            if($result) {
                $result["status"] = "success";
                echo json_encode($result);
            } else {
                $result["status"] = "failed";
                echo json_encode($result);
            }
            break;
        case "sortListProduct":
            $product = new Product($conn);
            $typeSort =(int) $_GET["typeSort"];
            $nameSort = $_GET["nameSort"];
            $currentPage = (int)  $_GET["currentPage"];
            $limit = (int)  $_GET["limit"];
            $categoryID = (int)  $_GET["categoryID"];
            $result = $product->sortListProduct($typeSort,$nameSort,$currentPage,$limit,$categoryID);
            echo json_encode($result);
            break;
        case "addProduct":
            $response["status"] = true;
            $product = new Product($conn);
            $name = $_POST["name"];
            $price = (float) $_POST["price"];
            $description = $_POST["description"];
            $discount = (float) $_POST["discount"];
            $categoryID = $_POST["categoryID"];
            $display = $_POST["display"];
            $userID =(int) $_POST["userID"];
            $statusUploadImage = false;
            if(isset($_FILES["image"])) {
                $file_path = $folder_path.$_FILES["image"]["name"]; // dẫn file vào upload
                $file_type =  strtolower(pathinfo($file_path,PATHINFO_EXTENSION));
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
                $result = $product->create($name,$price,$description,$discount,$image,$categoryID,$display,$userID);
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
        case "getOneProduct":
            $product = new Product($conn);
            $productID = (int)$_GET["productID"];
            $result = $product->getDetail($productID);
            echo json_encode($result);
            break;
        case  "editProduct":
            $product = new Product($conn);
            $productID = $_POST["productID"];
            $name = $_POST["name"];
            $price = (float) $_POST["price"];
            $description = $_POST["description"];
            $discount = (float) $_POST["discount"];
            $categoryID = (int) $_POST["categoryID"];
            $display =(int) $_POST["display"];
            if(isset($_FILES["image"])) {
                $file_path = $folder_path.$_FILES["image"]["name"]; 
                $file_type =  strtolower(pathinfo($file_path,PATHINFO_EXTENSION));
                if(in_array($file_type,$acceptType)) {
                    if(move_uploaded_file($_FILES["image"]["tmp_name"],$file_path)) {
                        $image = $upload->upload($file_path)['secure_url'];// upload image to cloudinary
                    } else {
                        $response["status"] = false;
                    }
                } 
            } else {
                $image = $_POST["image"];
                $statusUploadImage = true;
            };
            $result = $product->update($productID,$name,$price,$description,$discount,$image,$categoryID,$display);
            echo json_encode($result);
            break;
        case "getRelatedProduct":
            $categoryID = (int) $_GET["categoryID"];
            $products = new Product($conn);
            $result = $products->getRelatedProduct($categoryID);
            echo json_encode($result);
            break;
        case "filterProduct":
            $product = new Product($conn);
            $filterPrice = (int) $_GET["filterPrice"];
            $filterRating = (int) $_GET["filterRating"];
            $result = $product->filterProduct($filterPrice,$filterRating);
            echo json_encode($result);
            break;
        case "searchByKeyword":
            $product = new Product($conn);
            $keyword = $_GET["keyword"];
            $result = $product->searchByKeyword($keyword);
            echo json_encode($result);
            break;
        case "getTotal":
            $product = new Product($conn);
            $result = $product->getTotal();
            echo json_encode($result);
            break;
        case "getProductByDisplay":
            $product = new Product($conn);
            $display = (int) $_GET["display"];
            $result = $product->getProductByDisplay($display);
            echo json_encode($result);
            break;
        default : 
            echo json_encode("Không hợp lệ"); 
            break;
    }
?>