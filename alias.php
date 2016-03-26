<html>
<head>
    <title>Alias Management | Lottery Hedge Fund</title>
    <?php include_once "lib.php"; ?>
    <link rel="stylesheet" type="text/css" href="css/index.css"/>
    <script type="text/javascript" src="js/alias.js"></script>
</head>
<body>
<?php include_once "header.php"; ?>
<div class="container">
    <?php echo curl($PROTOCOL . $DOMAIN . "/lottery/breadcrumb.php?active=alias"); ?>
    <div class="row">
        <div class="col-md-12">
            <table id="alias-list" class="table table-hover table-condensed">
                <thead>
                <tr>
                    <th></th>
                    <th>Match Time</th>
                    <th><img src="img/logo-500.png"/> Home</th>
                    <th><img src="img/logo-macau.jpg"/> Home</th>
                    <th><img src="img/logo-500.png"/> Away</th>
                    <th><img src="img/logo-macau.jpg"/> Away</th>
                    <th>Operations</th>
                </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </div>
</div>
</body>
</html>
