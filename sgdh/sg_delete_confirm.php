<?php
    include 'sg_header.php';
    include 'sg_common.php';
?>
<?php
    $param = get_browser_param('param', '');
?>
<div class="no"><a href="#" onClick="javascript :history.back(-1);">否</a></div>  <div class="yes"><a href=<?php echo '"'.$param.'"'?>>是</a></div>

<?php
    include 'sg_footer.php';
?>