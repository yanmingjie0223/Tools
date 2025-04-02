var EXPORT_TYPES = ["pdf", "jpg", "png", "web-jpg", "web-png"];
var EXPORT_SUFFIXS = ["pdf", "jpg", "png", "jpg", "png"];

/**
 * 切图导出
 * @param {object} exportOptions 参数
 * @returns 
 */
function cutoutExport(exportOptions) {
	if (!app.documents || !app.documents.length) {
		alert('未发现打开的psd文件!');
		return;
	}

	var quality = exportOptions.quality;
	var outPath = exportOptions.outPath;
	var isAllPsd = exportOptions.isAllPsd;
	var aDocument = app.activeDocument;

	var docs = [];
	for (var k = 0; k < app.documents.length; k++) {
		docs.push(app.documents[k]);
	}

	var isEror = false;
	for (var k = 0; k < docs.length; k++) {
		var document = docs[k];
		if (document == aDocument || isAllPsd) {
			app.activeDocument = document;
			isEror = _dealExportLayers(document, outPath, quality);
			if (isEror) {
				_logVersion();
				break;
			}
		}
	}

	if (!isEror) {
		alert('导出成功!');
	}
}

function _dealExportLayers(document, outPath, quality) {
	var isEror = false;

	var ref = new ActionReference();
	ref.putProperty(charIDToTypeID('Prpr'), charIDToTypeID('NmbL'));
	ref.putIdentifier(charIDToTypeID('Dcmn'), document.id);
	var desc = executeActionGet(ref);
	var layerCount = desc.getInteger(charIDToTypeID('NmbL'));

	for (var i = 0; i < layerCount; i++) {
		try {
			var refLayer = new ActionReference();
			refLayer.putIndex(charIDToTypeID('Lyr '), i + 1);
			var layerDesc = executeActionGet(refLayer);
			var layerName = layerDesc.getString(charIDToTypeID('Nm  '));
			_dealExportLayer(document, layerName, outPath, quality);
		} catch (e) {
			isEror = true;
			break;
		}
	}

	return isEror;
}

function _dealExportLayer(document, layerName, outPath, quality) {
	var exportInfo = _getExportInfo(document, layerName, outPath, quality);
	if (exportInfo != null) {
		_exportTo(exportInfo);
	}
}

function _exportTo(exportInfo) {
	var isError = _selectLayer(exportInfo);
	if (isError) {
		_logVersion();
		return;
	}

	isError = _dupLayerNewDocument(exportInfo);
	if (isError) {
		_logVersion();
		return;
	}

	try {
		// 合并所有图层
		activeDocument.mergeVisibleLayers();
	} catch (error) {

	}
	// 裁剪透明区域
	activeDocument.trim(TrimType.TRANSPARENT, true, true, true, true);
	
	var width = activeDocument.width.as('px');
	var height = activeDocument.height.as('px');
	if (width == 0 || height == 0) {
		return;
	}
	// 调整为自定义size
	if (exportInfo.width > 0 || exportInfo.height > 0) {
		if (exportInfo.width > 0) {
			width = exportInfo.width;
		}
		if (exportInfo.height > 0) {
			height = exportInfo.height;
		}

		try {
			activeDocument.resizeCanvas(
				UnitValue(width, "px"),
				UnitValue(height, "px"),
				AnchorPosition.MIDDLECENTER
			);
		} catch (error) {
			return;
		}
	}

	utils.dealPathFolder(exportInfo.outPath);
	utils.exportFile(activeDocument, exportInfo);

	activeDocument.close(SaveOptions.DONOTSAVECHANGES);
}

/**
 * 选择图层或者组
 * @param {*} exportInfo 
 * @returns 
 */
function _selectLayer(exportInfo) {
	var isEror = false;

	var desc97 = new ActionDescriptor();
	var ref14 = new ActionReference();
	ref14.putName(charIDToTypeID("Lyr "), exportInfo.layerName);
	desc97.putReference(charIDToTypeID("null"), ref14);
	desc97.putBoolean(charIDToTypeID("MkVs"), false);

	try {
		app.executeAction(charIDToTypeID("slct"), desc97, DialogModes.NO);
	} catch (error) {
		isEror = true;
	}

	return isEror;
}

/**
 * 拉启图层到新建文档中进行操作导出
 * @param {*} exportInfo 
 * @returns 
 */
function _dupLayerNewDocument(exportInfo) {
	var isEror = false;

	var desc143 = new ActionDescriptor();

	var ref73 = new ActionReference();
	ref73.putClass(charIDToTypeID("Dcmn"));
	desc143.putReference(charIDToTypeID("null"), ref73);
	desc143.putString(charIDToTypeID("Nm  "), exportInfo.layerName);

	var ref74 = new ActionReference();
	ref74.putEnumerated(
		charIDToTypeID("Lyr "),
		charIDToTypeID("Ordn"),
		charIDToTypeID("Trgt")
	);
	desc143.putReference(charIDToTypeID("Usng"), ref74);

	try {
		app.executeAction(charIDToTypeID("Mk  "), desc143, DialogModes.NO);
	} catch (error) {
		isEror = true;
	}

	return isEror;
}

/**
 * 获取导出层信息
 * @param {*} document
 * @param {*} layer 
 * @param {string} outPath 
 * @param {number} globalQuality 
 * @returns {
* { 
* 		width: number;
* 		height: number;
* 		type: string;
* 		srcDocument: Document;
* 		layerName: string;
* 		outPath: string;
* 		name: string;
* 		filePath: string; 
* 		quality: number;
* }
* }
*/
function _getExportInfo(document, layerName, outPath, globalQuality) {
	var nameArr = layerName.split("@");
	var nameLen = nameArr.length;
	if (nameLen <= 1) {
		return null;
	}

	var docName = document.name;
	var info = {
		width: -1,
		height: -1,
		type: '',
		srcDocument: document,
		layerName: layerName,
		outPath: outPath + "/" + docName.replace(".psd", ""),
		name: nameArr[0],
		filePath: '',
		quality: globalQuality,
	};

	for (var i = 1; i < nameLen; i++) {
		var curName = nameArr[i];
		if (curName) {
			_dealType(curName, info);
			_dealSize(curName, info);
		}
	}
	_dealDefaultInfo(info);

	return info;
}

function _dealDefaultInfo(info) {
	if (info.type == "") {
		info.type = "web-png";
		_dealFilePath('png', info);
	}
}

function _dealType(nameSlice, info) {
	if (!info.type) {
		var nNameSlice = nameSlice.toLowerCase();
		for (var i = 0, len = EXPORT_TYPES.length; i < len; i++) {
			var type = EXPORT_TYPES[i];
			if (nNameSlice.indexOf(type) > -1) {
				info.type = type;
				_dealFilePath(EXPORT_SUFFIXS[i], info);
				break;
			}
		}
	}
}

function _dealFilePath(suffix, info) {
	info.filePath = info.outPath + "/" + info.name + "." + suffix;
}

function _dealSize(nameSlice, info) {
	if (info.width < 0 && info.height < 0) {
		var nNameSlice = nameSlice.toLowerCase();
		var sizeArr
		if (nNameSlice.indexOf("x") > -1) {
			sizeArr = nNameSlice.split("x");
		}
		else if (nNameSlice.indexOf("*") > -1) {
			sizeArr = nNameSlice.split("*");
		}
		else if (nNameSlice.indexOf("×") > -1) {
			sizeArr = nNameSlice.split("×");
		}
		if (sizeArr) {
			var widthStr = sizeArr[0];
			if (widthStr) {
				var width = parseInt(widthStr);
				if (width) {
					info.width = width;
				}
			}
			var heightStr = sizeArr[1];
			if (heightStr) {
				var height = parseInt(heightStr);
				if (height) {
					info.height = height;
				}
			}
		}
	}
}

function _logVersion() {
	alert('可能是ps版本兼容问题导致脚本无法选择图层进行导出操作, 请告知插件开发者!');
}
