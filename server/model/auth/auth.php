<?php

use GuzzleHttp\Psr7\Response;

class Auth {
        private $conn;


        function __construct($db){
            $this->conn = $db;
        }

        function authWithSocical($userID,$email,$fullName,$image) { // đăng nhập với mạng xã hội facebook và google
            $response = [];
            $response["data"]= [];
            $call = mysqli_prepare($this->conn, 'CALL checkAccountsSocical("'.$email.'","'.$userID.'", @result)'); // call stored procedure hàm trả về int
            mysqli_stmt_execute($call);
            $select = mysqli_query($this->conn,'SELECT @result');
            $result = (int) mysqli_fetch_assoc($select)["@result"];
            if($result > 0) { // nếu lớn hơn 0 thì tài khoản đã tồn tại 
                $queryUser = 'call getUserByEmail("'.$email.'","'.$userID.'")'; // hàm lấy user bằng email
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
                            "Image" => $row["Image"],
                            "Role" => $row["Role"]
                        );
                        array_push($response["data"],$item);
                    }
                    $response["status"] = true;
                }
            } else { // nếu <= 0 tức là chưa đăng ký => đăng ký
                $queryInsert = 'call insertUserBySocical("'.$userID.'","'.$email.'","'.$fullName.'","'.$image.'")'; // vì google, facebook chỉ trả về id, tên, email, image nên phải làm 1 hàm stored procedure riêng để insert
                $resultInsert = mysqli_query($this->conn,$queryInsert);
                if($resultInsert) {
                    $response["status"] = true;
                    $response["data"] = array (
                        "email" => $email,
                        "name" => $fullName,
                        "image" => $image,
                        "role" => 1
                    );
                }
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
                } else {
                    $response["status"] = false;
                    $response["messenger"] = "Đăng ký tài khoản thất bại !";
                }
            }
            return $response;
        }

        function login($email,$password) {
            $response = [];
            $query = mysqli_query($this->conn,'CALL checkExitsUser("'.$email.'")');
           if(mysqli_num_rows($query) > 0) {
               $result = mysqli_fetch_assoc($query);
               if($password == md5($result["UserPassword"])) {
                    $response["data"] = array (
                        "id" => $result["UserId"],
                        "fullName" => $result["Name"],
                        "Age" => $result["Age"],
                        "Address" => $result["Address"],
                        "Phone" => $result["Phone"],
                        "Email" => $result["Email"],
                        "Image" => $result["Image"],
                        "Role" => $result["Role"],
                        'SocicalID' => $result["IdSocical"]
                    );
                    $response["status"] = true;
               } else {
                   $response["status"] = false;
                   $response["messenger"] = "Sai tài khoản hoặc mật khẩu";
               }
           } else {
               $response["status"] = false;
               $response["messenger"] = "Email không tồn tại";
           }
           return $response;
        }




    }

?>