import LoginForm from "./_components/LoginForm";

export default async function LoginPage() {
   return (
      <main className="min-h-screen bg-gray-100 flex items-center p-5">
         <div className="max-w-lg w-full mx-auto p-5 shadow-lg rounded-lg bg-white space-y-4">
            <p className="text-xl text-center font-bold">LOGIN</p>
            <LoginForm />
         </div>
      </main>
   );
}
