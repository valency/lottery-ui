<html>
<head>
    <title>Lottery Hedge Fund</title>
    <?php include_once "lib.php"; ?>
    <link rel="stylesheet" type="text/css" href="css/index.css"/>
    <script type="text/javascript" src="js/index.js"></script>
</head>
<body>
<?php include_once "header.php"; ?>
<div class="container">
    <div class="row">
        <div class="col-md-12">
            <table id="match-list" class="table table-hover table-condensed">
                <thead>
                <tr>
                    <th>Match Time</th>
                    <th>Home</th>
                    <th>Away</th>
                    <th><img src="img/logo-500.png"/> H</th>
                    <th><img src="img/logo-500.png"/> D</th>
                    <th><img src="img/logo-500.png"/> A</th>
                    <th><img src="img/logo-hkjc.gif"/> H</th>
                    <th><img src="img/logo-hkjc.gif"/> D</th>
                    <th><img src="img/logo-hkjc.gif"/> A</th>
                    <th><img src="img/logo-macau.jpg"/> Mode</th>
                    <th><img src="img/logo-macau.jpg"/> H</th>
                    <th><img src="img/logo-macau.jpg"/> A</th>
                    <th>Strategy</th>
                </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </div>
    <hr/>
    <div class="row">
        <div class="col-md-12">
            <p>
                <span class="text-danger">*</span> Return Rate:
                <img src="img/logo-500.png" style="height:1em;"/> <span id="rr-500" class="label label-info">...</span>
                <img src="img/logo-macau.jpg" style="height:1em;"/> <span id="rr-macau" class="label label-info">...</span>
            </p>
        </div>
    </div>
</div>
</body>
</html>
