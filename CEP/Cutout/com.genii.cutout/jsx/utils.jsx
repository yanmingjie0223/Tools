var utils = {};

utils.exportFile = function (type, fDocunment, filePath) {
	switch (type) {
		case "pdf": {
			var pdfSaveOptions = new PDFSaveOptions();
			pdfSaveOptions.embedColorProfile = true;
			pdfSaveOptions.optimizeForWeb = true;
			fDocunment.saveAs(new File(filePath), pdfSaveOptions, true);
			break;
		}
		case "jpg": {
			var jpgSaveOptions = new JPEGSaveOptions();
			jpgSaveOptions.embedColorProfile = true;
			jpgSaveOptions.formatOptions = FormatOptions.STANDARDBASELINE;
			jpgSaveOptions.matte = MatteType.NONE;
			jpgSaveOptions.quality = 1;
			fDocunment.saveAs(new File(filePath), jpgSaveOptions, true);
			break;
		}
		case "png": {
			var pngSaveOptions = new PNGSaveOptions();
			pngSaveOptions.interlaced = false;
			fDocunment.saveAs(new File(filePath), pngSaveOptions, true);
			break;
		}
		case "web_jpg": {
			var exportOptions = new ExportOptionsSaveForWeb();
			exportOptions.quality = 60;
			exportOptions.format = SaveDocumentType.JPEG;
			exportOptions.includeProfile = true;
			fDocunment.exportDocument(
				new File(filePath),
				ExportType.SAVEFORWEB,
				exportOptions
			);
			break;
		}
		case "web_png": {
			var exportOptions = new ExportOptionsSaveForWeb();
			exportOptions.format = SaveDocumentType.PNG;
			exportOptions.transparency = true;
			exportOptions.interlaced = false;
			exportOptions.quality = 60;
			exportOptions.embedColorProfile = false;
			exportOptions.formatOptions = FormatOptions.STANDARDBASELINE;
			exportOptions.matte = MatteType.NONE;
			fDocunment.exportDocument(
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

utils.filterLayerText = function(layers) {
	if (!layers) return;

	var layer;
	for (var i = 0, len = layers.length; i < len; i++) {
		layer = layers[i];
		if (layer.kind == LayerKind.TEXT) {
			layers[i].visible = false;
		}
    }
}

utils.filterText = function(docu) {
	var layers = docu.artLayers;
	var layerSets = docu.layerSets;
	utils.filterLayerText(layers);

	if (layerSets) {
		var layerSet;
		for (var i = 0; i< layerSets.length; i++) {
			layerSet = layerSets[i];
			utils.filterText(layerSet);
		}
	}
}