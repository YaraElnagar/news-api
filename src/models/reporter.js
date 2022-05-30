const mongoose = require ('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const reporterSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true,

        validate(value){
            let emailReg = new RegExp('^[a-z0-9._%+-]+@[gmail|hotmail|yahoo]+.[a-z]{2,4}$')
            //using validator or expressin test
            if(!validator.isEmail(value)|| ! emailReg.test(value)){
                throw new Error ('Please enter a valid Email')
            }
        }
    },
    password:{
        type:String,
        required:true,
        minlength:6,
        trim:true,

        validate(value){
            let passwordReg = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])")
            if(!passwordReg.test(value)){
                throw new Error('Please password must include: characters, numbers, special characters, uppercase and lowercase')
            }
        }
    },
    phoneNumber:{
        type:Number,
        requred:true,
        trim:true,
        //Validating the number that it is Egyptian
        validate(value){
            let phoneReg = new RegExp("^01[0-2,5]{1}][0-9]{8}$")
            if(!phoneReg.test(value)){
                throw new Error('Please make sure you entered your number correctly')
            }
        }
    },
    avatar:{
        type:Buffer
    },
    tokens:[{
        type:String,
        required:true
    }]
})

reporterSchema.virtual('news',{
    ref:'News',
    localField:'_id',
    foreignField:'owner'
})

reporterSchema.pre('save',async function(){
    const reporter = this
    if(reporter.isModified('password'))
    reporter.password = await bcryptjs.hash(reporter.password,8)
})

reporterSchema.statics.findByCredentials = async (email,password)=>{

    const reporter = await Reporter.findOne({email})
    console.log(reporter)

    if(!reporter){
        throw new Error ('Unable to login')
    }

    const isMatch = await bcryptjs.compare(password, reporter.password)

    if(!isMatch){
        throw new Error ('Unable to login')
    }

    return reporter
}

reporterSchema.methods.generateToken = async function(){
    const reporter = this
    const token = jwt.sign({_id:reporter._id.toString()},'nodecourse')
    reporter.tokens = reporter.tokens.concat(token)
    await reporter.save()
    return token
}

reporterSchema.methods.toJSON = function(){
    const reporter = this
    const reporterObj = reporter.toObject()

    delete reporterObj.password
    delete reporterObj.tokens

    return reporterObj
}

const Reporter = mongoose.model('Reporter',reporterSchema)
module.exports = Reporter