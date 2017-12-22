<?php

  if (is_file('lib/class.phpmailer.php')) {
    require_once("lib/class.phpmailer.php");
  }
  
  if (is_file('lib/class.smtp.php')) {
    require_once("lib/class.smtp.php");
  }
  
  if (is_file('lib/newsletter.php')) {
    require_once("lib/newsletter.php");
  }

  $http_host = $_SERVER["HTTP_HOST"];
  $body = "";
  $data = array();

  if ( substr($http_host, 0, 4)=="www.") {
    $host_name = substr($http_host, 4);
  } else {
    $host_name = $http_host;
  }
  if (isset($_SERVER["HTTP_REFERER"])) {
    $http_referer = $_SERVER["HTTP_REFERER"];
  } else {
    $http_referer = "";
  }
  define ("HTTP_SERVER", "http://" . $http_host . "/");
  define ("HOST_NAME", $host_name);
  define ("HTTP_REFERER", $http_referer);
  $post = array( 
    "host_name"     => HOST_NAME,
    "host_dir"      => HTTP_SERVER,
    "host_referer"  => HTTP_REFERER
  );

  $_POST = filter_input_array(INPUT_POST, FILTER_SANITIZE_STRING);

  if (!$_POST) {
    echo "Форма пустая!";
    exit;
  }
  
  //header("Content-Type: text/html; charset=utf-8");
  //echo "<pre>";
  //var_dump($_POST);
  //echo "</pre>";
  //exit;

  if ( (!empty($_POST["form"])) && (isset($_POST["form"])) ) {
    $post["user_form"] = $_POST["form"];

    $stack = array(
      "key"   => "Форма: ",
      "value" => $post["user_form"]
    );
    array_push($data, $stack);
  }

  if ( (!empty($_POST["email"])) && (isset($_POST["email"])) ) {
    $post["user_email"] = $_POST["email"];
    $stack = array(
      "key"   => "Email: ",
      "value" => $post["user_email"]
    );
    array_push($data, $stack);
  }

  if ( (!empty($_POST["phone"])) && (isset($_POST["phone"])) ) {
    $post["user_phone"] = $_POST["phone"];
    $stack = array(
      "key"   => "Телефон: ",
      "value" => $post["user_phone"]
    );
    array_push($data, $stack);
  }

  if ( (!empty($_POST["name"])) && (isset($_POST["name"])) ) {
    $post["user_name"] = $_POST["name"];
    $stack = array(
      "key"   => "Имя: ",
      "value" => $post["user_name"]
    );
    array_push($data, $stack);
  }

  if ( (!empty($_POST["message"])) && (isset($_POST["message"])) ) {
    $post["user_message"] = $_POST["message"];
    $stack = array(
      "key"   => "Сообщение: ",
      "value" => $post["user_message"]
    );
    array_push($data, $stack);
  }

  if ( !empty($_POST["test1"])  && (isset($_POST["test1"])) ) {
    if (is_array($_POST['test1'])) {
      $post["user_test1"] = implode(", ", $_POST["test1"]);
    } else {
      $post["user_test1"] = $_POST["test1"];
    }
    $stack = array(
      "key"   => "Есть ли у вас сайт: ",
      "value" => $post["user_test1"]
    );
    array_push($data, $stack);
  }

  if ( !empty($_POST["test2"])  && (isset($_POST["test2"])) ) {
    if (is_array($_POST['test2'])) {
      $post["user_test2"] = implode(", ", $_POST["test2"]);
    } else {
      $post["user_test2"] = $_POST["test2"];
    }
    $stack = array(
      "key"   => "Сайт многостраничный: ",
      "value" => $post["user_test2"]
    );
    array_push($data, $stack);
  }

  if ( !empty($_POST["test3"])  && (isset($_POST["test3"])) ) {
    if (is_array($_POST['test3'])) {
      $post["user_test3"] = implode(", ", $_POST["test3"]);
    } else {
      $post["user_test3"] = $_POST["test3"];
    }
    $stack = array(
      "key"   => "Выберите тип вашего сайта: ",
      "value" => $post["user_test3"]
    );
    array_push($data, $stack);
  }

  if ( !empty($_POST["test4"])  && (isset($_POST["test4"])) ) {
    if (is_array($_POST['test4'])) {
      $post["user_test4"] = implode(", ", $_POST["test4"]);
    } else {
      $post["user_test4"] = $_POST["test4"];
    }
    $stack = array(
      "key"   => "Вы уже применяли СЕО: ",
      "value" => $post["user_test4"]
    );
    array_push($data, $stack);
  }


  $stack = array(
    "key"   => "Форма отправлена с сайта: ",
    "value" => $post["host_referer"]
  );
  array_push($data, $stack);

  foreach ($data as $key => $value) {
    $body .= $value['key'] . $value['value'] . chr(10) . chr(13);
  }

  $mail = new PHPMailer();
  $mail->CharSet = "UTF-8";
  $mail->IsSendmail();

  $from = "no-repeat@" . HOST_NAME;
  $mail->SetFrom($from, HOST_NAME);
  $mail->AddAddress("Artem2431@gmail.com");
  $mail->AddAddress("iborisbelov@gmail.com");
  $mail->isHTML(true);
  $mail->Subject      = HOST_NAME;
  $NewsLetterClass    = new NewsLetterClass();
  $mail->Body         = $NewsLetterClass->generateHTMLLetter($data);
  $mail->AltBody      = $body;

  if(!$mail->send()) {
    $response = array(
      'state'  => 200,
      'error' => "Что-то пошло не так. " . $mail->ErrorInfo,
    );
  } else {
    $response = array(
      'state'  => 200,
      'message' => "Cообщение успешно отправлено.",
    );
  }

  echo json_encode($response);
?>
