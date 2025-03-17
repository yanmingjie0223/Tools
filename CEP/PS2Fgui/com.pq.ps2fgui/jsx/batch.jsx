var batchDoc;
var isActionError;

function batchExport(path) {
	if (!app.documents || !app.documents.length) {
		return;
	}
	batchDoc = activeDocument;

	var name;
	var layers = batchDoc.artLayers;
	var layerSets = batchDoc.layerSets;

	for (var i = 0; i < layers.length; i++) {
		if (isExport(layers[i]) && !isActionError) {
			name = layers[i].name;
			exportPNG(name, path);
		}
    }

    for (var i = 0; i < layerSets.length; i++) {
		if (isExport(layerSets[i]) && !isActionError) {
			name = layerSets[i].name;
			exportPNG(name, path);
		}
	}

	if (isActionError) {
		alert('请选中需要导出的文档！');
	}
	else {
		alert('image导出成功！');
	}

	batchDoc = null;
	isActionError = null;
}

function exportPNG(name, path) {
	activeDocument.activeLayer = batchDoc.layers.getByName(name);

	dupLayers();
	if (isActionError) {
		return;
	}

	if (activeDocument.layers.length > 1) {
		activeDocument.mergeVisibleLayers();
	}
	activeDocument.trim(TrimType.TRANSPARENT, true, true, true, true);
	var filePath = path + "/" + name + ".png";
	const width = activeDocument.width.as('px');
	const height = activeDocument.height.as('px');
	if (width == 0 || height == 0) {
		return;
	}
	utils.exportFile('web_png', activeDocument, filePath);
	app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
}

function isExport(layer) {
	if (!layer.visible) {
		return false;
	}
	return true;
}

function dupLayers() {
	var desc143 = new ActionDescriptor();
	var ref73 = new ActionReference();
	ref73.putClass(charIDToTypeID("Dcmn"));
	desc143.putReference(charIDToTypeID("null"), ref73);
	desc143.putString(charIDToTypeID("Nm  "), activeDocument.activeLayer.name);
	var ref74 = new ActionReference();
	ref74.putEnumerated(
		charIDToTypeID("Lyr "),
		charIDToTypeID("Ordn"),
		charIDToTypeID("Trgt")
	);
	desc143.putReference(charIDToTypeID("Usng"), ref74);
	try {
		executeAction(charIDToTypeID("Mk  "), desc143, DialogModes.NO);
	} catch (error) {
		isActionError = true;
	}
}