const router = require('express').Router();
var mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const User = require('../models/User');
const verifyToken = require("./auth");

router.get("/", verifyToken, async (req , res) => { //Permite listar todos los usuarios
    if(req.token.role == "admin"){
        try {
            const listUsers = await User.find().select('-password');
            if (!listUsers) { return res.status(400).json({error: 'No existe ningun usuario'})}

            res.json({
                error: null,
                data: listUsers
                
            })
        } catch (error) {
            console.log(error)
            res.json({
                mensaje: 'Falló al listar las companias'
            })
        }
    }
    else{
        res.status(403).json({mensaje: 'Privilegios incorrectos'})
    }
});

router.post("/login", async (req , res) => { //Permite que un usuario realice el login
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ error: 'No se ha podido iniciar sesión' });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'No se ha podido iniciar sesión' })
    
    else {
        jwt.sign({id: user._id, name: user.name , email: user.email, role: user.role, company: user.company},process.env.TOKEN_SECRET, {expiresIn: '32m'}, (err, token) => {
            res.json({
                token
            });
        });
    }
});

router.post("/", async (req , res) => { //Permite registrar un usuario Hacker
    const isEmailExist = await User.findOne({ email: req.body.email });
    if (isEmailExist) {
        return res.status(400).json({error: 'Se ha producido un error al intentar registrar el usuario'})
    }

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: password,
        role:"hacker"
    });

    try {
        const savedUser = await user.save();

        res.json({
            error: null,
            data: 'El usuario fue creado exitosamente'
        })
    } catch (error) {
        res.status(400).json({error})
    }

});

router.put("/:id", verifyToken, async (req , res) => { //Permite modificar un usuario
    if(req.token.role == "admin"){
        try {
            if(mongoose.Types.ObjectId.isValid(req.params.id)) {
                const UserDB = await User.findByIdAndUpdate(
                    { _id: req.params.id }, { name: req.body.name , email: req.body.email, role: req.body.role }, { useFindAndModify: false }
                )
                res.json({
                    estado: true,
                    mensaje: 'Usuario Editado exitosamente'
                })
            } else { res.status(400).json({mensaje: 'ID Incorrecto!'})}
        } catch (error) {
            console.log(error)
            res.json({
                mensaje: 'Falló la edición del usuario'
            })
        }
    }
    else{
        res.status(403).json({mensaje: 'Privilegios incorrectos'})
    }

});

router.delete("/:id", verifyToken, async (req , res) => { //Permite eliminar un usuario
    if(req.token.role == "admin"){
        const id = req.params.id
        try {
            if(mongoose.Types.ObjectId.isValid(req.params.id)) {
                const UserDB = await User.findByIdAndDelete({ _id: id });
                if (!UserDB) {
                    res.json({
                        mensaje: 'No se puede eliminar'
                    })
                } else {
                    res.json({
                        mensaje: 'Usuario eliminado exitosamente!'
                    })
                }
            } else { res.status(400).json({mensaje: 'ID Incorrecto!'})}
        } catch (error) {
            console.log(error)
        }
    }
    else{
        res.status(403).json({mensaje: 'Privilegios incorrectos'})
    }
});

module.exports = router;