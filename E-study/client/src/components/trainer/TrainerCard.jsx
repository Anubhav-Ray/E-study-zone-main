import React from 'react';
import { User, ShieldCheck, Zap, Star, BookOpen, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';

export const TrainerCard = ({ trainer, onConnect, isPending, isConnected }) => {
    return (
        <Card className="p-6 flex flex-col justify-between group hover:border-indigo-500/40">
            <div>
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <Avatar name={trainer.name} size="lg" status="online" />
                        <div>
                            <h3 className="text-lg font-bold text-zinc-100 group-hover:text-indigo-400 transition-colors">
                                {trainer.name}
                            </h3>
                            <p className="text-xs text-zinc-400 font-medium">
                                {trainer.email}
                            </p>
                        </div>
                    </div>
                    <Badge variant="success" size="sm" icon={ShieldCheck}>
                        Verified
                    </Badge>
                </div>

                <p className="text-zinc-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {trainer.trainerProfile?.bio || 'Experienced academic mentor specializing in modern engineering and software development.'}
                </p>

                {/* Skill Badges */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                    {trainer.trainerProfile?.expertise?.length ? (
                        trainer.trainerProfile.expertise.map((skill, idx) => (
                            <span 
                                key={idx} 
                                className="bg-zinc-950/80 text-zinc-300 text-[11px] font-medium px-2.5 py-1 rounded-lg border border-zinc-800"
                            >
                                {skill}
                            </span>
                        ))
                    ) : (
                        <span className="text-xs text-zinc-500 italic">No expertise tags listed</span>
                    )}
                </div>
            </div>

            <Button
                variant={isConnected ? 'success' : isPending ? 'outline' : 'primary'}
                disabled={isPending || isConnected}
                onClick={() => onConnect(trainer._id)}
                className="w-full justify-center"
                icon={isConnected ? ShieldCheck : isPending ? Clock : Zap}
            >
                {isConnected ? 'Connected Mentor' : isPending ? 'Request Pending' : 'Send Handshake'}
            </Button>
        </Card>
    );
};

export default TrainerCard;
