var utils = {};

/**
 * 导出
 * @param {*} document psd文档
 * @param { 
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
 * } } exportInfo 导出信息
 */
utils.exportFile = function (document, exportInfo) {
	var type = exportInfo.type;
	var filePath = exportInfo.filePath;
	var quality = exportInfo.quality;
	switch (type) {
		case "pdf": {
			var pdfSaveOptions = new PDFSaveOptions();
			pdfSaveOptions.embedColorProfile = true;
			pdfSaveOptions.optimizeForWeb = true;
			document.saveAs(new File(filePath), pdfSaveOptions, true);
			break;
		}
		case "jpg": {
			var jpgSaveOptions = new JPEGSaveOptions();
			jpgSaveOptions.embedColorProfile = true;
			jpgSaveOptions.formatOptions = FormatOptions.STANDARDBASELINE;
			jpgSaveOptions.matte = MatteType.NONE;
			jpgSaveOptions.quality = quality / 100;
			document.saveAs(new File(filePath), jpgSaveOptions, true);
			break;
		}
		case "png": {
			var pngSaveOptions = new PNGSaveOptions();
			pngSaveOptions.interlaced = false;
			document.saveAs(new File(filePath), pngSaveOptions, true);
			break;
		}
		case "web-jpg": {
			var exportOptions = new ExportOptionsSaveForWeb();
			exportOptions.quality = quality / 100;
			exportOptions.format = SaveDocumentType.JPEG;
			exportOptions.includeProfile = true;
			document.exportDocument(
				new File(filePath),
				ExportType.SAVEFORWEB,
				exportOptions
			);
			break;
		}
		case "web-png": {
			var exportOptions = new ExportOptionsSaveForWeb();
			exportOptions.format = SaveDocumentType.PNG;
			exportOptions.transparency = true;
			exportOptions.interlaced = false;
			exportOptions.quality = quality;
			exportOptions.embedColorProfile = false;
			exportOptions.formatOptions = FormatOptions.STANDARDBASELINE;
			exportOptions.matte = MatteType.NONE;
			document.exportDocument(
				new File(filePath),
				ExportType.SAVEFORWEB,
				exportOptions
			);
			break;
		}
		default: {
			alert("exportFile 中文件类型未定义：" + type);
			break;
		}
	}
}

/**
 * 递归创建路径上未存在的文件夹
 * @param {string} path 
 */
utils.dealPathFolder = function (path) {
	var pathArr = path.split("/");
	var len = pathArr.length;
	if (len > 1) {
		var curPath = pathArr[0];
		for (var i = 1; i < len; i++) {
			curPath += "/" + pathArr[i];
			var curPathFolder = new Folder(curPath);
			if (!curPathFolder.exists) {
				curPathFolder.create();
			}
		}
	}
}

/**
 * 发生事件
 * @param {string} type 
 * @param {string} data 
 */
utils.sendEvent = function (type, data) {
	var eventJAX = new CSXSEvent();
	eventJAX.type = type;
	eventJAX.data = data;
	eventJAX.dispatch();
}
