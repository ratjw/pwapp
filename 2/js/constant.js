//Actually these are constants but older browsers do not support const
var GETIPD		= "php/getipd.php";
var GETNAMEHN	= "php/getnamehn.php";
var MYSQLIPHP	= "php/mysqli.php";

//tbl, queuetbl
var OPDATE		= 0;
var ROOM		= 1;
var CASENUM		= 2;
var STAFFNAME	= 3;
var HN			= 4;
var NAME		= 5;
var DIAGNOSIS	= 6;
var TREATMENT	= 7;
var CONTACT		= 8;
var QN			= 9;

//servicetbl
var CASENUMSV	= 0;
var HNSV		= 1;
var NAMESV		= 2;
var DIAGNOSISSV	= 3;
var TREATMENTSV	= 4;
var ADMISSIONSV	= 5;
var FINALSV		= 6;
var ADMITSV		= 7;
var OPDATESV	= 8;
var DISCHARGESV	= 9;
var QNSV		= 10;

var ROWREPORT = {
	"Brain Tumor": 3,
	"Brain Vascular": 4,
	"CSF related": 5,
	"Trauma": 6,
	"Spine": 7,
	"etc": 8,
	"Radiosurgery": 10,
	"Endovascular": 11,
	"Conservative": 12
}
var COLUMNREPORT = {
	"Staff": 1,
	"Resident": 5,
	"Major": 0,
	"Minor": 2,
	"Elective": 0,
	"Emergency": 1
}

// NAMEOFDAYABBR for row color
// NAMEOFDAYFULL for 1st column color
var NAMEOFDAYABBR	= ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
var NAMEOFDAYFULL	= ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
var THAIMONTH		= ["มค.", "กพ.", "มีค.", "เมย.", "พค.", "มิย.", "กค.", "สค.", "กย.", "ตค.", "พย.", "ธค."];
var LARGESTDATE		= "9999-12-31";

var	BRAINDX = [
	/\bbrain\b/i, /basal ganglion/i, /basal.*gg/i, /bgg/i, /cavernous/i, /cerebell/i, 
	/cranio/i, /\bCNS\b/i, /convexity/i, /\bCPA?\b/i, /cliv[aou]/i,
	/facial/i, /front/i, /fal[cx]/i, /\bF-?P\b/i, /jugular/i,
	/planum/i, /pitui/i, /pineal/i, /petro/i, 
	/occipit/i, /sella/i, /sphenoid/i, /sagittal/i, /\bSSS\b/i,
	/tempor/i, /tentori/i, /thalam/i, /tonsil/i,
	/transnasal/i, /transsphenoid/i, /transtent/i, /transventric/i, 
	/tuberculum/i, /vestibul/i
]
var	BRAINTUMORDX = [
	/^((?!cavernoma|osteo).)*oma/i, /\bCA\b/i, /CPA/i, /crani[oe]/i, /Cushing/i, /cyst\b/i,
	/DNET/i, /GBM/i, /mass/i, /metas/i, /\bNFP?A\b/i,
	/\bPA\b/i, /pituitary apoplexy/i, /tumou?r/i
]
var	BRAINVASCULARDX = [
	/aneurysm/i, /AVM/i, /AVF/i, /basal ganglion|\bbg|cerebellar hemorrhage/i,
	/cavernoma/i, /emboli/i, /ha?emorrh/i, /HT?ICH/i,
	/ICH/i, /infarct/i, /(ICA|MCA|VBA).*stenosis/i,
	/M1|M2|MCA occlusion/i, /moya moya/i, /\bSAH\b/i
]
var	CSFDX = [
	/\bHCP\b/i, /hydrocephalus/i, /\bNPH\b/i,
	/(\bVP|\bLP|periton|subgaleal).*shunt/i,
	/shunt obstruct/i, /shunt malfunction/i
]
var	TRAUMADX = [
	/accident/i, /assault/i, /concussion/i, /contusion/i, /\bEDH\b/i,
	/fall/i, /Fx|fracture/i, /injury/i, /lacerat/i,
	/\bSDH\b/i, /subdural ha?ematoma/i, /trauma/i
]
var	SPINEDX = [
	/cervical/i, /cord/i, /\bCSM\b/i, /^((?!mri|mri|MRI?).)*[CTLS] ?[\d]/,
	/degenerat/i, /dislocat/i,
	/HNP/i, /lamin[eo]/i, /listhesis/i, /lumb[ao]/i, /myel/i,
	/odontoid/i, /sacr[ao]/i, /scoliosis/i, /spin[aeo]/i, /spondylo/i, /thora/i
]
var	ETCDX = [
	/abscess/i, /chiari/i, /convulsi/i, /\bCTS\b/i, /cubital/i,
	/dysplasia/i, /epilepsy/i, /hemifacial/i,
	/\bMTS\b/i, /ocele/i, /parkinson/i,
	/skull defect/i, /sclerosis/i, /seizure/i, /sural/i,
	/\bTG?N\b/i, /trigemin/i, /tunnel/i
]

var	BRAINTUMORDXNO = [
	/aneurysm/i, /AVM/i, /AVF/i, /basal ganglion|\bbg|cerebellar hemorrhage/i,
	/cavernoma/i, /emboli/i, /ha?emorrh/i, /HT?ICH/i,
	/ICH/i, /infarct/i, /(ICA|MCA|VBA).*stenosis/i,
	/M1|M2|MCA occlusion/i, /moya moya/i, /\bSAH\b/i,

	/\bHCP\b/i, /hydrocephalus/i, /\bNPH\b/i,
	/(\bVP|\bLP|periton|subgaleal).*shunt/i,
	/shunt obstruct/i, /shunt malfunction/i,

	/assault/i, /\bEDH\b/i, /contusion/i, /injury/i,
	/Fx|fracture/i, /lacerat/i,
	/\bC?SDH\b/i, /subdural ha?ematoma/i, /trauma/i,

	/cervical/i, /cord/i, /\bCSM\b/i, /^((?!mri|mri|MRI?).)*[CTLS] ?[\d]/,
	/dislocat/i,
	/HNP/i, /lamin[eo]/i, /listhesis/i, /lumb[ao]/i, /myel/i,
	/odontoid/i, /sacr[ao]/i, /scoliosis/i, /spin[aeo]/i, /spondylo/i, /thora/i,

	/abscess/i, /chiari/i, /\bCTS\b/i, /cubital/i,
	/dysplasia/i, /hemifacial/i,
	/\bMTS\b/i, /ocele/i, /parkinson/i,
	/skull defect/i, /sclerosis/i, /sural/i,
	/tunnel/i
]
var	BRAINVASCULARDXNO = [
	/^((?!cavernoma|osteo).)*oma/i, /\bCA\b/i, /CPA/i, /Cushing/i, /cyst\b/i,
	/DNET/i, /GBM/i, /mass/i, /metas/i, /\bNFP?A\b/i,
	/pituitary apoplexy/i, /tumou?r/i,

	/\bHCP\b/i, /hydrocephalus/i, /\bNPH\b/i,
	/(\bVP|\bLP|periton|subgaleal).*shunt/i,
	/shunt obstruct/i, /shunt malfunction/i,

	/assault/i, /\bEDH\b/i, /contusion/i, /injury/i,
	/Fx|fracture/i, /lacerat/i,
	/\bC?SDH\b/i, /subdural ha?ematoma/i, /trauma/i,

	/cervical/i, /cord/i, /\bCSM\b/i, /^((?!mri|mri|MRI?).)*[CTLS] ?[\d]/,
	/degenerat/i, /dislocat/i,
	/HNP/i, /lamin[eo]/i, /listhesis/i, /lumb[ao]/i, /myel/i,
	/odontoid/i, /sacr[ao]/i, /scoliosis/i, /spin[aeo]/i, /spondylo/i, /thora/i,

	/abscess/i, /chiari/i, /convulsi/i, /\bCTS\b/i, /cubital/i,
	/dysplasia/i, /epilepsy/i, /hemifacial/i,
	/\bMTS\b/i, /ocele/i, /parkinson/i,
	/skull defect/i, /sclerosis/i, /seizure/i, /sural/i,
	/\bTG?N\b/i, /trigemin/i, /tunnel/i
]
var	CSFDXNO = [
	/^((?!cavernoma|osteo).)*oma/i, /\bCA\b/i, /CPA/i, /crani[oe]/i, /Cushing/i,
	/DNET/i, /GBM/i, /mass/i, /metas/i, /\bNFP?A\b/i,
	/\bPA\b/i, /pituitary apoplexy/i, /tumou?r/i,

	/aneurysm/i, /AVM/i, /AVF/i, /basal ganglion|\bbg|cerebellar hemorrhage/i,
	/cavernoma/i, /emboli/i, /ha?emorrh/i, /HT?ICH/i,
	/ICH/i, /infarct/i, /(ICA|MCA|VBA).*stenosis/i,
	/M1|M2|MCA occlusion/i, /moya moya/i, /\bSAH\b/i,

	/assault/i, /\bEDH\b/i, /contusion/i, /injury/i,
	/Fx|fracture/i, /lacerat/i, /trauma/i,

	/cervical/i, /cord/i, /\bCSM\b/i, /^((?!mri|mri|MRI?).)*[CTLS] ?[\d]/,
	/degenerat/i, /dislocat/i,
	/HNP/i, /lamin[eo]/i, /listhesis/i, /lumb[ao]/i,
	/odontoid/i, /sacr[ao]/i, /scoliosis/i, /spin[aeo]/i, /spondylo/i, /thora/i,

	/abscess/i, /chiari/i, /convulsi/i, /\bCTS\b/i, /cubital/i,
	/dysplasia/i, /epilepsy/i, /hemifacial/i,
	/\bMTS\b/i,
	/sclerosis/i, /seizure/i, /sural/i,
	/\bTG?N\b/i, /tunnel/i
]
var	TRAUMADXNO = [
	/^((?!cavernoma|osteo).)*oma/i, /\bCA\b/i, /CPA/i, /crani[oe]/i, /Cushing/i, /cyst\b/i,
	/DNET/i, /GBM/i, /mass/i, /metas/i, /\bNFP?A\b/i,
	/\bPA\b/i, /pituitary apoplexy/i, /tumou?r/i,

	/aneurysm/i, /AVM/i, /AVF/i, /basal ganglion|\bbg|cerebellar hemorrhage/i,
	/cavernoma/i, /emboli/i, /ha?emorrh/i, /HT?ICH/i,
	/ICH/i, /infarct/i, /(ICA|MCA|VBA).*stenosis/i,
	/M1|M2|MCA occlusion/i, /moya moya/i, /\bSAH\b/i,

	/\bHCP\b/i, /hydrocephalus/i, /\bNPH\b/i,
	/(\bVP|\bLP|periton|subgaleal).*shunt/i,
	/shunt obstruct/i, /shunt malfunction/i,

	/cervical/i, /cord/i, /\bCSM\b/i, /^((?!mri|mri|MRI?).)*[CTLS] ?[\d]/,
	/degenerat/i, /dislocat/i,
	/HNP/i, /lamin[eo]/i, /listhesis/i, /lumb[ao]/i, /myel/i,
	/odontoid/i, /sacr[ao]/i, /scoliosis/i, /spin[aeo]/i, /spondylo/i, /thora/i,

	/abscess/i, /chiari/i, /convulsi/i, /\bCTS\b/i, /cubital/i,
	/dysplasia/i, /epilepsy/i, /hemifacial/i,
	/\bMTS\b/i, /ocele/i, /parkinson/i,
	/skull defect/i, /sclerosis/i, /seizure/i, /sural/i,
	/\bTG?N\b/i, /trigemin/i, /tunnel/i
]
var	SPINEDXNO = [
	/CPA/i, /crani[oe]/i, /Cushing/i,
	/GBM/i, /\bNFP?A\b/i,
	/\bPA\b/i, /pituitary apoplexy/i,

	/basal ganglion|\bbg|cerebellar hemorrhage/i,
	/HT?ICH/i, /ICH/i, /infarct/i, /(ICA|MCA|VBA).*stenosis/i,
	/M1|M2|MCA occlusion/i, /moya moya/i,

	/\bHCP\b/i, /hydrocephalus/i, /\bNPH\b/i,
	/(\bVP|\bLP|periton|subgaleal).*shunt/i,
	/shunt obstruct/i, /shunt malfunction/i,

	/convulsi/i, /\bCTS\b/i, /cubital/i,
	/epilepsy/i, /hemifacial/i,
	/\bMTS\b/i, /parkinson/i,
	/skull defect/i, /seizure/i, /sural/i,
	/\bTG?N\b/i, /trigemin/i
]
var	ETCDXNO = [
	/DNET/i, /GBM/i, /mass/i, /metas/i, /\bNFP?A\b/i,
	/\bPA\b/i, /pituitary apoplexy/i, /tumou?r/i,

	/\bHCP\b/i, /hydrocephalus/i, /\bNPH\b/i,
	/(\bVP|\bLP|periton|subgaleal).*shunt/i,
	/shunt obstruct/i, /shunt malfunction/i,

	/assault/i, /\bEDH\b/i, /contusion/i, /injury/i,

	/HNP/i, /lamin[eo]/i, /listhesis/i, /lumb[ao]/i, /myel/i,
	/odontoid/i, /sacr[ao]/i, /scoliosis/i, /spin[aeo]/i, /spondylo/i, /thora/i
]

var	BRAINTUMORRX = [
	/approa/i, /biopsy/i, /\bbx\b/i, /crani[oe]c?tomy/i, /\bETS\b/i, /otom/i, /trans.*remov/i,
	/TSP/i, /TSS/i, /transnasal/i, /transsphenoid/i, /transventric/i, /tumou?r/i
]
var	BRAINVASCULARRX = [
	/anast/i, /bypass/i, /(clot|hematoma).*(remov|irrigat|evacuat)/i,
	/clip/i, /crani[oe]c?tomy/i, /EDAS/i, /EDAMS/i, /excision.*AVM|AVM.*excision/i,
	/occlu/i
]
var	CSFRX = [
	/ETV/i, /EVD/i, /lumbar drain/i, /OMMAYA/i,
	/Pudenz/i, /pressure.*valve/i, /Programmable/i,
	/(\bVP|\bLP|periton|subgaleal).*shunt/i,
]
var	TRAUMARX = [
	/debridement/i, /(clot|hematoma).*(remov|irrigat|evacuat)/i
]
var	SPINERX = [
	/ACDF/i, /ALIF/i, /biopsy/i, /\bbx\b/i, /cervical/i, /^((?!mri|MRI?).)*[CTLS][\d]/,
	/corpectomy/i, /decompress/i, /Discectomy/i,
	/\bESI\b/i, /fixation/i, /foraminotomy/i, /\bfusion/i, /kyphoplasty/i,
	/lamin[eo]/i, /MIDLIF/i, /OLIF/i, 
	/PDS/i, /PLF/i, /PLIF/i, /remov/i, /sacr[ao]/i, /screw/i, /SNRB/i,
	/thora/i, /TLIF/i, /transoral/i, /transforam/i, /tumou?r/i,
	/vertebr/i, /untether/i
]
var	SPINEOP = [
	/ACDF/i, /ALIF/i, /biopsy/i, /\bbx\b/i, /block/i,
	/corpectomy/i, /decompress/i, /Discectomy/i, /disc.*fx/i, /ectomy/,
	/\bESI\b/i, /fixation/i, /foraminotomy/i, /\bfusion/i, /kyphoplasty/i,
	/lamin[eo]/i, /MIDLIF/i, /OLIF/i, 
	/PDS/i, /PLF/i, /PLIF/i, /remov/i, /sacr[ao]/i, /screw/i, /SNRB/i,
	/TLIF/i, /transoral/i, /transforam/i,
	/vertebr(oplasty|ectomy)\b/i, /untether/i
]
var ETCRX = [
	/anast/i, /aspirat/i, /advance/i,
	/biop/i, /block/i, /burr/i, /\bbx\b/i, /balloon/i, /cranioplasty/i,
	/change battery/i, /DBS/i, /grid/i, /MVD/i,
	/decom/i, /DBS/i, /drain/i, /disconnect/i,
	/ECOG/i, /ectom/i, /endoscop/i, /\bESI\b/i, /excis/i,
	/grid/i, /insert/i,
	/lesion/i, /lysis/i, /lesionectomy/i, /lobectomy/i,
	/neurot/i, /Navigator/i,
	/occlu/i, /operat/i, /ostom/i, /plast/i, 
	/rhizotomy/i,
	/recons/i, /redo/i, /remov/i, /repa/i, /revis/i, /\bRF/i, /robot/i,
	/scope/i, /stim/i, /suture/i,
	/tracheos/i, /VNS/i
]
var	NOOPERATION = [
	/adjust.*pressure/i, /advice.*surg[ery|ical]/i, /conservative/i, /observe/i, /\boff OR/
]
var BRAINTUMORRXNO = [
	/(clot|hematoma).*(remov|irrigat|evacuat)/i,
	/clip/i, /EDAS/i, /EDAMS/i, /excision.*AVM|AVM.*excision/i,

	/ETV/i,

	/ACDF/i, /ALIF/i, /^((?!mri|MRI?).)*[CTLS][\d]/,
	/cervical/i, /lamin[eo]/i, /lumbar/i, /MIDLIF/i, /OLIF/i, 
	/PLF/i, /PLIF/i, /sacr[ao]/i, /SNRB/i,
	/thora/i, /TLIF/i,

	/change battery/i, /DBS/i, /grid/i, /MVD/i,
	/untether/i, /VNS/i
]
var BRAINVASCULARRXNO = [
	/biopsy/i, /\bbx\b/i, /tumou?r/i,
	/TSP/i, /TSS/i, /transnasal/i, /transsphenoid/i, /transventric/i,

	/ETV/i, /OMMAYA/i,
	/(\bVP|\bLP|periton|subgaleal).*shunt/i,

	/ACDF/i, /ALIF/i, /^((?!mri|MRI?).)*[CTLS][\d]/,
	/lamin[eo]/i, /lumbar drain/i, /MIDLIF/i, /OLIF/i, 
	/PLF/i, /PLIF/i, /sacr[ao]/i, /SNRB/i,
	/thora/i, /TLIF/i,

	/change battery/i, /DBS/i, /grid/i, /MVD/i, /cranioplasty/i,
	/untether/i, /VNS/i
]
var CSFRXNO = [
	/biopsy/i, /\bbx\b/i, /tumou?r/i,
	/TSP/i, /TSS/i, /transnasal/i, /transsphenoid/i, /transventric/i,

	/(clot|hematoma).*(remov|irrigat|evacuat)/i,
	/clip/i, /EDAS/i, /EDAMS/i, /excision.*AVM|AVM.*excision/i,

	/ACDF/i, /ALIF/i, /^((?!mri|MRI?).)*[CTLS][\d]/,
	/lamin[eo]/i, /MIDLIF/i, /OLIF/i, 
	/PLF/i, /PLIF/i, /sacr[ao]/i, /SNRB/i,
	/thora/i, /TLIF/i,

	/change battery/i, /DBS/i, /grid/i, /MVD/i, /cranioplasty/i,
	/untether/i, /VNS/i
]
var TRAUMARXNO = [
	/biopsy/i, /\bbx\b/i, /tumou?r/i,
	/TSP/i, /TSS/i, /transnasal/i, /transsphenoid/i, /transventric/i,

	/EDAS/i, /EDAMS/i, /excision.*AVM|AVM.*excision/i,

	/ETV/i, /OMMAYA/i,
	/(\bVP|\bLP|periton|subgaleal).*shunt/i,

	/ACDF/i, /ALIF/i,
	/lamin[eo]/i, /lumbar drain/i, /MIDLIF/i, /OLIF/i, 
	/PLF/i, /PLIF/i, /sacr[ao]/i, /SNRB/i,
	/thora/i, /TLIF/i,

	/change battery/i, /DBS/i, /grid/i, /MVD/i,
	/untether/i, /VNS/i
]
var SPINERXNO = [
	/crani[oe]/i, /\bETS\b/i,
	/TSP/i, /TSS/i, /transnasal/i, /transsphenoid/i, /transventric/i,

	/EDAS/i, /EDAMS/i,

	/ETV/i, /EVD/i, /OMMAYA/i,
	/(\bVP|\bLP|periton|subgaleal).*shunt/i,
	/lumbar drain/i,

	/change battery/i, /DBS/i, /grid/i, /MVD/i, /cranioplasty/i,
	/VNS/i
]
var ETCRXNO = [
	/tumou?r.*(biopsy|\bbx\b|remov)/i, /craniot.*tumou?r|clot remov/i,
	/TSP/i, /TSS/i, /transnasal/i, /transsphenoid/i, /transventric/i,

	/clip/i, /EDAS/i, /EDAMS/i, /excision.*AVM|AVM.*excision/i,

	/ETV/i, /OMMAYA/i,
	/(\bVP|\bLP|periton|subgaleal).*shunt/i,

	/ACDF/i, /ALIF/i, /^((?!mri|mri|mri|MRI?).)*[CTLS][\d]/,
	/lamin[eo]/i, /lumbar drain/i, /MIDLIF/i, /OLIF/i, 
	/PLF/i, /PLIF/i, /sacr[ao]/i, /SNRB/i,
	/thora/i, /TLIF/i
]

var	RADIOSURGERY = [
	/conformal radiotherapy/i, /CRT/i, /CyberKnife/i,
	/Gamma knife/i, /GKS/i, /Linac/i,
	/radiosurgery/i, /\bRS\b/i,
	/\bSRS\b/i, /\bSRT\b/i, /stereotactic radiotherapy/i,
	/Tomotherapy/i
]
var	ENDOVASCULAR = [
	/\bcoil/i, /emboli[zs]/i, /\bendovasc/i, /\bintervention/i,
	/\bstent/i, /\btransart/i, /\btransvenous/i
]

//====================================================================================================

var gv = {
	BOOK: [],
	CONSULT: [],
	SERVICE: [],
	SERVE: [],
	STAFF: [],
	user: "",
	timestamp: "",
	uploadWindow: null,
	timer: {},
	idleCounter: 0,
	mobile: false,
	isPACS: true,
	editableSV: true
}

if (/Android|webOS|iPhone|iPad|BlackBerry|IEMobile/i.test(navigator.userAgent)) {
	gv.mobile = true
	gv.isPACS = false
}