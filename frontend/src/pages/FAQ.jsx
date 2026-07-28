import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "¿De qué material están hechos los bolsos?",
    answer: "Todos nuestros productos están elaborados con cuero 100% genuino de primera calidad (grano completo y grano superior), lo que garantiza una durabilidad excepcional y un envejecimiento hermoso con el tiempo."
  },
  {
    question: "¿Cuánto tardan en realizar los envíos?",
    answer: "Los envíos estándar dentro del país demoran entre 3 y 5 días hábiles. También ofrecemos envíos exprés (1-2 días hábiles) por un costo adicional."
  },
  {
    question: "¿Tienen política de devolución?",
    answer: "Sí, aceptamos devoluciones dentro de los 30 días posteriores a la recepción de tu compra, siempre y cuando el producto esté sin uso, en sus condiciones originales y con todas las etiquetas."
  },
  {
    question: "¿Cómo debo cuidar mi bolso de cuero?",
    answer: "Recomendamos evitar la exposición prolongada al sol directo y a la humedad. Límpialo suavemente con un paño seco y aplica una crema especial para cuero cada 3-6 meses para mantenerlo hidratado."
  },
  {
    question: "¿Hacen envíos internacionales?",
    answer: "Por el momento, nuestros envíos se concentran a nivel nacional. Sin embargo, estamos trabajando para expandir nuestros horizontes próximamente. ¡Suscríbete a nuestro boletín para enterarte de novedades!"
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-brand-50 pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16 reveal opacity-0 translate-y-12 transition-all duration-1000 ease-out delay-100">
          <span className="text-brand-600 font-bold tracking-[0.3em] text-xs uppercase mb-4 block">Resolviendo dudas</span>
          <h1 className="text-5xl font-serif text-brand-900 mb-6">Preguntas Frecuentes</h1>
          <p className="text-brand-700 text-lg font-light">Encuentra respuestas rápidas a las preguntas más comunes de nuestros clientes.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`reveal opacity-0 translate-y-12 transition-all duration-700 ease-out bg-white rounded-2xl shadow-sm border border-brand-100 overflow-hidden cursor-pointer`}
              style={{ transitionDelay: `${index * 100 + 200}ms` }}
              onClick={() => toggleFAQ(index)}
            >
              <div className="p-6 flex justify-between items-center bg-white/50 hover:bg-brand-50/50 transition-colors">
                <h3 className="font-bold text-brand-900 pr-4">{faq.question}</h3>
                <ChevronDown className={`w-5 h-5 text-brand-500 transition-transform duration-300 flex-shrink-0 ${openIndex === index ? 'rotate-180' : ''}`} />
              </div>
              <div 
                className={`transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'} px-6`}
              >
                <p className="text-brand-700 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-20 text-center reveal opacity-0 translate-y-12 transition-all duration-1000 ease-out delay-700">
          <p className="text-brand-600 mb-4 font-medium">¿Aún tienes dudas?</p>
          <a href="#nosotros" className="inline-block bg-white text-brand-900 border border-brand-200 px-8 py-3 rounded-full font-bold tracking-widest text-xs uppercase shadow-sm hover:shadow-md hover:border-brand-300 transition-all">Contáctanos</a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
