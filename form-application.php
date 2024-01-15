<?php

$recipient = "anastasiaputeeya@gmail.com";
$sitename = "test.ru";
$headers = 'MIME-Version: 1.0' . "\r\n";
$headers .= "Content-type: text/html; charset=utf-8 \r\n";
$headers .= "From: <a.puteeva@yandex.by>\r\n";

$message = '';
if(!empty($_POST['name-form'])){
	$message .= "Заявка с формы: " . $_POST['name-form'] . '<br>';
}
if(!empty($_POST['name'])){
	$message .= "Имя: " . $_POST['name'] . '<br>';
}
$message .= "Номер телефона: " . $_POST['phone'] . '<br>';

$pagetitle = "Новая заявка с сайта " . $sitename;

if(mail($recipient, $pagetitle, $message, $headers)){
	echo 'Успешно отправлено!';
} else {
	echo 'Отправка не удалась!';
}