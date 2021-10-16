<?php
    header('Content-Type: application/json;');
    require_once('../../config/db.php');
    require("../../helpers/cors.php");
    require("../../config/cloud/index.php");
    require("../../model/categories/categories.php");
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
        case "addCategories":
            $categories = new Categories($conn);
            $statusUploadImage = false;
            if(isset($_FILES["image"])) {
                $file_path = $folder_path.$_FILES["image"]["name"]; // dẫn file vào upload
                $file_type =  strtolower(pathinfo($file_path,PATHINFO_EXTENSION));
                if(in_array($file_type,$acceptType)) {
                    if(move_uploaded_file($_FILES["image"]["tmp_name"],$file_path)) {
                        $image = $upload->upload($file_path)['secure_url'];// upload image to cloudinary
                        $statusUploadImage = true;
                    }
                } 
            }
            if($statusUploadImage) {
                $result = $categories->add($_POST["name"],$image);
            }
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