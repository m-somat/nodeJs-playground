# About

RESTful API for online shopping applications. My API allows users to read/write/delete/update products and read/write/delete orders.

## Middlewares:

I used [Express](https://expressjs.com/en/guide/using-middleware.html) web framework for routing, calling and controlling middlewares

* [Morgan](http://expressjs.com/en/resources/middleware/morgan.html)
* [body-parser](https://www.npmjs.com/package/body-parser)
* [mongoose](https://mongoosejs.com/docs/middleware.html)
* [multer](http://expressjs.com/en/resources/middleware/multer.html)

## used HTTP response status codes:
* 200: **(Accessed)** The request has succeeded
* 201: **(Created)** the request has succeeded and has led to the creation of a resource
* 404: **(Not found)** the requested resource is valid but the server can't find it
* 500: **(Wrong resource)** the server encountered an unexpected condition
* 401: **(Unauthorized)** the request lacks valid authentication credentials for the target resource
* 409: **(Conflict)** a request conflict with current state of the target resource

# Installation

Clone my repository

```
git clone https://github.com/m-somat/nodeJs-playground.git
```

Install the dependencies in package.json file

```
npm install
```

add a file nodemon.json in the main folder including your MongoDB Atlas cluster properties

```json
{
    "env": {
        "MONGO_ATLAS_user": "your ATLAS project username",
        "MONGO_ATLAS_PW": "your ATLAS project password",
        "MONGO_ATLAS_cluster": "clustername.id",
        "JWT_KEY": "your private JWT key"
    }
}
```

To get your `clustername.id`:
1. Create a cluster following [these steps](https://docs.atlas.mongodb.com/tutorial/create-new-cluster/).
2. Make sure your cluster is accessible from anywhere or at least for your current IP Address. Follow [these steps](https://docs.atlas.mongodb.com/security/ip-access-list/#add-ip-access-list-entries).
3. Use the **Connect** button on your cluster.
4. The given code will look like this:
```
mongodb+srv://<username>:<password>@<clustername.id>.mongodb.net/<databaseName>?retryWrites=true&w=majority
```
5. Copy your `clustername.id`.
6. Edit nodemon.json with your username, password and cluster

Notes:
* I ignored "nodemon.json" file as it contains my database security keys but you have to add this file for the API to function
* I ignored an "uploads/" folder for convenience as it contains user's form-data but it will be created automatically once the user uploads a file

# Features

## :fire: New
I added user authentication features to set different roles dynamically. The table below shows whether a resource is static (public) or dynamic (user-based).


## API Resources
| Request | Route | Security | Response | Description |
| :---: | :---: | :---: | :---: | --------------- |
| `POST` | /products | user | `201` | write new product:<br>`"name": String` **(Required)** product's name.<br>`"price": Number` **(Required)** product's price.<br>`"productImg": File` **(Optional)** product's image.<br>File options:<br>&nbsp;&nbsp;&nbsp;&nbsp;**Support**: JPG, JPEG, PNG<br>&nbsp;&nbsp;&nbsp;&nbsp;**Size Limit**: 5MB |
| `GET` | /products | public | `200` | read all products in the database. |
| `GET` | /products/:productId | public | `200` | read product with the requested id. |
| `PATCH` | /products/:productId | user | `200` | update one or more fields for the requested product.<br>accepts an array of objects as follows:<br>&nbsp;&nbsp;&nbsp;&nbsp;`"propName": String` **(Required)** field to update (e.g. name or price).<br>&nbsp;&nbsp;&nbsp;&nbsp;`"value": String` **(Required)** new value for the field |
| `DELETE` | /products/:productId | user | `200` | delete product with the requested id.<br>delete orders containing the product. |
| `POST` | /orders | user | `201` | write new order:<br>`"product": ObjectId` **(Required)** product's id. Check [Mongoose docs](https://mongoosejs.com/docs/schematypes.html#objectids) for more information<br>`"quantity": Number` **(Optional)** products' quantity. Default => `"quantity": 1` |
| `GET` | /orders | user | `200` | read all orders in the database. |
| `GET` | /orders/:orderId | user | `200` | read order with the requested id. |
| `DELETE` | /orders/:orderId | user | `200` | delete order with the requested id. |
| `POST` | /user/signup | public | `201` | register new user.<br>`"email": String` it has to be in mail format `(test@test.com)`<br>`"password": String` hashed using [bcrypt](https://www.npmjs.com/package/bcrypt) |
| `POST` | /user/login | public | `200` | login using registered email.<br>creates [JWT](https://www.npmjs.com/package/jsonwebtoken) token valid for 12 hours.<br>`"email": String` User email<br>`"password": String` User password |
| `POST` | /user/logout | user | `200` | invalidate current JWT by enforcing early expiration. |
| `DELETE` | /user/:userId | user | `200` | delete user with the requested id. |

<br>

# Error Handling

Will be documented soon.
