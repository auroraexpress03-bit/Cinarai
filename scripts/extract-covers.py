import fitz  # PyMuPDF

comics = [1, 2, 3]

for i in comics:
    pdf_path = f"/workspaces/Cinarai/public/comics/komik-{i}/comic.pdf"
    out_path = f"/workspaces/Cinarai/public/comics/komik-{i}/cover.png"
    doc = fitz.open(pdf_path)
    page = doc[0]
    mat = fitz.Matrix(2.0, 2.0)  # 2x scale = ~144 DPI
    pix = page.get_pixmap(matrix=mat)
    pix.save(out_path)
    print(f"OK: {out_path} {pix.width}x{pix.height}")

print("Done")
