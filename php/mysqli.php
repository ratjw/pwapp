﻿<?php

require_once "book.php";

	$mysqli = new mysqli("localhost", "root", "zaq12wsx", "neurosurgery");
	if ($mysqli->connect_errno)
		exit("Connect failed: %s\n". $mysqli->connect_error);
/*
$str="UPDATE book SET diagnosis = 'No DMNo HTHIV -veNo AntiplateletNo Anticoagแพ้ Sulfonamides', editor='001198' WHERE qn = 514;";
echo sqlexecute($mysqli, $str);
exit;
*/
	if (isset($_GET['startup']))
	{
		echo json_encode(book($mysqli));
	}
	else if (isset($_GET['nosqlReturnbook']))
	{
		echo json_encode(book($mysqli));
	}
	else if (isset($_GET['sqlnoResult']))
	{
		echo sqlexecute($mysqli, $_GET['sqlnoResult']);
	}
	else if (isset($_GET['sqlReturnbook']))
	{
		$return = sqlexecute($mysqli, $_GET['sqlReturnbook']);
		if (strpos($return, "DBfailed") !== false)
			echo $return;
		else
			echo json_encode(book($mysqli));
	}
	else if (isset($_GET['sqlReturnData']))	//from edithistory
	{
		echo sqlexecute($mysqli, $_GET['sqlReturnData']);
	}
	else if (isset($_GET['functionName']))
	{
		echo json_encode($_GET['functionName']($mysqli));
	}

function sqlexecute($mysqli, $sql)
{
	$returndata = "";
	if ($mysqli->multi_query(urldecode($sql))) {
		do {
			if ($result = $mysqli->store_result())
			{
				$rowi = array();
				$data = array();
				while ($rowi = $result->fetch_assoc())
					$data[] = $rowi;
				$returndata .= json_encode($data);
			}
			//false $result but success query : insert. update, delete
			//has no result, but no error, skip this
			else if ($mysqli->errno)
			{
				$returndata .= 'DBfailed multi query ' . $sql . " \n" . $mysqli->error;
			}
			if (!$mysqli->more_results()) {
				break;
			}
		} while ($mysqli->next_result());
	}
	else if ($mysqli->errno)
	{
		$returndata .= 'DBfailed first query ' . $sql . " \n" . $mysqli->error;
	}
	return $returndata;
}

function checkupdate($mysqli)
{
	$time = $_GET['time'];
	$result = $mysqli->query ("SELECT MAX(editdatetime) from bookhistory;");
	if ($result)
	{
		$stamp = $result->fetch_row();
		if ($time < $stamp[0])		//fetch_row result is an array
			return book($mysqli);	//there is an update
	}	//no update if current time > TIMESTAMP of last entry, check another

	return "";	//no front-end update
}
			
function movecaseQwaitToQwait($mysqli)
{
	extract($_GET);	//$WNfrom, $WaitNumTo, $staffname, $THISUSER, $QNfrom

	if ($WNfrom < $WaitNumTo)
	{
		$sql = "UPDATE book SET waitnum = waitnum - 1 WHERE waitnum > $WNfrom AND waitnum <= $WaitNumTo AND staffname = '$staffname';";
	}
	else
	{
		$sql = "UPDATE book SET waitnum = waitnum + 1 WHERE waitnum >= $WaitNumTo AND waitnum < $WNfrom AND staffname = '$staffname';";
	}
	if (!$mysqli->query($sql))	// ??? can't use multi_query ??? error about + - signs ???
		return "DBfailed: %s\n".$sql."\n".$mysqli->error;
	$sql = "UPDATE book SET waitnum = $WaitNumTo, editor='$THISUSER' WHERE qn = $QNfrom;";
	if (!$mysqli->query($sql))
		return "DBfailed: %s\n".$sql."\n".$mysqli->error;
	return book($mysqli);
}
			
function movecasebookToQwait($mysqli)
{
	extract($_GET);	//$WaitNumTo, $staffname, $THISUSER, $QNfrom

	$sql = "UPDATE book SET waitnum = waitnum + 1 WHERE waitnum >= $WaitNumTo AND staffname = '$staffname';";
	if (!$mysqli->query($sql))	// ??? can't use multi_query ??? error about + - signs ???
		return "DBfailed: %s\n".$sql."\n".$mysqli->error;
	$sql = "UPDATE book SET waitnum = $WaitNumTo, staffname = '$staffname', editor='$THISUSER' WHERE qn = $QNfrom;";	//update staffname in case change staffname
	if (!$mysqli->query($sql))
		return "DBfailed: %s\n".$sql."\n".$mysqli->error;
	return book($mysqli);
}
