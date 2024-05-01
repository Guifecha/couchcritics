import { logout } from "@/actions";

const LogoutForm = () => {
    return (
        <form action={logout}>
            <button className="text-red">Logout</button>
        </form>
    );
}
export default LogoutForm;