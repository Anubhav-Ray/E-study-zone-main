import React, { useEffect, useRef } from 'react';

/**
 * InteractiveDotBackground
 * A structured Dot Grid Matrix with real-time Magnetic Attraction Physics.
 * Dots are magnetically pulled towards the cursor when hovered and spring
 * smoothly back into their exact geometric grid alignment when the mouse moves away.
 */
export const InteractiveDotBackground = ({ className = '' }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const mouse = {
            x: -1000,
            y: -1000,
            radius: 170
        };

        const gridGap = 28; // Equidistant spacing between dots in pixels
        let dots = [];

        const initGrid = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            dots = [];

            const cols = Math.ceil(width / gridGap) + 1;
            const rows = Math.ceil(height / gridGap) + 1;

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const baseX = c * gridGap;
                    const baseY = r * gridGap;
                    dots.push({
                        baseX,
                        baseY,
                        x: baseX,
                        y: baseY,
                        vx: 0,
                        vy: 0,
                        baseRadius: 1.1,
                        baseAlpha: 0.08
                    });
                }
            }
        };

        initGrid();

        const handleResize = () => {
            initGrid();
        };

        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const handleMouseLeave = () => {
            mouse.x = -1000;
            mouse.y = -1000;
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            const spring = 0.14;
            const friction = 0.82;
            const maxAttractPull = 22; // Maximum pixel displacement towards cursor

            for (let i = 0; i < dots.length; i++) {
                const dot = dots[i];
                const dx = mouse.x - dot.baseX;
                const dy = mouse.y - dot.baseY;
                const distance = Math.hypot(dx, dy);

                let targetX = dot.baseX;
                let targetY = dot.baseY;
                let radius = dot.baseRadius;
                let alpha = dot.baseAlpha;
                let color = `rgba(255, 255, 255, ${alpha})`;

                if (distance < mouse.radius && mouse.x > 0) {
                    const proximity = 1 - distance / mouse.radius; // 0 to 1
                    const pull = Math.pow(proximity, 1.4) * maxAttractPull;
                    
                    // Magnetic attraction towards cursor
                    const angle = Math.atan2(dy, dx);
                    targetX = dot.baseX + Math.cos(angle) * pull;
                    targetY = dot.baseY + Math.sin(angle) * pull;

                    radius = dot.baseRadius + proximity * 1.8; // Grow up to ~2.9px
                    alpha = dot.baseAlpha + proximity * 0.8; // Brighten up to ~0.88

                    // Color shift based on magnetic pull intensity
                    if (proximity > 0.55) {
                        color = `rgba(236, 72, 153, ${alpha})`; // Glowing pink
                    } else {
                        color = `rgba(99, 102, 241, ${alpha})`; // Electric Indigo
                    }

                    ctx.shadowBlur = proximity * 10;
                    ctx.shadowColor = 'rgba(99, 102, 241, 0.7)';
                } else {
                    ctx.shadowBlur = 0;
                }

                // Spring physics towards target
                dot.vx += (targetX - dot.x) * spring;
                dot.vy += (targetY - dot.y) * spring;
                dot.vx *= friction;
                dot.vy *= friction;
                dot.x += dot.vx;
                dot.y += dot.vy;

                // Draw dot
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className={`fixed inset-0 pointer-events-none z-0 w-screen h-screen ${className}`}
        />
    );
};

export default InteractiveDotBackground;
