const model = require('./model')
const basicPah = 'https://www.mzitu.com/';
// let start = 1, end = 10;
let index = 3;
const main = async url => {
    const data = await model.getPage(url)
    let list = model.getUrl(data)
    // console.log(list)
    downLoadImages(list, 0)
}
//  list 爬取的数组

const downLoadImages = async (list, index) => {
    if (index == list.length) {
        console.log('爬取完成')
        return false
    }
    if (model.getTitle(list[index])) {
        let item = await model.getPage(list[index].url);
        let imageNum = model.getImageNum(item.res.data)
        for (var i = 1; i < imageNum; i++) {
            let page = await model.getPage(list[index].url + `/${i}`);//遍历获取这组图片每一张所在的网页
            await model.downloadImgae(page, i, list[index].url + `/${i}`)
        }
        index++;
        downLoadImages(list,index)
    }else{
        index++;
        downLoadImages(list,index)
    }
}

main(basicPah)