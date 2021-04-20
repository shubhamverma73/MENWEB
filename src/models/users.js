const mongoose  = require('mongoose');
const validator = require('validator');
const bcrypt    = require('bcrypt');
const jwt       = require('jsonwebtoken');

// Schema
const userSchema = new mongoose.Schema({
    name:   { 
                type: String, 
                required: true,
                minlength: 4
            },
    email:  {
                type: String,
                required: true,
                unique: [true, "Email is already exists"],
                validate(value) {
                    if(!validator.isEmail(value)) {
                        throw new Error('Email not valid');
                    }
                }
            },
    password:   { 
                    type: String, 
                    required: true,
                    minLength: [4, 'Password should be at least four characters']
                },
    /*confirmpassword:{
                        type: String,
                        required: [true, 'Retype your password.'],
                        validate:{
                                    validator: function(el) {
                                    return el === this.password;
                                },
                        message: 'Passwords don\'t match.'
                        }
                    },*/
    phone:  {
                type: Number,
                min: 10,
                // max: 10,
                required: true,
                unique: true
            },
    gender: { 
                type: String, 
                required: true,
            },
    tokens: [{ 
                token: {
                    type: String, 
                    required: true,
                }                
            }],
    date:   { 
                type: Date, 
                default: Date.now 
            }
});

// ================== Generate Token =====================
userSchema.methods.generateAuthToken = async function() {
    try {
        const token = jwt.sign({ _id: this._id.toString()}, process.env.SECRETE_KEY);
        this.tokens = this.tokens.concat({token: token});
        await this.save();
        return token;
    }
    catch(err) {
        res.status(401).send('Getting error during gerenate token: '+err);
    }
}

// ============== Convert password into hash ======================
userSchema.pre("save", async function(next) { //Middleware
    if(this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Collection create
const Users = new mongoose.model('User', userSchema); //Table name shouls be singular with first word in capital

module.exports = Users;