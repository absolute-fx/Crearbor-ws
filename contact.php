<?php
require './vendor/autoload.php';

use Mailjet\Client;
use Mailjet\Resources;

$error = 0;

if (filter_var(htmlentities($_POST['email']), FILTER_VALIDATE_EMAIL)) {
    $error = 1;
} else {
    $fullName = htmlentities($_POST['fullname']);
    $email = htmlentities($_POST['email']);
    $mobile = htmlentities($_POST['mobile']);
    $message = htmlentities($_POST['message']);
    $mj = new Client('bdb4181cf13a0371af37e7fcb13b3646', '2ac411e58ce996926ade05e28c51e4c3',true,['version' => 'v3.1']);

    $body = [
        'Messages' => [
            [
                'From' => [
                    'Email' => "philippe.janssens@hotmail.co.uk",
                    'Name' => "Cre'Arbor"
                ],
                'To' => [
                    [
                        'Email' => $email,
                        'Name' => $fullName
                    ]
                ],
                'TemplateID' => 1670943,
                'TemplateLanguage' => true,
                'Subject' => "Contact site web Cre'Arbor"
            ],
            [
                'From' => [
                    'Email' => "philippe.janssens@hotmail.co.uk",
                    'Name' => "Cre'Arbor"
                ],
                'To' => [
                    [
                        'Email' => 'philippe.janssens@hotmail.co.uk',
                        'Name' => "Cre'Arbor"
                    ]
                ],
                'TemplateID' => 1670849,
                'TemplateLanguage' => true,
                'Subject' => "Contact site web Cre'Arbor",
                'Variables' => [
                    'fullname' => $fullName,
                    'email' => $email,
                    'mobile' => $mobile,
                    'message' => $message
                ]
            ]
        ]
    ];
    $response = $mj->post(Resources::$Email, ['body' => $body]);
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="./images/icon.png">
    <link rel="stylesheet" href="./css/bootstrap.min.css">
    <link type="text/css" rel="stylesheet" href="./css/main.css">
    <link type="text/css" rel="stylesheet" href="./css/aos.css">
    <title>Cre'Arbor</title>
</head>


<body>

<?php if ($error == 0): ?>
    <section class="contact-section">
        <div class="container contact-container">
            <div class="">
                <div class="row">
                    <div class="col-md-12 text-center">
                        <img src="./images/logo-white.png" class="img contact-logo" alt="Cre'Arbor logo" id="nav-logo" data-aos="flip-left" data-aos-offset="200" data-aos-duration="800"/>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-3"></div>
                    <div class="col-md-6">
                        <h1 class="crearbor-green-a text-center" data-aos="fade-down"><? echo $fullName;?>, Merci pour votre message</h1>
                        <h2 class="crearbor-brown-a text-center" data-aos="fade-right">Votre message nous a bien été envoyé et nous y répondrons dans les plus brefs délais.</h2>
                        <p class="text-center">Un message de confiramtion vient de vous être envoyé sur votre adresse mail <strong><? echo $email;?></strong>.</p>
                    </div>
                    <div class="col-md-3"></div>
                </div>
            </div>
        </div>
    </section>
<?php endif; ?>
<?php if ($error == 1): ?>
    <section class="contact-section">
        <div class="container contact-container">
            <div class="">
                <div class="row">
                    <div class="col-md-12 text-center">
                        <img src="./images/logo-white.png" class="img contact-logo" alt="Cre'Arbor logo" id="nav-logo" data-aos="flip-left" data-aos-offset="200" data-aos-duration="800"/>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-3"></div>
                    <div class="col-md-6">
                        <h1 class="crearbor-green-a text-center" data-aos="fade-down">Oups... </h1>
                        <h2 class="crearbor-brown-a text-center" data-aos="fade-right">Une erreur est survenue, veuillez réessayer plus tard.</h2>
                    </div>
                    <div class="col-md-3"></div>
                </div>
            </div>
        </div>
    </section>
<?php endif; ?>
<script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
<script type="text/javascript" src="./js/bootstrap.min.js"></script>
<script type="text/javascript" src="./js/modernizr.custom.min.js"></script>
<script type="text/javascript" src="./js/aos.js"></script>
<script type="text/javascript" src="./js/contact.js"></script>
</body>