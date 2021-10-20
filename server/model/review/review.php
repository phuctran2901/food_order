<?php


class Review {
        private $conn;


        function __construct($db){
            $this->conn = $db;
        }

        public function insert($userID,$productID,$content,$stars) {
            $result = mysqli_query($this->conn,'CALL insertReview('.$userID.','.$productID.',"'.$content.'",'.$stars.')');
            if($result)
                $res = true;
            else
                $res = false;
            mysqli_close($this->conn);
            return $res;
        }
        public function getReviewByProduct($product) {
            $res = [];
            $res["data"] =[];
            $result = mysqli_query($this->conn,'CALL getReviewByProduct('.$product.')');
            if(mysqli_num_rows($result) > 0) {
                while($row = mysqli_fetch_assoc($result)) {
                    $item = array (
                        "id" => $row["RvID"],
                        "stars" => $row["Stars"],
                        "content" => $row["Content"],
                        "userName" => $row["name"],
                        "userImage" => $row["image"],
                        "userID" => $row["UserId"],
                        "createdAt" => $row["CreatedAt"] 
                    );
                    array_push($res["data"],$item);
                }
            }
            $res["status"] = true;
            mysqli_close($this->conn);
            return $res;
        }
        public function getTotalReviewAndAvgStar($product) {
            $res = [];
            $call =mysqli_prepare($this->conn,'call getTotalAndAvgStarReview('.$product.',@total,@avgStar)'); // hàm này trả về tổng review và trung bình rating
            mysqli_stmt_execute($call);
            $resultQuery = mysqli_query($this->conn,'SELECT @total,@avgStar');
            $result = mysqli_fetch_assoc($resultQuery);
            if($result) {
                $res["total"] = $result["@total"];
                $res["avgStar"] = $result["@avgStar"];
                $res["status"] = true;
            } else {
                $res["status"] = false;
            }
            mysqli_close($this->conn);
            return $res;
        }
        public function delete($reviewID) {
            $result = mysqli_query($this->conn,'DELETE from fo_review WHERE RvID = '.$reviewID.'');
            if($result) $res = true;
            else $res = false;
            mysqli_close($this->conn);
            return $res;
        }
    }

?>