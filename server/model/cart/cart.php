<?php

class Cart {
        private $conn;

        function __construct($db){
            $this->conn = $db;
        }

        public function addOrUpdate($productID,$userID,$amount) { 
            $call = mysqli_prepare($this->conn, 'CALL checkExistsCart('.$productID.','.$userID.',@result)'); // hàm này check xem sản phẩm của userID đó có trong giỏ hàng chưa
            mysqli_stmt_execute($call);
            $select = mysqli_query($this->conn,'SELECT @result');
            $isExists = (int) mysqli_fetch_assoc($select)["@result"];
            if($isExists > 0) { // sản phẩm đã tồn tại thì update
                $query = 'UPDATE fo_cartdetail c SET Quantity = '.$amount.' WHERE c.ProductID = '.$productID.'';
                $result = mysqli_query($this->conn,$query);
                if($result) $res["status"] = true;
                else $res["status"] = false;
            } else { // chưa thì insert
                $query = 'INSERT INTO fo_cartdetail(UserId,ProductID,Quantity) VALUES('.$userID.','.$productID.','.$amount.')';
                $result = mysqli_query($this->conn,$query);
                if($result) $res["status"] = true;
                else $res["status"] = false;
            }
            mysqli_close($this->conn);
            return $res;
        }


        public function delete($cartID) {
            $query  = 'DELETE from fo_cartdetail c WHERE c.CartDeID = '.$cartID.'';
            $result = mysqli_query($this->conn,$query);
            if($result) $res["status"] = true;
            else $res["status"] = false;
            mysqli_close($this->conn);
            return $res;
        }
        public function totalCart($userID) {
            $result = mysqli_query($this->conn,'select totalCart('.$userID.') as total');
            if($result) {
                $res["status"] = true;
                $res["total"] = mysqli_fetch_assoc($result)['total'];
            } else {
                $res["status"]= false;
            }
            mysqli_close($this->conn);
            return $res;
        }
    }

?>