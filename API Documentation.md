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

  
