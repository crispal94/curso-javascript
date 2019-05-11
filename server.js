const express = require("express");
const bodyParser = require("body-parser");

const http = require("http");
const path = require("path");
const process = require("process");

let productos = require("./catalogo_js");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// SIRVO DIRECTORIO
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public/index.html"));
});

app.get("/productos", (req, res) => {
  res.send(productos);
});

app.get("/productos/:nombre", (req, res) => {
  let producto = productos.find(
    producto => producto.nombre === req.params.nombre
  );
  res.send(producto);
});

app.post("/productos", (req, res) => {
  let producto = {
    ...req.body,
    idProducto: productos.length + 1,
    precio: Number(req.body.precio),
    stock: Number(req.body.stock)
  };

  producto.fechaCreacion = new Date();
  productos = [...productos, producto];
  res.send({ mensaje: "Registro insertado", productos });
});

app.put("/productos", (req, res) => {
  let idProducto = Number(req.body.idProducto);

  let producto = {
    ...req.body,
    idProducto: Number(req.body.idProducto)
  };

  if (req.body.precio) {
    producto.precio = Number(req.body.precio);
  }

  if (req.body.stock) {
    producto.stock = Number(req.body.stock);
  }

  let index = productos.findIndex(function(producto) {
    return producto.idProducto === idProducto;
  });

  productos[index] = { ...productos[index], ...producto };
  res.send({ mensaje: "Registro modificado", productos });
});

app.delete("/productos/:idProducto", (req, res) => {
  let index = productos.findIndex(
    productoABuscar =>
      productoABuscar.idProducto === Number(req.params.idProducto)
  );
  productos.splice(index, 1);

  res.send({ mensaje: "Registro eliminado correctamente", productos });
});

const port = process.env.PORT || "8080";
app.set("port", port);

const server = http.createServer(app);
server.listen(port, () => console.log(`Magic Happens on port:${port}`));
