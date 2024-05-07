"use client"
import { login } from "@/actions";
import { useFormState } from "react-dom";

const LoginForm = () => {
    const [state, formAction] = useFormState<any,FormData>(login, undefined)
    return (
            <div className="flex min-h-screen flex-col items-center mt-20">
            <form  className="text-black" action={formAction}>
            <input type="text" name="username" required placeholder="Username" />
            <input type="password" name="password" required placeholder="Password" />
            <button className="LoginButton"type="submit">Login</button>
            {state?.error && <p className="text-red" >{state.error}</p>}
            </form>
            </div>
    );
}

export default LoginForm;