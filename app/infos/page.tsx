import { redirect } from "next/navigation";
import { FEATURES } from "@/lib/features";

export default function InfosPage() {
  if (!FEATURES.INFOS) redirect("/");

  return (
    <div className="min-h-screen py-24 px-6" style={{ backgroundColor: "oklch(0.99 0.008 80)" }}>
      <div className="max-w-5xl mx-auto space-y-16">

        {/* ── EN-TÊTE ── */}
        <div className="text-center space-y-4">
          <p className="font-body text-xs uppercase tracking-[0.3em]"
            style={{ color: "oklch(0.58 0.13 148)" }}>
            Informations
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-semibold uppercase tracking-wider"
            style={{ color: "oklch(0.15 0.02 60)" }}>
            Nous retrouver
          </h1>
          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="w-12 h-[1px]" style={{ backgroundColor: "oklch(0.85 0.01 80)" }} />
            <div className="w-2 h-2 rounded-full bg-[oklch(0.58_0.13_148)]" />
            <div className="w-12 h-[1px]" style={{ backgroundColor: "oklch(0.85 0.01 80)" }} />
          </div>
        </div>

        {/* ── INFOS PRATIQUES ── */}
        <div className="grid md:grid-cols-2 gap-5">

          {/* Adresse */}
          <div className="rounded-2xl p-7 space-y-4 transition-colors duration-300"
            style={{ backgroundColor: "oklch(0.97 0.008 80)", border: "1px solid oklch(0.90 0.01 80)" }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "oklch(0.92 0.05 148)" }}>
                <svg className="w-4 h-4" style={{ color: "oklch(0.58 0.13 148)" }}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
              </div>
              <h2 className="font-display text-sm uppercase tracking-widest"
                style={{ color: "oklch(0.15 0.02 60)" }}>
                Adresse
              </h2>
            </div>
            <address className="not-italic font-body text-sm leading-relaxed"
              style={{ color: "oklch(0.45 0.02 60)" }}>
              Guinguette du Père Chapuis<br />
              1 parc des vallées<br />
              49140 Seiches-sur-le-Loir
            </address>
          </div>

          {/* Téléphone */}
          <div className="rounded-2xl p-7 space-y-4 transition-colors duration-300"
            style={{ backgroundColor: "oklch(0.97 0.008 80)", border: "1px solid oklch(0.90 0.01 80)" }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "oklch(0.92 0.05 148)" }}>
                <svg className="w-4 h-4" style={{ color: "oklch(0.58 0.13 148)" }}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>
              </div>
              <h2 className="font-display text-sm uppercase tracking-widest"
                style={{ color: "oklch(0.15 0.02 60)" }}>
                Téléphone
              </h2>
            </div>
            <a href="tel:+33241933900"
              className="font-body text-sm hover:underline transition-colors duration-200"
              style={{ color: "oklch(0.58 0.13 148)" }}>
              02 41 93 39 00
            </a>
          </div>

          {/* Horaires */}
          <div className="rounded-2xl p-7 space-y-4 transition-colors duration-300"
            style={{ backgroundColor: "oklch(0.97 0.008 80)", border: "1px solid oklch(0.90 0.01 80)" }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "oklch(0.92 0.05 148)" }}>
                <svg className="w-4 h-4" style={{ color: "oklch(0.58 0.13 148)" }}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h2 className="font-display text-sm uppercase tracking-widest"
                style={{ color: "oklch(0.15 0.02 60)" }}>
                Horaires
              </h2>
            </div>
            <div className="font-body text-sm space-y-2" style={{ color: "oklch(0.55 0.02 60)" }}>
              {[
                ["Mardi – Jeudi", "11h00 – 22h00"],
                ["Vendredi – Samedi", "11h00 – 23h00"],
                ["Dimanche", "11h00 – 17h00"],
              ].map(([day, hours]) => (
                <div key={day} className="flex justify-between gap-6">
                  <span>{day}</span>
                  <span style={{ color: "oklch(0.25 0.02 60)" }}>{hours}</span>
                </div>
              ))}
              <div className="flex justify-between gap-6 pt-2"
                style={{ borderTop: "1px solid oklch(0.88 0.01 80)" }}>
                <span style={{ color: "oklch(0.70 0.02 60)" }}>Lundi</span>
                <span style={{ color: "oklch(0.70 0.02 60)" }}>Fermé</span>
              </div>
            </div>
          </div>

          {/* Accès & Parking */}
          <div className="rounded-2xl p-7 space-y-4 transition-colors duration-300"
            style={{ backgroundColor: "oklch(0.97 0.008 80)", border: "1px solid oklch(0.90 0.01 80)" }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "oklch(0.92 0.05 148)" }}>
                <svg className="w-4 h-4" style={{ color: "oklch(0.58 0.13 148)" }}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              </div>
              <h2 className="font-display text-sm uppercase tracking-widest"
                style={{ color: "oklch(0.15 0.02 60)" }}>
                Accès & Parking
              </h2>
            </div>
            <p className="font-body text-sm leading-relaxed"
              style={{ color: "oklch(0.45 0.02 60)" }}>
              Parking à proximité immédiate.<br />
              Accès piéton le long du Loir.
            </p>
          </div>

        </div>

        {/* ── CARTE GOOGLE MAPS ── */}
        <div className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid oklch(0.90 0.01 80)" }}>
          <iframe
            src="[google.com](https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3045.8617489176872!2d-0.3607813876280256!3d47.578274609182515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48087396eb106f69%3A0x4c22b9c4331b7ca3!2sGuinguette%20du%20P%C3%A8re%20Chapuis!5e1!3m2!1sen!2sfr!4v1771184964223!5m2!1sen!2sfr)"
            width="100%" height="420" loading="lazy" className="border-0 block"
          />
        </div>

        {/* ── BOUTON ITINÉRAIRE ── */}
        <div className="text-center">
          <a href="[maps.app.goo.gl](https://maps.app.goo.gl/TEixhxhvFZmGyyqV7)"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white font-body font-semibold text-sm tracking-wide active:scale-95 transition-all duration-200"
            style={{ backgroundColor: "oklch(0.58 0.13 148)" }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
            </svg>
            Ouvrir l'itinéraire sur Google Maps
          </a>
        </div>

        {/* ── RÉSEAUX SOCIAUX ── */}
        <div className="rounded-2xl p-8 text-center space-y-6"
          style={{ backgroundColor: "oklch(0.97 0.008 80)", border: "1px solid oklch(0.90 0.01 80)" }}>
          <div className="space-y-2">
            <p className="font-body text-xs uppercase tracking-[0.3em]"
              style={{ color: "oklch(0.58 0.13 148)" }}>
              Réseaux sociaux
            </p>
            <h2 className="font-display text-2xl uppercase tracking-wider"
              style={{ color: "oklch(0.15 0.02 60)" }}>
              Suivez-nous
            </h2>
            <p className="font-body text-sm" style={{ color: "oklch(0.55 0.02 60)" }}>
              Retrouvez toute l'actualité de la guinguette
            </p>
          </div>

          <div className="flex justify-center gap-4">
            {[
              {
                href: "[instagram.com](https://www.instagram.com/guinguetteperechapuis/)",
                label: "Instagram",
                icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />,
              },
              {
                href: "[facebook.com](https://www.facebook.com/guinguetteduperechapuis)",
                label: "Facebook",
                icon: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />,
              },
            ].map((social) => (
              <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-5 py-3 rounded-full transition-all duration-200"
                style={{ border: "1px solid oklch(0.88 0.01 80)" }}>
                <svg className="w-5 h-5 transition-colors duration-200 group-hover:text-[oklch(0.58_0.13_148)]"
                  style={{ color: "oklch(0.65 0.02 60)" }}
                  fill="currentColor" viewBox="0 0 24 24">
                  {social.icon}
                </svg>
                <span className="font-body text-sm transition-colors duration-200 group-hover:text-[oklch(0.15_0.02_60)]"
                  style={{ color: "oklch(0.45 0.02 60)" }}>
                  {social.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
