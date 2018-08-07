const express = require('express');
const router = express.Router();
const superagent = require('superagent');
const cheerio = require('cheerio');

let firstNews= [];
let secondNews = [];
let getNews = [];
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
      getNews = firstNews.concat(secondNews);
      return getNews;
    }
  })

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send({
    getNews
  });
});


module.exports = router;