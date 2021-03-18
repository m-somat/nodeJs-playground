# About

RESTful API for online shopping applications. My API allows users to read/write/delete/update products and read/write/delete orders.

### Middlewares:

I used [Express](https://expressjs.com/en/guide/using-middleware.html) web framework for routing, calling and controlling middlewares

* [Morgan](http://expressjs.com/en/resources/middleware/morgan.html)
* [body-parser](https://www.npmjs.com/package/body-parser)
* [mongoose](https://mongoosejs.com/docs/middleware.html)
* [multer](http://expressjs.com/en/resources/middleware/multer.html)

### HTTP response status codes in this API:
* 200: **(Accessed)** The request has succeeded
* 201: **(Created)** the request has succeeded and has led to the creation of a resource
* 404: **(Not found)** the requested resource is valid but the server can't find it
* 500: **(Wrong resource)** the server encountered an unexpected condition

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
        "MONGO_ATLAS_cluster": "clustername.id"
    }
}
```

To get your clustername.id:
1. Create a cluster following [these steps](https://docs.atlas.mongodb.com/tutorial/create-new-cluster/).
2. Make sure your cluster is accessible from anywhere or at least for your current IP Address following [these steps](https://docs.atlas.mongodb.com/security/ip-access-list/#add-ip-access-list-entries).
3. Use the **Connect** button on your cluster.
4. The given code will look like this:
```
mongodb+srv://<username>:<password>@<clustername.id>.mongodb.net/<databaseName>?retryWrites=true&w=majority
```
5. Copy your clustername.id.
6. Edit nodemon.json with your username, password and cluster

Notes:
* I ignored "nodemon.json" file as it contains my database security keys but you have to add this file for the API to function
* I ignored an "uploads/" folder for convenience as it contains user's form-data but it will be created automatically once the user uploads a file

# Features

Available API routes:

| Request | Route | Response | Description |
| --- | :---: | :---: | --------------- |
| `POST` | /products | `201` | write new product:<br>**(Required)**`"name": String` product's name.<br>**(Required)**`"price": Number` product's price.<br>**(Optional)**`"productImg": File` product's image.<br>File options:<br>&nbsp;&nbsp;&nbsp;&nbsp;**Support**: JPG, JPEG, PNG<br>&nbsp;&nbsp;&nbsp;&nbsp;**Size Limit**: 5MB |
| `GET` | /products | `200` | read all products in the database. |
| `GET` | /products/:productId | `200` | read product with the requested id. |
| `PATCH` | /products/:productId | `200` | update one or more fields for the requested product.<br>accepts an array of objects as follows:<br>&nbsp;&nbsp;&nbsp;&nbsp;**(Required)**`"propName": String` field to update (e.g. name or price).<br>&nbsp;&nbsp;&nbsp;&nbsp;**(Required)**`"value": String` new value for the field |
| `DELETE` | /products/:productId | `200` | delete product with the requested id.<br>delete orders containing the product. |
| `POST` | /orders | `201` | write new order:<br>**(Required)**`"product": ObjectId` product's id. Check [Mongoose docs](https://mongoosejs.com/docs/schematypes.html#objectids) for more information<br>**(Optional)**`"quantity": Number` products' quantity. Default => `quantity: 1` |
| `GET` | /orders | `200` | read all orders in the database. |
| `GET` | /orders/:orderId | `200` | read order with the requested id. |
| `DELETE` | /orders/:orderId | `200` | delete order with the requested id. |

 

