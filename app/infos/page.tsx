import { Card, CardContent } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { FEATURES } from "@/lib/features";

if (!FEATURES.INFOS) {
  redirect("/");
}

export default function InfosPage() {
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

            <div>
              <h2 className="text-xl font-semibold mb-2">Téléphone</h2>
              <a
                href="tel:+33600000000"
                className="text-amber-700 hover:underline"
              >
                06 00 00 00 00
              </a>
            </div>

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

      </div>
    </div>
  );
}
