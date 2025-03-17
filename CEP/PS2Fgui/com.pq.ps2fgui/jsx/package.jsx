var layersData;

function packageExport(path, imagePath) {
    var docu = app.activeDocument;

    layersData = {};
    layersData.layers = {};
    layersData.document = {
        name: docu.fullName,
        bounds: [0, 0, docu.width.as('px'), docu.height.as('px')],
        visible: true,
        kind: 'document'
    };
    layersData.path = path;
    batchExport(imagePath);

    dealSet(layersData.layers, docu);
    sendEvent();

    layersData = null;
}

function dealSet(setJson, layerSet) {
    var layers = layerSet.artLayers;
    if (layers) {
        var name;
        for (var i = 0; i < layers.length; i++) {
            name = layers[i].name;
		    setJson[name] = addParam(layers[i]);
        }
    }

    var layerSets = layerSet.layerSets;
    if (layerSets) {
        var name;
        for (var i = 0; i < layerSets.length; i++) {
            name = layerSets[i].name;
            setJson[name] = {};
            setJson[name]['layers'] = {};
            dealSet(setJson[name]['layers'], layerSets[i]);
        }
    }
}

/**
 * 添加属性构建数据，给js使用
 * @param layer
 */
function addParam(layer) {
    if (!layer) {
        return;
    }

    var param = {};
    if (layer.kind == LayerKind.TEXT) {
        param.kind = 'text';
    }
    else {
        param.kind = 'image';
    }

    var bounds = layer.bounds;
    var left = bounds[0].as("px");
    var top = bounds[1].as("px");
    var right = bounds[2].as("px");
    var down = bounds[3].as("px");

    param.name = layer.name;
    param.bounds = [left, top, right, down];
    param.visible = layer.visible;

    return param;
}

function sendEvent() {
    try {
        //载入所需对象，loadSuccess 记录是否成功载入
        var loadSuccess = new ExternalObject("lib:\PlugPlugExternalObject");
    } catch (e) {
        alert("ExternalObject 构建失败 extendscript 无法发送事件！"); // 如果载入失败，输出错误信息
    }

    if (loadSuccess) {
        var eventJAX = new CSXSEvent(); //创建事件对象
        eventJAX.type = "psd_layer_data"; //设定一个类型名称
        eventJAX.data = JSON.stringify(layersData); // 事件要传递的信息
        eventJAX.dispatch(); // GO ! 发送事件
    }
}