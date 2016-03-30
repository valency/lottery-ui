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
                    <th rowspan="2">*</th>
                    <th rowspan="2" class="text-center">Match Time</th>
                    <th colspan="4" class="text-center">Home</th>
                    <th colspan="4" class="text-center">Away</th>
                    <th rowspan="2" class="text-center">Operations</th>
                </tr>
                <tr>
                    <th class="text-center"><img src="img/flags/China.png"/></th>
                    <th class="text-center"><img src="img/flags/Taiwan.png"/></th>
                    <th class="text-center"><img src="img/flags/United-States-of-America.png"/></th>
                    <th class="text-center"><img src="img/flags/United-Kingdom.png"/></th>
                    <th class="text-center"><img src="img/flags/China.png"/></th>
                    <th class="text-center"><img src="img/flags/Taiwan.png"/></th>
                    <th class="text-center"><img src="img/flags/United-States-of-America.png"/></th>
                    <th class="text-center"><img src="img/flags/United-Kingdom.png"/></th>
                </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </div>
</div>
</body>
</html>
