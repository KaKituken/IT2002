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
          "location": "", 	//  string
          "price": 0, 		// number
          "size": 0, 			// number
          "startDate": "",	// Date
          "endDate": "",		// Date
          "MaxBid": "",		// number
          "description": "",	// string
          "typeOfHouse": "",  //string
          "age": 1233,
          "minPrice": 123,
          "images": [
          "url1",
          "url2"
      ],					// Array<string>
  },
      "token": ""				// string
  }

- Response:

  ```json
  {
      "status": true/false,
      "details": "...",
  }

## Display Page

### Get house info list

- Route: `/house-list`

- Request: `GET`

- Response:

  ```json
  {
      "status": true/false,
      "houseInfoList": [
          {
              "houseid": "", 		// string, housing
              "providerName": "", // string, to select
              "location": "", 	// string, housing
              "minPrice": 0, 		// number, housing
              "size": 0, 			// number, housing
              "sizeType": "", 	// number, to select
              "startDate": "",	// Date, housing
              "endDate": "",		// Date, housing
              "currentBid": "",	// number, to select
              "description": "",	// string, housing
              "type": "",			// string
              "images": [
                  "url1",
                  "url2"
              ],					// Array<string>, not in  db
          },
          // ...
      ],
      "details": "..."
  }
  ```

### Make Bid

- Route: `/make-bid`
- Request: `POST`
- Param:
  ```json
    {
      "houseInfo":{
        "houseid": "", //string
        "location": "", //string
        "description": "", //string
      }
    	"token": ""				// string
    }
- Response:

  ```json
  {
    "status": true/false,
    "houseInfo": {
        
    },
    "details": "...",
    "currentBid": "",	// 
}

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
        "location": "", 	// string
        "startDate": "",	// Date
        "endDate": "",		// Date
        "maxbid": "", 		// number
        "bidding period": 0,// number
        "description": "",	// string
        "images": [
                  "url1",
                  "url2"
                  "url3"
                  "url4"
              ]
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

 ### Filter for houses

 - Route: `/filter-for-houses`
 - Request: `GET`
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
        "location": "", 	// string
        "type": "", 		// string
        "size": "", 		// string
        "maxprice": 0, 		// number
        "startdate": "", 	// date
        "enddate": "" 		// date
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
    "tableNameList": ["tableName1"]
}
```

- Response:

```json
{
    "status": true/false,
    "tableAttributes":[
        {
           "name": "tableName1",
           "attribute":[
               {
                    "attributeName": "att1",
                    "type": "TEXT",
                    "count": [
                        {"value1": 9},
                        {"value2": 20},
                    ],
               },
               {
                    "attributeName": "att2",
                    "type": "TEXT",
                    "count": [
                        {"value1": 9},
                        {"value2": 20},
                    ],
               }
            ], 
        },
        {
            "name": "tableName2",
            "attribute":[
               {
                    "attributeName": "att1",
                    "type": "TEXT",
                    "count": [
                        {"value1": 9},
                        {"value2": 20},
                    ],
               },
               {
                    "attributeName": "att2",
                    "type": "NUMERIC",
                    "count": [
                        {"minValue": 9},
                        {"maxValue": 20},	// pay attention to the order
                    ],
               }
            ], 
            }
        }
    ],
	"details": "...",
}
```

### Complex query

- Router: `admin/complex-query`
- Request: `POST`
- Param:

```json
{
    "fromTable": ["table1", "table2", "..."],
    "joinOn":[
        {
            "table1": "att1",
            "table2": "att2",
        },
        {
            "table2": "att3",
            "table3": "att1"
        }
    ],
    "filterEqual": {
        "table1": [
            {"att1": "value1"},
            {"att1": "value3"},
            {"att2": "value2"}
        ],
        "table2": [
            {"att1": "value1"},
            {"att2": "value2"}
        ],
    },
    "filterLess": {
        "table1": {
            "att1": "value1",
            "att2": "value2"
        },
        "table2": {
            "att1": "value1",
            "att2": "value2"
        },
    }
}
```

- Response

```json
{
    "status": true,
    "tableData": {
      "columns": ["a","b","c"],
      "rows": [
          {"a":1,"b":2,"c":3},
          {"a":4,"b":5,"c":6}
      ]
    },
    "details": "..."
}
```

### Delete entry

- Router: `admin/delete`
- Request: `POST`
- Param:

```json
{
    "entryInfo":{
        "att1": "value1",
        "att2": "value2",
        ...
    }
}
```

- Response:

```json
{
    "status": true,
    "details": "..."
}
```

### Update entry

- Router: `admin/update`
- Request: `POST`
- Param:

```json
{
    "orgRow":{
        "att1": "value1",
        "att2": "value2",
        ...
    },
    "newRow":{
        "att1": "value1",
        "att2": "value2",
        ...
    }
}
```

- Response:

```json
{
    "status": true,
    "details": "..."
}
```
