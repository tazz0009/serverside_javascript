<?php
  //UTF-8�� ��� �Ʒ��� header�� �ּ��� �����Ѵ�.
  //header("Content-type: application/xml; charset=UTF-8");
  $host = "211.39.140.93"; //�����ϰ����ϴ� ������
//  $host = "61.82.137.182"; //�����ϰ����ϴ� ������
  $port = "8080"; //�Ϲ����� ��������Ʈ
  $convert = $_GET["convert"];
  $query = $_GET["query"];
  $target = $_GET["target"];
  $charset = $_GET["charset"];
  $fullpath = "/neo-2.0.0/WNRun.do?convert=".$convert."&query=".$query."&target=".$target."&charset=".$charset;
  $fp = fsockopen($host, $port, &$errno, &$errstr, 30);
  if(!$fp) {
	return fasle;
	exit; 
  }else{
	fputs($fp, "POST ".$fullpath." HTTP/1.0\r\n");
	fputs($fp, "Host: ".$host."\r\n");
	fputs($fp, "Accept: application/xml\r\n");
	fputs($fp, "Connection: close\r\n\r\n"); 
	$content = "";
	while(!feof($fp)){
		$temp = fgets($fp, 1024);
		$content .= $contents.$temp;
		
	}
	$xmls = trim(substr($content,strpos($content, "\r\n\r\n")));//��� ���� 
	echo $xmls;//�������� ���� Ȯ��
	fclose($fp);
  }
?>