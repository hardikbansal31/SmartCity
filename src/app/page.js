// import LiveMapWrapper from "./components/LiveMapWrapper";
// // import { ArrowRight } from "lucide-react"; // Or any other icon library

// export default function Home() {
//   return (
//     <main className="relative h-[calc(100vh-theme(height.16))] flex items-center justify-center text-white overflow-hidden">
//       {/* Background Image and Overlay */}
//       <div
//         className="absolute inset-0 bg-cover bg-center z-[-1]"
//         style={{ backgroundImage: "url('/city-background.jpg')" }} // Replace with your image path
//       />
//       <div className="absolute inset-0 bg-black opacity-60 z-[-1]" />

//       <div className="container mx-auto px-4 md:px-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
//           {/* Left Side: Text Content */}
//           <div className="flex flex-col gap-6 text-center md:text-left">
//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
//               <span className="text-orange-500">OptiRoute:</span> Smarter
//               Cities. Smoother Commutes.
//             </h1>
//             <p className="text-lg text-gray-300">
//               Experience the power of real-time traffic intelligence. Whether
//               you're behind the wheel or behind the grid—move better with
//               OptiRoute.
//             </p>
//             <div className="mt-4">
//               <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2 transition-colors duration-300 mx-auto md:mx-0">
//                 Get Started
//                 {/* <ArrowRight size={20} /> */}
//               </button>
//             </div>
//           </div>

//           {/* Right Side: Map Component */}
//           <div className="flex justify-center items-center">
//             <div className="w-full max-w-lg h-72 rounded-xl overflow-hidden shadow-2xl border-2 border-gray-700">
//               {/* Your existing LiveMapWrapper component goes here */}
//               {/* <LiveMapWrapper /> */}
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }

import Image from "next/image";
import Link from "next/link";
// import { ArrowRight } from "lucide-react"; // Or any other icon library

export default function Home() {
  return (
    <main className="relative h-[calc(100vh-theme(height.16))] flex items-center justify-center text-white overflow-hidden">
      {/* Background Image and Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center z-[-1]"
        style={{ backgroundImage: "url('/city-background.jpg')" }} // Replace with your image path
      />
      <div className="absolute inset-0 bg-black opacity-60 z-[-1]" />

      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Side: Text Content */}
          <div className="flex flex-col gap-6 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-orange-500">OptiRoute:</span> Smarter
              Cities. Smoother Commutes.
            </h1>
            <p className="text-lg text-gray-300">
              Experience the power of real-time traffic intelligence. Whether
              you're behind the wheel or behind the grid—move better with
              OptiRoute.
            </p>
            <div className="mt-4">
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2 transition-colors duration-300 mx-auto md:mx-0">
                <Link href="/user/dashboard">Get Started</Link>
                {/* <ArrowRight size={20} /> */}
              </button>
            </div>
          </div>

          {/* Right Side: Map Image */}
          <div className="flex justify-center items-center">
            <div className="relative w-full max-w-lg h-72 rounded-xl overflow-hidden shadow-2xl border-2 border-gray-700">
              {/* Image component replaces the LiveMapWrapper */}
              <Image
                src="/mapIco.png" // Replace with your map image path
                alt="Map preview of OptiRoute"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
