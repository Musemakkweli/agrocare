import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import visaLogo from "../assets/visa.png";
import mastercardLogo from "../assets/mastercard.png";
import paypalLogo from "../assets/paypal.jpg";
import mtnLogo from "../assets/mtn.jpg";
import airtelLogo from "../assets/airtel.png";
import bankLogo from "../assets/bank.jpg";

export default function DonatePage() {
  const { id } = useParams(); // get program ID from URL
  const navigate = useNavigate();

  const programs = [
    {
      id: "1",
      title: "Maize Pest Control Fund",
      description:
        "This program helps farmers fight pest outbreaks by providing pesticides, training, and agronomist support.",
      district: "Huye",
      goal: "$10,000",
      raised: "$3,200",
    },
    {
      id: "2",
      title: "Organic Fertilizer Initiative",
      description:
        "Supporting eco-friendly fertilizer distribution for sustainable farming.",
      district: "Nyamagabe",
      goal: "$7,500",
      raised: "$2,100",
    },
    {
      id: "3",
      title: "Irrigation Expansion",
      description:
        "Helping farmers access irrigation systems to increase crop production.",
      district: "Gisagara",
      goal: "$15,000",
      raised: "$6,400",
    },
  ];

  const program = programs.find((p) => String(p.id) === String(id));

  const [donation, setDonation] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(""); // Visa, Mastercard, PayPal, MTN, Airtel, Bank
  const [cardInfo, setCardInfo] = useState({ name: "", number: "", expiry: "", cvv: "" });
  const [mobileNumber, setMobileNumber] = useState("");
  const [bankDetails, setBankDetails] = useState({ donorBank: "", donorAccount: "" });

  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Program not found
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Donation of $${donation} via ${paymentMethod} completed!\nThank you for supporting ${program.title}`
    );
    setDonation("");
    setPaymentMethod("");
    setCardInfo({ name: "", number: "", expiry: "", cvv: "" });
    setMobileNumber("");
    setBankDetails({ donorBank: "", donorAccount: "" });
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-slate-900 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-md p-8 space-y-6">
        <h1 className="text-3xl font-bold text-green-700 dark:text-green-400">
          Donate to {program.title}
        </h1>

        <p className="text-gray-700 dark:text-gray-300">{program.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div><strong>District:</strong> {program.district}</div>
          <div><strong>Goal:</strong> {program.goal}</div>
          <div><strong>Raised:</strong> {program.raised}</div>
        </div>

        {/* Donation Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">

          {/* Amount */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">
              Donation Amount
            </label>
            <input
              type="number"
              min="1"
              value={donation}
              onChange={(e) => setDonation(e.target.value)}
              placeholder="Enter amount in $"
              required
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Payment Method Selection */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
              Select Payment Method
            </label>
            <div className="flex flex-wrap gap-4">
              {[
                { name: "Visa", logo: visaLogo },
                { name: "Mastercard", logo: mastercardLogo },
                { name: "PayPal", logo: paypalLogo },
                { name: "MTN", logo: mtnLogo },
                { name: "Airtel", logo: airtelLogo },
                { name: "Bank", logo: bankLogo },
              ].map((method) => (
                <button
                  key={method.name}
                  type="button"
                  onClick={() => setPaymentMethod(method.name)}
                  className={`flex items-center gap-2 border p-2 rounded-lg hover:border-green-500 transition ${
                    paymentMethod === method.name ? "border-green-600 bg-green-50 dark:bg-slate-700" : ""
                  }`}
                >
                  <img src={method.logo} alt={method.name} className="w-8 h-8" />
                  <span>{method.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Conditional Fields Based on Payment */}
          {paymentMethod === "Visa" || paymentMethod === "Mastercard" ? (
            <div className="space-y-3">
              <div>
                <label className="block text-gray-700 dark:text-gray-200">Cardholder Name</label>
                <input
                  type="text"
                  value={cardInfo.name}
                  onChange={(e) => setCardInfo({ ...cardInfo, name: e.target.value })}
                  required
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-white"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200">Card Number</label>
                <input
                  type="text"
                  value={cardInfo.number}
                  onChange={(e) => setCardInfo({ ...cardInfo, number: e.target.value })}
                  required
                  placeholder="1234 5678 9012 3456"
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={cardInfo.expiry}
                  onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })}
                  required
                  placeholder="MM/YY"
                  className="w-1/2 p-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-white"
                />
                <input
                  type="text"
                  value={cardInfo.cvv}
                  onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                  required
                  placeholder="CVV"
                  className="w-1/2 p-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>
          ) : null}

          {paymentMethod === "PayPal" && (
            <div>
              <p className="text-gray-700 dark:text-gray-200 mb-2">
                Please send your donation via PayPal to: <b>donations@agrocare.org</b>
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Click Donate below after sending the payment to confirm.
              </p>
            </div>
          )}

          {(paymentMethod === "MTN" || paymentMethod === "Airtel") && (
            <div>
              <p className="text-gray-700 dark:text-gray-200 mb-2">
                {paymentMethod === "MTN"
                  ? "Send your donation via MTN MoMo to: +250 788 123 456"
                  : "Send your donation via Airtel Money to: +250 730 987 654"}
              </p>
              <input
                type="text"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                required
                placeholder="Your phone number used for payment"
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-white"
              />
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Follow your provider instructions to complete the payment.
              </p>
            </div>
          )}

          {paymentMethod === "Bank" && (
            <div className="space-y-3">
              <p className="text-gray-700 dark:text-gray-200">
                Transfer to AgroCare Bank Account:
              </p>
              <ul className="text-gray-700 dark:text-gray-200 list-disc list-inside">
                <li>Bank: Bank of Kigali</li>
                <li>Account Name: AgroCare Ltd</li>
                <li>Account Number: 1234567890</li>
              </ul>

              <input
                type="text"
                value={bankDetails.donorBank}
                onChange={(e) => setBankDetails({ ...bankDetails, donorBank: e.target.value })}
                required
                placeholder="Your Bank Name"
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-white"
              />
              <input
                type="text"
                value={bankDetails.donorAccount}
                onChange={(e) => setBankDetails({ ...bankDetails, donorAccount: e.target.value })}
                required
                placeholder="Your Account Number"
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-white"
              />
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2 rounded-lg bg-gray-300 dark:bg-slate-600 dark:text-white hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!paymentMethod}
              className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-50"
            >
              Donate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
