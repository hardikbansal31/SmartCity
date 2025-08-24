// import {
//   MapIcon,
//   DocumentTextIcon,
//   //   TrafficLightIcon,
//   ChartBarIcon,
//   ClockIcon,
//   ExclamationTriangleIcon,
//   Cog6ToothIcon,
//   ArrowPathIcon, // Using this as a placeholder for the logo
// } from "@heroicons/react/24/solid";
// import { icon } from "leaflet";

// // You can manage your navigation items in an array like this for cleaner code
// const navigationItems = [
//   { name: "Live Map", icon: MapIcon, active: false },
//   { name: "Hazards", icon: ChartBarIcon, active: false },
// ];

// function SidePanel() {
//   return (
//     <div className="z-[10] sidepanel w-[20%] h-[calc(100vh-100px)] bg-[#1B1B1B] flex flex-col p-6 space-y-8">

//       {/* Navigation Links */}
//       <nav className="flex flex-col space-y-2">
//         {navigationItems.map((item) => (
//           <a
//             key={item.name}
//             href="#"
//             className={`flex items-center p-3 rounded-lg transition-colors duration-200
//               ${
//                 item.active
//                   ? "bg-red-600 text-white" // Active link style
//                   : "text-zinc-400 hover:bg-zinc-800 hover:text-white" // Inactive link style
//               }
//             `}
//           >
//             <item.icon className="h-6 w-6 mr-4" />
//             <span className="font-semibold text-lg">{item.name}</span>
//           </a>
//         ))}
//       </nav>
//     </div>
//   );
// }

// export default SidePanel;

// src/components/SidePanel.jsx

import { MapIcon, ChartBarIcon } from "@heroicons/react/24/solid";

// You can manage your navigation items in an array like this for cleaner code
const navigationItems = [
  { name: "Live Map", icon: MapIcon, active: false },
  { name: "Hazards", icon: ChartBarIcon, active: false },
];

function SidePanel() {
  return (
    <div className="z-[10] sidepanel w-[20%] h-[calc(100vh-100px)] bg-[#1B1B1B] flex flex-col p-6 space-y-8">
      {/* ...rest of your component... */}
      <nav className="flex flex-col space-y-2">
        {navigationItems.map((item) => (
          <a
            key={item.name}
            href="#"
            className={`flex items-center p-3 rounded-lg transition-colors duration-200
              ${
                item.active
                  ? "bg-red-600 text-white"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }
            `}
          >
            <item.icon className="h-6 w-6 mr-4" />
            <span className="font-semibold text-lg">{item.name}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}

export default SidePanel;
