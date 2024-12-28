import bcrypt from 'bcrypt'
import userModel from '../../models/userModel';


const userMiddleware = {
    checkLogin: async (req, res, next) => {
        try {
            const {email,password} = req.body;
            if(!email || !password) {
                return res.send('Vui long dien day du thong tin dang nhap');
            }
            const user = await userModel.findOne({email});
            if (!user) {
                return res.send('Email khong ton tai');
            }
            const comparepassword = await bcrypt.compare(password, user.password);
            if(!comparepassword) {
                return res.send('Sai mat khau')
            };
            next ();
        } catch (err) {
            res.status(400).send({
                message:'Dang nhap that bai'
            })
        }
    },

    checkRegister: async (req,res,next) => {
        try {
            const {email, password} = req.body;
            if (!email || password) {
                return res.send('Vui long dien day du thong tin');
            }
            const checkemail = await userModel.findOne({email});
            if (checkemail) {
                return res.status(400).send('Tai khoan da ton tai');
                
            }
            next ();
        } catch (err) {
            res.status(400).send({
                message: 'Loi dang nhap'
            })
        }
    }

}
export default userMiddleware;