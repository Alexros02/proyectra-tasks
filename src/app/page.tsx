'use client';

import Link from 'next/link';
import { ArrowRight, Info, Upload, ShieldCheck, Bot } from 'lucide-react';

export default function Home() {
  return (
    <>
      {/* Fondos decorativos */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[520px] w-[820px] rounded-full blur-3xl opacity-30 bg-gradient-to-tr from-blue-500 via-violet-500 to-fuchsia-500 dark:opacity-25"
      ></div>
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-20 h-[360px] w-[360px] rounded-full blur-3xl opacity-20 bg-gradient-to-br from-cyan-400 to-blue-600"
      ></div>
      {/* Hero */}
      <div className="mx-auto max-w-6xl py-12 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-300/40 bg-blue-50/60 px-3 py-1 text-xs font-medium text-blue-800 backdrop-blur dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-200">
              Nuevo • Asignación híbrida por categorías
            </span>
            <h1 className="mt-4 text-4xl sm:text-6xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-br from-blue-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                Planificador de Trabajos
              </span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Centraliza el ciclo completo: creación, negociación, pago (PayPal y Revolut),
              seguimiento y cierre. Asigna automáticamente por categoría y abre a ofertas si lo
              necesitas.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <a
                href="#crear-tarea"
                aria-label="Crear una tarea"
                tabIndex={0}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:brightness-110 active:brightness-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-background transition"
              >
                Comenzar gratis
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <a
                href="#funcionalidades"
                aria-label="Ver funcionalidades"
                tabIndex={0}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300/70 dark:border-gray-700/70 bg-white/70 dark:bg-white/5 px-6 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100 hover:bg-white/90 dark:hover:bg-white/10 backdrop-blur focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-background transition"
              >
                <Info className="h-4 w-4" aria-hidden />
                Ver funcionalidades
              </a>
            </div>
            <div className="mt-4 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden />
                Sin tarjeta
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Upload className="h-3.5 w-3.5 text-blue-600" aria-hidden />
                Subida de archivos
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Bot className="h-3.5 w-3.5 text-violet-600" aria-hidden />
                Chat seguro
              </span>
            </div>
          </div>
          <div className="relative">
            <div
              className="absolute -inset-3 rounded-2xl bg-gradient-to-tr from-blue-600/20 via-indigo-600/20 to-fuchsia-600/20 blur-2xl"
              aria-hidden
            ></div>
            <div className="relative aspect-[16/10] w-full rounded-2xl border border-white/20 dark:border-white/10 bg-white/60 dark:bg-white/5 p-4 shadow-2xl backdrop-blur">
              <div className="h-full w-full rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-white/10 dark:to-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center text-center">
                <div className="px-4">
                  <p className="mt-3 text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">
                    Crea, negocia y cobra en un solo lugar
                  </p>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    Simplifica tu flujo con pagos integrados, acuerdos trazables y estados claros.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Funcionalidades */}
      <div id="funcionalidades" className="mx-auto max-w-6xl py-12 sm:py-20">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Todo lo que necesitas para gestionar tus trabajos
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Diseñado para uso personal con clientes, de principio a fin.
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            title="Cliente"
            items={[
              'Crear tareas con título, descripción y archivos',
              'Seleccionar categoría del servicio',
              'Ver estado en tiempo real',
              'Negociar condiciones por chat seguro',
              'Confirmar precio y fecha',
            ]}
          />
          <FeatureCard
            title="Administrador"
            items={[
              'Asociado a categorías de especialidad',
              'Recibe automáticamente tareas de su categoría',
              'Revisar y proponer precio y fecha',
              'Gestionar estados de la tarea',
              'Subir avances y entregas parciales',
            ]}
          />
          <FeatureCard
            title="Chat seguro"
            items={[
              'Canal central con registro inalterable',
              'Sirve como contrato digital',
              'Soporte de texto, imágenes y videos',
            ]}
          />
          <FeatureCard
            title="Pagos"
            items={[
              'Integración PayPal y Revolut',
              'Asociación automática a la tarea',
              'Facturación básica opcional',
            ]}
          />
          <FeatureCard
            title="Inteligencia Artificial"
            items={[
              'Analiza descripción y estima complejidad',
              'Sugiere rango de precios y tiempo',
              'Ayuda como referencia de negociación',
            ]}
          />
        </div>
      </div>

      {/* Asignación Híbrida */}
      <div id="asignacion-hibrida" className="mx-auto max-w-6xl py-12 sm:py-20">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Asignación híbrida: automática con opción a ofertas
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Equilibrio perfecto entre rapidez para el cliente y flexibilidad para administradores.
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group relative rounded-2xl border border-white/20 dark:border-white/10 p-6 bg-white/60 dark:bg-white/5 backdrop-blur shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Asignación automática
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>1) Cliente crea tarea y selecciona una categoría</li>
              <li>2) El sistema asigna a un administrador disponible de esa categoría</li>
              <li>3) El administrador propone precio y fecha</li>
            </ul>
          </div>
          <div className="group relative rounded-2xl border border-white/20 dark:border-white/10 p-6 bg-white/60 dark:bg-white/5 backdrop-blur shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Fallback a ofertas
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>1) Si el cliente rechaza la propuesta inicial</li>
              <li>2) La tarea se abre a varios administradores de la categoría</li>
              <li>3) El cliente elige una oferta o cancela</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Flujo */}
      <div id="crear-tarea" className="mx-auto max-w-6xl py-12 sm:py-20">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Flujo de trabajo simple y transparente
        </h2>
        <ol className="mt-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            'En revisión',
            'Pendiente',
            'Aceptada',
            'En curso',
            'Finalizada',
            'Rechazada (opcional)',
          ].map((step, index) => (
            <li
              key={step}
              className="group rounded-xl border border-black/10 dark:border-white/10 p-4 bg-white/60 dark:bg-white/5 backdrop-blur shadow-sm hover:shadow-md transition"
            >
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Paso {index + 1}
              </p>
              <p className="mt-2 font-medium text-gray-900 dark:text-white">{step}</p>
              <div className="mt-3 h-1.5 w-full rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 group-hover:translate-x-1 transition`}
                  style={{ width: `${Math.min(16 * (index + 1), 100)}%` }}
                ></div>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <Link
            href="/tasks"
            aria-label="Ir a tareas"
            tabIndex={0}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:brightness-110 active:brightness-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-background transition"
          >
            Crear mi primera tarea
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>

      {/* Casos de Uso */}
      <div id="casos-de-uso" className="mx-auto max-w-6xl py-12 sm:py-20">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Casos de uso
        </h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-white/20 dark:border-white/10 p-6 bg-white/60 dark:bg-white/5 backdrop-blur">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Caso simple</h3>
            <ol className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
              <li>Cliente crea tarea con descripción e imágenes</li>
              <li>Administrador propone precio y fecha</li>
              <li>Cliente acepta y paga</li>
              <li>Se ejecuta el trabajo</li>
              <li>Se marca como finalizado</li>
            </ol>
          </div>
          <div className="rounded-2xl border border-white/20 dark:border-white/10 p-6 bg-white/60 dark:bg-white/5 backdrop-blur">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Caso con negociación
            </h3>
            <ol className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
              <li>Cliente describe una tarea ambigua</li>
              <li>Se aclaran detalles mediante el chat</li>
              <li>IA sugiere complejidad y rango de precio</li>
              <li>Se acuerda presupuesto final</li>
              <li>Cliente paga → se inicia el trabajo</li>
            </ol>
          </div>
          <div className="rounded-2xl border border-white/20 dark:border-white/10 p-6 bg-white/60 dark:bg-white/5 backdrop-blur">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Caso de rechazo</h3>
            <ol className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
              <li>Cliente crea una tarea</li>
              <li>Administrador considera que no es viable</li>
              <li>La tarea se cierra con estado rechazada</li>
            </ol>
          </div>
          <div className="rounded-2xl border border-white/20 dark:border-white/10 p-6 bg-white/60 dark:bg-white/5 backdrop-blur">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Caso híbrido</h3>
            <ol className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
              <li>Cliente crea tarea y selecciona categoría</li>
              <li>Asignación automática al administrador disponible</li>
              <li>Administrador propone precio y fecha</li>
              <li>Cliente acepta o abre a ofertas de la misma categoría</li>
              <li>Cliente elige una oferta o cancela</li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}

type FeatureCardProps = {
  title: string;
  items: string[];
};

const FeatureCard = ({ title, items }: FeatureCardProps) => {
  return (
    <div className="group relative rounded-2xl border border-white/20 dark:border-white/10 p-6 bg-white/60 dark:bg-white/5 backdrop-blur shadow-sm hover:shadow-lg transition">
      <div
        className="absolute -inset-px rounded-2xl bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-fuchsia-600/10 opacity-0 group-hover:opacity-100 transition"
        aria-hidden
      ></div>
      <h3 className="relative text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      <ul className="relative mt-4 space-y-2">
        {items.map(text => (
          <li
            key={text}
            className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300"
          >
            <span className="mt-1 h-2 w-2 rounded-full bg-gradient-to-br from-blue-600 to-violet-600"></span>
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
