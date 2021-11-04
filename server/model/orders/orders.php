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
            $res["currentPage"] = (int) $currentPage;
            $res["totalPage"] = (int) ceil($totalOrder / $limit);
            mysqli_close($this->conn);
            return $res;
        }
        public function create($userID,$name,$phone,$address,$note,$listProduct,$totalMoney) {
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
                return true;
            }
            mysqli_close($this->conn);
            return false;
        }
    }
?>