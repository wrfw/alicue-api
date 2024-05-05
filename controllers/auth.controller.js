const db = require('../models/index');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
	try{
		const {name, email, password} = req.body;
		const userExists = await db.User.findOne({
			where: {email}
		});
		if(userExists){
			return res.status(400).send('Email is alredy associeted with an account');
		}
		await db.User.create({
			name,email,password:await bcrypt.hash(password, 15),
		});
		return res.status(200).send('Registration succesful');
	}catch(err){
		return res.status(500).send('Error in registering user');
	}
	
}

const signInUser = async (req, res) => {
	try{

		const {email, password} = req.body;
		const user = await db.User.findOne({
			where: {email}
		});
		if(!user){
			return res.status(404).json('Email not found');
		}
		const passwordValid = await bcrypt.compare(password, user.password);
		const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_REFRESH_EXPIRATION
		});
		res.status(200).send({
			id: user.id,
			name: user.name,
			email: user.email,
			accessToken: token,
		});
	}catch(err){
		return res.status(500).send('Sign in error');
	}
}

module.exports = {
	registerUser,
	signInUser,
}
