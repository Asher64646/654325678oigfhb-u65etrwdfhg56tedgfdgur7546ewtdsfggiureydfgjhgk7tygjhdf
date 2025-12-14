useEffect(() => {
  const saved = localStorage.getItem("asher-project");
  if (saved) setManifest(JSON.parse(saved));
}, []);

useEffect(() => {
  if (manifest) {
    localStorage.setItem("asher-project", JSON.stringify(manifest));
  }
}, [manifest]);
"use client";

import { useMemo, useState } from "react";
import JSZip from "jszip";

export default function Page() {
  const [brief, setBrief] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [showPreview, setShowPreview] = useState(true);

  const [manifest, setManifest] = useState(null);
  const [selected, setSelected] = useState(0);
  const [edits, setEdits] = useState({}); // { [path]: { html } }

  const pages = manifest?.pages || [];
  const currentPage = pages[selected];

  const currentHtml = useMemo(() => {
    if (!currentPage) return "";
    return edits[currentPage.path]?.html ?? currentPage.html;
  }, [currentPage, edits]);

  async function generate(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    setManifest(null);
    setSelected(0);
    setEdits({});

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief }),
      });

      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      setManifest(data);
      setSelected(0);
      setShowPreview(true);
    } catch (ex) {
      setErr(ex?.message || "Generate failed");
    } finally {
      setLoading(false);
    }
  }

  async function exportZip() {
    if (!manifest) return;
    const zip = new JSZip();

    (manifest.pages || []).forEach((p) => {
      const name = p.path === "/" ? "index.html" : p.path.replace("/", "") + ".html";
      const html = edits[p.path]?.html ?? p.html;
      zip.file(name, html);
    });

    zip.file(
      "README.txt",
      `Asher AI export\n\nUpload these HTML files to any static host.\nHome is index.html\n`
    );

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${manifest.title || "asher-ai-site"}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function setPreset(text) {
    setBrief(text);
  }

  return (
    <div className="asher-bg">
      <div className="card" style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
        <div className="row" style={{ alignItems: "center", justifyContent: "space-between" }}>
          <div className="row" style={{ alignItems: "center" }}>
            <img
              src="https://image2url.com/images/1765564566111-6083ed51-e395-4ee6-975d-9d55ac7e9dff.png"
              alt="Asher AI"
              style={{ width: 44, height: 44 }}
            />
            <div>
              <div className="h1">Asher AI</div>
              <div className="sub">Describe your website — Asher generates a professional multi-page site.</div>
            </div>
          </div>

          <div className="row" style={{ alignItems: "center" }}>
            <button className="btn" onClick={() => setShowPreview((v) => !v)}>
              {showPreview ? "Hide Preview" : "Show Preview"}
            </button>
            <button className="btn btnPrimary" disabled={!manifest} onClick={exportZip}>
              Export ZIP
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "16px auto 0" }} className={`grid grid3`}>
        {/* LEFT: Builder / Editor */}
        <div className="card" style={{ padding: 16 }}>
          <form onSubmit={generate} className="grid" style={{ gap: 12 }}>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Describe your website</div>
              <textarea
                className="textarea"
                rows={showPreview ? 10 : 16}
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder='Example: "A modern agency site with services, pricing, testimonials, contact form. Black/purple galaxy vibe."'
              />
              <div className="small" style={{ marginTop: 8 }}>
                Tip: try presets to see multi-page output fast.
              </div>
            </div>

            <div className="row">
              <button className="btn btnPrimary" disabled={loading || !brief.trim()} type="submit">
                {loading ? "Generating…" : "Generate site"}
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setBrief("");
                  setManifest(null);
                  setEdits({});
                  setSelected(0);
                  setErr("");
                }}
              >
                Reset
              </button>
            </div>

            <div className="row">
              <button className="btn" type="button" onClick={() => setPreset("A sleek agency portfolio with services, case studies, pricing, testimonials, contact. Galaxy black/purple theme.")}>
                Agency
              </button>
              <button className="btn" type="button" onClick={() => setPreset("A personal portfolio with hero, projects, about, skills, contact. Dark premium style.")}>
                Portfolio
              </button>
              <button className="btn" type="button" onClick={() => setPreset("A SaaS landing page with features, pricing, FAQs, testimonials, and a strong CTA. Purple/black modern.")}>
                SaaS
              </button>
            </div>

            {err ? <div style={{ color: "#ff6b6b" }}>{err}</div> : null}
          </form>

          <hr className="hr" />

          <div style={{ fontWeight: 800, marginBottom: 8 }}>Editor</div>
          <div className="small" style={{ marginBottom: 10 }}>
            Select a page tab, then edit its HTML. Preview updates instantly.
          </div>

          <div className="tabs" style={{ marginBottom: 10 }}>
            {(pages || []).map((p, i) => (
              <div
                key={p.path}
                className={`tab ${i === selected ? "tabActive" : ""}`}
                onClick={() => setSelected(i)}
              >
                {p.title}
              </div>
            ))}
          </div>

          {!manifest ? (
            <div className="small">Generate a site to unlock the editor + preview.</div>
          ) : (
            <textarea
              className="textarea"
              rows={showPreview ? 12 : 22}
              value={currentPage ? (edits[currentPage.path]?.html ?? currentPage.html) : ""}
              onChange={(e) => {
                const next = e.target.value;
                const path = currentPage?.path;
                if (!path) return;
                setEdits((prev) => ({ ...prev, [path]: { html: next } }));
              }}
            />
          )}
        </div>

        {/* RIGHT: Preview */}
        {showPreview ? (
          <div className="card" style={{ padding: 16 }}>
            <div className="row" style={{ alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 800 }}>Live Preview</div>
                <div className="small">
                  Tip: open dev tools if you want to inspect the generated HTML.
                </div>
              </div>
              <div className="small">
                Shortcut: <span className="kbd">Ctrl</span> + <span className="kbd">F5</span> refresh
              </div>
            </div>

            <hr className="hr" />

            {!manifest ? (
              <div className="small">No site yet. Click “Generate site”.</div>
            ) : (
              <div className="iframeWrap">
                <iframe className="iframe" title="preview" srcDoc={currentHtml} />
              </div>
            )}
          </div>
        ) : null}
      </div>

      <div style={{ maxWidth: 1100, margin: "14px auto 0" }} className="small">
        Brand: Asher AI · Assistant: Asher · Export ZIP creates static HTML files.
      </div>
    </div>
  );
}
