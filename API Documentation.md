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
      firstName: "..",
      lastName: "..",
      email: "..",
      age: 123,
      nationality: "..",
      sex: ".."
  }
  ```

- Response:

  ```json
  {
      status: true/false
      token: "..."
      details: "..."
  }
  ```



## Log-in Page

### Exsiting user log in

- Route: `/log-in`

- Request: `POST`

- Param:

  ```json
  {
      email: "..",
  }
  ```

- Response:

  ```json
  {
      status: true/false
      token: "..."
      details: "..."
  }
  ```

