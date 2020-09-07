
<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);
require './vendor/autoload.php';

use Mailjet\Client;
use Mailjet\Resources;
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
    <section class="contact-section">
        <div class="container contact-container">
            <div class="">
                <div class="row">
                    <div class="col-md-12 text-center">
                        <img src="./images/logo-white.png" class="img contact-logo" alt="Cre'Arbor logo" id="nav-logo" data-aos="flip-left" data-aos-offset="200" data-aos-duration="800"/>
                    </div>
                </div>
                <?php
                $fullName = $_POST['fullname'];
                $email = $_POST['email'];
                $mobile = $_POST['mobile'];
                $message = $_POST['message'];

                $mj = new Client('bdb4181cf13a0371af37e7fcb13b3646', '2ac411e58ce996926ade05e28c51e4c3',true,['version' => 'v3.1']);


                // Define your request body

                $body = [
                    'Messages' => [
                        [
                            'From' => [
                                'Email' => "manu@absolute-fx.com",
                                'Name' => "Simon janssens"
                            ],
                            'To' => [
                                [
                                    'Email' => $email,
                                    'Name' => $fullName
                                ]
                            ],
                            'TemplateID' => 1670943,
                            'TemplateLanguage' => true,
                            'Subject' => "test",
                            'Variables' => json_decode('{}', true)
                        ],
                        [
                            'From' => [
                                'Email' => "manu@absolute-fx.com",
                                'Name' => "Simon janssens"
                            ],
                            'To' => [
                                [
                                    'Email' => 'Info@absolute-fx.com',
                                    'Name' => 'Simon janssens'
                                ]
                            ],
                            'TemplateID' => 1670849,
                            'TemplateLanguage' => true,
                            'Subject' => "test",
                            'Variables' => json_decode('{
                                fullname: $fullName,
                                email: $email,
                                mobile: $mobile,
                                message: $message
                            }', true)
                        ]
                    ]
                ];


                // All resources are located in the Resources class

                $response = $mj->post(Resources::$Email, ['body' => $body]);
                $response->success() && var_dump($response->getData());
                ?>
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
    <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
    <script type="text/javascript" src="./js/bootstrap.min.js"></script>
    <script type="text/javascript" src="./js/modernizr.custom.min.js"></script>
    <script type="text/javascript" src="./js/aos.js"></script>
    <script type="text/javascript" src="./js/contact.js"></script>
</body>
