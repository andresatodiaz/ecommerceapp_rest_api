const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
var crypto = require('crypto')

const {Usuario,Producto,Compra,Venta}=require("./dao")


var PUERTO = process.env.PORT || 9999

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended : true
}))
app.use(cors()) // politica CORS (cualquier origen) <---- TODO: cuidado!!!

app.get("/getUsuario",async(req,resp)=>{
    const userData = req.body
    const userResult = await Usuario.findOne({
        where:{
            id: userData.id,
            correo: userData.correo,
            contrasena: userData.contrasena
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