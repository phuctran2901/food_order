-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 08, 2021 lúc 01:37 PM
-- Phiên bản máy phục vụ: 10.4.21-MariaDB
-- Phiên bản PHP: 7.3.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `food_order`
--

DELIMITER $$
--
-- Thủ tục
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `addOrderDetail` (IN `orderid` INT, IN `productid` INT, IN `quantity` INT, IN `total` FLOAT)  BEGIN
	INSERT INTO fo_orderdetail(OrderID,ProductID,Quantity,Total) VALUES(orderid,productid,quantity,total);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `checkAccountsSocical` (IN `userID` VARCHAR(200), OUT `result` INT)  BEGIN
	SELECT COUNT(*) INTO result
    FROM fo_user
    WHERE IdSocical = userID;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `checkEmail` (IN `emailUser` VARCHAR(200), OUT `result` INT)  BEGIN
	SELECT COUNT(*) into result FROM fo_user WHERE fo_user.Email = emailUser;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `checkExistsCart` (IN `id` INT, IN `userid` INT, OUT `result` INT)  BEGIN
	SELECT COUNT(CartDeID) INTO result from fo_cartdetail c WHERE c.ProductID = id and c.UserId = userid;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `checkExitsUser` (IN `emailUser` VARCHAR(200))  BEGIN
	SELECT * FROM fo_user
    WHERE Email = emailUser and IdSocical is null;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `createOrder` (IN `userid` INT, IN `nameIn` VARCHAR(100), IN `phoneIn` INT, IN `addressIn` VARCHAR(300), IN `note` TEXT, IN `totalMoney1` FLOAT, OUT `result` INT)  BEGIN
	INSERT INTO fo_order(UserId,name,phone,address,Note,Status,totalMoney) VALUES(userid,nameIn,phoneIn,addressIn,note,0,totalMoney1);
    SELECT @@IDENTITY INTO result;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `filterPriceAndRating` (IN `priceI` INT, IN `rating` INT)  BEGIN
	SELECT p.*,(SELECT AVG(Stars) from fo_review r WHERE r.ProductID = p.ProductID) as Star from fo_product p
	HAVING CASE priceI
    		WHEN 5 THEN Price >=50000
            WHEN 4 THEN Price BETWEEN 40000 AND 50000
            WHEN 3 THEN Price BETWEEN 20000 AND 40000
            WHEN 2 THEN Price <=20000 
            WHEN -1 THEN Price >=0 END
            AND
           CASE rating
           WHEN 5 THEN FLOOR(Star) = 5
           WHEN 4 THEN FLOOR(Star) = 4
           WHEN 3 THEN FLOOR(Star) BETWEEN 0 and 3
           WHEN -1 THEN FLOOR(Star) >= 0 or Star is null
           END;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getListCartByUser` (IN `userid` INT)  BEGIN
	SELECT p.*,c.Quantity,c.CartDeID,ca.ca_name from fo_cartdetail c, fo_product p, fo_category ca
    WHERE c.UserId = userid and c.ProductID = p.ProductID and p.CategoryID = ca.CategoryID; 
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getListCategories` ()  BEGIN
	select * from fo_category;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getListOrder` (IN `currentPage` INT, IN `limitt` INT, IN `type` VARCHAR(10))  BEGIN
    if(type = 'ALL')
    THEN
    	select * from fo_order o
     	ORDER by o.CreatedAt DESC
        LIMIT currentPage,limitt;
    ELSE
    	SELECT * from fo_order o
        WHERE CASE type
            WHEN 'Date' THEN DATE(CreatedAt) = DATE(NOW())
            WHEN 'Month' THEN MONTH(o.CreatedAt) = MONTH(NOW())
            WHEN 'Year' THEN YEAR(o.createdAt) = YEAR(NOW())
            END
        ORDER by o.createdAt DESC
        LIMIT currentPage,limitt;
    END IF;	
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getListProduct` (IN `currentPage` INT, IN `limitProduct` INT, IN `categoryID` INT)  BEGIN
	if(categoryID = -1)
    then 
    	SELECT  p.*,ca_name,(SELECT  AVG(Stars) from fo_review r WHERE r.ProductID = p.ProductID) as 'Star' FROM fo_product p ,fo_category c
 		WHERE p.CategoryID = c.CategoryID
        ORDER BY p.create_At DESC
        LIMIT currentPage,limitProduct;
    else
    	SELECT  p.*,ca_name,(SELECT  AVG(Stars) from fo_review r WHERE r.ProductID = p.ProductID) as 'Star'  FROM fo_product p ,fo_category c
 		WHERE p.CategoryID = c.CategoryID and p.CategoryID = categoryID
        ORDER BY p.create_At DESC
        LIMIT currentPage,limitProduct;
    end if;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getListProductByDisplay` (IN `display` INT)  BEGIN
	SELECT p.*,c.ca_name,(select avg(r.Stars) from fo_product p, fo_review r WHERE p.ProductID = r.ProductID) as Star from fo_product p, fo_category c
    where p.CategoryID = c.CategoryID and p.dis_play = display;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getListProductWithCategories` (IN `categoryID` INT, IN `currentPage` INT, IN `limitP` INT)  BEGIN
	SELECT * from fo_product
    WHERE fo_product.CategoryID = categoryID
    LIMIT currentPage,limitP;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getListUser` (IN `role` INT, IN `currentPage` INT, IN `limitUser` INT)  begin
	IF role >= 0
		THEN
		select * from fo_user
		where fo_user.Role = role
        LIMIT currentPage,limitUser;
     ELSE
		select * from fo_user
         LIMIT currentPage,limitUser;
    End if;
end$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getRelatedProduct` (IN `categoryID` INT)  BEGIN
	SELECT * from fo_product WHERE fo_product.CategoryID = categoryID
    LIMIT 0,4;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getReviewByProduct` (IN `productid` INT)  BEGIN
	SELECT r.*,u.name,u.image,u.UserId FROM fo_review r,fo_user u
    WHERE r.userID = u.UserID and r.ProductID = productid; 
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getRole` (IN `id` INT, OUT `result` INT)  BEGIN
	select role into result from fo_user WHERE UserId = id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getTotalAndAvgStarReview` (IN `productid` INT, OUT `totalReview` INT, OUT `avgStar` FLOAT)  BEGIN
    SELECT count(*) INTO totalReview FROM fo_review r WHERE r.ProductID = productid;
	SELECT AVG(Stars) INTO avgStar FROM fo_review r WHERE r.ProductID = productid;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getTotalRowUser` (IN `roleUser` INT, OUT `result` INT)  BEGIN
	IF roleUser >= 0
		THEN
		select count(*) into result from fo_user
		where fo_user.Role = roleUser;
       	ELSE
		select count(*) into result from fo_user;
     
    End if;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getUserSocical` (IN `userID` VARCHAR(200))  BEGIN
	Select * from fo_user
    where IdSocical = UserId;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `insertReview` (IN `userid` INT, IN `productid` INT, IN `content` TEXT, IN `star` INT)  BEGIN
	INSERT INTO fo_review(userID,ProductID,Content,Stars) VALUES(userid,productid,content,star);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `insertUserBySocical` (IN `userID` VARCHAR(200), IN `email` VARCHAR(200), IN `fullName` VARCHAR(200), IN `image` VARCHAR(200))  BEGIN
	INSERT INTO fo_user(IdSocical,Email,Name,Image,Role) VALUES(userId,email,fullName,image,1);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `INSERT_CATEGORY` (IN `name` VARCHAR(100), IN `image` VARCHAR(200))  begin
	INSERT INTO FO_Category(Ca_Name,image) values(name,image);
end$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `searchProductByKeyword` (IN `keyword` TEXT)  BEGIN
	SELECT p.*,(SELECT AVG(Stars) from fo_review r WHERE r.ProductID = p.ProductID) as Star from fo_product p
    WHERE p.Name LIKE CONCAT('%',keyword,'%')
    LIMIT 0,12;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sortListProduct` (IN `currentPage` INT, IN `limitProduct` INT, IN `categoryID` INT, IN `typeSort` INT, IN `nameSort` VARCHAR(20))  BEGIN
	if(categoryID = -1)
    then 
    	SELECT  p.*,ca_name,(SELECT  AVG(Stars) from fo_review r WHERE r.ProductID = p.ProductID) as 'Star'  		FROM fo_product p ,fo_category c
 		WHERE p.CategoryID = c.CategoryID
        ORDER BY 
        CASE  WHEN nameSort = 'Price' and typeSort = 0 THEN p.Price END ASC,
        CASE  WHEN nameSort = 'Star' and typeSort = 0 THEN Star END ASC,
        CASE  WHEN nameSort = 'Price' and typeSort = 1 THEN p.Price END DESC,
        CASE  WHEN nameSort = 'Star' and typeSort = 1 THEN Star END DESC
        LIMIT currentPage,limitProduct;
    else
    	SELECT  p.*,ca_name,(SELECT  AVG(Stars) from fo_review r WHERE r.ProductID = p.ProductID) as 'Star'  		FROM fo_product p ,fo_category c
 		WHERE p.CategoryID = c.CategoryID and p.CategoryID = categoryID
        ORDER BY 
        CASE  WHEN nameSort = 'Price' and typeSort = 0 THEN p.Price END ASC,
        CASE  WHEN nameSort = 'Star' and typeSort = 0 THEN Star END ASC,
        CASE  WHEN nameSort = 'Price' and typeSort = 1 THEN p.Price END DESC,
        CASE  WHEN nameSort = 'Star' and typeSort = 1 THEN Star END DESC
        LIMIT currentPage,limitProduct;
    end if;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `totalOrder` (IN `type` VARCHAR(10), OUT `total` INT)  BEGIN
    if(type = 'ALL')
    THEN
    	select count(*) into total  from fo_order o;
    ELSE
    	SELECT count(*) into total from fo_order o
        WHERE CASE type
            WHEN 'Date' THEN DATE(CreatedAt) = DATE(NOW())
            WHEN 'Month' THEN MONTH(o.CreatedAt) = MONTH(NOW())
            WHEN 'Year' THEN YEAR(o.createdAt) = YEAR(NOW())
            END;
    END IF;	
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `updateUser` (IN `id` INT, IN `name` VARCHAR(100), IN `age` INT, IN `phone` INT, IN `role` INT, IN `image` VARCHAR(200), IN `address` VARCHAR(100))  BEGIN
	UPDATE fo_user
    SET Name = name, Age = age, Role = role, Image = image, Address = address,Phone = phone
    WHERE UserId = id;
END$$

--
-- Các hàm
--
CREATE DEFINER=`root`@`localhost` FUNCTION `totalCart` (`userID` INT) RETURNS INT(11) BEGIN
	DECLARE total int;
    SELECT COUNT(*) INTO total from fo_cartdetail WHERE fo_cartdetail.UserId = userID;
    RETURN total;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fo_cartdetail`
--

CREATE TABLE `fo_cartdetail` (
  `CartDeID` int(11) NOT NULL,
  `UserId` int(11) DEFAULT NULL,
  `ProductID` int(11) DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_vietnamese_ci;

--
-- Đang đổ dữ liệu cho bảng `fo_cartdetail`
--

INSERT INTO `fo_cartdetail` (`CartDeID`, `UserId`, `ProductID`, `Quantity`) VALUES
(26, 19, 115, 2),
(27, 19, 118, 3),
(42, 17, 135, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fo_category`
--

CREATE TABLE `fo_category` (
  `CategoryID` int(11) NOT NULL,
  `ca_name` varchar(200) COLLATE utf8_vietnamese_ci DEFAULT NULL,
  `image` varchar(200) COLLATE utf8_vietnamese_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_vietnamese_ci;

--
-- Đang đổ dữ liệu cho bảng `fo_category`
--

INSERT INTO `fo_category` (`CategoryID`, `ca_name`, `image`) VALUES
(1, 'Tất cả', 'https://res.cloudinary.com/phuctran/image/upload/v1634367345/yigb0t9ooerl90eigth3.png'),
(2, 'Hamburger', 'https://res.cloudinary.com/phuctran/image/upload/v1634367026/xfo1tp1jhxgyeciooqbh.jpg'),
(3, 'Trà sữa', 'https://res.cloudinary.com/phuctran/image/upload/v1634367259/fulnywoxagtf3tgxn18p.jpg'),
(4, 'Sanwiches', 'https://res.cloudinary.com/phuctran/image/upload/v1634367276/fidj6ecrvpgmtxptxr1b.jpg'),
(5, 'Bánh mì', 'https://res.cloudinary.com/phuctran/image/upload/v1634367289/huxdge1ey1pyo1wxzpbm.jpg'),
(6, 'Pizza', 'https://res.cloudinary.com/phuctran/image/upload/v1634367300/nyasenjg9lvyyj6n2eon.jpg');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fo_notification`
--

CREATE TABLE `fo_notification` (
  `idNofi` int(11) NOT NULL,
  `content` varchar(500) COLLATE utf8_vietnamese_ci DEFAULT NULL,
  `createdAt` datetime DEFAULT curtime(),
  `productID` int(11) DEFAULT NULL,
  `userID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_vietnamese_ci;

--
-- Đang đổ dữ liệu cho bảng `fo_notification`
--

INSERT INTO `fo_notification` (`idNofi`, `content`, `createdAt`, `productID`, `userID`) VALUES
(3, 'Thêm', '2021-11-04 19:15:48', 126, 17),
(4, 'Thêm', '2021-11-04 19:52:15', 128, 17),
(5, 'Thêm', '2021-11-04 19:53:59', 129, 17),
(6, 'Thêm', '2021-11-04 19:55:45', 130, 17),
(7, 'Thêm', '2021-11-04 19:57:16', 131, 17),
(8, 'Thêm', '2021-11-05 18:45:08', 132, 17),
(9, 'Thêm', '2021-11-05 18:47:16', 133, 17),
(10, 'Thêm', '2021-11-05 19:01:58', 134, 17),
(11, 'Thêm', '2021-11-05 19:28:39', 135, 17),
(12, 'Thêm', '2021-11-05 19:29:48', 136, 17),
(13, 'Thêm', '2021-11-05 19:30:43', 137, 17),
(14, 'Thêm', '2021-11-05 19:32:43', 138, 17);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fo_order`
--

CREATE TABLE `fo_order` (
  `OrderID` int(11) NOT NULL,
  `UserId` int(11) DEFAULT NULL,
  `Status` int(11) DEFAULT NULL,
  `CreatedAt` datetime DEFAULT current_timestamp(),
  `Note` varchar(200) COLLATE utf8_vietnamese_ci DEFAULT NULL,
  `name` varchar(100) COLLATE utf8_vietnamese_ci NOT NULL,
  `phone` int(11) NOT NULL,
  `address` varchar(300) COLLATE utf8_vietnamese_ci NOT NULL,
  `totalMoney` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_vietnamese_ci;

--
-- Đang đổ dữ liệu cho bảng `fo_order`
--

INSERT INTO `fo_order` (`OrderID`, `UserId`, `Status`, `CreatedAt`, `Note`, `name`, `phone`, `address`, `totalMoney`) VALUES
(16, 17, 1, '2021-11-04 16:47:42', 'giao lẹ bro ơi', 'Trần Hoàng Phúc', 896728429, 'Viet Nam', 560000),
(17, 17, 2, '2021-11-05 16:06:45', '', 'Trần Hoàng Phúc', 896728429, 'Viet Nam', 96000),
(18, 17, 0, '2021-09-05 16:07:31', '', 'Trần Hoàng Phúc', 896728429, 'Viet Nam', 89000),
(19, 17, 1, '2021-04-05 16:07:33', '', 'Trần Hoàng Phúc', 896728429, 'Viet Nam', 89000),
(20, 17, 2, '2021-11-05 16:14:42', '', 'Trần Hoàng Phúc', 896728429, 'Viet Nam', 25000),
(21, 18, 0, '2021-11-08 16:03:52', 'giao lẹ', 'Nguyễn  A', 123456789, 'phường 17, quận bình thạnh, hcm', 45000),
(22, 18, 0, '2021-11-08 16:54:40', 'aa', 'Nguyễn B', 896728429, 'sa đéc, đồng tháp', 165700),
(23, 17, 0, '2021-11-08 19:11:03', '', 'Trần Hoàng Phúc', 896728429, 'Viet Nam', 78500);

--
-- Bẫy `fo_order`
--
DELIMITER $$
CREATE TRIGGER `alter_delete_cart` AFTER INSERT ON `fo_order` FOR EACH ROW BEGIN
	DELETE FROM fo_cartdetail WHERE UserId = NEW.UserId;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `before_delete_orderdetail` BEFORE DELETE ON `fo_order` FOR EACH ROW BEGIN
	DELETE FROM fo_orderdetail WHERE OrderID = OLD.OrderID;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fo_orderdetail`
--

CREATE TABLE `fo_orderdetail` (
  `OrderDeID` int(11) NOT NULL,
  `OrderID` int(11) DEFAULT NULL,
  `ProductID` int(11) DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `Total` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_vietnamese_ci;

--
-- Đang đổ dữ liệu cho bảng `fo_orderdetail`
--

INSERT INTO `fo_orderdetail` (`OrderDeID`, `OrderID`, `ProductID`, `Quantity`, `Total`) VALUES
(13, 16, 116, 2, 94000),
(14, 16, 115, 2, 94000),
(15, 16, 117, 3, 207000),
(16, 16, 119, 1, 25000),
(17, 16, 118, 2, 80000),
(18, 16, 114, 1, 60000),
(19, 17, 129, 2, 46000),
(20, 17, 126, 1, 30000),
(21, 17, 130, 1, 20000),
(22, 18, 118, 1, 40000),
(23, 18, 113, 1, 49000),
(24, 19, 118, 1, 40000),
(25, 19, 113, 1, 49000),
(26, 20, 119, 1, 25000),
(27, 21, 136, 1, 45000),
(28, 22, 135, 1, 70000),
(29, 22, 132, 1, 15000),
(30, 22, 117, 1, 69000),
(31, 22, 126, 1, 30000),
(32, 23, 132, 1, 15000),
(33, 23, 137, 1, 65000);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fo_product`
--

CREATE TABLE `fo_product` (
  `ProductID` int(11) NOT NULL,
  `Name` varchar(200) COLLATE utf8_vietnamese_ci DEFAULT NULL,
  `Price` float DEFAULT NULL,
  `Description` text COLLATE utf8_vietnamese_ci DEFAULT NULL,
  `Image` varchar(200) COLLATE utf8_vietnamese_ci DEFAULT NULL,
  `CategoryID` int(11) DEFAULT NULL,
  `discount` float NOT NULL,
  `create_At` datetime NOT NULL DEFAULT current_timestamp(),
  `dis_play` int(11) NOT NULL DEFAULT 0,
  `UserId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_vietnamese_ci;

--
-- Đang đổ dữ liệu cho bảng `fo_product`
--

INSERT INTO `fo_product` (`ProductID`, `Name`, `Price`, `Description`, `Image`, `CategoryID`, `discount`, `create_At`, `dis_play`, `UserId`) VALUES
(113, 'Burger siêu nhân phô mai', 49000, 'Khác với các loại hamburger khác loại này có nhân bằng phô mai dành cho 			những bạn đã ngán thịt và muốn ăn gì đó thật béo ^^!', 'https://res.cloudinary.com/phuctran/image/upload/v1634268015/ovlq9nluyysrkvdgkgyb.jpg', 2, 0.1, '2021-10-15 11:06:03', 2, 17),
(114, 'Hamburger Trứng, Thịt Bò & Xúc Xích', 60000, 'Bạn là tín đồ của thịt bò ? Bạn muốn biến tấu những miếng thịt bò thành một món ăn khác? Đừng lo, hãy đến với Food Order, bạn sẽ được thưởng thức những suất hamburger bò đặc biệt tại cửa hàng này.', 'https://res.cloudinary.com/phuctran/image/upload/v1634268979/j4u4n4payhzbjbpjmect.jpg', 2, 0.2, '2021-10-15 11:06:45', 0, 17),
(115, 'Burger bò nướng khoai tây lát', 47000, 'Burger 2 miếng bò nướng phô mai thịt xông khói whopper.', 'https://res.cloudinary.com/phuctran/image/upload/v1634268482/ls4h0k9xudj0wkxos0ij.jpg', 2, 0.2, '2021-10-15 11:06:46', 0, 17),
(116, 'Burger bò nướng hành chiên', 47000, 'Một bữa ăn đầy đủ chất dinh dưỡng cho bạn sức khỏe tốt, sự dẻo dai, và thân hình đúng chuẩn. Trong xã hội hiện đại, mọi thứ được tối giản đáng kể, và các món ăn cũng vậy. Bạn không phải mất công chuẩn bị nhiều món để tương xứng với số lượng dưỡng chất nạp vào cơ thể, mà nay trong một chiếc burger cũng giúp bạn thực hiện dễ dàng điều này.', 'https://res.cloudinary.com/phuctran/image/upload/v1634268747/hs4byxyowgluqyikrcsk.jpg', 2, 0.2, '2021-10-15 11:06:46', 0, 17),
(117, 'Burger gà giòn cay', 69000, 'Khác với loại burger truyền thống, burger gà giòn cay sẽ đem lại cho bạn 1 món ăn với gà và mùi cay nồng đối với tín đồ ăn cay', 'https://res.cloudinary.com/phuctran/image/upload/v1634269250/lpelmuc0qsitveb18man.jpg', 2, 0.2, '2021-10-15 11:06:46', 1, 17),
(118, 'Trà sữa Thái', 40000, 'Là sự kết hợp giữa trà, sữa và các loại thảo mộc như quế, đinh hương,..để tạo ra thức uống thơm ngon và bổ dưỡng.', 'https://res.cloudinary.com/phuctran/image/upload/v1634269976/dmro0mrj1j23fcw1ypid.png', 3, 0.2, '2021-10-15 11:06:46', 2, 17),
(119, 'Sữa tươi trân châu đường đen', 25000, 'Khác với trà sữa, sữa tươi trân châu đường đen vừa mới xuất hiện đã được sự chào đón nồng nhiệt. Vị trà không đậm chủ yếu là mùi hương của sữa kết hợp cùng vị ngọt của trân châu đường đen làm người ta khó cưỡng lại sức hút.\r\n', 'https://res.cloudinary.com/phuctran/image/upload/v1634270187/qe6v1b3mzvjxuj904bnn.jpg', 3, 0.2, '2021-10-15 11:06:46', 0, 17),
(126, 'Bánh mì chảo', 30000, 'Bánh mì chảo là món bánh mì rất đặc biệt vì nhân bánh được cho hết vào chảo nào là pate, trứng, xúc xích, chả cá, phô mai,... biết bao nhiêu là nhân kể hoài cũng không hết. Mỗi nơi bán lại có một cách biến tấu nhân bánh mì khác nhau nên ăn hoài không ngán luôn nha!', 'https://res.cloudinary.com/phuctran/image/upload/v1636028131/hdoq2d24ynkegtbnlv3c.jpg', 5, 0.1, '2021-11-04 19:15:48', 0, 17),
(128, 'Bánh mì bột lọc', 35000, 'Có thể bạn mới nghe lần đầu nhưng không nghe lầm đâu, đây là món bánh mì quen thuộc của miền Trung yêu thương mang đến hương vị rất lạ miệng. Bánh mì với nhân là bánh bột lọc bên ngoài là bánh mì giòn bên trong lại là bánh bột lọc dai dai. Ôi! Đích thị là một món ăn phải thử 1 lần trong đời.', 'https://res.cloudinary.com/phuctran/image/upload/v1636030317/ltndccsau8h3kiexbra6.jpg', 5, 0.2, '2021-11-04 19:52:15', 2, 17),
(129, 'Bánh mì chả cá hấp, chiên', 23000, 'Bánh mì nhân chả cá chiên, ai không ăn dầu mỡ thì có ngay chả cá hấp luôn nha! Bánh mì ăn cùng với dưa chua, thơm mùi chả cá, dưa giòn lại chua ngọt. Nghe thôi là đã chảy nước miếng rồi!', 'https://res.cloudinary.com/phuctran/image/upload/v1636030421/qsis1a1rrcfgvygq9ap6.jpg', 5, 0.1, '2021-11-04 19:53:59', 0, 17),
(130, 'Bánh mì gà xé', 20000, 'Nếu bạn muốn một nhân bánh mì mới? Tìm đâu xa, có ngay bánh mì gà xé thơm ngon. Vẫn là rau mùi và dưa chua nhưng ăn với gà xé thì thật ngon ăn một lần là nhớ mãi.', 'https://res.cloudinary.com/phuctran/image/upload/v1636030528/nrrioskp507xqa7ge0dy.jpg', 5, 0.1, '2021-11-04 19:55:45', 0, 17),
(131, 'Bánh mì phá lấu', 25000, 'Đối với nhiều du khách nước ngoài thì việc ăn lòng động vật không quen thuộc nhưng đối với những du khách sành ăn ở Sài Gòn thì sẽ bị gây nghiện với món bánh mì phá lấu lòng heo dai giòn của bao tử, béo béo của lá mía cùng nhiều bộ phận khác lạ miệng mà ngon vô cùng.', 'https://res.cloudinary.com/phuctran/image/upload/v1636030619/tcxdvuyluxr8buknvkjj.jpg', 5, 0, '2021-11-04 19:57:16', 2, 17),
(132, 'Hồng trà sữa', 15000, 'Hồng trà sữa có vị đậm đà, vị trà thanh ngọt, một trong số những loại đang được ưa chuộng là hồng trà sữa trân châu và hồng trà sữa phô mai. Ngoài ra, cũng có thêm hương mint, socola, matcha, khoai môn... hoặc các hương trái cây như dâu, nho, cam, táo, kiwi,.. Để tăng thêm hương vị cho thức uống.', 'https://res.cloudinary.com/phuctran/image/upload/v1636112686/m75vbs0kdb7u77jneekv.png', 3, 0.1, '2021-11-05 18:45:08', 1, 17),
(133, 'Trà sữa Olong', 50000, 'Trà sữa oolong mang một hương vị đặc trưng của mật ong và mùi hương của gỗ. Đây là một trong những thức uống được ưa chuộng khá nhiều trong menu quán trà sữa.', 'https://res.cloudinary.com/phuctran/image/upload/v1636112814/sjlgwkxmll5easpfq5dw.png', 3, 0, '2021-11-05 18:47:16', 0, 17),
(134, 'Lục trà sữa', 22000, 'Lục trà sữa có hương vị của sữa và vị béo nhiều hơn, và có màu nhạt hơn hồng trà sữa. Tuy nhiên, bạn vẫn có thể cảm nhận được vị chát của trà. Lục trà sữa mật ong là từ khóa được tìm kiếm nhiều nhất trong thời gian gần đây. Và giống như hồng trà thì lục trà sữa cũng có thể thêm được những hương vị khác nhau để thay đổi khẩu vị cho thức uống này.', 'https://res.cloudinary.com/phuctran/image/upload/v1636113696/mznwoi3edydcvvxjbaai.png', 3, 0.3, '2021-11-05 19:01:58', 0, 17),
(135, 'Sandwich cá ngừ', 70000, 'Cá ngừ là loài thực phẩm giàu protein, vitamin và các khoáng chất tốt cho sức khỏe. Thế nên hãy cùng Điện máy XANH vào bếp ngay với món sandwich cá ngừ - tuna sandwich thơm bổ cho bữa sáng tốt lành.\n\nVới món bánh mì này bạn có thể kết hợp thêm cùng với phô mai hay bơ nghiền để tăng thêm độ hấp dẫn nhé!\n\nChiếc sandwich được trang trí với vẻ ngoài bắt mắt, ăn vào bạn sẽ cảm nhận được vị dai mềm của bánh mì hòa quyện cùng cá ngừ béo ngon, ngọt thịt, thấm đều gia vị ngon miệng vô cùng.', 'https://res.cloudinary.com/phuctran/image/upload/v1636115297/yeh5eudidaiedkeoxtki.jpg', 4, 0, '2021-11-05 19:28:39', 1, 17),
(136, 'Sandwich gà', 45000, 'Dù là kết hợp cùng ớt chuông, dưa leo hay đơn giản chỉ đem đi chiên xù thì món sandwich gà - chicken sandwich đều sẽ là món ngon khiến bạn khó cưỡng lại được đấy!\n\nLát bánh mì bên ngoài được áo đều lớp sốt mayonaise béo ngậy, thơm phức. Bên trong là phần nhân thịt gà dai mềm, ngọt nước mà không bị khô, đậm đà gia vị, ăn kèm với 1 ít tương ớt hay tương cà nữa thì hấp dẫn còn gì bằng.', 'https://res.cloudinary.com/phuctran/image/upload/v1636115366/dlfqhtyqmitivsons2fz.jpg', 4, 0, '2021-11-05 19:29:48', 0, 17),
(137, 'Sandwich phô mai', 65000, 'Sự kết hợp hoàn hảo của lát bánh mì sand wich dai mềm, thơm phức cùng miếng phô mai béo ngậy, đậm đà bổ dưỡng chắc chắn sẽ giúp bạn tràn đầy năng lượng để khởi đầu ngày mới.\n\nNgoài sử dụng cách nướng truyền thống, để bữa sáng thêm phần độc đáo, mới lạ hơn, bạn có thể dùng thêm cùng với mì cay, cà chua nướng, nhân khoai lang,... đều là sự kết hợp tuyệt vời đấy!', 'https://res.cloudinary.com/phuctran/image/upload/v1636115421/sb6y26zruzlnqmcscvi1.jpg', 4, 0, '2021-11-05 19:30:43', 0, 17),
(138, 'Sandwich kẹp kem', 32000, 'Yêu ngay từ cái nhìn đầu tiên với vẻ ngoài siêu đẹp mắt, siêu đáng yêu đến từ chiếc bánh sandwich kẹp kem màu sắc độc đáo.\n\nLớp vỏ bánh mềm mịn, bên trong là phần nhân kem tươi mát lạnh, béo ngậy kết hợp cùng vị chua chua ngọt ngọt của dâu tây mọng nước, dùng bánh làm bữa sáng hay ăn nhẹ giữa giờ đều rất hấp dẫn.\n\nBạn có thể thay thế nhân bằng các loại trái cây khác như kiwi, nho, táo, dưa hấu,... tùy theo sở thích để có được món bánh thơm ngon cho mình nhé!', 'https://res.cloudinary.com/phuctran/image/upload/v1636115541/pm3i8wnxq7m3pdktbkj8.jpg', 4, 0, '2021-11-05 19:32:43', 0, 17);

--
-- Bẫy `fo_product`
--
DELIMITER $$
CREATE TRIGGER `create_notification` AFTER INSERT ON `fo_product` FOR EACH ROW BEGIN

 	INSERT INTO fo_notification(content,productID,userID) VALUES('Thêm',NEW.productID,NEW.userID);

END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fo_review`
--

CREATE TABLE `fo_review` (
  `RvID` int(11) NOT NULL,
  `Content` text COLLATE utf8_vietnamese_ci DEFAULT NULL,
  `CreatedAt` datetime DEFAULT current_timestamp(),
  `Stars` int(11) DEFAULT NULL,
  `ProductID` int(11) DEFAULT NULL,
  `userID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_vietnamese_ci;

--
-- Đang đổ dữ liệu cho bảng `fo_review`
--

INSERT INTO `fo_review` (`RvID`, `Content`, `CreatedAt`, `Stars`, `ProductID`, `userID`) VALUES
(3, 'asd', '2021-10-19 15:16:38', 5, 115, 17),
(4, 'test', '2021-10-19 15:17:13', 5, 115, 17),
(10, 'test', '2021-10-19 16:57:31', 5, 117, 18),
(32, 'hehe', '2021-10-20 15:19:31', 5, 119, 17),
(33, 'kaka', '2021-10-20 15:19:36', 5, 119, 17),
(34, 'asd', '2021-10-20 15:19:42', 4, 119, 17),
(35, 'kém', '2021-10-20 15:35:41', 1, 115, 17),
(36, 'món ăn ngon', '2021-10-21 15:32:36', 5, 118, 18),
(39, 'test', '2021-10-21 15:52:47', 5, 116, 15),
(40, 'test 2', '2021-10-21 15:53:10', 4, 117, 15),
(41, 'hảo', '2021-11-05 17:06:06', 5, 126, 17),
(42, 'a', '2021-11-05 17:07:08', 5, 126, 17);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `fo_user`
--

CREATE TABLE `fo_user` (
  `UserId` int(11) NOT NULL,
  `UserPassword` varchar(100) COLLATE utf8_vietnamese_ci DEFAULT NULL,
  `Name` varchar(100) COLLATE utf8_vietnamese_ci DEFAULT NULL,
  `Age` int(11) DEFAULT NULL,
  `Phone` varchar(11) COLLATE utf8_vietnamese_ci DEFAULT NULL,
  `Address` varchar(200) COLLATE utf8_vietnamese_ci DEFAULT NULL,
  `Role` int(11) DEFAULT NULL,
  `CreatedAt` datetime DEFAULT current_timestamp(),
  `Image` text COLLATE utf8_vietnamese_ci NOT NULL DEFAULT 'https://www.kindpng.com/picc/m/22-223863_no-avatar-png-circle-transparent-png.png',
  `IdSocical` varchar(100) COLLATE utf8_vietnamese_ci DEFAULT NULL,
  `Email` varchar(200) COLLATE utf8_vietnamese_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_vietnamese_ci;

--
-- Đang đổ dữ liệu cho bảng `fo_user`
--

INSERT INTO `fo_user` (`UserId`, `UserPassword`, `Name`, `Age`, `Phone`, `Address`, `Role`, `CreatedAt`, `Image`, `IdSocical`, `Email`) VALUES
(15, NULL, 'Hoàng Phúc', 21, '896728429', 'Sa đéc, Đồng Tháp', 0, '2021-10-11 15:26:26', 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=1489554284736814&height=50&width=50&ext=1636532786&hash=AeSjS7ijacuG_V8u3og', '1489554284736814', 'hp.sliver123@gmail.com'),
(16, 'phucdeptrai', 'test', 1999, '123456789', '1', 1, '2021-10-11 15:54:51', 'https://docsach24.net/no-avatar.png', '', 'asd@gmail.com'),
(17, 'e10adc3949ba59abbe56e057f20f883e', 'Phúc', 2001, '123456789', 'Đồng tháp, Sa đéc', 0, '2021-10-12 16:00:08', 'https://res.cloudinary.com/phuctran/image/upload/v1636359971/ljwnzpzhpqcqcgyaqert.jpg', NULL, 'hoangphuc@tlus.edu.vn'),
(18, NULL, 'Trần Hoàng Phúc', 2000, '896728429', 'Viet Nam', 1, '2021-10-19 16:43:28', 'https://res.cloudinary.com/phuctran/image/upload/v1636360216/wrugsue409zhyno3tobl.jpg', '113789031169021130526', 'hp.sliver123@gmail.com'),
(19, NULL, 'Phuc Tran Hoang', NULL, NULL, NULL, 1, '2021-10-20 14:51:11', 'https://lh3.googleusercontent.com/a/AATXAJwjtJ6q3Tqj896PucDIC7lXPwu57gMxm910eG0e=s96-c', '115351953355258986343', 'hoangphuc@tlus.edu.vn');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `fo_cartdetail`
--
ALTER TABLE `fo_cartdetail`
  ADD PRIMARY KEY (`CartDeID`),
  ADD KEY `ProductID` (`ProductID`),
  ADD KEY `UserId` (`UserId`);

--
-- Chỉ mục cho bảng `fo_category`
--
ALTER TABLE `fo_category`
  ADD PRIMARY KEY (`CategoryID`);

--
-- Chỉ mục cho bảng `fo_notification`
--
ALTER TABLE `fo_notification`
  ADD PRIMARY KEY (`idNofi`),
  ADD KEY `productID` (`productID`),
  ADD KEY `userID` (`userID`);

--
-- Chỉ mục cho bảng `fo_order`
--
ALTER TABLE `fo_order`
  ADD PRIMARY KEY (`OrderID`),
  ADD KEY `UserId` (`UserId`);

--
-- Chỉ mục cho bảng `fo_orderdetail`
--
ALTER TABLE `fo_orderdetail`
  ADD PRIMARY KEY (`OrderDeID`),
  ADD KEY `ProductID` (`ProductID`),
  ADD KEY `fo_orderdetail_ibfk_3` (`OrderID`);

--
-- Chỉ mục cho bảng `fo_product`
--
ALTER TABLE `fo_product`
  ADD PRIMARY KEY (`ProductID`),
  ADD KEY `CategoryID` (`CategoryID`);

--
-- Chỉ mục cho bảng `fo_review`
--
ALTER TABLE `fo_review`
  ADD PRIMARY KEY (`RvID`),
  ADD KEY `ProductID` (`ProductID`),
  ADD KEY `fo_review_ibpk_1` (`userID`);

--
-- Chỉ mục cho bảng `fo_user`
--
ALTER TABLE `fo_user`
  ADD PRIMARY KEY (`UserId`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `fo_cartdetail`
--
ALTER TABLE `fo_cartdetail`
  MODIFY `CartDeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT cho bảng `fo_category`
--
ALTER TABLE `fo_category`
  MODIFY `CategoryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT cho bảng `fo_notification`
--
ALTER TABLE `fo_notification`
  MODIFY `idNofi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT cho bảng `fo_order`
--
ALTER TABLE `fo_order`
  MODIFY `OrderID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT cho bảng `fo_orderdetail`
--
ALTER TABLE `fo_orderdetail`
  MODIFY `OrderDeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT cho bảng `fo_product`
--
ALTER TABLE `fo_product`
  MODIFY `ProductID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=139;

--
-- AUTO_INCREMENT cho bảng `fo_review`
--
ALTER TABLE `fo_review`
  MODIFY `RvID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT cho bảng `fo_user`
--
ALTER TABLE `fo_user`
  MODIFY `UserId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `fo_cartdetail`
--
ALTER TABLE `fo_cartdetail`
  ADD CONSTRAINT `fo_cartdetail_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `fo_product` (`ProductID`),
  ADD CONSTRAINT `fo_cartdetail_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `fo_user` (`UserId`);

--
-- Các ràng buộc cho bảng `fo_order`
--
ALTER TABLE `fo_order`
  ADD CONSTRAINT `fo_order_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `fo_user` (`UserId`);

--
-- Các ràng buộc cho bảng `fo_orderdetail`
--
ALTER TABLE `fo_orderdetail`
  ADD CONSTRAINT `fo_orderdetail_ibfk_2` FOREIGN KEY (`ProductID`) REFERENCES `fo_product` (`ProductID`),
  ADD CONSTRAINT `fo_orderdetail_ibfk_3` FOREIGN KEY (`OrderID`) REFERENCES `fo_order` (`OrderID`);

--
-- Các ràng buộc cho bảng `fo_product`
--
ALTER TABLE `fo_product`
  ADD CONSTRAINT `fo_product_ibfk_1` FOREIGN KEY (`CategoryID`) REFERENCES `fo_category` (`CategoryID`);

--
-- Các ràng buộc cho bảng `fo_review`
--
ALTER TABLE `fo_review`
  ADD CONSTRAINT `fo_review_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `fo_product` (`ProductID`),
  ADD CONSTRAINT `fo_review_ibpk_1` FOREIGN KEY (`userID`) REFERENCES `fo_user` (`UserId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
