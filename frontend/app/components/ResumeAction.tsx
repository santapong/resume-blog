export default function ResumeActions() {
  return (
    <div className="flex gap-4">
      <a 
        href="/resume.pdf" 
        target="_blank" 
        className="bg-blue-600 px-4 py-2 rounded-lg text-white hover:bg-blue-700"
      >
        View CV
      </a>
      <a 
        href="/resume.pdf" 
        download="My_Resume.pdf" 
        className="border border-blue-600 px-4 py-2 rounded-lg text-blue-600 hover:bg-blue-50"
      >
        Download PDF
      </a>
    </div>
  );
}