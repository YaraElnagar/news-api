const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const News = require('../models/news')

//Post
router.post('/news',auth,async(req,res)=>{
    try{
        const news = new News({...req.body,owner:req.user._id})
        await news.save()
        res.status(200).send(news)
    }
    catch(e){
        res.status(400).send(e.message)
    }
})

//Get
router.get('/news/:id',auth,async(req,res)=>{
    try{
        const _id = req.params.id
        const news = await News.findOne({_id,owner:req.reporter._id})
       
        if(!news){
            return res.status(404).send('No news found')
        }
        res.status(200).send(news)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})

//Patch
router.patch('/news/:id',auth,async(req,res)=>{
    try{
        const _id = req.params.id
        const updates = Object.keys(req.body)
        const news = await News.findOne({_id,owner:req.user._id})

        if(!news){
            return res.status(404).send('No news was found')
        }
        updates.forEach((el)=> news[el]=req.body[el])
        await news.save()
        res.send(news)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})

//Delete
router.delete('/news/:id',auth,async(req,res)=>{
    
    try{
        const _id = req.params.id
           const news = await News.findOneAndDelete({_id,owner:req.reporter._id})
           if(!news){
             return  res.status(404).send('No news was found')
           }
           res.status(200).send(news)
       }
       catch(e){
           res.status(500).send(e.message)
       }
   })

   // ref:'Reporter' --> inside news model
router.get('/reporterData/:id',auth,async(req,res)=>{
    try{
        const _id = req.params.id
        const news = await News.findOne({_id,owner:req.reporter._id})
        if(!news){
            res.status(404).send('No news was found')
        }
        await news.populate('owner')
        res.status(200).send(news.owner)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})

module.exports = router