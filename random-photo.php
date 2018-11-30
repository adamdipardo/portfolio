<?php

// get a random page
$pageMax = 15;
$page = rand( 1, $pageMax );

$ch = curl_init();
curl_setopt( $ch, CURLOPT_SSL_VERIFYPEER, false );
curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
curl_setopt( $ch, CURLOPT_URL, 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=4e95e34129fc96017025fd5161f890bd&per_page=100&user_id=adamdipardo&page=' . $page . '&format=php_serial' );
$result = curl_exec( $ch );
curl_close( $ch );

$resp = unserialize( $result );

$photoMax = count( $resp['photos']['photo'] );
$photoIndex = rand ( 0, $photoMax - 1 );
$photo = $resp['photos']['photo'][$photoIndex];

die( json_encode( ['photo' => "https://farm" . $photo['farm'] . ".static.flickr.com/" . $photo['server'] . "/" . $photo['id'] . "_" . $photo['secret'] . ".jpg", 'link' => "https://www.flickr.com/photos/adamdipardo/" . $photo['id']] ) );