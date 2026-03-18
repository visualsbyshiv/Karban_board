    const express=require('express');
    const bcrypt=require('bcryptjs');
    const router=express.Router();
    const jwt=require('jsonwebtoken');
    const User=require('../modal/User');
    const JWT_SECRET=require('/env')

    router.post('/register', async (req,res)=>{
        const {name,email,password}= req.body;
        const secret= process.env.JWT_SECRET;
        try{
            let user=await User.findOne({email});
            if(user)return res.status(400).json({message:"user already exists"});

            user=new User({name,email,password});

            const salt= await bcrypt.genSalt(10);
            user.password= await bcrypt.hash(password,salt);
            await user.save();

            const payload= {user:{id: user.id}};
            jwt.sign(payload,secret,{expiresIn: '24h'},(err,token)=>{
                if(err)throw err
                res.json({token});
            });

        }catch(err){
            res.status(500).json({message:'err from server'});
        }
        });

        router.post('/login', async (req,res)=>{
            const{name,email,password}=req.body;
            try{
                let user = await User.findOne({email});
                if(!user) return res.status(400).json({message:'User cant find pleas ragistered first'});

                const isMatch= await bcrypt.compare(password, user.password);
                if(!isMatch) return res.status(400).json({message:'user not exits'});
                const payload={user:{id: user.id}};
                jwt.sign(payload, secret,{expiresIn:'24h'},(err, token)=>{
                    if(err) throw err
                    res.status(200).send({token});

                });
            }catch(err){
                res.status(500).json('server err');
            }

    
    });

    module.exports=router;