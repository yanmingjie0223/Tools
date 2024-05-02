exports.AppConfig = {
    // https://tieba.baidu.com/f/search/res?isnew=1&kw=使命召唤手游&qw=匹配&rn=10&un=&only_thread=0&sm=1&sd=&ed=&pn=4
    /**根路径 */
    root: 'https://tieba.baidu.com/f/search/res?isnew=1',
    /**贴吧名字 */
    tiebaName: "使命召唤手游",
    /**导出目录 */
    outDir: './dist',
    /**导出文件 */
    outFileName: '使命召唤贴吧数据总结.xlsx',
    /**页爬取间隔（ms） */
    pageLoadInterval: 1000,
    /**最多获取多少页 */
    maxPage: 100,
    /**搜索匹配字符 */
    searchs: [
        '匹配',
        '排位',
        '生存',
        '吃鸡'
    ]
}