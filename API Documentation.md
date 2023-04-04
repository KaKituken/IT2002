# API Documentation

## Welcome Page

No api request.

## Sign-in Page

### New user sign in

- Route: `/sign-in`

- Request: `POST`

- Param:

  ```json
  {
      "firstName": "..",
      "lastName": "..",
      "email": "..",
      "age": 123,
      "nationality": "..",
      "sex": "..",
      "password": "..",
      "type": "renter/provider"
  }
  ```

- Response:

  ```json
  {
      "status": true/false,
      "details": "..."
  }
  ```



## Log-in Page

### Exsiting user log in

- Route: `/log-in`

- Request: `POST`

- Param:

  ```json
  {
      "email": "..",
      "password": ".."
  }
  ```

- Response:

  ```json
  {
      "status": true/false,
      "token": "...",
      "details": "...",
  }
  ```

## Provider Page

### Upload house info

- Route: `/provide-house`

- Request: `POST`

- Param:

  ```json
  {
      "houseInfo":{
          "name": "", 		// string
          "location": "", 	//  string
          "price": 0, 		// number
          "size": 0, 			// number
          "rooms": 0, 		// number
          "startDate": "",	// Date
          "endDate": "",		// Date
          "currentBid": "",	// number
          "description": "",	// string
          "images": [
              "url1",
              "url2"
          ],					// Array<string>
      },
      "token": ""				// string
  }
  
  ```

- Response:

  ```json
  {
      "status": true/false,
      "details": "...",
  }
  ```

## Display Page

### Get house info list

- Route: `/house-list`

- Request: `GET`

- Param: 

- Response:

  ```json
  {
      "status": true/false,
      "houseInfoList": [
          {
              "houseid": "", //string
              "name": "", 		// string
              "location": "", 	//  string
              "price": 0, 		// number
              "size": 0, 			// number
              "rooms": 0, 		// number
              "startDate": "",	// Date
              "endDate": "",		// Date
              "currentBid": "",	// number
              "description": "",	// string
              "images": [
                  "url1",
                  "url2"
              ],					// Array<string>
          },
          // ...
      ]
  }
  ```
### Make Bid

- Route: '/make-bid'
- Request: 'POST'
- Param:
  ```json
    {
      "houseInfo":{
        "houseid": "", //string
    "token": ""				// string
    }
- Response:
  ```json
  {
    "status": true/false,
    "details": "...",
    "currentBid": "",	// 
  }
  
  ```
 ### Bid for rental provider
 - Route: '/bid-for-rental-provider'
 - Request: 'POST'
 - Param:
  ```json
    {
      "houseInfo":{
        "asking price": 0, //string
        "location": "", 	//  string
        "type": "", 		// string
        "size": 0, 			// number
        "rooms": 0, 		// number
        "location": "" //string
        "startDate": "",	// Date
        "endDate": "",		// Date
        "maxbid": "", //number
        "bidding period": 0, //number
        "description": "",	// string
        "images": [
                  "url1",
                  "url2"
                  "url3"
                  "url4"
              ]
       } 
    "token": ""				// string
    }
- Response:
  ```json
  {
    "status": true/false,
    "details": "...",
  }

  ```

 ### Filter for houses
 - Route: '/filter-for-houses'
 - Request: 'GET'
 - Param:
  ```json
    {
    "token": ""				// string
    }
- Response:
  {
    "status": true/false,
    "details": "...",
    "typeofhousing":{}
  }
  ```

- Request: 'POST'
- Param: 
 ```json
    {
      "houseinfo": {
        "location": "" //string
        "type": "" //string
        "size": "" //string
        "maxprice": 0 //number
        "rooms": 0 //number
        "startdate": "" //date
        "enddate": "" //date
      }
    "token": ""				// string
    }
- Response:
  {
    "status": true/false,
    "details": "...",
  }
 ```

## Admin

### Get all tables name

- Route: `/admin/table-name`
- Request: `GET`
- Param:
- Response:

```json
{
    "status": true/false,
    "tableNameList": [],
    "details": "..."
}
```

### Get all attributes

- Router: `admin/attributes`
- Request: `POST`
- Param:

```json
{
    "tableNameList": []
}
```

- Response:

```json
{
    "status": true/false,
    "tableAttributes":[
        "tableName1":[
            "att1": {
                "type": "TEXT/INT/NUM",
        		"count": "if can"
            },
			"att2": {
                "type": "TEXT/INT/NUM",
        		"count": "if can"
            }
        ],
        "tableName2":[
            "att1": {
                "type": "TEXT/INT/NUM",
        		"count": "if can"
            },
			"att2": {
                "type": "TEXT/INT/NUM",
        		"count": "if can"
            }
        ],
    ],
	"details": "...",
}
```







