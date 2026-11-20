export default function MentorDocumentType() {
  return (
    <div className="mb-4">
      <label
        htmlFor="apply-document-type"
        className="block text-xs font-bold text-ink-secondary mb-1.5"
      >
        Jenis dokumen
      </label>
      <select
        id="apply-document-type"
        name="jenisDokumen"
        defaultValue="portofolio"
        className="block w-full sm:max-w-xs min-h-11 rounded-xl border border-line bg-surface px-4 text-sm font-medium text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-accent/20"
      >
        <option value="portofolio">Portofolio</option>
        <option value="transkrip">Transkrip nilai</option>
        <option value="sertifikat">Sertifikat</option>
      </select>
    </div>
  );
}
