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
			isEror = dealExportLayers(document, outPath, quality);
			if (isEror) {
				logVersion();
				break;
			}
		}
	}

	if (!isEror) {
		alert('image导出成功!');
	}
}

function dealExportLayers(document, outPath, quality) {
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

			// var isGroup = false;
			// var layerSectionKey = stringIDToTypeID('layerSection');
			// if (layerDesc.hasKey(layerSectionKey)) {
			// 	var sectionValue = layerDesc.getEnumerationValue(layerSectionKey);
			// 	if (typeIDToStringID(sectionValue) === 'layerSectionEnd') {
			// 		isGroup = true;
			// 	}
			// }
			// else if (!isGroup) {
			// 	if (layerDesc.hasKey(charIDToTypeID('LyGr'))) {
			// 		isGroup = true;
			// 	}
			// }

			var layerName = layerDesc.getString(charIDToTypeID('Nm  '));
			dealExportArtLayer(document, layerName, outPath, quality);
		} catch (e) {
			isEror = true;
			break;
		}
	}

	return isEror;
}

function dealExportArtLayer(document, layerName, outPath, quality) {
	var exportInfo = getExportInfo(document, layerName, outPath, quality);
	if (exportInfo != null) {
		exportPNG(exportInfo);
	}
}

/**
 * dom api太慢使用action manager方式获取信息
 * @deprecated
 * @param {*} document 
 * @param {*} layerSet 
 * @param {*} outPath 
 * @param {*} quality 
 */
function dealExportLayerSet(document, layerSet, outPath, quality) {
	// 广度优先迭代来优化递归深度
	var lSets = [layerSet];
	while (lSets.length > 0) {
		var curSet = lSets.pop();
		dealExportArtLayer(document, curSet, outPath, quality);

		var layers = curSet.artLayers;
		for (var i = 0, len = layers.length; i < len; i++) {
			dealExportArtLayer(document, layers[i].name, outPath, quality);
		}

		var childSets = curSet.layerSets;
		if (childSets) {
			for (var i = 0, len = childSets.length; i < len; i++) {
				var childSet = childSets[i];
				if (childSet.visible) {
					lSets.push(childSets[i]);
				}
			}
		}
	}
}

function exportPNG(exportInfo) {
	var isError = selectLayer(exportInfo);
	if (isError) {
		logVersion();
		return;
	}

	isError = dupLayer(exportInfo);
	if (isError) {
		logVersion();
		return;
	}

	// 合并所有图层
	if (activeDocument.layers.length > 1) {
		activeDocument.mergeVisibleLayers();
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
		var isChange = false;
		if (exportInfo.width > 0) {
			width = exportInfo.width;
			isChange = true;
		}
		if (exportInfo.height) {
			height = exportInfo.height;
			isChange = true;
		}

		if (isChange) {
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
	}

	utils.dealPathFolder(exportInfo.outPath);
	utils.exportFile(activeDocument, exportInfo);

	activeDocument.close(SaveOptions.DONOTSAVECHANGES);
}

/**
 * 获取导出层信息
 * @param {*} document
 * @param {*} layer 
 * @param {string} outPath 
 * @param {number} globalQuality 
 * @returns 
 */
function getExportInfo(document, layerName, outPath, globalQuality) {
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
		outPath: outPath + "/" + docName.replace(".psd", ""),
		srcDocument: document,
		layerName: layerName,
		name: nameArr[0],
		filePath: '',
		quality: globalQuality,
	};

	for (var i = 1; i < nameLen; i++) {
		var curName = nameArr[i];
		if (curName) {
			dealType(curName, info);
			dealSize(curName, info);
		}
	}
	dealDefaultInfo(info);

	return info;
}

/**
 * 选择图层或者组
 * @param {*} exportInfo 
 * @returns 
 */
function selectLayer(exportInfo) {
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
function dupLayer(exportInfo) {
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
 * 判断图层或者组是否导出，如果是隐藏状态不导出
 * @param {*} layer 
 * @returns 
 */
function isExport(layer) {
	if (!layer.visible) {
		return false;
	}
	return true;
}

function logVersion() {
	alert('可能是ps版本兼容问题导致脚本无法选择图层进行导出操作, 请告知插件开发者!');
}

function dealDefaultInfo(info) {
	if (info.type == "") {
		info.type = "web-png";
		dealFilePath('png', info);
	}
}

function dealType(nameSlice, info) {
	if (!info.type) {
		var nNameSlice = nameSlice.toLowerCase();
		var types = ["pdf", "jpg", "png", "web-jpg", "web-png"];
		var suffixs = ["pdf", "jpg", "png", "jpg", "png"];
		for (var i = 0, len = types.length; i < len; i++) {
			var type = types[i];
			if (nNameSlice.indexOf(type) > -1) {
				info.type = type;
				dealFilePath(suffixs[i], info);
				break;
			}
		}
	}
}

function dealFilePath(suffix, info) {
	info.filePath = info.outPath + "/" + info.name + "." + suffix;
}

function dealSize(nameSlice, info) {
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
