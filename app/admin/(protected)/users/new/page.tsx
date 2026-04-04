import UserForm from "@/components/admin/UserForm";

export default function NewUserPage() {
  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Новый пользователь</h1>
      <UserForm />
    </div>
  );
}
