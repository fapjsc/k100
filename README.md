## .env

### 88U

REACT_APP_HOST_NAME=88U
REACT_APP_PROXY=www.88u.asia

### K100U

REACT_APP_HOST_NAME=K100U
REACT_APP_PROXY=demo.k100u.com

### DEMO

REACT_APP_HOST_NAME=K100U
REACT_APP_PROXY=www.k100u.com

## Package.json

### DEMO

"proxy": "https://demo.k100u.com"

### K100U

"proxy": "https://www.k100u.com"

### 88U

"proxy": "https://www.88u.asia"

## 影響範圍

REACT_APP_PROXY => websocket url
REACT_APP_HOST_NAME => ui 及部分邏輯
