<?php
    require("../../config/db.php");
    class Product {
        private $conn;


        function __construct($db){
            $this->conn = $db;
        }

        public function getList($currentPage = 1, $limit = 12) {
            $resultList = array();
            $resultList["data"] = [];
            $totalQuery = 'SELECT count(ProductID) as Soluong from FO_Product';
            $totalResult = mysqli_query($this->conn,$totalQuery);
            $row = mysqli_fetch_assoc($totalResult);
            $totalProduct = $row["Soluong"];
            $totalPage = ceil($totalProduct / $limit);
            $limitQuery = 'LIMIT '.($currentPage - 1) * $limit.','.$limit.' '; // pagination
            $query = 'SELECT *,Ca_Name FROM FO_Product as p,FO_Category as c Where p.CategoryID = c.CategoryID '.$limitQuery.'';
            $data = mysqli_query($this->conn,$query);
            if(mysqli_num_rows($data) > 0) {
                    while($row1 = mysqli_fetch_assoc($data)) {
                        $items = array (
                            "product_id" => $row1["ProductID"],
                            "name" => $row1["pt_name"],
                            "price" => $row1["pt_price"],
                            "description" => $row1["pt_description"],
                            "discount" => $row1["pt_discount"],
                            "image" => $row1["pt_image"],
                            "category" => $row1["Ca_Name"],
                            "createdAt" => $row1["pt_createdAt"]
                        );
                        array_push($resultList["data"],$items);
                    }
            }
            $resultList["total_page"] = $totalPage;
            $resultList["current_page"] = $currentPage;
            mysqli_close($this->conn);
            return $resultList;
        }

        public function getDetail($productID) {
            $result = [];
            $result["product"] = [];
            $result["review"] = [];
            $queryProduct = "SELECT *,Ca_Name from FO_Product p, FO_Category c where p.CategoryID = c.CategoryID and '".$productID." = p.ProductID";
            $resultQueryProduct = mysqli_query($this->conn, $queryProduct);
            if(mysqli_num_rows($resultQueryProduct) > 0) {
                while($row = mysqli_fetch_assoc($resultQueryProduct)) {
                    $item = array (
                        "product_id" => $row["ProductID"],
                        "name" => $row["pt_name"],
                        "price" => $row["pt_price"],
                        "description" => $row["pt_description"],
                        "discount" => $row["pt_discount"],
                        "image" => $row["pt_image"],
                        "category" => $row["Ca_Name"],
                        "createdAt" => $row["CreatedAt"]
                    );
                    array_push($result["data"],$item);
                };
            }
            $queryReview = "SELECT * from FO_Review r,FO_User u where r.productID = ".$productID." and r.userID = u.userID";
            $resultReview = mysqli_query($this->conn,$queryReview);
            if(mysqli_num_rows($resultReview) > 0) {
                while($row = mysqli_fetch_assoc($resultReview)) {
                    $item = array (
                        "review_id" => $row["RvID"],
                        "content" => $row["Rv_Content"],
                        "createdAt" => $row["CreatedAt"],
                        "stars" => $row["Rv_Stars"],
                        "userName" => $row["us_name"],
                        "userImage" => $row["us_image"]
                    );
                    array_push($result["review"],$item);
                }
            }
            mysqli_close($this->conn);
            return $result;
        }

        public function create($name,$price,$description,$discount,$image,$categoryID) {
            $query="INSERT INTO `FO_Product` (pt_name, pt_price, pt_description, pt_discount, CategoryID, pt_image) VALUES('".$name."','".$price."','".$description."','".$discount."','".$categoryID."','".$image."')";
            $result = mysqli_query($this->conn,$query);
            mysqli_close($this->conn);
            return $result;
        }

        public function update($productID,$name,$price,$description,$discount,$image,$categoryID) {
            $query = 'UPDATE  `FO_Product` 
                            set pt_name,pt_price,pt_description,pt_discount, CategoryID, pt_image =   '.$name.','.$price.','.$description.','.$discount.','.$categoryID.','.$image.'
                            where FO_Product.productID = '.$productID.'';
            $result = mysqli_query($this->conn,$query);
            mysqli_close($this->conn);
            return $result;
        }

    }

?>