const router = require('express').Router();
const Company = require('../models/Company');
const Vuln = require('../models/Vuln');
const verifyToken = require("./auth");
var mongoose = require('mongoose');

router.get("/", verifyToken, async (req , res) => { //Permite listar todas las companias
        try {
            const listCompanies = await Company.find();
            if (!listCompanies) { return res.status(400).json({error: 'No existe ningua compania'})}

            res.json({
                error: null,
                data: listCompanies
            })
        } catch (error) {
            console.log(error)
            res.json({
                mensaje: 'Falló al listar las companias'
            })
        }
});

router.post("/", verifyToken, async (req , res) => { //Permite crear una compania
    if(req.token.role == "admin"){
        try {
            const doesCompanyExist = await Company.findOne({ company: req.body.company });
            if (doesCompanyExist) {
                return res.status(400).json({error: 'La compania ya existe'})
            }

            if (!req.body.company) return res.status(400).json({ error: 'Ingrese el nombre de la compania!' });
            const company = await new Company({
                company: req.body.company,
                description: req.body.description
            });

            const savedCompany = await company.save();
            res.json({
                error: null,
                data: savedCompany
            })
        } catch (error) {
            console.log(error)
            res.json({
                mensaje: 'Falló la creación de la compania'
            })
        }
    }
    else{
        res.status(403).json({mensaje: 'Privilegios incorrectos'})
    }
});

router.get("/:id", verifyToken, async (req , res) => { //Permite obtener una compania
        try {
            if(mongoose.Types.ObjectId.isValid(req.params.id)) {
                const companyInfo = await Company.findById({ _id: req.params.id });
                if (!companyInfo) { return res.status(400).json({error: 'No existe la compania'})}

                res.json({
                    mensaje: companyInfo
                })
            }

            if (!req.params.id) return res.status(400).json({ error: 'Ingrese el nombre de la compania!' });

        } catch (error) {
            console.log(error)
            res.json({
                mensaje: 'Falló al obtener la compania'
            })
        }
});

router.put("/:id", verifyToken, async (req , res) => { //Permite modificar una compania
    if(mongoose.Types.ObjectId.isValid(req.params.id) ) {
        const userCompany =  await Company.findById({ _id: req.params.id })
        if(req.token.role == "admin" || (req.token.role == "empresa" && (req.token.company == userCompany.company))){ 
            try {
                    const CompanyDB = await Company.findByIdAndUpdate(
                        { _id: req.params.id }, { description: req.body.description }, { useFindAndModify: false } //Solamente se puede cambiar la descripcion!
                    );
                    res.json({
                        estado: true,
                        mensaje: 'Compania Editada exitosamente'
                    })
            } catch (error) {
                console.log(error)
                res.json({
                    mensaje: 'Falló la edición de la compania'
                })
            }
        }
    else{
        res.status(403).json({mensaje: 'Privilegios incorrectos'})
    } 
} else { res.status(400).json({mensaje: 'ID Incorrecto!'})}
});

router.delete("/:id", verifyToken, async (req , res) => { //Permite eliminar una compania
    if(req.token.role == "admin"){ 
        try {
            id = req.params.id;
            if(mongoose.Types.ObjectId.isValid(req.params.id)) {
                const CompanyDB = await Company.findByIdAndDelete({ _id: id });
                if (!CompanyDB) {
                    res.json({
                        mensaje: 'No se puede eliminar'
                    })
                }
                res.json({
                    estado: true,
                    mensaje: 'Compania Elimada Exitosamente'
                })
            } else { res.status(400).json({mensaje: 'ID Incorrecto!'})}
        } catch (error) {
            console.log(error)
            res.json({
                mensaje: 'Falló la eliminación de la compania'
            })
        }
    }
    else{
        res.status(403).json({mensaje: 'Privilegios incorrectos'})
    }
});

router.get("/:companyid/vulns", verifyToken, async (req , res) => {  //Permite ver una lista de todas las vulnerabilidades de una empresa. PRO
        try {
            const userCompany =  await Company.findById({ _id: req.params.companyid })
            if(req.token.role == "admin" || (req.token.role == "empresa" && (req.token.company == userCompany.company))){
                const vulnList = await Vuln.find({ id_company: req.params.companyid });
                if (!vulnList) { return res.status(400).json({error: 'No existe ninguna vulnerabilidad'})}
    
                res.json({
                    error: null,
                    data: vulnList
                })
            }
            else{
                res.status(403).json({mensaje: 'Privilegios incorrectos'})
            }
        } catch (error) {
            console.log(error)
            res.json({
                mensaje: 'Falló al listar las vulnerabilidades'
            })
        }    
});

router.post("/:companyid/vulns", verifyToken, async (req , res) => { //Permite crear una nueva vulnerabilidad para ser cargada en el programa
    const vuln = new Vuln({
        name: req.body.name,
        description: req.body.description,
        risk: req.body.risk,
        status:"pending",
        id_company:req.params.companyid,
        id_hacker:req.token.id

    });

    try {
        const savedVuln = await vuln.save();
        res.json({
            error: null,
            data: savedVuln
        })
    } catch (error) {
        res.status(400).json({error})
    }
});

router.get("/:companyid/vulns/:vulnid", verifyToken, async (req , res) => { //Permite visualizar los detalles de una vulnerabilidad puntual. 
    try {
        if(mongoose.Types.ObjectId.isValid(req.params.vulnid) && mongoose.Types.ObjectId.isValid(req.params.companyid)) {
            const userCompany =  await Company.findById({ _id: req.params.companyid })
            const selectedVuln = await Vuln.findById({ _id: req.params.vulnid });
            if(req.token.role == "admin" || (req.token.role == "empresa" && (req.token.company == userCompany.company)) || (req.token.id == selectedVuln.id_hacker) ){
                if (!selectedVuln) { return res.status(400).json({error: 'No existe ninguna vulnerabilidad'})}
                res.json({
                    error: null,
                    data: selectedVuln
                })
            }
            else{
                res.status(403).json({mensaje: 'Privilegios incorrectos'})
            }
        } else { res.status(400).json({mensaje: 'ID Incorrecto!'})}

    } catch (error) {
        console.log(error)
        res.json({
            mensaje: 'Falló al mostrar la vulnerabilidad'
        })
    }
});

router.get("/:companyid/vulns/:vulnid/approve", verifyToken, async (req , res) => { //Permite cambiar el estado de una vulnerabilidad a aprobado. 
    if(req.token.role == "admin" || (req.token.role == "empresa" && (req.token.company == req.body.company))){ //Probar
        if(mongoose.Types.ObjectId.isValid(req.params.vulnid)) {
            const selectedVuln = await Vuln.findByIdAndUpdate(
                { _id: req.params.vulnid }, { status:"approved" }, { useFindAndModify: false }
            )
            res.json({
                estado: true,
                mensaje: 'La vulnerabilidad fue aprobada exitosamente'
            })
        }
    }
    else{
        res.status(403).json({mensaje: 'Privilegios incorrectos'})
    }
});

router.get("/:companyid/vulns/:vulnid/reject", verifyToken, async (req , res) => { //Permite cambiar el estado de una vulnerabilidad a rechazado. 
    if(req.token.role == "admin" || (req.token.role == "empresa" && (req.token.company == req.body.company))){ //Probar
        if(mongoose.Types.ObjectId.isValid(req.params.vulnid)) {
            const selectedVuln = await Vuln.findByIdAndUpdate(
                { _id: req.params.vulnid }, { status:"rejected" }, { useFindAndModify: false }
            )
            res.json({
                estado: true,
                mensaje: 'La vulnerabilidad fue rechazada'
            })
        }
    }
    else{
        res.status(403).json({mensaje: 'Privilegios incorrectos'})
    }
});


module.exports = router;