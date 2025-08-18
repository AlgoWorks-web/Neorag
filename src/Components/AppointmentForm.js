import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DateTime } from "luxon";

/* Available service options */
const services = [
  "Web Solutions",
  "Mobility Solutions",
  "Digital Solutions",
  "Branding & Creative",
  "Hosting Solutions",
  "Start-Up Consulting",
];

const AppointmentForm = () => {
  const navigate = useNavigate();

  /* live CST clock */
  const [currentCSTTime, setCurrentCSTTime] = useState(
    DateTime.now().setZone("America/Chicago")
  );
  useEffect(() => {
    const i = setInterval(
      () => setCurrentCSTTime(DateTime.now().setZone("America/Chicago")),
      1000
    );
    return () => clearInterval(i);
  }, []);

  /* generate 48 half-hour slots: 00:00, 00:30 … 23:30 */
  const timeSlots = useMemo(
    () =>
      Array.from({ length: 48 }, (_, i) =>
        DateTime.fromObject({ hour: 0, minute: 0 })
          .plus({ minutes: 30 * i })
          .toFormat("HH:mm")
      ),
    []
  );

  /* form state */
  const [formData, setFormData] = useState({
    service: "",
    date: "",
    time: "",
    fullName: "",
    email: "",
    countryCode: "+91",
    phone: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  /* handle input changes */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const digits = value.replace(/\D/g, "");
      if (digits.length <= 10) {
        setFormData((p) => ({ ...p, phone: digits }));
      }
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  /* submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    if (formData.phone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits.");
      setLoading(false);
      return;
    }

    try {
      /* build CST datetime */
      const cstDateTime = DateTime.fromFormat(
        `${formData.date} ${formData.time}`,
        "yyyy-MM-dd HH:mm",
        { zone: "America/Chicago" }
      );

      const payload = {
        serviceType: formData.service,
        date: cstDateTime.toFormat("yyyy-MM-dd"),
        timeSlot: `${cstDateTime.toFormat("hh:mm a")} - ${cstDateTime
          .plus({ hours: 1 })
          .toFormat("hh:mm a")}`,
        fullName: formData.fullName,
        email: formData.email,
        countryCode: formData.countryCode,
        phone: formData.phone,
        msg: formData.notes,
      };

      const res = await fetch("https://hydersoft.com/api/connectingwires/bookanappointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const txt = await res.text();
      if (res.status === 302 || txt.startsWith("<!DOCTYPE html")) {
        throw new Error("Invalid API endpoint or HTML response.");
      }
      const data = JSON.parse(txt);

      if (res.ok && data.statusCode === 200) {
        toast.success(data.statusMsg || "Appointment booked successfully!we reach you out soon");
        setFormData({
          service: "",
          date: "",
          time: "",
          fullName: "",
          email: "",
          countryCode: "+91",
          phone: "",
          notes: "",
        });
        setTimeout(() => navigate("/"), 2000);
      } else {
        toast.error(data.statusMsg || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("API error:", err.message);
      toast.error(`Could not connect to the server.\n${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  /* UI */
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <ToastContainer />
        {/* header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-customBlue mb-2">
            Book Your Slot Now
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Fill out the form below to schedule your appointment
          </p>
          <p className="text-sm text-gray-500">
            ⏰ Current CST Time:{" "}
            <span className="font-semibold">
              {currentCSTTime.toFormat("yyyy-MM-dd hh:mm:ss a")}
            </span>
          </p>
        </div>

        {/* form */}
        <form
          onSubmit={handleSubmit}
          className={`bg-white shadow-sm rounded-lg px-8 pt-6 pb-8 mb-4 border border-gray-200 ${
            loading ? "cursor-wait" : ""
          }`}
        >
          {/* service */}
          <div className="mb-6">
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-customBlue focus:border-transparent"
            >
              <option value="" disabled>
                Select a service…
              </option>
              {services.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* date + half-hour time slot */}
          <div className="grid md:grid-cols-2 gap-6 mb-2">
            <div>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBlue focus:border-transparent"
              />
            </div>
            <div>
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-customBlue focus:border-transparent"
              >
                <option value="" disabled>
                  Select time…
                </option>
                {timeSlots.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-6 italic">
            Note: All times are in CST (Central Standard Time)
          </p>

          {/* full name */}
          <div className="mb-6">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full name"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBlue focus:border-transparent"
            />
          </div>

          {/* email + phone */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBlue focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                placeholder="+91"
                required
                className="w-24 px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBlue focus:border-transparent"
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone number"
                required
                maxLength={10}
                pattern="\d{10}"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBlue focus:border-transparent"
              />
            </div>
          </div>

          {/* notes */}
          <div className="mb-8">
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes (optional)"
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBlue focus:border-transparent"
            />
          </div>

          {/* submit */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105 ${
                loading ? "opacity-70 cursor-wait" : ""
              }`}
            >
              {loading && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              )}
              {loading ? "Submitting…" : "Submit Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;

