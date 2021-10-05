<?php
    require 'vendor/autoload.php';
    use Cloudinary\Configuration\Configuration;
    use Cloudinary\Api\Upload\UploadApi;
    Configuration::instance([
        'cloud' => [
          'cloud_name' => 'phuctran', 
          'api_key' => '112161527594347', 
          'api_secret' => 'OE4ic2hMC6wd9JIhee5ExK-NGWk'],
        'url' => [
          'secure' => true]]);
    $upload =  (new UploadApi());
?>