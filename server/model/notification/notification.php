<?php
    require("../../config/db.php");
    class Notification {
        private $conn;


        function __construct($db){
            $this->conn = $db;
        }
       function getList() {
           $res = [];
           $res["data"] = [];
           $query = mysqli_query($this->conn,'SELECT p.name as productName,u.name,n.*,u.image from fo_notification n,fo_product p,fo_user u WHERE n.productID = p.productID and n.userID = u.UserId ORDER BY createdAt DESC');
           if(mysqli_num_rows($query) > 0) {
               while($row = mysqli_fetch_assoc($query)) {
                $item = array (
                       "id" => $row["idNofi"],
                       "content" => $row["content"],
                       "createdAt" => $row["CreatedAt"],
                       "productName" => $row["productName"],
                       "name" => $row["name"],
                       "image" => $row["image"]
                   );
                   array_push($res["data"],$item);
               }
               $res["status"] = true;
           }
           return $res;
       }
    }
?>