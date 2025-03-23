try {
    // 载入所需对象，loadSuccess 记录是否成功载入
    var loadSuccess = new ExternalObject("lib:\PlugPlugExternalObject");
}
catch (e) {
}

if (!loadSuccess) {
    alert("内置对象无法载入 请关闭重启插件!");
}

app.displayDialogs = DialogModes.NO;