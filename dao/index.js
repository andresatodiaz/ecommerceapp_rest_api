const { Sequelize, DataTypes, DATE, UUID } = require("sequelize");

const CADENA_CONEXION ="postgresql://postgres:STP0GnnMuB0kTuBV9RDi@containers-us-west-180.railway.app:7293/railway"

//"postgresql://ecommerceUser:postgres@localhost:5432/ecommerce"

//const sequelize = new Sequelize(CADENA_CONEXION)
const sequelize = new Sequelize(
    process.env.DATABASE_URL,
    {
        dialectOptions:{
            ssl:{
                require: true,
                rejectUnauthorized: false
            }
        }
    }
    )

const Usuario = sequelize.define("usuario",{
    id:{
        primaryKey:true,
        type:DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4
    },
    nombre:{
        type:DataTypes.STRING,
        allowNull:false
    },
    apellido:{
        type:DataTypes.STRING,
        allowNull:false
    },
    fechaNacimiento:{
        type:DataTypes.DATE,
        allowNull:true
    },
    correo:{
        type:DataTypes.STRING,
        allowNull:false
    },
    contrasena:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    timestamps:false,
    freezeTableName:true
}) 
const Producto = sequelize.define("producto",{
    id:{
        primaryKey:true,
        type:DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4
    },
    titulo:{
        type:DataTypes.STRING,
        allowNull:false
    },
    descripcion:{
        type:DataTypes.STRING,
        allowNull:false
    },
    precio:{
        type:DataTypes.STRING,
        allowNull:false
    },
    estado:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    vendidoPor:{
        type:DataTypes.UUID,
        allowNull:true
    },
    compradoPor:{
        type:DataTypes.UUID,
        allowNull:true
    }
},{
    timestamps:false,
    freezeTableName:true
})
const Compra = sequelize.define("compra_producto",{
    id:{
        primaryKey:true,
        type:DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4
    },
    usuario_id:{
        type:DataTypes.UUID,
        allowNull:false
    },
    producto_id:{
        type:DataTypes.UUID,
        allowNull:false
    }
})
const Venta = sequelize.define("venta_producto",{
    id:{
        primaryKey:true,
        type:DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4
    },
    usuario_id:{
        type:DataTypes.UUID,
        allowNull:false
    },
    producto_id:{
        type:DataTypes.UUID,
        allowNull:false
    }
},{
    timestamps:false,
    freezeTableName:true
})

Producto.belongsTo(Usuario,{
    foreignKey:"vendidoPor"
})

Producto.belongsTo(Usuario,{
    foreignKey:"compradoPor"
})

Compra.belongsTo(Producto,{
    foreignKey:"producto_id"
})

Venta.belongsTo(Producto,{
    foreignKey:"producto_id"
})

Compra.belongsTo(Usuario,{
    foreignKey:"usuario_id"
})

Compra.belongsTo(Usuario,{
    foreignKey:"usuario_id"
})

module.exports={
    Usuario,Producto,Compra,Venta
}