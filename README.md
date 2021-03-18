# About

This is my first RESTful API using nodeJS<br>
My API provides simple shopping options. The client can do the following:
* POST product
* GET all products
* GET product
* PATCH product
* DELTE product
* POST order
* GET all orders
* GET order
* DELETE order

HTTP response status codes in this API:
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

| Request | Route | Response | Description |
| --- | --- | :---: | ----------------- |
| `GET` | /products | `200` | read all products in the database. |
| `POST` | /products | `201` | write new product:<br>**(Required)**`"name": String` product's name.<br>**(Required)**`"price": Number` product's price.<br>**(Optional)**`"productImg": File` product's image. |
| `GET` | /products/:productId | `200` | read product with the requested id. |
| `PATCH` | /products/:productId | `200` | update product with the requested id. you can change one or more fields. |
| `DELETE` | /products/:productId | `200` | delete product with the requested id.<br>delete orders containing the product. |
| `GET` | /orders | `200` | read all orders in the database. |
| `POST` | /orders | `201` | write new order:<br>**(Required)**`"product": ObjectId` product's id. Check [Mongoose docs](https://mongoosejs.com/docs/schematypes.html#objectids) for more information<br>**(Optional)**`"price": Number` product's price. Default => `price: 1` |
| `GET` | /orders/:orderId | `200` | read order with the requested id. |
| `DELETE` | /orders/:orderId | `200` | delete order with the requested id. |



