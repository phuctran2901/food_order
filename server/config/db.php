<?php
$hostname = 'localhost';
$username = 'root';
$password = '';
$dbname = "food_order";
$port = 3306;
$conn = mysqli_connect($hostname, $username, $password,$dbname, $port);
if (!$conn){
    die('Không thể kết nối: ' . mysqli_error($conn));
    exit();
}
mysqli_set_charset($conn,"utf8");

?>
