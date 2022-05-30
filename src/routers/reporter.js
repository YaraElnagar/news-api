const express = require('express')
const router = express.Router()
const Reporter = require('../models/reporter')
const auth = require('../middleware/auth')
//const multer = require('multer')

//signup
router.post('/signup',async (req,res)=>{
    try{
        const reporter = new Reporter(req.body) 
        const token = await reporter.generateToken()
        await reporter.save()
        res.status(200).send({reporter,token})
    }
    catch(e){
        res.status(400).send(e)
    }
})

//login
router.post('/login',async (req,res)=>{
    try{
        const reporter = await Reporter.findByCredentials(req.body.email,req.body.password)
        const token = await reporter.generateToken()
        res.send({reporter,token})
    }
    catch(e){
        res.send(e.message)
    }
})

//Profile
router.get('/profile',auth,async(req,res)=>{
    try{
        res.send(req.user)
    }
    catch(e){
        res.status(500).send(e.message)
    }
    
})

//logout
router.delete('/logout',auth,async(req,res)=>{
    try{
        req.reporter.tokens = req.reporter.tokens.filter((el)=>{
            return el !== req.token
        })
        await req.reporter.save()
        res.send()
    }
    catch(e){
        res.status(500).send(e.message)
    }
})

//logout all
//
//
//
//

//get
router.get('/reporters',auth,(req,res)=>{
    User.find({}).then((reporters)=>{
        res.status(200).send(reporters)
    }).catch((e)=>{
        res.status(500).send(e)
    })
})

//get by id
router.get('/reporters/:id',auth,(req,res)=>{
     const _id = req.params.id
     User.findById(_id).then((reporter)=>{
         if(!reporter){
         return res.status(404).send('Unable to find reporter')
         }
         res.status(200).send(reporter)
     }).catch((e)=>{
         res.status(500).send(e)
     })
 })


 //Update
 //patch
 router.patch('/reporters/:id',auth,async(req,res)=>{
    try{
        const updates = Object.keys(req.body)
        console.log(updates)
       const reporter = await Reporter.findById(req.params.id)
        if(!reporter){
            return res.status(404).send('No reporter was found')
        }
         updates.forEach((el)=> reporter[el]=req.body[el])
         await reporter.save()
        res.status(200).send(reporter)
    }
    catch(e){
        res.status(400).send(e.message)
    }
})

//delete
router.delete('/reporters/:id',auth,async(req,res)=>{
    try{
        const reporter = await Reporter.findByIdAndDelete(req.params.id)
        if(!reporter){
            return res.status(404).send('Not found')
        }
        res.status(200).send(reporter)
    }
    catch(e){
        res.status(500).send(e.message)
    }
     
})

//delete all
// 
//
//
//



module.exports = router