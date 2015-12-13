# safefood


### 使用技術
Backend: [Nodejs](https://nodejs.org/en/) + [Express](http://expressjs.com/en/guide/routing.html) + [nunjucks](https://mozilla.github.io/nunjucks/templating.html#variables)(html render)

Database: [Elasticsearch](https://www.elastic.co/)

Frontend: [Vue.js](http://cn.vuejs.org/guide/index.html) + [bootstrap](http://getbootstrap.com/)

另有使用 cron 模組, 實作 server 內 cronjob, 每天 1:00 定時備份

### 安裝

* 安裝 Nodejs
* 安裝 Elasticsearch
* 複製 ```git clone https://github.com/ffbli666/safefood.git```
* 安裝相依套件  ```npm install```
* 設定 config.js


### 啟動

開發執行

```node start.js```

server 背景執行

```nohup node start.js &```

### 更新 markdown 說明文件

有改 /docs/index.md 才需要

需安裝 gulp ```npm install gulp -g```

下指令 ```gulp```



### 檔案和資料夾說明

 * backup: 每日備份資料
 * bin: 放執行檔
 * controllers: 寫 controller 程式
 * develop: 跟開發有關的東西, 目前是放 postman 設定檔
 * docs: 放開發文件
 * log: 系統 log 產生的地方
 * models: 寫 model 程式
 * public: 靜態檔案, 像 css、image、zip 等
 * system: 系統核心
 * views: 寫 view 程式
 * router.js: 路由都在這
 * config.js: 設定檔


