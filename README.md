
### HOST NAME: ui及部分邏輯
REACT_APP_HOST_NAME=K100U
REACT_APP_HOST_NAME=88U
REACT_APP_HOST_NAME=JP88

### PROXY: websocket url 
REACT_APP_PROXY=www.88u.asia
REACT_APP_PROXY=www.k100u.com
REACT_APP_PROXY=demo.k100u.com







## build 前設定 websocket url 以及 ui
### .env
REACT_APP_HOST_NAME=88U
REACT_APP_PROXY=www.88u.asia

### package.json
proxy 


## 影響範圍
REACT_APP_PROXY => websocket url
REACT_APP_HOST_NAME => ui 及部分邏輯


HOST
1. 88U
2. K100U

PROXY
1. www.88u.asia
2. www.k100u.com
3. demo.k100u.com


### Package.json
"proxy": "https://demo.k100u.com"
"proxy": "https://www.k100u.com"
"proxy": "https://www.88u.asia"


### 88U
REACT_APP_HOST_NAME=88U
REACT_APP_PROXY=www.88u.asia

### K100U
REACT_APP_HOST_NAME=K100U
REACT_APP_PROXY=demo.k100u.com

### DEMO
REACT_APP_HOST_NAME=K100U
REACT_APP_PROXY=www.k100u.com