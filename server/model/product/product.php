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
            $query = 'SELECT *,c.Ca_Name FROM FO_Product as p,FO_Category as c 
            Where p.CategoryID = c.CategoryID 
            ORDER BY create_At DESC
            '.$limitQuery.' 
            ' ;
            $data = mysqli_query($this->conn,$query);
            if(!$data || mysqli_num_rows($data) > 0) {
                    while($row1 = mysqli_fetch_array($data)) {
                        $items = array (
                            "product_id" => $row1["ProductID"],
                            "name" => $row1["Name"],
                            "price" => $row1["Price"],
                            "description" => $row1["Description"],
                            "discount" => $row1["discount"],
                            "image" => $row1["Image"],
                            "category" => $row1["Ca_Name"],
                            "createdAt" => $row1["create_At"]
                        );
                        // array_push($items["ngay"],$row1["createdAt"]);
                        array_push($resultList["data"],$items);
                    }
            }
            $resultList["total_page"] = $totalPage;
            $resultList["current_page"] = (int) $currentPage;
            mysqli_close($this->conn);
            return $resultList;
        }

        public function getDetail($productID) {
            $result = [];
            $result["product"] = [];
            $result["review"] = [];
            $queryProduct = "SELECT *,Ca_Name from FO_Product p, FO_Category c where p.CategoryID = c.CategoryID and  p.ProductID =  ".$productID."";
            $resultQueryProduct = mysqli_query($this->conn, $queryProduct);
            if(mysqli_num_rows($resultQueryProduct) > 0) {
                while($row = mysqli_fetch_assoc($resultQueryProduct)) {
                    $item = array (
                        "product_id" => $row["ProductID"],
                        "name" => $row["Name"],
                        "price" => $row["Price"],
                        "description" => $row["Description"],
                        "discount" => $row["discount"],
                        "image" => $row["Image"],
                        "createdAt" => $row["create_At"],
                        "category" => $row["Ca_Name"],
                    );
                    array_push($result["product"],$item);
                };
            }
            // $queryReview = "SELECT * from FO_Review r,FO_User u where r.productID = ".$productID." and r.userID = u.userID";
            // $resultReview = mysqli_query($this->conn,$queryReview);
            // var_dump(mysqli_num_rows($resultReview));
            // if(mysqli_num_rows($resultReview) > 0) {
            //     while($row = mysqli_fetch_assoc($resultReview)) {
            //         $item = array (
            //             "review_id" => $row["RvID"],
            //             "content" => $row["Rv_Content"],
            //             "createdAt" => $row["createdAt"],
            //             "stars" => $row["Rv_Stars"],
            //             "userName" => $row["us_name"],
            //             "userImage" => $row["us_image"]
            //         );
            //         array_push($result["review"],$item);
            //     }
            // }
            mysqli_close($this->conn);
            return $result;
        }

        public function create($name,$price,$description,$discount,$image,$categoryID,$display) {
            $query="INSERT INTO `FO_Product` (Name, Price, Description, Discount, CategoryID, Image,Display) VALUES('".$name."','".$price."','".$description."','".$discount."','".$categoryID."','".$image."', '".$display."')";
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
        public function delete($productID) {
            $query = 'DELETE from `FO_Product` where ProductID = '.$productID.' ';
            $result = mysqli_query($this->conn,$query);
            mysqli_close($this->conn);
            return $result;
        }
    }

?>