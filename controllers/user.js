const {user} = require('../models')
const jwt = require('../helpers/jwt')
const bcrypt = require('../helpers/bcrypt')
module.exports = class {
    static async register(req, res){
        try {
            const newUser = await  user.create(req.body)

            const userCredentials = newUser.toJSON({
                exclude: ['password', 'createdAt', 'updatedAt']
              });
            
            res.status(201).json({user:newUser})
        } catch (error) {
            res.status(500).json(error)

        }
    }

    static async login (req,res){
        try {

           const userData = await user.findOne({where:{email: req.body.email}})

           if(!userData){
            res.status(401).json({message: 'Email not found'})
            return
            }
  
           const isCorrect = await bcrypt.comparePassword(req.body.password, userData.dataValues.password)
           if (!isCorrect) {
            throw {
                code: 401,
                message: "Password salah",
              };
           }

           const token = jwt.generateToken(userData.dataValues)
           res.status(200).json({token : token})
        } catch (error) {
            res.status(500).json(error)

        }
    }

    static async update (req,res){
        try {
            const userData = await user.findOne({where:{id: req.params.id}})
            if(!userData){
                res.status(401).json({message: 'user not found'})
                return
            }

            if (userData.dataValues.id !== req.userLogin.id) {
                res.status(500).json({message: 'This is not your data'})
                return
            }

            const updateData = await user.update(req.body,{where: {id: req.params.id},returning: true})

            res.status(200).json({user : updateData})
        } catch (error) {
            res.status(500).json(error)
        }
    }

    static async delete (req,res){
        try {
            const findUser = await user.findOne({where:{id: req.params.id}})

            if (!findUser) {
                res.status(401).json({message: 'User not found'})
                return
            }

            if (req.userLogin.id !== findUser.dataValues.id) {
                res.status(401).json({message: 'You not user this account'})
                return
            }

            const deleteData = await user.destroy({where: {id: req.userLogin.id},returning: true})
            res.status(200).json({message : "Your Account has been deleted"})
        } catch (error) {
            res.status(500).json(error)
        }

    }
}