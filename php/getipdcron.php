<?php
include "connect.php";
require_once "book.php";

	$from = $_GET["from"];
	$to = $_GET["to"];

	$result = $mysqli->query ("SELECT opdate, hn, admit, discharge, qn from book
		WHERE opdate BETWEEN '$from' AND '$to';");

	if (!$result) {
		return;
	}

	while ($rowi = $result->fetch_assoc()) {
		$case[] = $rowi;
	}

	$update = false;
	for ($i = 0; $i < count($case); $i++)
	{
		$OldAdmit = $case[$i][admit];
		$OldDischarge = $case[$i][discharge];
		if ($OldAdmit && $OldDischarge) {
			continue;
		}

		$opdate = $case[$i]["opdate"];
		$hn = $case[$i]["hn"];
		$qn = $case[$i]["qn"];
		$ipd = getipd($hn);

		if (empty($ipd[admission_date])) {
			$admit = null;
		} else {
			$admit = $ipd[admission_date];
		}
		if (empty($ipd[discharge_date])) {
			$discharge = null;
		} else {
			$discharge = $ipd[discharge_date];
		}

		$date1 = date_create($admit);
		$date2 = date_create($opdate);
		$diff = date_diff($date1, $date2);
		$datediff = $diff->format("%R%a");
//	echo "hn ".$hn." admit ".$admit." datediff ".$datediff."\n";

		if (($datediff < 0) || ($datediff > 30)) {
			continue;
		}

		if (!$OldAdmit) {
			if (!$OldDischarge && $discharge) {
				if ($admit) {
					$mysqli->query ("UPDATE book SET admit = '$admit', discharge = '$discharge' WHERE qn = $qn;");
				}
			} else {
				if ($admit) {
					$mysqli->query ("UPDATE book SET admit = '$admit' WHERE qn = $qn;");
//					echo "UPDATE book SET admit = '$admit' WHERE qn = $qn;\n";
				}
			}
		} else {
			if (!$OldDischarge && $discharge) {
				$mysqli->query ("UPDATE book SET discharge = '$discharge' WHERE qn = $qn;");
			}
		}
	}

 	echo json_encode(book($mysqli));

function getipd($hn)
{
	$wsdl="http://appcenter/webservice/patientservice.wsdl";
	$client = new SoapClient($wsdl);
	$resultx = $client->Get_ipd_detail($hn);
	$resulty = simplexml_load_string($resultx);
	while ($resulty->children())			//find last children
		$resulty = $resulty->children();
	$resultj = json_encode($resulty);		//use json encode-decode to
	return json_decode($resultj,true);		//convert XML to assoc array
}
