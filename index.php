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
                    <th><img src="img/logo-betfair.png"/> H</th>
                    <th><img src="img/logo-betfair.png"/> D</th>
                    <th><img src="img/logo-betfair.png"/> A</th>
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
                <img src="img/logo-500.png" style="height:1em;"/> <span id="rr-5c" class="label label-info">...</span>
                <img src="img/logo-hkjc.gif" style="height:1em;"/> <span id="rr-hk" class="label label-info">...</span>
                <img src="img/logo-betfair.png" style="height:1em;"/> <span id="rr-bf" class="label label-info">...</span>
            </p>
        </div>
    </div>
</div>
</body>
</html>
