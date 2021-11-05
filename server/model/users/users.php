<?php


class Users {
        private $conn;


        function __construct($db){
            $this->conn = $db;
        }

        function getList($role,$currentPage,$limit) { // lấy danh sách theo loại -1 : all, 0 : admin, 1 customer, 2 : shipper
            $response = [];
            $response["data"] = [];
            $totalRowUserQuery = mysqli_prepare($this->conn, 'CALL getTotalRowUser("'.$role.'", @result)');
            mysqli_stmt_execute($totalRowUserQuery);
            $select = mysqli_query($this->conn,'SELECT @result');
            $totalPage = ceil(( (int) mysqli_fetch_assoc($select)["@result"]) / $limit);
            $query = mysqli_query($this->conn, 'CALL getListUser("'.$role.'","'.($currentPage -1) * $limit.'","'.$limit.'")');
            if(mysqli_num_rows($query) > 0) {
                while($row = mysqli_fetch_assoc($query)) {
                    $item = array (
                        "userID" => $row["UserId"],
                        "name" => $row["Name"],
                        "age" => $row["Age"],
                        "phone"=> $row["Phone"],
                        "address" => $row["Address"],
                        "role" => $row["Role"],
                        "createdAt" => $row["CreatedAt"],
                        "image"=> $row["Image"],
                        "email" => $row["Email"]
                    );
                    array_push($response["data"],$item);
                }
            }
            $response["currentPage"] = $currentPage;
            $response["totalPage"] = $totalPage;
            mysqli_close($this->conn);
            return $response;
        }
        function delete($id) {
            $response = [];
            $getRole = mysqli_prepare($this->conn, 'CALL getRole("'.$id.'", @result)'); // kiểm tra quyền của user
            mysqli_stmt_execute($getRole);
            $role = mysqli_query($this->conn,'SELECT @result');
            if(mysqli_fetch_assoc($role)['@result'] = 1) { //nếu là admin thì được phép xóa 
                $query = mysqli_query($this->conn,'DELETE from fo_user where UserId = '.$id.'');
                if($query) {
                    $response["status"] = true;
                    $response["messenger"] = "Xóa thành công";
                } else {
                    $response["status"] = false;
                    $response["messenger"] = "Xóa thất bại";
                }
            } else {
                $response["status"] = false;
                $response["messenger"] = "Bạn không đủ quyền để thực hiện thao tác này";
            }
            mysqli_close($this->conn);
            return $response;
        }
        function update($id,$name,$phone,$address,$age,$role = 1,$image) {
            $query = 'CALL updateUser('.$id.',"'.$name.'",'.$age.','.$phone.','.$role.',"'.$image.'","'.$address.'")';
            $resultQuery = mysqli_query($this->conn,$query);
            if($resultQuery) {
                $response= true;
            } else {
                $response = false;
            }
            mysqli_close($this->conn);
            return $response;
        }

        function getOneUser($id) {
            $resultQuery = mysqli_query($this->conn,'SELECT * from fo_user WHERE UserId = '.$id.'');
            $res["data"] = [];
            if(mysqli_num_rows($resultQuery) > 0) {
                while($row = mysqli_fetch_assoc($resultQuery)) {
                    $item = array (
                        "id" => $row["UserId"],
                        "name" => $row["Name"],
                        "age" => $row["Age"],
                        "phone"=>$row["Phone"],
                        "address"=>$row["Address"],
                        "image"=>$row["Image"],
                        "createdAt" =>$row["CreatedAt"],
                        "role" =>$row["Role"],
                        "email"=>$row["Email"]
                    );
                    array_push($res["data"],$item);
                }
                $res["status"] = true;
            } else {
                $res["status"] = false;
                $res["messenger"] = "Lấy thông tin khách hàng có mã ".$id." thất bại";
            }
            mysqli_close($this->conn);
            return $res;
        }
        public function getTotal() {
            $res = [];
            $query = mysqli_query($this->conn,'SELECT count(*) as total from fo_user');
            $res["total"]  = mysqli_fetch_assoc($query)['total'];
            mysqli_close($this->conn);
            return $res;
        }
    }

?>