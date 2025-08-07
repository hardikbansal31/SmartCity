import SidePanel from '../components/admin/SidePanel'; 

export default function UserDashboardLayout({ children }) {
  return (
  
    <section className="flex h-screen bg-black overflow-hidden">
      
      <div className="flex-shrink-0">
        <SidePanel />
      </div>

    
      <main className="flex-grow h-full overflow-y-auto">
        {children}
      </main>
      
    </section>
  );
}