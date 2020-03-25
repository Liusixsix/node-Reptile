const axios = require('axios')

const fs = require('fs')
const cheerio = require('cheerio')
let downloadPath;
module.exports = {
    async getPage(url) {
        const data = { url, res: await axios(url) }
        return data
    },
    getUrl(data) {
        let list = []
        // console.log(data.res.data)
        const $ = cheerio.load(data.res.data);
        $(' #pins li a').children().each(async (i, e) => {
            //  console.log(e)
            let obj = {
                name: e.attribs.alt,
                url: e.parent.attribs.href
            }

            list.push(obj)
        })
        return list
    },
    getImageNum(res, name) {
        let $ = cheerio.load(res);
        // console.log(res)
        let len = $('.pagenavi').find('a').find('span').length;
        if (len == 0) {
            return false
        }
        let pageIndex = $('.pagenavi').find('a').find('span')[len - 2].children[0].data
        console.log(pageIndex)
        return pageIndex
    },
    getTitle(obj) {
        downloadPath = __dirname + '/' + obj.name;
        if (!fs.existsSync(downloadPath)) {
            fs.mkdirSync(downloadPath)
            console.log(`${obj.name}文件夹创建成功`)
            return true
        } else {
            console.log(`${obj.name}文件夹已经存在`)
            return false
        }
    },
    async downloadImgae(data, index, ref) {
        // console.log(data)
        if (data) {
            var $ = cheerio.load(data.res.data);
            if ($(".main-image").find("img")[0]) {
                let imgSrc = $(".main-image").find("img")[0].attribs.src;//图片地址
                let headers = {
                    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                    "Accept-Encoding": "gzip, deflate",
                    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
                    "Cache-Control": "no-cache",
                    // Host: "i.meizitu.net",
                    Pragma: "no-cache",
                    "Proxy-Connection": "keep-alive",
                    Referer: ref,
                    "Upgrade-Insecure-Requests": 1,
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.19 Safari/537.36"
                };//反防盗链
                //   console.log(imgSrc)
                await axios({
                    method: 'get',
                    url: imgSrc,
                    headers,
                    resolveWithFullResponse: true,
                    responseType: 'stream'
                }).then((response) => {
                    //   console.log(`${downloadPath}/${index}.jpg`)
                    response.data.pipe(fs.createWriteStream(`${downloadPath}/${index}.jpg`))
                    console.log('下载成功')
                })

            }
        }
    }

}