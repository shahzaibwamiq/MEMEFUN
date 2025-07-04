"use client";
import { useEffect, useRef, useState } from "react";

const DropAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lines = useRef<[number, number, number, number, string, number, boolean][]>([]);

  const [footerHeight, setFooterHeight] = useState(0); // Track footer height dynamically


  // const maxSpeed = 1;
  // const minSpeed = 1;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const amount = window.innerWidth < 640 ? 20 : 30;
    const colors = ["#F8FFE5", "#06D6A0", "#1B9AAA", "#EF476F", "#FFC43D"];
    const maxHeight = 40;
    const minHeight = 20;
    // Dynamically calculate footer height after render
    const footer = document.querySelector("footer");
    if (footer) {
      setFooterHeight(footer.clientHeight);
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;

      // Ensure canvas doesn't overflow below footer
      requestAnimationFrame(() => {
        canvas.height = Math.max(document.documentElement.scrollHeight - footerHeight, window.innerHeight);
        initLines();
      });
    };

    const initLines = () => {
      lines.current = [];
      for (let i = 0; i < amount; i++) {
        const height = Math.random() * (maxHeight - minHeight) + minHeight;
        const width = height / 10;
        lines.current.push([
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          width,
          height,
          colors[Math.floor(Math.random() * colors.length)],
          Math.random() * 0.5 + 0.5,
          false
        ]);
      }
    };

    const update = () => {
      for (const line of lines.current) {
        line[1] += line[5];
        if (line[1] > canvas.height) {
          line[1] = -line[3];
          line[0] = Math.random() * canvas.width;
          line[5] /= 5;
          line[6] = false;
        }
        if (line[1] > canvas.height / 2 && !line[6]) {
          line[5] *= 5;
          line[6] = true;
        }
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const line of lines.current) {
        const [x, y, width, height, color] = line;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);
        ctx.beginPath();
        ctx.arc(x + width / 2, y - width / 3, width / 2, 0, 2 * Math.PI);
        ctx.arc(x + width / 2, y + height, width / 2, 0, 2 * Math.PI);
        ctx.fill();

        const grd = ctx.createLinearGradient(x, y - height * 2, x, y);
        grd.addColorStop(0, "#0000");
        grd.addColorStop(1, color);
        ctx.fillStyle = grd;
        ctx.fillRect(x, y - height * 2, width, height * 2);
      }
    };

    const loop = () => {
      render();
      update();
      requestAnimationFrame(loop);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Backup resize to fix delayed layout changes
    setTimeout(resizeCanvas, 100);

    requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [footerHeight]);

  return (
      <canvas
          ref={canvasRef}
          style={{
            position: "absolute", // scrolls with the page
            top: 0,
            left: 0,
            width: "100%",
            zIndex: -1,
            pointerEvents: "none",
            objectFit: "cover",
            background: "transparent"
          }}
      />
  );
};

export default DropAnimation;
