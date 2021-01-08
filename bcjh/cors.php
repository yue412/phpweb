<?php
    include_once "../common.php";
    $url = get_browser_param('url', '');
?>
<?php
echo file_get_contents($url);
?>