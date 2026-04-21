export default function ReservationPage() {
  return (
    <div className="min-h-screen bg-white py-16 px-6">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-2xl md:text-3xl font-semibold mb-10 text-center">
          Réserver une table
        </h1>

        <div className="w-full">
          <iframe
            src="https://ordertab.menu/laguingetteduperechapuis/R%C3%A9servations"
            className="w-full h-[750px] border-0 rounded-xl"
          />
        </div>

        <p className="text-center text-sm text-stone-500 mt-6">
          Si le module ne s'affiche pas, contactez-nous au{" "}
          <a href="tel:0241933900" className="underline">
            02 41 93 39 00
          </a>{" "}
          📞
        </p>

      </div>
    </div>
  );
}