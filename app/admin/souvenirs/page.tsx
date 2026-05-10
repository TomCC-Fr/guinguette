import { createServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import CreateAlbumForm from "./CreateAlbumForm";
import UploadMediaForm from "./UploadMediaForm";

export default async function AdminSouvenirsPage() {
  const supabase = await createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data: albums } = await supabase
    .from("event_albums")
    .select("*")
    .order("event_date", { ascending: false });

  return (
    <div className="min-h-screen bg-white px-6 py-16">
      <div className="max-w-6xl mx-auto space-y-10">

        <div>
          <h1 className="text-3xl font-semibold mb-2">
            Souvenirs 🍷
          </h1>

          <p className="text-stone-500">
            Gérez les albums photos et vidéos.
          </p>
        </div>

        <CreateAlbumForm />

        <div className="space-y-8">
          {albums?.map((album) => (
            <div
              key={album.id}
              className="bg-stone-50 rounded-2xl p-6 space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    {album.title}
                  </h2>

                  <p className="text-sm text-stone-500 mt-1">
                    {album.description}
                  </p>
                </div>

                <div>
                  {album.published ? (
                    <span className="text-emerald-700 text-sm font-medium">
                      ● Publié
                    </span>
                  ) : (
                    <span className="text-amber-700 text-sm font-medium">
                      ● Brouillon
}