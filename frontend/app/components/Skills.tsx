import { resumeData } from '@/app/data/resume';
import { Terminal } from 'lucide-react';

export default function Skills() {
  return (
    <section className="py-20 bg-slate-900 text-slate-300 px-6 font-mono">
      <div className="max-w-4xl mx-auto">
        {/* Terminal Header */}
        <div className="bg-slate-800 rounded-t-lg p-3 flex items-center gap-2 border-b border-slate-700">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-xs text-slate-400 ml-2">guest@kali: ~/skills</span>
        </div>

        {/* Terminal Body */}
        <div className="bg-slate-950 p-6 rounded-b-lg shadow-2xl border border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {resumeData.skills.map((group) => (
              <div key={group.category}>
                <div className="flex items-center gap-2 text-blue-400 mb-3">
                  <span className="text-green-500">➜</span>
                  <span className="font-bold uppercase tracking-wider">{group.category}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {group.items.map((skill) => (
                    <span 
                      key={skill} 
                      className="border border-slate-800 bg-slate-900 px-3 py-1 rounded hover:border-blue-500 hover:text-white transition-colors cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Animated Cursor Effect */}
          <div className="mt-8 flex items-center gap-2">
            <span className="text-green-500">guest@kali:~$</span>
            <span className="w-2 h-5 bg-blue-500 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}