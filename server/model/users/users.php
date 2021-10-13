<?php

use GuzzleHttp\Psr7\Response;

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
            $totalPage = ( (int) mysqli_fetch_assoc($select)["@result"]) / $limit;
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
            return $response;
        }
    }

?>