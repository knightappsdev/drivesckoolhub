'use client';

import { Car, Trees, Building2, CloudSun } from 'lucide-react';

export default function DrivingAnimation() {
  return (
    <div className="relative w-full h-64 overflow-hidden rounded-lg bg-gradient-to-b from-sky-200 via-sky-100 to-green-100">
      {/* Sky and Clouds */}
      <div className="absolute top-4 right-8 animate-float">
        <CloudSun className="w-8 h-8 text-yellow-400 opacity-80" />
      </div>
      <div className="absolute top-2 left-16 w-12 h-6 bg-white/70 rounded-full animate-drift opacity-60" />
      <div className="absolute top-6 right-24 w-8 h-4 bg-white/60 rounded-full animate-drift-slow opacity-50" />

      {/* Background Buildings/Cityscape */}
      <div className="absolute bottom-20 left-8 animate-parallax-slow">
        <Building2 className="w-6 h-12 text-gray-400 opacity-40" />
      </div>
      <div className="absolute bottom-20 left-20 animate-parallax-slow" style={{animationDelay: '0.2s'}}>
        <Building2 className="w-4 h-10 text-gray-500 opacity-35" />
      </div>
      <div className="absolute bottom-20 right-12 animate-parallax-slow" style={{animationDelay: '0.4s'}}>
        <Building2 className="w-5 h-14 text-gray-400 opacity-30" />
      </div>

      {/* Trees and Scenery */}
      <div className="absolute bottom-20 left-32 animate-parallax">
        <Trees className="w-6 h-8 text-green-600 opacity-60" />
      </div>
      <div className="absolute bottom-20 right-32 animate-parallax" style={{animationDelay: '0.3s'}}>
        <Trees className="w-5 h-7 text-green-700 opacity-50" />
      </div>
      
      {/* Road with Multiple Lanes */}
      <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-gray-700 via-gray-600 to-gray-500 rounded-b-lg">
        {/* Lane Dividers */}
        <div className="absolute top-2 left-0 w-full h-0.5 flex space-x-12">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="h-0.5 w-10 bg-yellow-300 animate-road-lines"
              style={{
                animationDelay: `${i * 0.15}s`,
                animationDuration: '3s'
              }}
            />
          ))}
        </div>
        
        {/* Center Lane Markings */}
        <div className="absolute top-1/2 left-0 w-full h-1 flex space-x-8 transform -translate-y-1/2">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="h-1 w-8 bg-white animate-road-lines"
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: '2.5s'
              }}
            />
          ))}
        </div>

        {/* Bottom Lane Dividers */}
        <div className="absolute bottom-2 left-0 w-full h-0.5 flex space-x-12">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="h-0.5 w-10 bg-yellow-300 animate-road-lines"
              style={{
                animationDelay: `${i * 0.12}s`,
                animationDuration: '2.8s'
              }}
            />
          ))}
        </div>
      </div>

      {/* Realistic Car 1 - Learner Car with Instructor */}
      <div className="absolute bottom-7 animate-realistic-drive-1">
        <div className="relative">
          {/* Car Body */}
          <div className="w-14 h-7 bg-blue-500 rounded-lg shadow-lg relative">
            {/* Car Details */}
            <div className="absolute top-1 left-1 w-3 h-5 bg-blue-300 rounded opacity-80" /> {/* Windshield */}
            <div className="absolute top-1 right-1 w-3 h-5 bg-blue-300 rounded opacity-80" /> {/* Rear Window */}
            <div className="absolute top-0 left-4 w-6 h-1 bg-blue-400 rounded-t" /> {/* Roof */}
            
            {/* L-Plate */}
            <div className="absolute -top-3 -left-1 w-6 h-6 bg-white border-2 border-red-500 rounded flex items-center justify-center text-red-500 font-bold text-xs animate-pulse z-10">
              L
            </div>
            
            {/* Headlights */}
            <div className="absolute top-2 -left-1 w-2 h-1.5 bg-yellow-200 rounded-full animate-headlight" />
            <div className="absolute bottom-2 -left-1 w-2 h-1.5 bg-yellow-200 rounded-full animate-headlight" />
            
            {/* Taillights */}
            <div className="absolute top-2 -right-1 w-1.5 h-1 bg-red-400 rounded-full" />
            <div className="absolute bottom-2 -right-1 w-1.5 h-1 bg-red-400 rounded-full" />
            
            {/* Wheels */}
            <div className="absolute -bottom-1 left-1 w-3 h-3 bg-gray-800 rounded-full border border-gray-600">
              <div className="w-1 h-1 bg-gray-400 rounded-full m-auto mt-1 animate-spin-slow" />
            </div>
            <div className="absolute -bottom-1 right-1 w-3 h-3 bg-gray-800 rounded-full border border-gray-600">
              <div className="w-1 h-1 bg-gray-400 rounded-full m-auto mt-1 animate-spin-slow" />
            </div>
          </div>
          
          {/* Car shadow */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-2 bg-black/20 rounded-full blur-sm" />
        </div>
      </div>
      
      {/* Realistic Car 2 - Regular Car */}
      <div className="absolute bottom-12 animate-realistic-drive-2">
        <div className="relative">
          {/* Car Body */}
          <div className="w-12 h-6 bg-green-600 rounded-lg shadow-lg relative">
            {/* Car Details */}
            <div className="absolute top-0.5 left-1 w-2.5 h-4 bg-green-300 rounded opacity-80" />
            <div className="absolute top-0.5 right-1 w-2.5 h-4 bg-green-300 rounded opacity-80" />
            <div className="absolute top-0 left-3 w-6 h-0.5 bg-green-400 rounded-t" />
            
            {/* Headlights */}
            <div className="absolute top-1.5 -left-1 w-1.5 h-1 bg-white rounded-full animate-headlight" />
            <div className="absolute bottom-1.5 -left-1 w-1.5 h-1 bg-white rounded-full animate-headlight" />
            
            {/* Wheels */}
            <div className="absolute -bottom-0.5 left-1 w-2.5 h-2.5 bg-gray-800 rounded-full border border-gray-600">
              <div className="w-0.5 h-0.5 bg-gray-400 rounded-full m-auto mt-1 animate-spin-slow" />
            </div>
            <div className="absolute -bottom-0.5 right-1 w-2.5 h-2.5 bg-gray-800 rounded-full border border-gray-600">
              <div className="w-0.5 h-0.5 bg-gray-400 rounded-full m-auto mt-1 animate-spin-slow" />
            </div>
          </div>
          
          {/* Car shadow */}
          <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-10 h-1.5 bg-black/20 rounded-full blur-sm" />
        </div>
      </div>
      
      {/* Realistic Car 3 - Another Learner Car */}
      <div className="absolute bottom-2 animate-realistic-drive-3">
        <div className="relative">
          {/* Car Body */}
          <div className="w-13 h-6.5 bg-red-500 rounded-lg shadow-lg relative">
            {/* Car Details */}
            <div className="absolute top-0.5 left-1 w-2.5 h-4 bg-red-300 rounded opacity-80" />
            <div className="absolute top-0.5 right-1 w-2.5 h-4 bg-red-300 rounded opacity-80" />
            
            {/* L-Plate on Right */}
            <div className="absolute -top-3 -right-1 w-6 h-6 bg-white border-2 border-green-500 rounded flex items-center justify-center text-green-500 font-bold text-xs animate-pulse z-10">
              L
            </div>
            
            {/* Indicator Lights */}
            <div className="absolute top-1 -left-1 w-1.5 h-1 bg-orange-400 rounded-full animate-indicator" />
            <div className="absolute bottom-1 -left-1 w-1.5 h-1 bg-orange-400 rounded-full animate-indicator" />
            
            {/* Wheels */}
            <div className="absolute -bottom-0.5 left-1 w-2.5 h-2.5 bg-gray-800 rounded-full border border-gray-600">
              <div className="w-0.5 h-0.5 bg-gray-400 rounded-full m-auto mt-1 animate-spin-slow" />
            </div>
            <div className="absolute -bottom-0.5 right-1 w-2.5 h-2.5 bg-gray-800 rounded-full border border-gray-600">
              <div className="w-0.5 h-0.5 bg-gray-400 rounded-full m-auto mt-1 animate-spin-slow" />
            </div>
          </div>
          
          {/* Car shadow */}
          <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-11 h-1.5 bg-black/20 rounded-full blur-sm" />
        </div>
      </div>

      {/* Traffic Light */}
      <div className="absolute top-8 right-12 animate-float">
        <div className="w-2 h-8 bg-gray-700 rounded-lg">
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mx-auto mt-0.5 animate-traffic-light" />
          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mx-auto mt-0.5 opacity-30" />
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mx-auto mt-0.5 opacity-30" />
        </div>
        <div className="w-0.5 h-8 bg-gray-600 mx-auto" />
      </div>

      {/* Road Signs */}
      <div className="absolute top-10 left-8 animate-parallax">
        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
          <div className="text-white text-xs font-bold">30</div>
        </div>
        <div className="w-0.5 h-8 bg-gray-500 mx-auto" />
      </div>

      {/* Exhaust Smoke Effects */}
      <div className="absolute bottom-7 animate-realistic-drive-1">
        <div className="absolute -right-2 top-2 w-2 h-1 bg-gray-400/30 rounded-full animate-exhaust" />
      </div>

      <style jsx>{`
        @keyframes realistic-drive-1 {
          0% { 
            transform: translateX(-80px) translateY(0px) rotate(0deg); 
          }
          15% {
            transform: translateX(20vw) translateY(-1px) rotate(0.5deg);
          }
          30% {
            transform: translateX(40vw) translateY(-2px) rotate(-0.5deg);
          }
          45% {
            transform: translateX(60vw) translateY(-1px) rotate(0.2deg);
          }
          60% {
            transform: translateX(80vw) translateY(-3px) rotate(-0.3deg);
          }
          100% { 
            transform: translateX(calc(100vw + 100px)) translateY(0px) rotate(0deg); 
          }
        }
        
        @keyframes realistic-drive-2 {
          0% { 
            transform: translateX(-100px) translateY(0px) rotate(0deg); 
          }
          20% {
            transform: translateX(25vw) translateY(-1px) rotate(0.3deg);
          }
          40% {
            transform: translateX(50vw) translateY(-2px) rotate(-0.2deg);
          }
          70% {
            transform: translateX(75vw) translateY(-1px) rotate(0.1deg);
          }
          100% { 
            transform: translateX(calc(100vw + 120px)) translateY(0px) rotate(0deg); 
          }
        }
        
        @keyframes realistic-drive-3 {
          0% { 
            transform: translateX(-120px) translateY(0px) rotate(0deg); 
          }
          25% {
            transform: translateX(30vw) translateY(-2px) rotate(0.4deg);
          }
          50% {
            transform: translateX(55vw) translateY(-3px) rotate(-0.3deg);
          }
          75% {
            transform: translateX(80vw) translateY(-1px) rotate(0.2deg);
          }
          100% { 
            transform: translateX(calc(100vw + 140px)) translateY(0px) rotate(0deg); 
          }
        }
        
        @keyframes road-lines {
          0% {
            transform: translateX(0);
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: translateX(-100px);
            opacity: 0;
          }
        }
        
        @keyframes headlight {
          0%, 50% {
            opacity: 1;
            box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
          }
          51%, 100% {
            opacity: 0.7;
            box-shadow: 0 0 4px rgba(255, 255, 255, 0.4);
          }
        }
        
        @keyframes indicator {
          0%, 30% {
            opacity: 1;
            background-color: #fb923c;
          }
          31%, 60% {
            opacity: 0.3;
            background-color: #fed7aa;
          }
          61%, 100% {
            opacity: 1;
            background-color: #fb923c;
          }
        }
        
        @keyframes traffic-light {
          0%, 33% {
            background-color: #ef4444;
            opacity: 1;
          }
          34%, 66% {
            background-color: #eab308;
            opacity: 1;
          }
          67%, 100% {
            background-color: #22c55e;
            opacity: 1;
          }
        }
        
        @keyframes exhaust {
          0% {
            opacity: 0.3;
            transform: scale(1) translateY(0);
          }
          50% {
            opacity: 0.1;
            transform: scale(1.5) translateY(-4px);
          }
          100% {
            opacity: 0;
            transform: scale(2) translateY(-8px);
          }
        }
        
        @keyframes parallax {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50px);
          }
        }
        
        @keyframes parallax-slow {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-20px);
          }
        }
        
        @keyframes drift {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-200px);
          }
        }
        
        @keyframes drift-slow {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-150px);
          }
        }
        
        .animate-realistic-drive-1 {
          animation: realistic-drive-1 12s linear infinite;
        }
        
        .animate-realistic-drive-2 {
          animation: realistic-drive-2 10s linear infinite 3s;
        }
        
        .animate-realistic-drive-3 {
          animation: realistic-drive-3 14s linear infinite 6s;
        }
        
        .animate-road-lines {
          animation: road-lines 2.5s linear infinite;
        }
        
        .animate-headlight {
          animation: headlight 2s ease-in-out infinite;
        }
        
        .animate-indicator {
          animation: indicator 1.5s ease-in-out infinite;
        }
        
        .animate-traffic-light {
          animation: traffic-light 6s ease-in-out infinite;
        }
        
        .animate-exhaust {
          animation: exhaust 1s ease-out infinite;
        }
        
        .animate-parallax {
          animation: parallax 20s linear infinite;
        }
        
        .animate-parallax-slow {
          animation: parallax-slow 30s linear infinite;
        }
        
        .animate-drift {
          animation: drift 15s linear infinite;
        }
        
        .animate-drift-slow {
          animation: drift-slow 20s linear infinite;
        }
        
        .animate-spin-slow {
          animation: spin 0.5s linear infinite;
        }
      `}</style>
    </div>
  );
}