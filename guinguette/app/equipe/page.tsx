import Image from "next/image";

function PersonCard({
  name,
  role,
  image,
  description,
  large = false,
}: {
  name: string;
  role: string;
  image: string;
  description?: string;
  large?: boolean;
}) {
  return (
    <div className="group text-center space-y-4 transition">

      {/* PHOTO */}
      <div
        className={`relative mx-auto overflow-hidden rounded-full 
        ${large ? "w-48 h-48" : "w-40 h-40"}`}
      >
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      {/* NOM + ROLE */}
      <div>
        <h3 className="text-lg font-semibold transition group-hover:text-amber-700">
          {name}
        </h3>
        <p className="text-sm text-stone-500">{role}</p>
      </div>

      {description && (
        <p className="text-sm text-stone-600 leading-relaxed max-w-xs mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}

export default function EquipePage() {
  return (
    <div className="min-h-screen bg-white py-24 px-6">
      <div className="max-w-6xl mx-auto space-y-28">

        {/* ================= TITRE ================= */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-semibold">
            👥 Notre équipe
          </h1>
          <p className="text-stone-600 max-w-2xl mx-auto italic">
            Une équipe locale, passionnée et toujours prête à vous accueillir
            au bord du Loir.
          </p>
        </div>

        {/* ================= ASSOCIÉS ================= */}
        <section className="space-y-12">

          <div className="text-center space-y-4">
            <h2 className="text-sm uppercase tracking-[0.3em] text-stone-500">
              Les associés
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              À l’origine de cette aventure, une bande d’amis
              amoureux de convivialité et de bonne cuisine.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <PersonCard
              name="Alexis"
              role="Associé"
              image="/equipe/alexis.jpg"
              description="Toujours partant pour un nouveau projet et un bon moment partagé."
              large
            />

            <PersonCard
              name="Victor"
              role="Associé & gérant"
              image="/equipe/victor.jpg"
              description="Coordonne l’équipe avec énergie et passion."
              large
            />

            <PersonCard
              name="Thomas"
              role="Associé"
              image="/equipe/thomas.jpg"
              description="Veille à ce que l’ambiance reste conviviale et authentique."
              large
            />
          </div>

        </section>

        {/* ================= CUISINE ================= */}
        <section className="space-y-12 border-t border-stone-100 pt-20">

          <div className="text-center space-y-4">
            <h2 className="text-sm uppercase tracking-[0.3em] text-stone-500">
              La cuisine
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Des produits frais, des recettes généreuses et un vrai goût du
              terroir.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <PersonCard
              name="Jean Dupont"
              role="Chef de cuisine"
              image="/equipe/chef.jpg"
              description="Cuisine généreuse et authentique."
            />

            <PersonCard
              name="Sophie Martin"
              role="Second de cuisine"
              image="/equipe/second.jpg"
              description="Toujours attentive aux détails et aux saveurs."
            />

            <PersonCard
              name="Équipe cuisine"
              role="Cuisiniers & aide-cuisine"
              image="/equipe/cuisine.jpg"
              description="Une brigade soudée et passionnée."
            />
          </div>

        </section>

        {/* ================= SALLE ================= */}
        <section className="space-y-12 border-t border-stone-100 pt-20">

          <div className="text-center space-y-4">
            <h2 className="text-sm uppercase tracking-[0.3em] text-stone-500">
              La salle
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Sourires, accueil chaleureux et service attentif pour que
              chaque moment soit agréable.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-10">
            <PersonCard
              name="Équipe salle"
              role="Serveurs & accueil"
              image="/equipe/salle.jpg"
            />
            <PersonCard
              name="Équipe salle"
              role="Serveurs & accueil"
              image="/equipe/salle.jpg"
            />
            <PersonCard
              name="Équipe salle"
              role="Serveurs & accueil"
              image="/equipe/salle.jpg"
            />
            <PersonCard
              name="Équipe salle"
              role="Serveurs & accueil"
              image="/equipe/salle.jpg"
            />
          </div>

        </section>

      </div>
    </div>
  );
}
