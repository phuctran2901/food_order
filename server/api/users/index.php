<?php
    header('Content-Type: application/json;');
    require_once('../../config/db.php');
    require("../../helpers/cors.php");
    require("../../config/cloud/index.php");
    require("../../model/users/users.php");
    cors(); // use cors
    $event = "";
    $acceptType = array ("jpg","jpeg","png");
    $folder_path = "uploads/"; 
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
        case "getOneUser":
            $users = new Users($conn);
            $id = (int) $_GET["id"];
            $result = $users->getOneUser($id);
            echo json_encode($result);
            break;
        case "updateUser":
            $response = [];
            $users = new Users($conn);
            $id = (int) $_POST["id"];
            $name = $_POST["name"];
            $age = (int) $_POST["age"];
            $address = $_POST["address"];
            $phone = $_POST["phone"];
            $role = (int) $_POST["role"];
            $statusUploadImage = false;
            if(isset($_FILES["image"])) {
                $file_path = $folder_path.$_FILES["image"]["name"];
                $file_type =  strtolower(pathinfo($file_path,PATHINFO_EXTENSION));
                if(in_array($file_type,$acceptType)) {
                    if(move_uploaded_file($_FILES["image"]["tmp_name"],$file_path)) {
                        $image = $upload->upload($file_path)['secure_url'];
                        $statusUploadImage = true;
                    } else {
                        $response["status"] = false;
                    }
                } 
            } else {
                $image = $_POST["image"];
                $statusUploadImage = true;
            }
            if($statusUploadImage) {
                $resultUpdate = $users->update($id,$name,$phone,$address,$age,$role,$image);
                if($resultUpdate) $response["status"] = true;
                else   $response["status"] = false;
            }
            echo json_encode($response);
            break;
            case "getTotal":
                $user = new Users($conn);
                $result = $user->getTotal();
                echo json_encode($result);
                break;
        default : 
            echo json_encode("Không hợp lệ"); 
            break;
    }
?>