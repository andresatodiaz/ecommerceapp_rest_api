const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const rateLimit = require("express-rate-limit"); // Import rate-limiting middleware
var crypto = require('crypto');

const { Usuario, Producto, Compra, Venta } = require("./dao");

const PUERTO = process.env.PORT || 9999;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); 

// Apply rate limiting to all endpoints (adjust limits as needed)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // limit each IP to 100 requests per windowMs
  standardHeaders: true,     // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,      // Disable the `X-RateLimit-*` headers
  message: { error: "Too many requests, please try again later." }
});
app.use(limiter);

app.get("/getUsuario",async(req,resp)=>{
    const userData = req.query
    const userResult = await Usuario.findOne({
        where:{
            id: userData.id,
            correo: userData.correo,
            contrasena: userData.contrasena
        }
    })
    resp.send(userResult)
})

app.get("/getVendedor",async(req,resp)=>{
    const userData = req.query
    const userResult = await Usuario.findOne({
        where:{
            id: userData.id,
        }
    })
    resp.send(userResult)
})

app.get("/miUsuario",async(req,resp)=>{
    const userData = req.query
    const userResult = await Usuario.findOne({
        where:{
            id: userData.id,
        }
    })
    resp.send(userResult)
})

app.get("/login",async(req,resp)=>{
    const userData = req.query
    const userResult = await Usuario.findOne({
        where:{
            correo: userData.correo,
            contrasena: userData.contrasena
        }
    })

    if(userResult!=null){
        resp.send(userResult)
    }else{
        resp.send(null)
    }
})

app.get("/getUsuarios",async(req,resp)=>{
    const usuario=await Usuario.findAll()
    resp.send(usuario)
})

app.get("/getProductos",async(req,resp)=>{
    const productos= await Producto.findAll()
    resp.send(productos)
})

app.get("/misProductos",async(req,resp)=>{
    const userData = req.query
    const productos = await Producto.findAll({
        where:{
            id:userData.id
        }
    })
    resp.send(productos)
})

app.post("/addUsuario",async(req,resp)=>{
    const userData = req.body
    const emailExists = await Usuario.findOne({
        where:{
            correo: userData.correo
        }
    })
    if(emailExists==null){
        await Usuario.create({
            id: crypto.randomUUID(),
            nombre: userData.nombre,
            apellido: userData.apellido,
            fechaNacimiento: userData.fechaNacimiento,
            correo: userData.correo,
            contrasena: userData.contrasena
        })
        console.log(userData)
        console.log("\n\n Usuario creado \n\n")
    }else{
        console.log("\n\n Correo ya existe \n\n")
    }
    
})

app.post("/agregarProducto",async(req,resp)=>{
    const productoData = req.body
    await Producto.create({
        id: crypto.randomUUID(),
        titulo: productoData.titulo,
        descripcion: productoData.descripcion,
        precio: productoData.precio,
        estado: productoData.estado,
        vendidoPor: productoData.vendidoPor,
        compradoPor:productoData.compradoPor
    })
})

app.post("/comprarProducto",async(req,resp)=>{
    const productoCompra = req.body
    const searchProducto = await Producto.findOne({
        where:{
            id: productoCompra.id
        }
    })
    if(searchProducto.compradoPor!=null){
        await Producto.update({
            compradoPor:null
        },{
            where:{
                id:productoCompra.id
            }
        })
    }else{
        await Producto.update({
            compradoPor:productoCompra.compradoPor
        },{
            where:{
                id:productoCompra.id
            }
        })
    }
    
})

app.post("/borrarProducto",async(req,resp)=>{
    const productoData = req.body
    await Producto.destroy({
        where:{
            id:productoData.id
        }
    })
})

app.post("/VenderProducto",async(req,resp)=>{

})

app.post("ModifyUsuario",async(req,resp)=>{

})

app.post("ModifyProducto",async(req,resp)=>{

})

app.listen(PUERTO,()=>{
    console.log(`Servidor web iniciado en puerto ${PUERTO}`)
})

/* async function main() {

    try {

        await sequelize.sync({force: false});
        console.log("Coneccion establecida con exito");
    
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
    }
   
}

main(); */

