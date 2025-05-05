import Header from "@/components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Header />
            <main className="pt-12 md:pt-20 px-8 md:px-16">
                {children}
            </main>
        </div>
    );
}
