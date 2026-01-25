import { resumeData } from '@/app/data/resume';
import { Briefcase } from 'lucide-react';

export default function Experience() {
  return (
    <section className="py-20 bg-white px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 flex items-center gap-3 text-slate-900">
          <Briefcase className="text-blue-600" /> Professional Experience
        </h2>
        
        <div className="space-y-12">
          {resumeData.experience.map((job, index) => (
            <div key={index} className="relative pl-8 border-l-2 border-slate-100">
              <div className="absolute w-4 h-4 bg-blue-600 rounded-full -left-[9px] top-1 outline outline-4 outline-white" />
              <div className="flex flex-wrap justify-between items-baseline mb-2">
                <h3 className="text-xl font-bold text-slate-800">{job.title}</h3>
                <span className="text-sm font-mono text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                  {job.period}
                </span>
              </div>
              <p className="text-blue-600 font-medium mb-3">{job.company}</p>
              <p className="text-slate-600 mb-4 leading-relaxed">{job.description}</p>
              <div className="flex flex-wrap gap-2">
                {job.technologies.map(tech => (
                  <span key={tech} className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}