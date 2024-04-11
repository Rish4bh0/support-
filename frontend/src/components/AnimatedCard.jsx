import React, { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { FiMousePointer } from "react-icons/fi";
import { Link } from "react-router-dom";

const ROTATION_RANGE = 32.5;
const HALF_ROTATION_RANGE = 32.5 / 2;

const TiltCard = ({ icon, title, count, link, color}) => {
  
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x);
  const ySpring = useSpring(y);

  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

  const handleMouseMove = (e) => {
    if (!ref.current) return [0, 0];

    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
    const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;

    const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1;
    const rY = mouseX / width - HALF_ROTATION_RANGE;

    x.set(rX);
    y.set(rY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        transform,
      }}
      className={`relative h-40 w-48 rounded-xl bg-gradient-to-br `}
    >
        
      <div
        style={{
          transform: "translateZ(75px)",
          transformStyle: "preserve-3d",
        }}
        className="absolute inset-3 grid place-content-center rounded-xl bg-white shadow-xl text-center justify-center"
      >
        <Link to={link}>
        <div 
         style={{
            transform: "translateZ(50px)",
          }}
        className="flex justify-center">
        <button
          type="button"
          style={{ backgroundColor: color }}
          className="text-xl text opacity-0.9 text-white hover:drop-shadow-xl rounded-lg p-2 h-10 w-10 flex flex-col items-center justify-center mb-3"
        >
          {icon}
        </button>
        </div>
        <div 
         style={{
            transform: "translateZ(50px)",
          }}
        className="text-center font-semibold">{count}</div>
        <p
          style={{
            transform: "translateZ(50px)",
          }}
          className="text-center text-sm font-bold"
        >
          {title}
        </p>
        </Link>
      </div>
      
    </motion.div>
  );
};

export default TiltCard;
