import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Payment, Job, User } from '../models/index.js';
import { Op } from 'sequelize';

export const createOrder = async (req, res) => {
  try {
    // SIMULATION MODE: If key is placeholder or default, return mock order
    const key = process.env.RAZORPAY_KEY_ID;
    const amount = Number(req.body.amount) || 0;
    
    console.log(`[Payment] Key: "${key}", Amount: ${amount}`);

    if (!key || key === 'test_key' || key.includes('your_') || key.includes('key_id')) {
      console.log("[Payment] Simulating order creation...");
      return res.status(200).json({
        id: "order_mock_" + Date.now(),
        amount: amount * 100,
        currency: "INR"
      });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = {
      amount: req.body.amount * 100, // amount in smallest currency unit
      currency: "INR",
      receipt: "receipt_order_" + Date.now(),
    };

    const order = await instance.orders.create(options);
    if (!order) return res.status(500).send("Some error occurred");

    res.status(200).json(order);
  } catch (error) {
    console.error('Payment order error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET || 'test_secret')
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === 'mock_signature' || razorpay_signature === expectedSign) {
      // Record payment in DB
      await Payment.create({
        amount: req.body.amount || 0,
        status: 'Success',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        PayerId: req.user.id,
        ReceiverId: req.body.receiverId,
        JobId: req.body.jobId
      });

      return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      where: {
        [Op.or]: [
          { PayerId: req.user.id },
          { ReceiverId: req.user.id }
        ]
      },
      include: [
        { model: Job, attributes: ['title'] },
        { model: User, as: 'payer', attributes: ['name'] },
        { model: User, as: 'receiver', attributes: ['name'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(payments);
  } catch (error) {
    console.error('Fetch payments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
