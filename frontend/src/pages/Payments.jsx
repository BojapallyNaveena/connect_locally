import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../utils/api';
import { IndianRupee } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export default function Payments() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(searchParams.get('amount') || 500);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const jobId = searchParams.get('jobId');
  const receiverId = searchParams.get('receiverId');

  const handlePayment = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const res = await axios.post(`${API_URL}/api/payments/orders`, { amount }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setOrderDetails(res.data);
      setShowOtpModal(true); // Always show OTP modal for simulation/demo

    } catch (err) {
      console.error(err);
      alert('Payment failed or cancelled.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpAndPay = async (e) => {
    e.preventDefault();
    if (otp.length !== 4) return alert("Enter 4-digit OTP");

    setVerifyingOtp(true);
    const token = localStorage.getItem('token');

    try {
      // Simulate backend verification
      await axios.post(`${API_URL}/api/payments/verify`, {
        razorpay_order_id: orderDetails.id,
        razorpay_payment_id: 'pay_mock_' + Date.now(),
        razorpay_signature: 'mock_signature',
        jobId,
        receiverId,
        amount
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Payment Successful! (Verified via OTP)');
      setShowOtpModal(false);
      setOtp('');
    } catch (err) {
      alert('Payment Failed');
    } finally {
      setVerifyingOtp(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black py-12 px-4 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="bg-white dark:bg-black/40 backdrop-blur-xl p-8 lg:p-12 rounded-[48px] shadow-2xl border border-slate-100 dark:border-white/5 text-center max-w-sm w-full relative">
        <div className="bg-linear-to-br from-violet-600 to-indigo-600 text-white w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-violet-600/30">
          <IndianRupee size={36} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Secure Payment</h2>
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-10">Safe & Encrypted Transactions</p>

        <div className="relative mb-8">
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xl">₹</span>
          <input
            type="number" value={amount} onChange={e => setAmount(e.target.value)}
            className="w-full text-center text-3xl font-black p-6 bg-slate-50 dark:bg-white/5 border-none rounded-[32px] focus:ring-4 focus:ring-violet-500/20 outline-none dark:text-white transition-all"
            placeholder="0.00"
          />
        </div>

        <button
          onClick={handlePayment} disabled={loading}
          className="w-full bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-black py-5 rounded-[24px] shadow-2xl shadow-violet-600/30 transition-all active:scale-95 disabled:opacity-50 tracking-widest text-[10px] uppercase"
        >
          {loading ? 'Processing...' : `Pay ₹${amount}`}
        </button>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-200 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-black w-full max-w-xs rounded-[40px] p-8 text-center shadow-2xl border border-slate-100 dark:border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 blur-3xl rounded-full"></div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Verify OTP</h3>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-8">Enter the 4-digit code sent to you</p>

            <form onSubmit={verifyOtpAndPay} className="space-y-6">
              <input
                type="text" maxLength="4" required value={otp} onChange={e => setOtp(e.target.value)}
                className="w-full text-center text-4xl font-black tracking-[1em] p-4 bg-slate-50 dark:bg-white/5 rounded-2xl outline-none focus:ring-2 focus:ring-violet-500 dark:text-white"
                placeholder="0000"
              />
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowOtpModal(false)} className="flex-1 py-4 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest">Cancel</button>
                <button type="submit" disabled={verifyingOtp} className="flex-1 py-4 bg-violet-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-violet-600/20 active:scale-95">
                  {verifyingOtp ? '...' : 'Verify'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
