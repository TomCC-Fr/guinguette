import { Card, CardContent } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { FEATURES } from "@/lib/features";

export default function InfosPage() {
  
  if (!FEATURES.INFOS) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-5xl mx-auto space-y-16">

        <h1 className="text-4xl font-bold text-center">
          📍 Nous retrouver
        </h1>

        {/* ================= INFOS ================= */}
        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-8 space-y-6 text-center">

            <div>
              <h2 className="text-xl font-semibold mb-2">Adresse</h2>
              <p className="text-stone-700">
                Guinguette du Père Chapuis 
                <br />
                1 parc des vallées 
                <br />
                49140 Seiches-sur-le-Loir
              </p>
            </div>

{/*            <div>
              <h2 className="text-xl font-semibold mb-2">Téléphone</h2>
              <a
                href="tel:+33600000000"
                className="text-amber-700 hover:underline"
              >
                06 00 00 00 00
              </a>
            </div> */}

            <div>
              <h2 className="text-xl font-semibold mb-2">Horaires</h2>
              <p className="text-stone-700">
                Mardi – Dimanche : 11h30 – 22h
                <br />
                Vendredi & Samedi : 11h30 – 00h  
                <br />
                Fermé le lundi
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Accès & Parking</h2>
              <p className="text-stone-700">
                Parking à proximité immédiate.  
                Accès piéton le long du Loir.
              </p>
            </div>

          </CardContent>
        </Card>

        {/* ================= CARTE ================= */}
        <div className="rounded-2xl overflow-hidden shadow-md">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3045.8617489176872!2d-0.3607813876280256!3d47.578274609182515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48087396eb106f69%3A0x4c22b9c4331b7ca3!2sGuinguette%20du%20P%C3%A8re%20Chapuis!5e1!3m2!1sen!2sfr!4v1771184964223!5m2!1sen!2sfr" 
            width="100%"
            height="450"
            loading="lazy"
            className="border-0"
          ></iframe>
        </div>

        {/* ================= BOUTON ITINÉRAIRE ================= */}
        <div className="text-center">
          <a
            href="https://maps.app.goo.gl/TEixhxhvFZmGyyqV7"
            target="_blank"
            className="inline-block bg-stone-800 text-white px-6 py-3 rounded-xl hover:bg-stone-700 transition"
          >
            Ouvrir l’itinéraire sur Google Maps
          </a>
        </div>

        {/* ================= RÉSEAUX SOCIAUX ================= */}
        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-8 text-center space-y-6">

            <h2 className="text-xl font-semibold">
              📱 Suivez-nous
            </h2>

            <p className="text-stone-600">
              Retrouvez toute l’actualité de la guinguette
            </p>

            <div className="flex justify-center gap-6">

              {/* INSTAGRAM */}
              <a
                href="https://www.instagram.com/guinguetteperechapuis/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-14 h-14 rounded-full border border-stone-300 hover:border-stone-900 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-stone-600 group-hover:text-black transition"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17" cy="7" r="1.5" />
                </svg>
              </a>

              {/* FACEBOOK */}
              <a
                href="https://www.facebook.com/guinguetteduperechapuis"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-14 h-14 rounded-full border border-stone-300 hover:border-stone-900 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-stone-600 group-hover:text-black transition"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M13 22v-8h3l1-4h-4V7c0-1 0-2 2-2h2V1h-3c-4 0-6 2-6 6v3H5v4h3v8h5z" />
                </svg>
              </a>

            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  );
}