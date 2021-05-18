<?php namespace App\Http\Controllers\Test;

use App\Http\Controllers\Controller;
use View;
use Request;
use Redirect;
use DB;
use Auth;
use Excel;
use Hash;

class TestController extends Controller {

    protected $api_subdomain = "https://dev2.cognitiveservices.azure.com";
    protected $api_token = "683f681a76934155ade6671d2e65c613";
    protected $api_groupId = "woogroup1";


    protected $app_api_token = "j9Ofd5iAXyI9507Hmp4fT0";
    //protected $limit = 200;

    function __construct(){


    }

    function getCheck(){

      echo 1234567;

    }

    // 1. PUT
    function getCreatePersonGroup(){

      $url = $this->api_subdomain . "/face/v1.0/persongroups/";

      $headers = array(
        // Request headers
        'Content-Type: application/json',
        'Ocp-Apim-Subscription-Key: '. $this->api_token
      );

      $data = array(
          "name" => "woogroup1",
          "userData" => "user-provided data attached to the person group.",
          "recognitionModel" => "recognition_03"
      );

      $full_url = $url . "woogroup1";

      var_dump($full_url);

      $res = $this->curlPut($full_url, json_encode($data), $headers);

      var_dump($res);



    }

    // new test user : {"personId":"b2b8f545-7f5a-4af5-a04d-0009d371a9fa"}"

    // 2. POST
    function getCreatePerson($name){

      //$url = "https://westus.api.cognitive.microsoft.com/face/v1.0/persongroups/{personGroupId}/persons";

      $url = $this->api_subdomain . "/face/v1.0/persongroups/".$this->api_groupId."/persons";

      $headers = array(
        // Request headers
        'Content-Type: application/json',
        'Ocp-Apim-Subscription-Key: '. $this->api_token
      );

      $data = array(
          "name" => $name,
          "userData" => "User-provided data attached to the person."
      );

      //var_dump($url);

      $res = $this->curlPost($url, json_encode($data), $headers);

      return $res;

    }

    // 2. POST
    function getAddFaceTo($userId, $img_url){

      //$userId = "b2b8f545-7f5a-4af5-a04d-0009d371a9fa";


      //'https://westus.api.cognitive.microsoft.com/face/v1.0/persongroups/{personGroupId}/persons/{personId}/persistedFaces'

      // https://{endpoint}/face/v1.0/persongroups/{personGroupId}/persons/{personId}/persistedFaces[?userData][&targetFace][&detectionModel]
      $url = $this->api_subdomain . "/face/v1.0/persongroups/".$this->api_groupId."/persons/".$userId."/persistedFaces";

      // or we can use stream/binary data

      $headers = array(
        // Request headers
        'Content-Type: application/json',
        'Ocp-Apim-Subscription-Key: '. $this->api_token
      );

      $data = array(
          "url" => $img_url,//"http://dev2.rusrocket.com/upload_files/img_5067.jpg"
      );

      //var_dump($url);

      $res = $this->curlPost($url, json_encode($data), $headers);

      //var_dump($res);

      return $res;

      // {"persistedFaceId":"d5f8b7fe-3466-4a65-bdb4-3df171c67370"}"


    }


    // POST
    function getTrain(){

      //$url =  https://{endpoint}/face/v1.0/persongroups/{personGroupId}/train

      $url = $this->api_subdomain . "/face/v1.0/persongroups/".$this->api_groupId."/train";

      $headers = array(
        // Request headers
        'Ocp-Apim-Subscription-Key: '. $this->api_token
      );

      //var_dump($url);

      $res = $this->curlPost($url, null, $headers);

      return $res;

      //var_dump($res);

    }


    // GET
    function getTrainStatus(){

      // https://{endpoint}/face/v1.0/persongroups/{personGroupId}/training

      $url = $this->api_subdomain . "/face/v1.0/persongroups/".$this->api_groupId."/training";

      $headers = array(
        // Request headers
        'Ocp-Apim-Subscription-Key: '. $this->api_token
      );

      //var_dump($url);

      $res = $this->curlGet($url, $headers);

      return $res;

    }

    // POST
    function getFaceDetect($img_url){

      //$url = https://westus.api.cognitive.microsoft.com/face/v1.0/detect

      /*
      $parameters = array(
          // Request parameters
          'returnFaceId' => 'true',
          'returnFaceLandmarks' => 'false',
          'returnFaceAttributes' => '{string}',
          'recognitionModel' => 'recognition_04',
          'returnRecognitionModel' => 'false',
          'detectionModel' => 'detection_03',
          'faceIdTimeToLive' => '86400',
      );
      */

      $url = $this->api_subdomain . "/face/v1.0/detect" . "?" . "returnFaceId=true&recognitionModel=recognition_03&detectionModel=detection_03";

      $headers = array(
        // Request headers
        'Content-Type: application/json',
        'Ocp-Apim-Subscription-Key: '. $this->api_token
      );

      //var_dump($url);


      $data = array(
          "url" => $img_url,//"http://dev2.rusrocket.com/upload_files/img_test2.jpg"
      );

      $res = $this->curlPost($url, json_encode($data), $headers);

      //var_dump($res);

      // [{  "faceId":"d0aadec1-e60f-458d-9b21-251540388c67" }]

      return $res;

    }

    // POST
    function getFaceGet($faceId){

      //$url = https://westus.api.cognitive.microsoft.com/face/v1.0/detect

      /*
      $parameters = array(
          // Request parameters
          'returnFaceId' => 'true',
          'returnFaceLandmarks' => 'false',
          'returnFaceAttributes' => '{string}',
          'recognitionModel' => 'recognition_04',
          'returnRecognitionModel' => 'false',
          'detectionModel' => 'detection_03',
          'faceIdTimeToLive' => '86400',
      );
      */

      $url = $this->api_subdomain . "/face/v1.0/identify";

      $headers = array(
        // Request headers
        'Content-Type: application/json',
        'Ocp-Apim-Subscription-Key: '. $this->api_token
      );

      //var_dump($url);


      $data = array(
        "faceIds" => array($faceId),
        "personGroupId" => $this->api_groupId,
        "maxNumOfCandidatesReturned" => 1,
        "confidenceThreshold" => 0.5
      );

      $res = $this->curlPost($url, json_encode($data), $headers);

      //var_dump($res);

      // [{  "faceId":"d0aadec1-e60f-458d-9b21-251540388c67" }]

      return $res;

    }

    function getCheckPersonByGroup($userId){

      //$userId = "821d88e6-6770-4c88-b989-f6132c3be8b5";

      // https://{endpoint}/face/v1.0/persongroups/{personGroupId}/persons/{personId}
      $url = $this->api_subdomain . "/face/v1.0/persongroups/".$this->api_groupId."/persons/".$userId;

      $headers = array(
        // Request headers
        //'Content-Type: application/json',
        'Ocp-Apim-Subscription-Key: '. $this->api_token
      );

      //$res = $this->curlDelete($url, json_encode($data), $headers);
      $result = $this->curlGet($url, $headers);

      //var_dump($result);

      return $result;

    }


    function getPersonDelete($userId){

      //$userId = "b2b8f545-7f5a-4af5-a04d-0009d371a9fa";

      // method DELETE
      $url = $this->api_subdomain . "/face/v1.0/persongroups/".$this->api_groupId."/persons/".$userId;

      $headers = array(
        // Request headers
        //'Content-Type: application/json',
        'Ocp-Apim-Subscription-Key: '. $this->api_token
      );

      //$res = $this->curlDelete($url, json_encode($data), $headers);
      $res = $this->curlCustom($url, "DELETE", null, $headers);

      //var_dump($res);
      return $res;

    }

    function getList(){

      //$userId = "b2b8f545-7f5a-4af5-a04d-0009d371a9fa";

      // method DELETE
      $url = $this->api_subdomain . "/face/v1.0/persongroups/woogroup1/persons";

      $headers = array(
        // Request headers
        //'Content-Type: application/json',
        'Ocp-Apim-Subscription-Key: '. $this->api_token
      );

      //$res = $this->curlDelete($url, json_encode($data), $headers);
      $res = $this->curlGet($url, $headers);

      var_dump($res);
      //return $res;

    }

        function getGroupList(){

          //$userId = "b2b8f545-7f5a-4af5-a04d-0009d371a9fa";

          // method DELETE
          $url = $this->api_subdomain . "/face/v1.0/persongroups";

          $headers = array(
            // Request headers
            //'Content-Type: application/json',
            'Ocp-Apim-Subscription-Key: '. $this->api_token
          );

          //$res = $this->curlDelete($url, json_encode($data), $headers);
          $res = $this->curlGet($url, $headers);

          var_dump($res);
          //return $res;

        }

//////////////////////////////////////////////////

// c7bab631-86f9-4a13-b7df-1df2bde12c2c
// 61fa57bb-0be2-4e70-9ea1-538c2dc0d556
// a2297731-5490-4523-abbd-18d6764bf93c


  function postApiDeleteAzureId(){

    $apiToken = Request::get('api_token');
    $azureId = Request::get('azure_id');

    $allP = Request::all();

    //var_dump($allP);

    if($apiToken == $this->app_api_token){


      $res = $this->getPersonDelete($azureId);

      DB::table('users')
        ->where("azure_id", "=", $azureId)
        ->delete();

      return response()->json(array(
            "success" => true,
            "input" => $azureId,
            "data" => json_encode($res)
          )
        );

    }

    return response()->json(array(
          "success" => false,
          "message" => "Auth failed"
        )
      );

  }



  function postApiAddUser(){

    $userName = Request::get('user_name');
    $password = Request::get('password');
    $file = Request::file('avatar');
  	$apiToken = Request::get('api_token');

    // foto we should check if user already exists

  	if($apiToken == $this->app_api_token){

      if(!empty($file)){

        // 1. Upload

				$path_to_img = '/upload_files/';
				$filename = md5(time() . '_' . $file->getClientOriginalName() ) . ".jpg";
				$uploadSuccess = $file->move(public_path().$path_to_img, $filename);

        $img_url = "http://dev2.rusrocket.com/upload_files/" . $filename;

        // 2. Check

        $result_t = $this->getPersonFaceService($img_url);

        if($result_t!=false){

          $checkByGroup = $this->getCheckPersonByGroup($result_t['azure_id']);

          if($checkByGroup['http_code'] == 200){

            return response()->json(array(
                  "success" => false,
                  "data" => $result_t,
                  "message" => "Person already exists",
                  "error_code" => 999,
                )
              );

          }

        }


        //if(){

          $res = $this->getCreatePerson($userName);

          $json = json_decode($res);

          if(isset($json->personId)){

            $userInternalId = DB::table('users')
              //->where("id", "=", $user_id)
              ->insertGetId(array(
                "name" => $userName,
                "azure_id" => $json->personId,
                "password" => $password
              ));

            $userId = $json->personId;

      			//$ava_result = $this->postLoadImage([$file]);

            //echo "<br><br>-- upload success >>> --<br><br>";
            //var_dump($img_url);

            $result_1 = $this->getAddFaceTo($userId, $img_url);

            //echo "<br><br>-- add face >>> --<br><br>";
            //var_dump($result_1);

            $json_res_1 = json_decode($result_1);

            if(isset($json_res_1->persistedFaceId)){

              $res_2 = $this->getTrain();

              //echo "<br><br>-- train >>> --<br><br>";
              //var_dump($res_2);

              return response()->json(array(
                    "success" => true,
                    "data" => array(
                      "name" => $userName,
                      "azure_id" => $json->personId
                    )
                  )
                );

            }else {

              // delete person if upload failed from azure and db
              // to prevent errors
              $this->getPersonDelete($userId);

              return response()->json(array(
                    "success" => false,
                    "message" => "Error to upload photo!"
                  )
                );

            }

          }else{

            return response()->json(array(
                  "success" => false,
                  "message" => "Error! Please try again later"
                )
              );

          }

        //}

      }

      return response()->json(array(
            "success" => false,
            "message" => "Error! File is empty"
          )
        );

    }

  }

/*
  function postApiAddUserPhoto(){

  	$file = Request::file('avatar');
    $userId = Request::get('user_id');
  	$apiToken = Request::get('api_token');

  	if($apiToken == $this->app_api_token){

  		if(!empty($file)){

  			//$ava_result = $this->postLoadImage([$file]);

  			if($ava_result!==false){

  				$path_to_img = '/upload_files/';
  				$filename = md5(time() . str_random(6) . '_' . $file->getClientOriginalName() ) . ".jpg";
  				$uploadSuccess = $file->move(public_path().$path_to_img, $filename);

          // 0.
          var_dump($uploadSuccess);

          $img_url = public_path() . $path_to_img . $filename;

          $result_1 = $this->getAddFaceTo($userId, $img_url);

          // 1.



  			}

  			return response()->json(array(
  						"success" => false,
  						"message" => "File upload failed"
  					)
  				);

  		}
  	}

  	return response()->json(array(
  				"success" => false,
  				"message" => "Auth failed"
  			)
  		);


  }

*/

	function postApiPhotoIdentify(){

		$file = Request::file('avatar');
		$apiToken = Request::get('api_token');
    $password = Request::get('password');

		if($apiToken == $this->app_api_token){

  		if(!empty($file)){

  				//$ava_result = $this->postLoadImage([$file]);

  				$path_to_img = '/upload_files/';
  				$filename = md5(time() . '_' . $file->getClientOriginalName() ) . ".jpg";
  				$uploadSuccess = $file->move(public_path().$path_to_img, $filename);

          // 0.
          //var_dump($uploadSuccess);

          $img_url = "http://dev2.rusrocket.com/upload_files/" . $filename;

          $result_t = $this->getPersonFaceService($img_url);

          if($result_t!=false){

            $azureId = $result_t['azure_id'];

            //get frm db to return userDbId
            $userData = DB::table('users')
              ->where("azure_id", "=", $azureId)
              ->get();

            if(count($userData)>0){

              if($password == $userData[0]->password){

                return response()->json(array(
                      "success" => true,
                      "data" => $userData[0]
                    )
                  );

              }else{

                return response()->json(array(
                      "success" => false,
                      "message" => "User exists, but password is incorrect"
                    )
                  );

              }

            }

            return response()->json(array(
                  "success" => false,
                  "message" => "User exists in Azure, but not in QuickPass API"
                )
              );

          }

			}

			return response()->json(array(
						"success" => false,
						"message" => "File upload failed"
					)
				);


		}

		return response()->json(array(
					"success" => false,
					"message" => "Auth failed"
				)
			);

	}


  function postApiGetProfile(){

  	$apiToken = Request::get('api_token');
    $azureId = Request::get('azure_id');

  	if($apiToken == $this->app_api_token){

      $userData = DB::table('users')
        ->where("azure_id", "=", $azureId)
        ->get();

      if(count($userData)>0){

        return response()->json(array(
                      "success" => true,
                      "data" => $userData[0]
                    ));

      }

      return response()->json(array(
    				"success" => false,
    				"message" => "User not found. Create profile"
    			)
    		);

  	}

  	return response()->json(array(
  				"success" => false,
  				"message" => "Auth failed"
  			)
  		);

  }

  function postApiUpdateProfile(){

  	$apiToken = Request::get('api_token');

    $password = Request::get('password');
    $name = Request::get('name');
    $email = Request::get('email');
    $phone = Request::get('phone');
    $azureId = Request::get('azure_id');

  	if($apiToken == $this->app_api_token){

      $userData = DB::table('users')
        ->where("azure_id", "=", $azureId)
        ->update(array(
          "phone" => $phone,
          "email" => $email,
          "name" => $name,
          "password" => $password
        ));

      return response()->json(array(
                    "success" => true
                  )
                );

  	}

  	return response()->json(array(
  				"success" => false,
  				"message" => "Auth failed"
  			)
  		);

  }




  function getPersonFaceService($img_url){

    $res = $this->getFaceDetect($img_url);

    //echo "<br><br>-- detected >>> --<br><br>";
    //var_dump($res);

    $json_data = json_decode($res);

    if(count($json_data)>0){
      if(isset($json_data[0]->faceId)){

        $personDetected = $this->getFaceGet($json_data[0]->faceId);

        //echo "<br><br>-- detected >>> --<br><br>";
        //var_dump($personDetected);

        // [{"faceId":"30eb6253-85f6-441b-a63e-3ba238e3d9d9","candidates":[{"personId":"03db459c-d988-4461-9265-950427842af5","confidence":0.9412}]}]

        $json_result = json_decode($personDetected);

        if(count($json_result)>0){

          if(isset($json_result[0]->candidates) && count($json_result[0]->candidates)>0){

            return array(
              "azure_id" => $json_result[0]->candidates[0]->personId,
              "confidence" => intval($json_result[0]->candidates[0]->confidence*100)
            );

          }

        }

      }
    }

  return false;


  }








  	function postLoadImage($files){

  		$max_image_size = 5*1024*1024;
  		$time = time();
  		$path_to_img = '/upload_files/';
  		$i=0;

  		foreach ($files as $file) {

  			$i++;
  			if(!empty($file)){

  				$destinationPath = public_path().$path_to_img;
  				$filename = Str::random(6) . '_' . $file->getClientOriginalName();
  				$uploadSuccess = $file->move($destinationPath, $filename);

  				if($file->getClientOriginalName() != ""){

  					if(preg_match('/[.](GIF)|(gif)$/', $filename)) {
  						$im = imagecreatefromgif($destinationPath.$filename) ; //если оригинал был в формате gif
  					}
  					if(preg_match('/[.](PNG)|(png)$/', $filename)) {
  						$im = imagecreatefrompng($destinationPath.$filename) ;//если оригинал был в формате png
  					}
  					if(preg_match('/[.](JPG)|(jpg)|(jpeg)|(JPEG)$/', $filename)) {
  						$im = imagecreatefromjpeg($destinationPath.$filename); //если оригинал был в формате jpg
  					}

  					$quality = 88; //Качество создаваемого изображения
  					$w_src = imagesx($im); //вычисляем ширину
  					$h_src = imagesy($im); //вычисляем высоту изображения
  					if ($w_src < 800) {$w = $w_src;} else { $w = 800; }

  					$prop = $w_src/$h_src;
  					$h = $w/$prop;
  					$dest = imagecreatetruecolor($w,$h);
  					imagecopyresampled($dest, $im, 0, 0, 0, 0, $w, $h, $w_src, $h_src);

  					//------------------------------------------ watermark
  			/*
  					// создаём водяной знак
  					$watermark = imagecreatefrompng(public_path().'/img/watermark.png');

  					// получаем значения высоты и ширины водяного знака
  					$watermark_width = imagesx($watermark);
  					$watermark_height = imagesy($watermark);

  					// помещаем водяной знак на изображение
  					$dest_x = $w - $watermark_width - 0;
  					$dest_y = $h - $watermark_height - 15;

  					imagealphablending($im, true);
  					imagealphablending($watermark, true);
  					// создаём новое изображение
  					imagecopy($dest, $watermark, $dest_x, $dest_y, 0, 0, $watermark_width, $watermark_height);
  					//imagejpeg($im);
  			*/
  					//-----------------------------------------------

  					$random = md5((time()+$i) . rand() . $filename);
  					//$ext = explode(".", $filename);
  					$avatar = $random.".jpg";//заносим в переменную путь до аватара.
  			//		imagejpeg($dest, $destinationPath.$avatar, $quality);//сохраняем изображение формата jpg в нужную папку


  					unlink ($destinationPath.$filename);//удаляем оригинал загруженного изображения

  					//----------------------------------------- мини квадрат

  					$w2 = 600;  // ширина изображения
  					$quality2 = 75; //Качество создаваемого изображения max 100
  					$w_src21 = imagesx($im); //вычисляем ширину
  					$h_src21 = imagesy($im); //вычисляем высоту изображения
  					$avatar_sm = $random."_sm.jpg";

  					$dest21 = imagecreatetruecolor($w2,$w2);
  					if ($w_src21 > $h_src21){
  						imagecopyresampled($dest21, $im, 0, 0, round((max($w_src21,$h_src21)-min($w_src21,$h_src21))/2), 0, $w2, $w2, min($w_src21,$h_src21), min($w_src21,$h_src21));
  					}
  					if ($w_src21 < $h_src21){
  						imagecopyresampled($dest21, $im, 0, 0, 0, 0, $w2, $w2, min($w_src21,$h_src21), min($w_src21,$h_src21));
  					}
  					if ($w_src21 == $h_src21){
  						imagecopyresampled($dest21, $im, 0, 0, 0, 0, $w2, $w2, $w_src21, $h_src21);
  					}
  					imagejpeg($dest21, public_path().$path_to_img.$avatar_sm, $quality2); //сохраняем изображение формата jpg в нужную папку

  					//----------------------------------------- мини квадрат
  					// освобождаем память
  					imagedestroy($im);
  					//imagedestroy($watermark);
  					return $avatar_sm;

  				}
  			}
  		}
  		return false;
  	}






/////////////////////////////////////////////////////////////////////////////////////////


    function write_to_file($text,$new_filename,$subfolder=null){

      if(is_null($subfolder)){
        $short_path = storage_path()."/app/public/";
      }else{
        $short_path = storage_path()."/app/".$subfolder."/";
        if (!file_exists($short_path)) {
            mkdir($short_path, 0777, true);
        }
      }

      $fp = fopen($short_path . $new_filename, 'w');
      fwrite($fp, $text);
      fclose($fp);

    }



    function curlGet($url, $headers){

      $ch = curl_init();

      curl_setopt($ch, CURLOPT_URL, $url);
      curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
      curl_setopt($ch, CURLOPT_HEADER, 1);
      curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
      //curl_setopt($ch, CURLOPT_POSTFIELDS,$body);
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

      // Timeout in seconds
      curl_setopt($ch, CURLOPT_TIMEOUT, 30);

      $response = curl_exec($ch);

      $curl_info = curl_getinfo($ch);
      $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

      curl_close($ch); // Close the connection

      $header_size = $curl_info['header_size'];
      $header = substr($response, 0, $header_size);
      $body = substr($response, $header_size);


      $result = array(
        "header" => $header,
        "body" => $body,
        "http_code" => $http_code
      );

      return $result;

    }

    function curlPost($url, $data, $headers){

      $ch = curl_init();

      curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
      curl_setopt($ch, CURLOPT_HEADER, 0);
      curl_setopt($ch, CURLOPT_URL, $url);
      curl_setopt($ch, CURLOPT_POST, 1);
      curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

      // In real life you should use something like:
      // curl_setopt($ch, CURLOPT_POSTFIELDS,
      //          http_build_query(array('postvar1' => 'value1')));

      // Receive server response ...
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
      curl_setopt($ch, CURLOPT_TIMEOUT, 40);

      $server_output = curl_exec($ch);

      curl_close ($ch);

      return $server_output;

    }


    function curlPut($url, $data, $headers){

      $ch = curl_init();

      curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
      curl_setopt($ch, CURLOPT_HEADER, 1);
      curl_setopt($ch, CURLOPT_URL, $url);
      curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
      curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

      // In real life you should use something like:
      // curl_setopt($ch, CURLOPT_POSTFIELDS,
      //          http_build_query(array('postvar1' => 'value1')));

      // Receive server response ...
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
      curl_setopt($ch, CURLOPT_TIMEOUT, 40);

      $server_output = curl_exec($ch);

      curl_close ($ch);

      return $server_output;

    }

    function curlCustom($url, $method, $data, $headers){

      $ch = curl_init();

      curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
      curl_setopt($ch, CURLOPT_HEADER, 1);
      curl_setopt($ch, CURLOPT_URL, $url);
      curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
      curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

      // Receive server response ...
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
      curl_setopt($ch, CURLOPT_TIMEOUT, 40);

      $server_output = curl_exec($ch);

      curl_close ($ch);

      return $server_output;

    }




}
