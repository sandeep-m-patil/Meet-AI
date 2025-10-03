interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className="min-h-screen w-full bg-black flex flex-col">
      <main className="flex-1 w-full flex items-center justify-center px-4 py-6 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
