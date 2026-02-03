import Header from "@/components/Header"
const layout = ({children}:{children:React.ReactNode}) => {
  return (
    <main className="min-h-screen bg-neutral-950 text-gray-300">
        <Header/>
        <div className="py-6">{children}</div>
    </main>
  )
}

export default layout