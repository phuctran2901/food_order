<?php
    require("../../config/db.php");
    class Orders {
        private $conn;


        function __construct($db){
            $this->conn = $db;
        }
        public function getList($currentPage = 1,$limit = 10,$type) {
            $res = [];
            $res["data"] = [];
            $queryTotalOrder = mysqli_prepare($this->conn,'call totalOrder("'.$type.'",@total)');
            mysqli_stmt_execute($queryTotalOrder);
            $totalOrder =(int) mysqli_fetch_assoc(mysqli_query($this->conn,'SELECT @total'))["@total"];
            $query = mysqli_query($this->conn,'call getListOrder('.($currentPage - 1) * $limit.','.$limit.',"'.$type.'")');
            if(mysqli_num_rows($query) > 0) {
                while($row = mysqli_fetch_assoc($query)) {
                    $item = array (
                        "id" => $row["OrderID"],
                        "status" => $row["Status"],
                        "createdAt" => $row["CreatedAt"],
                        "note" => $row["Note"],
                        "name" => $row["name"],
                        "phone" => $row["phone"],
                        "address" => $row["address"],
                        "totalMoney" => $row["totalMoney"]
                    );
                    array_push($res["data"],$item);
                }
                $res["status"] = true;
            }
            print(mysqli_error($this->conn));
            $res["currentPage"] = (int) $currentPage;
            $res["totalPage"] = (int) ceil($totalOrder / $limit);
            mysqli_close($this->conn);
            return $res;
        }
        public function create($userID,$name,$phone,$address,$note,$listProduct,$totalMoney) {
            $res = [];
            $queryOrder = mysqli_prepare($this->conn,'call createOrder('.$userID.',"'.$name.'",'.$phone.',"'.$address.'","'.$note.'",'.$totalMoney.',@idOrder)');
            mysqli_stmt_execute($queryOrder);
            $idOrder =(int) mysqli_fetch_assoc(mysqli_query($this->conn,'SELECT @idOrder'))["@idOrder"]; // hàm procedure này sẽ trả lại id vừa insert
            // tạo list order detail chứa sản phẩm của đơn hàng
            if($idOrder >= 0) {
                for ($i=0; $i <count($listProduct); $i++) { 
                    $productID =(int) $listProduct[$i]["productID"];
                    $quantity = (int)$listProduct[$i]["quantity"];
                    $totalPrice = (float)$listProduct[$i]["totalPrice"];
                    mysqli_query($this->conn,'call addOrderDetail('.$idOrder.','.$productID.','.$quantity.','.$totalPrice.')');
                }
                $res["id"] = $idOrder;
                $res["status"] = true;
                return $res;
            }
            $res["status"]= false;
            mysqli_close($this->conn);
            return $res;
        }
        public function changeStatus($id) {
            $query = 'UPDATE fo_order set Status = Status + 1 where OrderID = '.$id.'';
            if(mysqli_query($this->conn,$query)) {
                mysqli_close($this->conn);
                return true;
            } else {
                mysqli_close($this->conn);
                return false;
            }
        }
        public function getOrder($id) {
            $res = [];
            $res["data"] = [];
            $query = mysqli_query($this->conn,'SELECT *,p.image as pimage from fo_orderdetail o,fo_product p,fo_category c WHERE o.OrderID = '.$id.' and p.ProductID = o.ProductID and c.CategoryID = p.CategoryID');
            if($query) {
                while($rowOrder = mysqli_fetch_assoc($query)) {
                    $itemOrder = array (
                        "id" => $rowOrder["OrderID"],
                        "quantity" => $rowOrder["Quantity"],
                        "total" => $rowOrder["Total"],
                        "name" => $rowOrder["Name"],
                        "price" => $rowOrder["Price"],
                        "nameCategory" => $rowOrder["ca_name"],
                        "image" => $rowOrder["pimage"],
                        "discount" => $rowOrder["discount"]
                    );
                    array_push($res["data"],$itemOrder);
                }
            }
            return $res;
        }
    }
?>