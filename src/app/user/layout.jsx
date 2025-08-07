import SidePanel from '../components/user/SidePanel'; 

export default function UserDashboardLayout({ children }) {
  return (
  
    <section className="flex h-screen bg-black overflow-hidden">
      
      <div className="flex-shrink-0 z-10">
        <SidePanel />
      </div>

    
      <main className="flex-grow relative z-0 h-full overflow-y-auto">
        {children}
      </main>
      
    </section>
  );
}