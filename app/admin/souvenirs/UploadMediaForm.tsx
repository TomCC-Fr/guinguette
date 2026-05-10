"use client";

    if (!file) return;

    setLoading(true);

    const fileName = `${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase
      .storage
      .from("souvenirs")
      .upload(fileName, file);

    if (uploadError) {
      console.error(uploadError);
      alert("Erreur upload");
      setLoading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase
      .storage
      .from("souvenirs")
      .getPublicUrl(fileName);

    const res = await fetch(
      "/api/admin/media/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          album_id: albumId,
          type: "photo",
          url: publicUrl,
        }),
      }
    );

    setLoading(false);

    if (!res.ok) {
      alert("Erreur sauvegarde média");
      return;
    }

    router.refresh();
  }

  return (
    <div className="space-y-3">

      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
      />

      {loading && (
        <p className="text-sm text-stone-500">
          Upload en cours...
        </p>
      )}

    </div>
  );
}