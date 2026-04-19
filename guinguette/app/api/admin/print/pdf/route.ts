export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { createClient } from "@/lib/supabase-server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const serviceFilter = searchParams.get("service");

  if (!date) {
    return NextResponse.json({ error: "Date requise" }, { status: 400 });
  }

  const supabase = await createClient();

  let query = supabase
    .from("reservations")
    .select("*")
    .eq("date", date)
    .eq("cancelled", false)
    .order("service", { ascending: true })
    .order("heure", { ascending: true });

  if (serviceFilter) {
    query = query.eq("service", serviceFilter);
  }

  const { data: reservations } = await query;

  const doc = new PDFDocument({ margin: 60 });
  const chunks: Buffer[] = [];

  doc.on("data", (chunk) => chunks.push(chunk));
  doc.on("end", () => {});

  // ======================
  // HEADER
  // ======================

  doc
    .fontSize(22)
    .fillColor("#2f3e2f")
    .text("La Guinguette du Père Chapuis", { align: "center" });

  doc.moveDown(0.5);

  doc
    .fontSize(12)
    .fillColor("black")
    .text("Feuille de service - Journée complète", {
      align: "center",
    });

  doc.moveDown(0.5);

  doc
    .fontSize(11)
    .fillColor("gray")
    .text(`Date : ${date}`, { align: "center" });

  doc.moveDown(2);

  // ======================
  // TABLE HEADER
  // ======================

  const startX = 60;
  let y = doc.y;

  const col = {
    service: startX,
    heure: startX + 80,
    nom: startX + 150,
    pers: startX + 380,
    tel: startX + 430,
  };

  doc
    .fontSize(11)
    .fillColor("#2f3e2f")
    .text("Service", col.service, y)
    .text("Heure", col.heure, y)
    .text("Nom", col.nom, y)
    .text("Pers.", col.pers, y)
    .text("Téléphone", col.tel, y);

  y += 18;

  doc
    .moveTo(startX, y)
    .lineTo(550, y)
    .strokeColor("#cccccc")
    .stroke();

  y += 12;

  // ======================
  // TABLE BODY
  // ======================

  let total = 0;

  reservations?.forEach((r) => {
    doc
      .fontSize(11)
      .fillColor("black")
      .text(r.service, col.service, y)
      .text(r.heure, col.heure, y)
      .text(r.nom, col.nom, y)
      .text(String(r.personnes), col.pers, y)
      .text(r.telephone || "", col.tel, y);

    y += 18;
    total += Number(r.personnes);
  });

  doc.moveDown(2);

  // ======================
  // TOTAL
  // ======================

  doc
    .fontSize(12)
    .fillColor("black")
    .text(`Total couverts : ${total}`);

  doc.moveDown(1);

  doc
    .fontSize(11)
    .fillColor("#2f3e2f")
    .text("Notes de service :");

  doc.moveDown(3);

  doc.end();

  const pdfBuffer = await new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=feuille_service_${date}.pdf`,
    },
  });
}
