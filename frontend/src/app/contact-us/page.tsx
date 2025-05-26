"use client";

import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaPaperPlane,
} from "react-icons/fa";
import Link from "next/link";

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);
    setIsError(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Form data submitted:", formData);
      setSubmitMessage(
        "Dziękujemy za wiadomość! Skontaktujemy się z Tobą wkrótce."
      );
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitMessage(
        "Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie później."
      );
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800">
            Skontaktuj się z nami
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Masz pytania lub sugestie? Jesteśmy tutaj, aby pomóc!
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">
              Wyślij nam wiadomość
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Imię i Nazwisko
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm text-black"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Adres Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm text-black"
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Temat
                </label>
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm text-black"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Wiadomość
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm text-black"
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
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
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Wysyłanie...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="mr-2" /> Wyślij Wiadomość
                    </>
                  )}
                </button>
              </div>
              {submitMessage && (
                <p
                  className={`mt-4 text-sm text-center ${
                    isError ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {submitMessage}
                </p>
              )}
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-700 mb-3 flex items-center">
                <FaMapMarkerAlt className="text-green-600 mr-3" size={20} />
                Nasz Adres
              </h3>
              <p className="text-gray-600">
                Loyall Treasures Sp. z o.o.
                <br />
                ul. Przykładowa 123
                <br />
                00-001 Warszawa, Polska
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-700 mb-3 flex items-center">
                <FaEnvelope className="text-green-600 mr-3" size={20} />
                Email
              </h3>
              <a
                href="mailto:kontakt@loyalltreasures.com"
                className="text-green-600 hover:text-green-700 hover:underline"
              >
                kontakt@loyalltreasures.com
              </a>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-700 mb-3 flex items-center">
                <FaPhone className="text-green-600 mr-3" size={20} />
                Telefon
              </h3>
              <a
                href="tel:+48123456789"
                className="text-green-600 hover:text-green-700 hover:underline"
              >
                +48 123 456 789
              </a>
              <p className="text-sm text-gray-500 mt-1">
                Dostępny od poniedziałku do piątku, 9:00 - 17:00.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-6 text-center">
          <p>
            &copy; {new Date().getFullYear()} Loyall Treasures. Wszelkie prawa
            zastrzeżone.
          </p>
          <div className="mt-2">
            <Link
              href="/privacy-policy"
              className="text-gray-400 hover:text-gray-200 mx-2"
            >
              Polityka Prywatności
            </Link>
            <span className="text-gray-500">|</span>
            <Link
              href="/terms-of-service"
              className="text-gray-400 hover:text-gray-200 mx-2"
            >
              Warunki Użytkowania
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactUsPage;
