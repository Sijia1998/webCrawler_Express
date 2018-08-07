const express = require('express');
const router = express.Router();
const superagent = require('superagent');
const cheerio = require('cheerio');

let hotNews = []; //热点新闻
let localNews = []; //本地新闻

let firstNews= [];
let secondNews = [];
let getNews = [];

let getHotNews = (res) => {
  let hotNews = [];
  // 访问成功，请求http://news.baidu.com/页面所返回的数据会包含在res.text中。
  //使用cheerio模块的cherrio.load()方法，将HTMLdocument作为参数传入函数
  let $ = cheerio.load(res.text);
  $('#pane-news ul li a').each((index, ele) => {
    // cherrio中 $('selector').each()用来遍历所有匹配到的DOM元素
    // 参数index是当前遍历的元素的索引，ele就是当前遍历的DOM元素
    let news = {
      title: $(ele).text(), //获取新闻标题
      href: $(ele).attr('href') //获取新闻网页链接
    }
    hotNews.push(news);
  })
  return hotNews;
}

//使用superagent.get()方法来访问百度新闻首页
superagent.get('http://news.baidu.com/')
  .end((err, res) => {
    if (err) {
      console.log(err.status);
      return false;
    } else if (res.status === 200) {
      // 访问成功，请求http://news.baidu.com/页面所返回的数据会包含在res
      // 抓取热点新闻数据
      hotNews = getHotNews(res);
    }
  })

  superagent.get('http://news.baidu.com/widget?id=LocalNews&loc=8206&ajax=json&t=1533633958636')
  .end((err, res) => {
    if (err) {
      console.log(err);
      return false;
    } else if(res.status === 200){
      let data = JSON.parse(res.text).data
      getNews = data.LocalNews.data.rows
      getNews.first.forEach((item) => {
        let itemObj = {
          title:item.title,
          url:item.url,
          imgUrl:item.imgUrl
        }
        firstNews.push(itemObj);
      });
      getNews.second.forEach((item)=>{
        let _item = {
          title:item.title,
          url:item.url,
          imgUrl:item.imgUrl
        };
        secondNews.push(_item);
      })
      localNews = firstNews.concat(secondNews);
      return localNews;
    }
  })

router.get('/', async (req, res, next) => {
  res.send({
    hotNews,
    localNews
  });
});

module.exports = router;