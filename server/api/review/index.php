<?php

use Symfony\Polyfill\Intl\Idn\Resources\unidata\Regex;

header('Content-Type: application/json;');
    require_once('../../config/db.php');
    require("../../helpers/cors.php");
    require("../../model/review/review.php");
    cors(); // use cors
    $event = "";
    if(isset($_POST["event"])) {
        $event = $_POST["event"];
    } else {
        $event = $_GET["event"];
    }
    switch($event) {
        case "insertReview":
            $review = new Review($conn);
            $userID = (int)$_POST["userID"];
            $productID = (int)$_POST["productID"];
            $content = $_POST["content"];
            $stars = $_POST["starRating"];
            $result = $review->insert($userID,$productID,$content,$stars);
            echo json_encode($result);
            break;
        case "getReviewByProduct":
            $review = new Review($conn);
            $productID =(int) $_GET["productID"];
            $result = $review->getReviewByProduct($productID);
            echo json_encode($result);
            break;
        case "getTotalReviewAndAvgStar":
            $review = new Review($conn);
            $productID = (int) $_GET["productID"];
            $result = $review->getTotalReviewAndAvgStar($productID);
            echo json_encode($result);
            break;
        case "deleteReview":
            $review = new Review($conn);
            $reviewID = (int) $_POST["reviewID"];
            $result = $review->delete($reviewID);
            echo json_encode($result);
            break;
        default:    
            break;
    }
?>