import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-brand-50 pt-24 overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-5xl mx-auto text-center reveal opacity-0 translate-y-12 transition-all duration-1000 ease-out">
          <span className="text-brand-600 font-bold tracking-[0.3em] text-xs uppercase mb-6 block">Nuestra Esencia</span>
          <h1 className="text-5xl md:text-7xl font-serif text-brand-900 mb-8 leading-tight">
            La belleza de lo <br/><span className="text-brand-600/90 italic">auténtico.</span>
          </h1>
          <p className="text-lg md:text-xl text-brand-800 max-w-2xl mx-auto font-light leading-relaxed">
            KALMA nace de la pasión por el diseño atemporal y el trabajo artesanal. 
            Creamos piezas que acompañan tu vida, diseñadas para durar y heredar.
          </p>
        </div>
      </section>

      {/* Historia e Imagen */}
      <section className="py-20 px-6 relative">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-brand-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-y-1/2 pointer-events-none z-0"></div>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
          <div className="order-2 md:order-1 reveal opacity-0 -translate-x-12 transition-all duration-1000 ease-out delay-200">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative">
              <div className="absolute inset-0 bg-brand-900/10 mix-blend-overlay z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1000&auto=format&fit=crop" 
                alt="Artesano trabajando cuero" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="order-1 md:order-2 space-y-8 reveal opacity-0 translate-x-12 transition-all duration-1000 ease-out delay-400">
            <h2 className="text-4xl font-serif text-brand-900">Nuestros Inicios</h2>
            <p className="text-brand-700 leading-relaxed font-light">
              Todo comenzó en un pequeño taller familiar donde aprendimos que la calidad no admite atajos. 
              Durante años, perfeccionamos la técnica de curtido vegetal y el cosido a mano.
            </p>
            <p className="text-brand-700 leading-relaxed font-light">
              Hoy, KALMA es una marca que fusiona el legado de la marroquinería tradicional con líneas 
              puras y minimalistas, pensadas para la mujer moderna que valora el lujo sutil.
            </p>
            <div className="pt-4">
              <img src="/logo.svg" alt="Firma Kalma" className="h-12 opacity-50 grayscale" />
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 reveal opacity-0 translate-y-12 transition-all duration-1000 ease-out">
            <h2 className="text-4xl font-serif text-brand-900">Nuestros Pilares</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "Cuero Premium",
                desc: "Seleccionamos minuciosamente cueros de grano completo, conocidos por su resistencia y por desarrollar una hermosa pátina con el paso del tiempo."
              },
              {
                title: "Diseño Ético",
                desc: "Trabajamos directamente con artesanos locales, asegurando condiciones justas y manteniendo vivo el oficio en nuestra comunidad."
              },
              {
                title: "Atención al Detalle",
                desc: "Cada puntada, cada herraje y cada borde terminado a mano refleja nuestro compromiso absoluto con la excelencia."
              }
            ].map((valor, i) => (
              <div 
                key={i} 
                className="bg-brand-50 p-10 rounded-3xl text-center reveal opacity-0 translate-y-12 transition-all duration-1000 ease-out"
                style={{ transitionDelay: `${i * 200}ms` }}
              >
                <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm mb-6 text-2xl font-serif text-brand-900">
                  {i + 1}
                </div>
                <h3 className="text-xl font-bold text-brand-900 mb-4">{valor.title}</h3>
                <p className="text-brand-700 text-sm leading-relaxed">{valor.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
