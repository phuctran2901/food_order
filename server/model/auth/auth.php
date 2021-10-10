<?php

use GuzzleHttp\Psr7\Response;

class Auth {
        private $conn;


        function __construct($db){
            $this->conn = $db;
        }

        function authWithGoogle($email,$fullName,$image) {
            $response = [];
            $response["data"]= [];
            $call = mysqli_prepare($this->conn, 'CALL checkEmail("'.$email.'", @result)'); // call stored procedure hàm trả về 0 hoặc 1 check tồn tại
            mysqli_stmt_execute($call);
            $select = mysqli_query($this->conn,'SELECT @result');
            $result = (int) mysqli_fetch_assoc($select)["@result"];
            if($result > 0) { // nếu lớn hơn 0 thì tài khoản đã tồn tại 
                $queryUser = 'call getUserByEmail("'.$email.'")'; // hàm lấy user bằng email
                $resultUser = mysqli_query($this->conn,$queryUser);
                if(mysqli_num_rows($resultUser) > 0) {
                    while($row = mysqli_fetch_assoc($resultUser)) {
                        $item = array (
                            "id" => $row["UserId"],
                            "fullName" => $row["Name"],
                            "Age" => $row["Age"],
                            "Address" => $row["Address"],
                            "Phone" => $row["Phone"],
                            "Email" => $row["Email"],
                            "Image" => $row["Image"]
                        );
                        array_push($response["data"],$item);
                    }
                    $response["status"] = true;
                }
            } else { // nếu <= 0 tức là chưa đăng ký => đăng ký
                $queryInsert = 'call insertUserByGoogle("'.$email.'","'.$fullName.'","'.$image.'")'; // vì google chỉ trả về tên, email, image nên phải làm 1 hàm stored procedure riêng để insert
                $resultInsert = mysqli_query($this->conn,$queryInsert);
                if($resultInsert) $response["status"] = true;
                else {
                    $response["status"] = false;
                    $response["messenger"] = "Đăng ký thất bại";
                }
            }
            return $response;
        }

        function register($email,$password,$name,$phone,$address,$age) {
            $response = [];
            $call = mysqli_prepare($this->conn,'Call checkEmail("'.$email.'",@result)');
            mysqli_stmt_execute($call);
            $select = mysqli_query($this->conn,'SELECT @result');
            $result = (int) mysqli_fetch_assoc($select)["@result"];
            if($result > 0) {
                $response["status"] = false;
                $response["messenger"] = "Email đã có người sử dụng !";
            } else {
                $hashPassword = md5($password); // hash code  lưu vào database sẽ k thấy password thật sự
                $queryInsert = 'INSERT TO `fo_user`(Email,UserPassword,Name,Age,Phone,Address,Role) VALUES("'.$email.'","'.$hashPassword.'","'.$name.'","'.$age.'","'.$phone.'","'.$address.'", 1)';
                $resultInsert = mysqli_query($this->conn,$queryInsert);
                if($resultInsert) {
                    $response["status"] = true;
                    $response["messenger"] = 'Đăng ký tài khoản thành công!';
                }
            }
            return $response;
        }





    }

?>