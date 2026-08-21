import React from 'react';
import { User, Award, ShieldCheck, Zap } from 'lucide-react';

const TrainerCard = ({ trainer, onConnect, isPending, isConnected }) => {
    return (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-slate-500 transition group">
            <div className="flex items-start justify-between mb-4">
                <div className="bg-primary/20 p-3 rounded-xl group-hover:scale-110 transition">
                    <User className="text-primary-light w-8 h-8" />
                </div>
                <div className="flex items-center text-xs font-semibold bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">
                    <ShieldCheck className="w-3 h-3 mr-1" />
                    Verified
                </div>
            </div>

            <h3 className="text-xl font-bold mb-1">{trainer.name}</h3>
            <p className="text-slate-400 text-sm mb-4 line-clamp-2">{trainer.trainerProfile?.bio || 'Professional IT Trainer specializing in modern technologies.'}</p>

            <div className="flex flex-wrap gap-2 mb-6">
                {trainer.trainerProfile?.expertise?.map((skill, idx) => (
                    <span key={idx} className="bg-slate-900 text-slate-300 text-[10px] px-2 py-1 rounded-md border border-slate-700">
                        {skill}
                    </span>
                ))}
            </div>

            <button 
                disabled={isPending || isConnected}
                onClick={() => onConnect(trainer._id)}
                className={`w-full py-3 rounded-xl font-bold transition flex items-center justify-center space-x-2 
                    ${isConnected ? 'bg-emerald-600 text-white' : 
                      isPending ? 'bg-slate-700 text-slate-400' : 'bg-primary hover:bg-primary-dark text-white'}`}
            >
                {isConnected ? <span>Connected</span> : isPending ? <span>Request Sent</span> : (
                    <>
                        <Zap size={16} />
                        <span>Send Handshake</span>
                    </>
                )}
            </button>
        </div>
    );
};

export default TrainerCard;
