import  Razorpay from "razorpay"; 
import crypto from "crypto"
const makeOrderMethod = async (req,res)=>{
    try {
        //initiating the instances....
        const instance = await new Razorpay({
            key_id : process.env.KEY_ID,
            key_secret:process.env.KEY_SECRET,
        })
        //initiating the options......
        const options = {
            amount : req.body.amount *100, 
            currency :"INR",
            receipt : crypto.randomBytes(10).toString("hex")
        }; 

        instance.orders.create(options, (err, order)=>{
            if(err){
                console.log(err);
                return res.status(500).json({error:"Something went wron while payment"})
            }
            res.status(200).json({data:order}); 

        }); 

    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Internal server error"})
    }
}


const verifyPaymentMethod = async (req,res) =>{
    try {
        //destructuring the payment method.. sucess and failure as per the documnetdation
        const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = await req.body; 
        const sign = razorpay_order_id + "|" + razorpay_payment_id; 
        const expectedSign = crypto.createHmac("sha256", process.env.KEY_SECRET)
        .update(sign.toString()).digest("hex"); 
        
        //validating the fields 
        if(razorpay_signature === expectedSign) {
            return res.status(200).json({message:"Payment verified and succesfully"})
        } else{
            return res.status(400).json({error:"Invalid signature given"})
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({error:"internal server error"})
        
    }
}

export {makeOrderMethod, verifyPaymentMethod}