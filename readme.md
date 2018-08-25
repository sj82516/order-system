# 用戶預約系統  
## 專案描述
前端使用 Vue@2.5，後端使用 Express@4 並以 pm2 執行，資料庫採用 MongoDB@4 並以3個 instance 組成Replica set 執行。  
部署於AWS上，反向代理使用 Nginx。

## 實作功能
1. 用戶可於瀏覽器創建預約，並實作基本的驗證與錯誤處理，一個Email僅能預約一筆。  
前端Url : /
後端API：POST /api/order

2. 預約完成後可以透過ID查看預約狀態，目前ID為獨特的八碼 base64亂碼    
前端url : /order/:id  
後端API：GET /api/order/:id  

3. 後台可以查看全部的預約，並單筆更新預約狀態    
前端url : /admin  
後端API：  
GET /api/order  
PUT /api/order/:id  

4. 後台可以查看以日期統整的個別類型預約總數
前端url：/admin/status  
後端API：  
GET /api/order/dashboard/status

## 需求釐清   
部分需求有些比較細碎就沒有特別詢問，以下是整理列表
1. 預約時間是單指日期還是要精準到時間？目前是採用日期

## 方案套討
1. Daily Dump DB(尚未實作)：
查詢官網的有幾種備份做法
a. 使用 File System Snapshot 功能：先開啟MongoDB 日誌功能，直接做檔案系統的備份，缺點是必須作業系統有支援，且資料庫資料都必須在同一個邏輯裝置上  
b. 使用 cp / rsync：直接將MongoDB儲存的原始資料複製，但缺點是必須先停止 `mongod`寫入，避免備份到過期資料。  
c. 使用 mongodump：使用 Mongo 官方提供的 dump工具，在dump過程會先lock住，文件描述到僅適合小型系統。  
d. 使用 Mongo Cloud Manager：付費工具，為Mongo官方提供的雲端工具，可以協助備份 Replica Set。  

如果要實作的話會考慮採用方案Ａ，因為在AWS EBS可以支援快照功能；  
其餘方案會需要停機或是鎖住資料庫，會導致服務暫停，又或是需要付費。  
2. 記錄用戶來源國家：  
要得知用戶來源國家，除了前端加開欄位請用戶填寫外，可以透過 ip轉換地理位置，此處採用 "geoip-lite" 模組，其資料是透過 maxmind 的資料  
ip來源為 nginx 反向代理解析的用戶 network layer remote address($remote_addr)。

## 實作細節與待修正細節
1. 驗證  
目前於前後端皆有驗證輸入格式，後端採用 joi並定義 schema，宣告於專案目錄 `/app/helper/schema/order.js`  
ORM 採用 Mongoose，宣告於 `/app/model/order.js`，也有基本的驗證，Email與id生成方法皆於此處定義  
原本希望前後端可以共用驗證模組，但因為 commonjs / esm 模組混用導致 wepack 打包有點問題，為了不影響繳交時間所以先分開處理，前端改以 validator.js驗證 

2. 錯誤處理
目前錯誤處理與顯示統一用 `/app/helper/middleware/errorHandler.js`處理

3. 週期性任務   
專案要求 `rejected預約超過三小時則刪除`，因為會需要有邏輯判斷則使用 node.js 自行處理，定義於 `/app/script/cron.js`

1. 前端目前是以子專案形式嵌入在 `/app/static`，打包好的檔案會產出至 `/app/static/dist`下，直接由 Express 返回。

