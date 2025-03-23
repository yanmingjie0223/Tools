# Cutout
- 一键切图插件

# nodejs 版本
- ^10.0.0

# 安装
- com.genii.cutout文件拷贝到ps软件位置下面的CEP\extensions中
- 注：如果出现未签收无法加载拓展，需要在注册表中打开调试模式
    - 打开注册表 win+r输入regedit进入注册表
    - 找到HKEY_CURRENT_USER\Software\Adobe\CSXS.9（CSXS.9可能是CSXS.10或者其他版本）
    - 在csxs下新建字符值为PlayerDebugMode的字段并设置值为1

# 使用规则
- 默认导出png并裁剪透明区域
    - 图层1 -> 图层1@
- 自定义规则
    - 限制导出大小: 图层1 -> 图层1@100x200
    - 限制导出类型: 图层1 -> 图层1@jpg
    - 限制导出大小和类型: 图层1 -> 图层1@100x200@jpg
