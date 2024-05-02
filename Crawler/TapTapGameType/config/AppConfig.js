exports.AppConfig = {
    /**
     * https://www.taptap.com/webapiv2/app-search/v1/by-keyword?from=0&kw=修仙&limit=10&X-UA=V%3D1%26PN%3DWebApp%26LANG%3Dzh_CN%26VN_CODE%3D3%26VN%3D0.1.0%26LOC%3DCN%26PLT%3DPC%26DS%3DAndroid%26UID%3D16761e2c-b16b-4542-a10e-716e11d6f6f0%26DT%3DPC
     * 上面是请求链接，关于请求数据参数可通过这个链接查看
     */

    /**根路径 */
    root: 'https://www.taptap.com/webapiv2/app-search/v1/by-keyword',
    /**xua访问透带参数，初步估计可能类似token需要更换 */
    rootXUA: 'X-UA=V%3D1%26PN%3DWebApp%26LANG%3Dzh_CN%26VN_CODE%3D3%26VN%3D0.1.0%26LOC%3DCN%26PLT%3DPC%26DS%3DAndroid%26UID%3D16761e2c-b16b-4542-a10e-716e11d6f6f0%26DT%3DPC',
    /**导出目录 */
    outDir: './dist',
    /**导出文件 */
    outFileName: 'taptap游戏数据_2021_03_28.xlsx',
    /**最多获取多少页 */
    maxCount: 200,
    /**搜索匹配字符 */
    searchs: [
        '修仙',
        '模拟经营'
    ]
}