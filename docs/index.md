---
title: API 說明
layout: ./views/templates/markdown.html
engine: nunjucks
---

## API 說明 :
#### 取得食物資訊 :
##### **URL:**  `/api/food/:id`
##### **Method:** `get`
##### **Description:**

取得食物的詳細資訊

##### **Query Parameters:**
| name | type | description |
| -------- | ------ | -----------------|
| id | string | 食品 ID |


##### **Query Example:**  `/api/food/AVGQwi6wNuRbmFRpYEAk`
##### **Results:**

```
{
    "status": 200,
    "msg": "ok",
    "result": {
        "id": "AVGQwi6wNuRbmFRpYEAk",
        "name": "食物啦",
        "company": "黑店",
        "barcode": "1234567890123",
        "description": "是黑心原料",
        "image": "/upload/AVGQwi6wNuRbmFRpYEAk.png",
        "hyperlinks": [
            {
                "url":"http://tw.yahoo.com",
                "title":"yahoo 新聞標題",
                "brief":" xxxx 食安"
            },
            {
                "url":"http://tw.yahoo.com",
                "title":"yahoo 新聞標題",
                "brief":" xxxx 食安"
            }
        ],
        "create_time": "2015-12-11 19:17:03",
        "update_time": "2015-12-11 20:21:56"
    }
}
```

#### 關鍵字搜尋 :
##### **URL:**  `/api/food`
##### **Method:** `get`
##### **Description:**

關鍵字取得食物清單資料

##### **Query Parameters:**
| name | type | description |
| -------- | ------ | -----------------|
| q | string | 查食品名稱or公司名稱or條碼, 空值是取得最新資料|
| from | string | 分頁用, 第幾筆開始 |
| size | number | 分頁用, 顯示幾筆 |

##### **Query Example:**  `/api/food?q=測試&from=0&size=10`
##### **Result Parameters:**
| name | type | description |
| -------- | ------ | -----------------|
| list | array | 食物資料清單 |
| total | number | 分頁用, 此條件總共幾筆 |
##### **Results:**

```
{
    "status": 200,
    "msg": "ok",
    "result": {
        "total": 2,
        "list": [
            {
                "id": "AVGQwi6wNuRbmFRpYEAk",
                "name": "食物啦",
                "company": "黑店",
                "barcode": "1234567890123",
                "description": "是黑心原料",
                "image": "/upload/AVGQwi6wNuRbmFRpYEAk.png",
                "hyperlinks": [
                    {
                        "url":"http://tw.yahoo.com",
                        "title":"yahoo 新聞標題",
                        "brief":" xxxx 食安"
                    },
                    {
                        "url":"http://tw.yahoo.com",
                        "title":"yahoo 新聞標題",
                        "brief":" xxxx 食安"
                    }
                ],
                "create_time": "2015-12-11 19:17:03",
                "update_time": "2015-12-11 20:21:56"
            }
        ]
    }
}
```

#### 新增食物資料 :
##### **URL:**  `/api/food/`
##### **Method:** `post`
##### **Content-Type:** `application/json; charset=utf-8`
##### **Description:**

新增食物資料,新增成功後會返回完整食物資料

##### **Query Parameters:**
| name | type | description |
| -------- | ------ | -----------------|
| name | string | 食品名稱 |
| company | string | 公司or集團名稱 |
| barcode | string | 條碼 |
| description | string | 說明原因 |
| image| base64 | 食品照片|
|hyperlinks| array| 新聞連結清單

hyperlink

| name | type | description |
| -------- | ------ | -----------------|
| title | string | 內容標題 |
| url | string | 網站網址 |
| brief | string | 內容簡介 |

##### **Query Example:**
```
{
  "name": "食物啦",
  "company":"黑店",
  "barcode":"1234567890123",
  "description":"是黑心原料",
  "hyperlinks":[
    {
      "url":"http://tw.yahoo.com",
      "title":"yahoo 新聞標題",
      "brief":" xxxx 食安"
    }
  ]
}
```
##### **Results:**

```
{
    "status": 200,
    "msg": "ok",
    "result": {
        "id": "AVGRJt-wNuRbmFRpYEAt",
        "name": "食物啦",
        "company": "黑店",
        "barcode": "1234567890123",
        "description": "是黑心原料",
        "hyperlinks": [
            {
                "title": "yahoo 新聞標題",
                "brief": "xxxx 食安",
                "url": "http://tw.yahoo.com"
            }
        ],
        "create_time": "2015-12-11 21:07:02",
        "update_time": "2015-12-11 21:07:02"
    }
}
```

#### 更新食物資料 :
##### **URL:**  `/api/food/:id`
##### **Method:** `post`
##### **Content-Type:** `application/json; charset=utf-8`
##### **Description:**

更新食物資料,更新成功後會返回完整食物資料

##### **Query Parameters:**
| name | type | description |
| -------- | ------ | -----------------|
| name | string | 食品名稱 |
| company | string | 公司or集團名稱 |
| barcode | string | 條碼 |
| description | string | 說明原因 |
| image| base64 | 食品照片|
|hyperlinks| array| 新聞連結清單

hyperlink

| name | type | description |
| -------- | ------ | -----------------|
| title | string | 內容標題 |
| url | string | 網站網址 |
| brief | string | 內容簡介 |

##### **Query Example:**
`/api/food/AVGQwi6wNuRbmFRpYEAk`
```
{
  "name": "食物啦123",
  "company":"黑店123",
  "barcode":"1234567890123",
  "description":"是黑心原料123",
  "hyperlinks":[
    {
      "url":"http://tw.yahoo.com",
      "title":"yahoo 新聞標題123",
      "brief":" xxxx 食安123"
    }
  ]
}
```
##### **Results:**

```
{
    "status": 200,
    "msg": "ok",
    "result": {
        "id": "AVGRJt-wNuRbmFRpYEAt",
        "name": "食物啦123",
        "company": "黑店123",
        "barcode": "1234567890123",
        "description": "是黑心原料123",
        "hyperlinks": [
            {
                "title": "yahoo 新聞標題123",
                "brief": "xxxx 食安",
                "url": "http://tw.yahoo.com"
            }
        ],
        "create_time": "2015-12-11 21:07:02",
        "update_time": "2015-12-11 21:07:02"
    }
}
```