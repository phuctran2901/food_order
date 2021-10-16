<?php
    require("../../config/db.php");
    class Categories {
        private $conn;


        function __construct($db){
            $this->conn = $db;
        }

       function add($name,$image) {
           $query = 'CALL INSERT_CATEGORY("'.$name.'","'.$image.'")'; // call stored procedure
           $result = mysqli_query($this->conn,$query);
           mysqli_close($this->conn);
           return $result;
       }

       function getList() {
            $result["data"] = [];
            $query = 'CALL  getListCategories()';
            $resultQuery = mysqli_query($this->conn,$query);
            if(mysqli_num_rows($resultQuery) > 0) {
            while($row = mysqli_fetch_assoc($resultQuery)) {
                $item = array (
                    "categoryID" => $row["CategoryID"],
                    "name" => $row["ca_name"],
                    "image" => $row["image"]
                );
                array_push($result["data"],$item);
                }
            }
            mysqli_close($this->conn);
            return $result;
       }
       function delete($id) {
            $query = 'DELETE from `FO_Category` WHERE categoryID = '.$id.'';
            $result = mysqli_query($this->conn,$query);
            return $result;
       }
    }
?>