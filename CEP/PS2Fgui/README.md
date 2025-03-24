# PQps2fgui
- ps 导出 fgui 文件

# nodejs 版本
- ^10.0.0

# 安装
- 将com.pq.ps2fgui文件拷贝到ps软件位置下面的CEP\extensions重
- 注：如果出现未签收无法加载拓展，需要在注册表中打开调试模式
    - 打开注册表 win+r输入regedit进入注册表
    - 找到HKEY_CURRENT_USER\Software\Adobe\CSXS.9（CSXS.9可能是CSXS.10或者其他版本）
    - 在csxs下新建字符值PlayerDebugMode并设置字段值为1
