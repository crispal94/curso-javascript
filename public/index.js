console.log("Hello world!");

moment.locale("es");

let productos = [];

axios.get("/productos").then(data => {
  productos = data.data;
  dibujarProductos();
});

dibujarProductos = function() {
  let cols = "";
  productos.forEach(producto => {
    cols += `<div class="col-4">
    <div class="card">
        <img src="${producto.urlImage}" class="card-img-top" alt="${
      producto.nombre
    }">
        <div class="card-body">
          <h5 class="card-title">${producto.nombre}</h5>
          <p class="card-text">Precio: ${producto.precio}</p>
          <p class="card-text">Stock: ${producto.stock}</p>
          <p class="card-text">
                Fecha de creación: ${moment(producto.fechaCreacion).format(
                  "dddd/MM/YYYY"
                )}
              </p>
          <a href="#" class="btn btn-primary">Comprar</a>
          <a onclick="editar('${
            producto.idProducto
          }')" class="btn btn-primary">Editar</a>
          <a onclick="eliminar('${
            producto.idProducto
          }')" class="btn btn-danger">Eliminar</a>
        </div>
      </div>
    </div>`;
  });
  let rowProductos = document.getElementById("productos");
  rowProductos.innerHTML = cols;
};

insertar = function(producto) {
  axios.post("/productos", producto).then(data => {
    productos = data.data.productos;
    dibujarProductos();
    limpiarFormulario();
    $("#exampleModal").modal("hide");
  });
};

limpiarFormulario = function() {
  document.getElementById("nombre").value = "";
  document.getElementById("urlImage").value = "";
  document.getElementById("precio").value = "";
  document.getElementById("stock").value = "";
};

let productoAModificar;

editar = function(idProducto) {
  productoAModificar = idProducto;
  let producto = productos.find(
    producto => producto.idProducto === Number(productoAModificar)
  );
  document.getElementById("nombre").value = producto.nombre;
  document.getElementById("urlImage").value = producto.urlImage;
  document.getElementById("precio").value = producto.precio;
  document.getElementById("stock").value = producto.stock;
  $("#exampleModal").modal("show");
};

guardar = function(e) {
  e.preventDefault();
  let producto = {
    nombre: document.getElementById("nombre").value,
    urlImage: document.getElementById("urlImage").value,
    precio: document.getElementById("precio").value,
    stock: document.getElementById("stock").value,
    fechaCreacion: new Date()
  };
  if (!productoAModificar) {
    insertar(producto);
  } else {
    axios
      .put("/productos", { ...producto, idProducto: productoAModificar })
      .then(data => {
        productos = data.data.productos;
        dibujarProductos();
        limpiarFormulario();
        $("#exampleModal").modal("hide");
        productoAModificar = undefined;
      });
  }
};

eliminar = function(idProducto) {
  axios.delete("/productos/" + idProducto).then(data => {
    debugger;
    productos = data.data.productos;
    dibujarProductos();
  });
};

dibujarProductos();

llamadaABase = function(numero, callback) {
  setTimeout(() => {
    callback(numero + 1);
  }, 3000);
};

llamadaABase(2, function(numero) {
  console.log(numero);
});
