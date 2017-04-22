var GETNAMEHN		= "php/getnamehn.php";
var MYSQLIPHP		= "php/mysqli.php";
var CHECKPAC		= "php/checkpac.php";

var BOOK		= [];

var THISUSER	= "";
var TIMESTAMP	= "";
var TIMER		= "";

var OPDATE		= 0;
var SINCE		= 1;
var STAFFNAME	= 2;
var HN			= 3;
var NAME		= 4;
var AGE			= 5;
var DIAGNOSIS	= 6;
var TREATMENT	= 7;
var CONTACT		= 8;
var QN			= 9;

var CASE		= 0;
var PATIENT		= 1;
var SDIAGNOSIS	= 2;
var STREATMENT	= 3;
var ADMISSION	= 4;
var FINAL		= 5;
var ADMIT		= 6;
var DISCHARGE	= 7;
var SQN			= 8;

var EDITABLE 	= [HN, DIAGNOSIS, TREATMENT, CONTACT];
var SEDITABLE	= [SDIAGNOSIS, STREATMENT, ADMISSION, FINAL, ADMIT, DISCHARGE]

var NAMEOFDAYTHAI	= ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์", "เสาร์"];
var DAYOFTHAINAME	= {"อาทิตย์":0, "จันทร์":1, "อังคาร":2, "พุธ":3, "พฤหัส":4, "ศุกร์":5, "เสาร์":6};

//use for row color
var NAMEOFDAYABBR	= ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

//use for 1st column color
var NAMEOFDAYFULL	= ["sunday", "monday", "tuesday", "wednesday", 
						"thursday", "friday", "saturday"];

var NUMMONTH	= {"มค.":"01","กพ.":"02","มีค.":"03","เมย.":"04","พค.":"05","มิย.":"06",
					"กค.":"07","สค.":"08","กย.":"09","ตค.":"10","พย.":"11","ธค.":"12"};

var STAFF		= ["อ.เอก", "อ.อัตถพร", "อ.สรยุทธ", "อ.วัฒนา", "อ.เกรียงศักดิ์", "อ.พีรพงศ์"];

var HOLIDAY = {
	"2017-02-11" : "url('pic/Magha.jpg')",
	"2017-02-13" : "url('pic/Maghasub.jpg')",	//หยุดชดเชยวันมาฆบูชา
	"2017-05-09" : "url('pic/Ploughing.jpg')",
	"2017-05-10" : "url('pic/Vesak.jpg')",
	"2017-07-08" : "url('pic/Asalha.jpg')",
	"2017-07-09" : "url('pic/Vassa.jpg')",
	"2017-07-10" : "url('pic/Asalhasub.jpg')",
	"2017-07-11" : "url('pic/Vassasub.jpg')",	//หยุดชดเชยวันเข้าพรรษา,	
	"2018-03-01" : "url('pic/Magha.jpg')",
	"2018-05-09" : "url('pic/Ploughing.jpg')",
	"2018-05-29" : "url('pic/Vesak.jpg')",
	"2018-07-27" : "url('pic/Asalha.jpg')",
	"2018-07-28" : "url('pic/Vassa.jpg')",
	"2018-07-30" : "url('pic/Vassasub.jpg')",
	"2019-02-19" : "url('pic/Magha.jpg')",		//วันมาฆบูชา
	"2019-05-13" : "url('pic/Ploughing.jpg')",	//วันพืชมงคล
	"2019-05-18" : "url('pic/Vesak.jpg')",		//วันวิสาขบูชา
	"2019-05-20" : "url('pic/Vesaksub.jpg')",	//หยุดชดเชยวันวิสาขบูชา	
	"2019-07-16" : "url('pic/Asalha.jpg')",		//วันอาสาฬหบูชา
	"2019-07-17" : "url('pic/Vassa.jpg')"		//วันเข้าพรรษา
	}

var neuroSxOp = [
	"Anast", "Approa", "Aspirat", "Biop", "Block", "Burr", "Clip", 
	"Decom", "DBS", "Drain", "Ectomy", "Fix", "Fusion", "Insert", "Lesion", "Lysis", 
	"Occlu", "Oper", "ostom", "otom", "plast", "Remov", "Repa", "Revis", 
	"scope", "Screw", "Shunt", "Stim", "Transpos", "Transect", "Untether",
	"anast", "approa", "aspirat", "biop", "block", "burr", "clip", 
	"decom", "dbs", "drain", "ectomy", "fix", "fusion", "insert", "lesion", "lysis", 
	"occlu", "oper", "remov", "repa", "revis", 
	"screw", "shunt", "stim", "transpos", "transect", "untether"
	]

var neuroMorbid = [
	"Brain death", "Brain swelling", "Delirium", "Donor", 
	"Leak", "Morbid", "Spastic", "Seizure", 
	"brain death", "brain swelling", "delirium", "donor", 
	"leak", "morbid", "spastic", "seizure", "DI"
	]

var	neuroPostop = [
	/palsy/, /paresis/, /plegia/, /weakness/, /gr [0123]/
	]
